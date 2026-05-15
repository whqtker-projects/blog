/**
 * Obsidian → Astro conversion script (D-18)
 *
 * Transforms Obsidian Markdown posts into Astro-compatible content:
 * - ![[image]] wikilinks → standard Markdown image syntax (images loaded from src/content/attachments/)
 * - [[series:parent]] / [[series:parent/child]] → /series/... links
 * - [[wikilinks]] → standard Markdown links to posts
 * - [[concept:slug]] is no longer supported; conversion fails with a cleanup error
 * - Validates file names against D-15 (lowercase kebab-case, English)
 * - Passes frontmatter through unchanged
 *
 * Usage:
 *   node scripts/obsidian-to-astro.mjs --input <vault-posts-dir> [options]
 *
 * --input            Path to the Obsidian vault posts directory (required)
 * --output           Destination directory for posts (default: ./src/content/posts)
 * --strict           Exit with error on any unresolved wikilink or missing image (default: warn only)
 *
 * Image files referenced via ![[...]] must be present in src/content/attachments/ before running.
 * Missing images produce a warning; --strict treats them as errors.
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { parseArgs } from 'node:util';
import { listMarkdownFilesRecursive } from './node-content-helpers.mjs';

// D-15: lowercase kebab-case, English only, .md extension
const VALID_FILENAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*\.md$/;

// ![[image.ext]] or ![[image.ext|alt text]] — must match before WIKILINK_RE
const IMAGE_WIKILINK_RE = /!\[\[([^\]|\n]+?)(?:\|([^\]\n]+?))?\]\]/g;

// [[concept:slug]] or [[concept:slug|display]] — unsupported legacy namespace
const UNSUPPORTED_CONCEPT_LINK_RE = /\[\[concept:([^\]|\n]+?)(?:\|([^\]\n]+?))?\]\]/g;

// [[series:parent]] or [[series:parent/child|display]] — must match before WIKILINK_RE
const SERIES_LINK_RE = /\[\[series:([^\]|\n]+?)(?:\|([^\]\n]+?))?\]\]/g;

// [[page]], [[page|alias]], [[page#heading]], [[page#heading|alias]]
const WIKILINK_RE = /\[\[([^\]|#\n]+?)(?:#([^\]|\n]+?))?(?:\|([^\]\n]+?))?\]\]/g;

export function validateFileName(filename) {
  return VALID_FILENAME_RE.test(filename);
}

export function fileNameToSlug(filename) {
  return basename(filename, '.md');
}

// Converts a wikilink page name or heading text to URL-safe slug form.
// Handles both [[kebab-case]] and [[Display Name]] inputs.
function toSlug(text) {
  return text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

/**
 * Extracts image filenames from all ![[image.ext]] and ![[image.ext|alt]] patterns.
 * Returns each referenced filename once (deduplicated).
 *
 * @param {string} content - Markdown body (no frontmatter)
 * @returns {string[]}
 */
export function extractImageFilenames(content) {
  const re = /!\[\[([^\]|\n]+?)(?:\|[^\]\n]+?)?\]\]/g;
  const seen = new Set();
  let m;
  while ((m = re.exec(content)) !== null) {
    seen.add(m[1].trim());
  }
  return [...seen];
}

/**
 * Converts ![[image.ext]] and ![[image.ext|alt]] to standard Markdown image syntax.
 * Images are assumed to be stored in src/content/attachments/.
 *
 * @param {string} content - Markdown body (no frontmatter)
 * @returns {string}
 */
export function convertImageWikilinks(content) {
  return content.replace(IMAGE_WIKILINK_RE, (_match, filename, alt) => {
    const name = filename.trim();
    const altText = alt ? alt.trim() : name;
    return `![${altText}](../attachments/${encodeURI(name)})`;
  });
}

function imageExistsInSourceDir(imageSourceDir, imageFile) {
  if (!existsSync(imageSourceDir)) return false;

  if (imageFile.includes('/')) {
    return existsSync(join(imageSourceDir, imageFile));
  }

  const stack = [imageSourceDir];
  while (stack.length > 0) {
    const currentDir = stack.pop();
    for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
      if (entry.name === '.obsidian') continue;

      const absolutePath = join(currentDir, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolutePath);
        continue;
      }

      if (entry.isFile() && entry.name === imageFile) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Builds a set of valid explicit series-link targets from committed series index files.
 * Parent series target format: <parent>
 * Child series target format: <parent>/<child>
 *
 * @param {string} seriesIndexesDir
 * @returns {Set<string>}
 */
export function buildSeriesTargetSet(seriesIndexesDir) {
  const targets = new Set();
  if (!existsSync(seriesIndexesDir)) return targets;

  for (const file of listMarkdownFilesRecursive(seriesIndexesDir)) {
    const raw = readFileSync(file, 'utf8');
    const { frontmatter } = parseFrontmatter(raw);
    if (!frontmatter) continue;

    const seriesMatch = frontmatter.match(/^series:\s*(.+)$/m);
    if (!seriesMatch) continue;
    const series = seriesMatch[1].replace(/^["']|["']$/g, '').trim();

    const parentMatch = frontmatter.match(/^parent:\s*(.+)$/m);
    if (parentMatch) {
      const parent = parentMatch[1].replace(/^["']|["']$/g, '').trim();
      if (parent && series) targets.add(`${parent}/${series}`);
      continue;
    }

    if (series) targets.add(series);
  }

  return targets;
}

/**
 * Finds unsupported legacy [[concept:...]] links.
 *
 * @param {string} content
 * @returns {string[]}
 */
export function findDeprecatedConceptLinks(content) {
  const matches = [];

  for (const match of content.matchAll(UNSUPPORTED_CONCEPT_LINK_RE)) {
    matches.push(match[0]);
  }

  return matches;
}

/**
 * Converts [[series:parent]] and [[series:parent/child]] to /series/... links.
 *
 * @param {string} content
 * @param {Set<string>|null} knownSeriesTargets - allowed targets such as parent or parent/child
 * @returns {{ result: string, warnings: string[] }}
 */
export function convertSeriesLinks(content, knownSeriesTargets = null) {
  const warnings = [];

  const result = content.replace(SERIES_LINK_RE, (_match, target, alias) => {
    const normalized = target.trim().toLowerCase();

    if (knownSeriesTargets !== null && !knownSeriesTargets.has(normalized)) {
      warnings.push(normalized);
    }

    const text = alias ? alias.trim() : target.trim();
    return `[${text}](/series/${normalized})`;
  });

  return { result, warnings };
}

/**
 * Converts all [[wikilinks]] in content to standard Markdown links.
 *
 * @param {string} content  - Markdown body (no frontmatter)
 * @param {Set<string>|null} knownSlugs - Set of known post slugs; null skips resolution check
 * @returns {{ result: string, warnings: string[] }}
 */
export function convertWikilinks(content, knownSlugs = null) {
  const warnings = [];

  const result = content.replace(WIKILINK_RE, (_match, page, heading, alias) => {
    const slug = toSlug(page);

    if (knownSlugs !== null && !knownSlugs.has(slug)) {
      warnings.push(slug);
    }

    const anchor = heading ? '#' + toSlug(heading) : '';
    const href = `/posts/${slug}${anchor}`;
    const text = alias ? alias.trim() : page.trim();

    return `[${text}](${href})`;
  });

  return { result, warnings };
}

/**
 * Splits raw Markdown content into frontmatter string and body string.
 * Returns { frontmatter: null, body } when no YAML fence is found.
 */
export function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: null, body: content };
  return { frontmatter: match[1], body: match[2] };
}

/**
 * Converts a single Obsidian file's content to Astro-compatible Markdown.
 *
 * @param {string} inputContent
 * @param {string} filename        - used only for error messages
 * @param {Set<string>|null} knownSlugs
 * @param {string|null} publicImagesDir - path to content attachments on disk; null skips image validation
 * @returns {{ content: string, warnings: string[], seriesWarnings: string[], imageWarnings: string[] }}
 */
export function convertFile(
  inputContent,
  filename,
  knownSlugs = null,
  publicImagesDir = null,
  knownSeriesTargets = null,
) {
  const { frontmatter, body } = parseFrontmatter(inputContent);
  if (!frontmatter) {
    throw new Error(`${filename}: missing frontmatter`);
  }

  const imageWarnings = publicImagesDir
    ? extractImageFilenames(body).filter(f => !imageExistsInSourceDir(publicImagesDir, f))
    : [];

  // Conversion order: images first, then deprecated concept-link guard, then series links, then post wikilinks
  const imageConverted = convertImageWikilinks(body);
  const deprecatedConceptLinks = findDeprecatedConceptLinks(imageConverted);
  if (deprecatedConceptLinks.length > 0) {
    throw new Error(
      `${filename}: concept links are no longer supported (${deprecatedConceptLinks.join(', ')}); use inline definition text or link to a normal post`
    );
  }
  const { result: seriesConverted, warnings: seriesWarnings } = convertSeriesLinks(
    imageConverted, knownSeriesTargets
  );
  const { result: convertedBody, warnings } = convertWikilinks(seriesConverted, knownSlugs);

  return {
    content: `---\n${frontmatter}\n---\n${convertedBody}`,
    warnings,
    seriesWarnings,
    imageWarnings,
  };
}

// ── CLI ──────────────────────────────────────────────────────────────────────

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const { values } = parseArgs({
    options: {
      input:            { type: 'string',  short: 'i' },
      output:           { type: 'string',  short: 'o', default: './src/content/posts' },
      'series-indexes': { type: 'string',              default: './src/content/series_indexes' },
      strict:           { type: 'boolean',             default: false },
    },
  });

  if (!values.input) {
    console.error(
      'Usage: node scripts/obsidian-to-astro.mjs --input <vault-posts-dir> [--output <dir>] [--series-indexes <dir>] [--strict]'
    );
    process.exit(1);
  }

  const inputDir        = values.input;
  const outputDir       = values.output;
  const seriesIndexesDir = values['series-indexes'];

  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  const knownSeriesTargets = buildSeriesTargetSet(seriesIndexesDir);

  const files = readdirSync(inputDir).filter(f => extname(f) === '.md');
  const knownSlugs = new Set(files.map(fileNameToSlug));

  let errorCount = 0;
  let warnCount  = 0;

  for (const file of files) {
    if (!validateFileName(file)) {
      console.error(`Skip: ${file} — filename violates D-15 (must be lowercase kebab-case, English only)`);
      errorCount++;
      continue;
    }

    const inputContent = readFileSync(join(inputDir, file), 'utf8');

    try {
      const { content: converted, warnings, seriesWarnings, imageWarnings } = convertFile(
        inputContent, file, knownSlugs, './src/content/attachments', knownSeriesTargets
      );

      for (const slug of warnings) {
        console.warn(`Warn: ${file} — unresolved wikilink [[${slug}]]`);
        warnCount++;
        if (values.strict) errorCount++;
      }

      for (const target of seriesWarnings) {
        console.warn(`Warn: ${file} — unresolved series link [[series:${target}]]`);
        warnCount++;
        if (values.strict) errorCount++;
      }

      for (const imgFile of imageWarnings) {
        console.warn(`Warn: ${file} — missing image src/content/attachments/${imgFile}`);
        warnCount++;
        if (values.strict) errorCount++;
      }

      writeFileSync(join(outputDir, file), converted, 'utf8');
      console.log(`OK:   ${file}`);
    } catch (err) {
      console.error(`Error: ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\n${files.length} file(s), ${warnCount} warning(s), ${errorCount} error(s).`);

  if (errorCount > 0) process.exit(1);
}
