/**
 * Obsidian → Astro conversion script (D-18)
 *
 * Transforms Obsidian Markdown posts into Astro-compatible content:
 * - ![[image]] wikilinks → standard Markdown image syntax (images served from /images/)
 * - [[wikilinks]] → standard Markdown links
 * - Validates file names against D-15 (lowercase kebab-case, English)
 * - Passes frontmatter through unchanged
 *
 * Usage:
 *   node scripts/obsidian-to-astro.mjs --input <vault-posts-dir> [--output <dir>] [--strict]
 *
 * --input   Path to the Obsidian vault posts directory (required)
 * --output  Destination directory (default: ./src/content/posts)
 * --strict  Exit with error on any unresolved wikilink or missing image (default: warn only)
 *
 * Image files referenced via ![[...]] must be present in public/images/ before running.
 * Missing images produce a warning; --strict treats them as errors.
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { parseArgs } from 'node:util';

// D-15: lowercase kebab-case, English only, .md extension
const VALID_FILENAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*\.md$/;

// ![[image.ext]] or ![[image.ext|alt text]] — must match before WIKILINK_RE
const IMAGE_WIKILINK_RE = /!\[\[([^\]|\n]+?)(?:\|([^\]\n]+?))?\]\]/g;

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
 * Images are assumed to be served from the /images/ public path.
 *
 * @param {string} content - Markdown body (no frontmatter)
 * @returns {string}
 */
export function convertImageWikilinks(content) {
  return content.replace(IMAGE_WIKILINK_RE, (_match, filename, alt) => {
    const name = filename.trim();
    const altText = alt ? alt.trim() : name;
    return `![${altText}](/images/${name})`;
  });
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
 * @param {string|null} publicImagesDir - path to public/images/ on disk; null skips image validation
 * @returns {{ content: string, warnings: string[], imageWarnings: string[] }}
 */
export function convertFile(inputContent, filename, knownSlugs = null, publicImagesDir = null) {
  const { frontmatter, body } = parseFrontmatter(inputContent);
  if (!frontmatter) {
    throw new Error(`${filename}: missing frontmatter`);
  }

  const imageWarnings = publicImagesDir
    ? extractImageFilenames(body).filter(f => !existsSync(join(publicImagesDir, f)))
    : [];

  // Image wikilinks must be converted before link wikilinks to avoid regex overlap
  const imageConverted = convertImageWikilinks(body);
  const { result: convertedBody, warnings } = convertWikilinks(imageConverted, knownSlugs);

  return {
    content: `---\n${frontmatter}\n---\n${convertedBody}`,
    warnings,
    imageWarnings,
  };
}

// ── CLI ──────────────────────────────────────────────────────────────────────

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const { values } = parseArgs({
    options: {
      input:  { type: 'string',  short: 'i' },
      output: { type: 'string',  short: 'o', default: './src/content/posts' },
      strict: { type: 'boolean',             default: false },
    },
  });

  if (!values.input) {
    console.error(
      'Usage: node scripts/obsidian-to-astro.mjs --input <vault-posts-dir> [--output <dir>] [--strict]'
    );
    process.exit(1);
  }

  const inputDir  = values.input;
  const outputDir = values.output;

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

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
      const { content: converted, warnings, imageWarnings } = convertFile(
        inputContent, file, knownSlugs, './public/images'
      );

      for (const slug of warnings) {
        console.warn(`Warn: ${file} — unresolved wikilink [[${slug}]]`);
        warnCount++;
        if (values.strict) errorCount++;
      }

      for (const imgFile of imageWarnings) {
        console.warn(`Warn: ${file} — missing image public/images/${imgFile}`);
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
