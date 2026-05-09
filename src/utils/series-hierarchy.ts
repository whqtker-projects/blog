import type { CollectionEntry } from 'astro:content';

type SeriesIndex = CollectionEntry<'series_indexes'>;

function byTitleAsc(a: SeriesIndex, b: SeriesIndex) {
  return a.data.title.localeCompare(b.data.title);
}

export function parentSeriesPath(parentSlug: string): string {
  return `/series/${parentSlug}`;
}

export function childSeriesPath(parentSlug: string, childSlug: string): string {
  return `${parentSeriesPath(parentSlug)}/${childSlug}`;
}

export function buildSeriesHierarchy(indexes: SeriesIndex[]) {
  const seriesBySlug = new Map(indexes.map((idx) => [idx.data.series, idx]));
  const parentIndexes = indexes.filter((idx) => !idx.data.parent).sort(byTitleAsc);
  const childIndexes = indexes.filter((idx) => Boolean(idx.data.parent)).sort(byTitleAsc);
  const childrenByParent = new Map<string, SeriesIndex[]>();

  for (const child of childIndexes) {
    const parentSlug = child.data.parent!;
    const children = childrenByParent.get(parentSlug) ?? [];
    children.push(child);
    childrenByParent.set(parentSlug, children);
  }

  for (const children of childrenByParent.values()) {
    children.sort(byTitleAsc);
  }

  return { seriesBySlug, parentIndexes, childIndexes, childrenByParent };
}

export function requireParentIndex(childIndex: SeriesIndex, seriesBySlug: Map<string, SeriesIndex>) {
  const parentSlug = childIndex.data.parent;
  if (!parentSlug) {
    throw new Error(
      `Series '${childIndex.data.series}' is missing required parent metadata for child-series routing.`
    );
  }

  const parentIndex = seriesBySlug.get(parentSlug);
  if (!parentIndex) {
    throw new Error(
      `Series '${childIndex.data.series}' references missing parent series '${parentSlug}'.`
    );
  }

  if (parentIndex.data.parent) {
    throw new Error(
      `Series '${childIndex.data.series}' references child series '${parentSlug}' as its parent.`
    );
  }

  return parentIndex;
}
