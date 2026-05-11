#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parent.parent
SERIES_INDEXES_DIR = ROOT / "src" / "content" / "series_indexes"
POSTS_DIR = ROOT / "src" / "content" / "posts"
ALLOWED_STATUSES = {"idea", "draft", "published"}


@dataclass
class SeriesIndex:
    file: str
    title: str
    series: str
    parent: str | None
    order: int | None
    description: str | None


@dataclass
class Post:
    file: str
    slug: str
    title: str
    series: str
    order: int | None
    status: str | None
    headings: list[str]


def parse_frontmatter(text: str) -> dict[str, Any]:
    if not text.startswith("---\n") and not text.startswith("---\r\n"):
        return {}

    lines = text.splitlines()
    if not lines or lines[0] != "---":
        return {}

    frontmatter: dict[str, Any] = {}
    for line in lines[1:]:
        if line == "---":
            break

        if ":" not in line:
            continue

        key, raw_value = line.split(":", 1)
        key = key.strip()
        value = raw_value.strip()
        if not key or not value:
            continue

        if (value.startswith('"') and value.endswith('"')) or (
            value.startswith("'") and value.endswith("'")
        ):
            value = value[1:-1]

        if key == "order":
            try:
                frontmatter[key] = int(value)
            except ValueError:
                frontmatter[key] = value
            continue

        frontmatter[key] = value

    return frontmatter


def extract_headings(text: str) -> list[str]:
    in_frontmatter = False
    past_frontmatter = False
    headings: list[str] = []
    for i, line in enumerate(text.splitlines()):
        if i == 0 and line == "---":
            in_frontmatter = True
            continue
        if in_frontmatter and line == "---":
            in_frontmatter = False
            past_frontmatter = True
            continue
        if not past_frontmatter:
            continue
        if line.startswith("#### "):
            headings.append("#### " + line[5:].strip())
        elif line.startswith("### "):
            headings.append("### " + line[4:].strip())
        elif line.startswith("## "):
            headings.append("## " + line[3:].strip())
    return headings


def read_md_files_recursive(base_dir: Path) -> list[tuple[Path, dict[str, Any]]]:
    records: list[tuple[Path, dict[str, Any]]] = []
    for path in sorted(base_dir.rglob("*.md")):
        frontmatter = parse_frontmatter(path.read_text(encoding="utf-8"))
        records.append((path, frontmatter))
    return records


def load_series_indexes(base_dir: Path) -> list[SeriesIndex]:
    indexes: list[SeriesIndex] = []
    for path, frontmatter in read_md_files_recursive(base_dir):
        indexes.append(
            SeriesIndex(
                file=path.relative_to(base_dir).as_posix(),
                title=str(frontmatter.get("title", "")),
                series=str(frontmatter.get("series", "")),
                parent=frontmatter.get("parent"),
                order=frontmatter.get("order")
                if isinstance(frontmatter.get("order"), int)
                else None,
                description=frontmatter.get("description"),
            )
        )
    return indexes


def load_posts(base_dir: Path) -> list[Post]:
    posts: list[Post] = []
    for path, frontmatter in read_md_files_recursive(base_dir):
        text = path.read_text(encoding="utf-8")
        posts.append(
            Post(
                file=path.relative_to(base_dir).as_posix(),
                slug=path.stem,
                title=str(frontmatter.get("title", "")),
                series=str(frontmatter.get("series", "")),
                order=frontmatter.get("order")
                if isinstance(frontmatter.get("order"), int)
                else None,
                status=frontmatter.get("status"),
                headings=extract_headings(text),
            )
        )
    return posts


def validate_with_repo_checker(skip_validation: bool) -> None:
    if skip_validation:
        return

    result = subprocess.run(
        ["pnpm", "check:content"],
        cwd=ROOT,
        text=True,
        capture_output=True,
    )

    if result.returncode == 0:
        return

    message = [
        "Repository validation failed. Run `pnpm check:content` and fix the reported issues first.",
    ]
    if result.stdout.strip():
        message.append("")
        message.append(result.stdout.strip())
    if result.stderr.strip():
        message.append("")
        message.append(result.stderr.strip())
    raise SystemExit("\n".join(message))


def build_relationship_tree(
    indexes: list[SeriesIndex], posts: list[Post]
) -> list[dict[str, Any]]:
    parents = [index for index in indexes if not index.parent]
    children = [index for index in indexes if index.parent]

    children_by_parent: dict[str, list[SeriesIndex]] = {}
    for child in children:
        children_by_parent.setdefault(child.parent or "", []).append(child)

    posts_by_series: dict[str, list[Post]] = {}
    for post in posts:
        posts_by_series.setdefault(post.series, []).append(post)

    parent_nodes: list[dict[str, Any]] = []
    for parent in sorted(parents, key=lambda item: (item.title, item.series)):
        child_nodes: list[dict[str, Any]] = []
        for child in sorted(
            children_by_parent.get(parent.series, []),
            key=lambda item: (
                item.order if item.order is not None else sys.maxsize,
                item.title,
                item.series,
            ),
        ):
            post_nodes = []
            for post in sorted(
                posts_by_series.get(child.series, []),
                key=lambda item: (
                    item.order if item.order is not None else sys.maxsize,
                    item.title,
                    item.slug,
                ),
            ):
                post_nodes.append(
                    {
                        "slug": post.slug,
                        "title": post.title,
                        "order": post.order,
                        "status": post.status,
                        "series": post.series,
                        "file": post.file,
                        "headings": post.headings,
                    }
                )

            child_nodes.append(
                {
                    "slug": child.series,
                    "title": child.title,
                    "order": child.order,
                    "parent": child.parent,
                    "description": child.description,
                    "file": child.file,
                    "posts": post_nodes,
                }
            )

        parent_nodes.append(
            {
                "slug": parent.series,
                "title": parent.title,
                "description": parent.description,
                "file": parent.file,
                "children": child_nodes,
            }
        )

    return parent_nodes


def resolve_filters(
    targets: list[str],
    indexes: list[SeriesIndex],
    posts: list[Post],
) -> tuple[str | None, str | None, str | None]:
    parent_by_slug = {i.series: i for i in indexes if not i.parent}
    parent_by_title = {i.title.lower(): i.series for i in indexes if not i.parent}
    child_by_slug = {i.series: i for i in indexes if i.parent}
    child_by_title = {i.title.lower(): i.series for i in indexes if i.parent}
    post_by_slug = {p.slug: p for p in posts}
    post_by_title = {p.title.lower(): p.slug for p in posts}

    parent_slug: str | None = None
    child_slug: str | None = None
    post_slug: str | None = None

    for target in targets:
        lower = target.lower()
        if target in parent_by_slug or lower in parent_by_title:
            parent_slug = target if target in parent_by_slug else parent_by_title[lower]
        elif target in child_by_slug or lower in child_by_title:
            child_slug = target if target in child_by_slug else child_by_title[lower]
        elif target in post_by_slug or lower in post_by_title:
            post_slug = target if target in post_by_slug else post_by_title[lower]
        else:
            raise SystemExit(
                f"Unknown target: {target!r}\n"
                "Expected a parent-series slug/title, child-series slug/title, or post slug/title."
            )

    return parent_slug, child_slug, post_slug


def filter_tree(
    tree: list[dict[str, Any]],
    parent_slug: str | None,
    child_slug: str | None,
    post_slug: str | None,
    status: str,
) -> list[dict[str, Any]]:
    filtered_tree = tree
    if parent_slug:
        filtered_tree = [node for node in filtered_tree if node["slug"] == parent_slug]

    result: list[dict[str, Any]] = []
    for parent in filtered_tree:
        children = parent["children"]
        if child_slug:
            children = [c for c in children if c["slug"] == child_slug]

        filtered_children = []
        for child in children:
            posts = child["posts"]
            if post_slug:
                posts = [p for p in posts if p["slug"] == post_slug]
            if status != "all":
                posts = [p for p in posts if p["status"] == status]
            if post_slug and not posts:
                continue
            filtered_children.append({**child, "posts": posts})

        if (child_slug or post_slug) and not filtered_children:
            continue
        result.append({**parent, "children": filtered_children})
    return result


_HEADING_INDENT = {
    "## ": "      ",
    "### ": "        ",
    "#### ": "          ",
}


def render_tree(tree: list[dict[str, Any]], show_headings: bool = False) -> str:
    lines: list[str] = []

    for parent in tree:
        lines.append(f"{parent['slug']} ({parent['title']})")
        for child in parent["children"]:
            child_order = "?" if child["order"] is None else child["order"]
            lines.append(f"  [{child_order}] {child['slug']} ({child['title']})")
            for post in child["posts"]:
                post_order = "?" if post["order"] is None else post["order"]
                status = post["status"] or "unknown"
                lines.append(
                    f"    - [{post_order}] {post['slug']} ({post['title']}) [{status}]"
                )
                if show_headings:
                    for heading in post.get("headings", []):
                        for prefix, indent in _HEADING_INDENT.items():
                            if heading.startswith(prefix):
                                lines.append(f"{indent}{heading}")
                                break

    return "\n".join(lines)


def render_json(tree: list[dict[str, Any]]) -> str:
    return json.dumps(tree, ensure_ascii=False, indent=2)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Print the repository's parent-series / child-series / post relationships.",
        epilog=(
            "TARGETS: zero, one, or two slugs/titles drawn from parent series, "
            "child series, or post slugs. The type of each argument is inferred "
            "automatically from the repository data."
        ),
    )
    parser.add_argument(
        "targets",
        nargs="*",
        metavar="TARGET",
        help="Parent-series, child-series, or post slug/title to filter by (optional).",
    )
    parser.add_argument(
        "--format",
        choices=["tree", "json"],
        default="tree",
        help="Output format. Defaults to tree.",
    )
    parser.add_argument(
        "--headings",
        action="store_true",
        help="Print h2/h3/h4 headings for each post.",
    )
    parser.add_argument(
        "--status",
        choices=["all", "idea", "draft", "published"],
        default="all",
        help="Filter posts by status. Defaults to all.",
    )
    parser.add_argument(
        "--skip-validation",
        action="store_true",
        help="Skip the repository validation step.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    validate_with_repo_checker(args.skip_validation)

    indexes = load_series_indexes(SERIES_INDEXES_DIR)
    posts = load_posts(POSTS_DIR)
    parent_slug, child_slug, post_slug = resolve_filters(args.targets, indexes, posts)
    show_headings = args.headings or bool(post_slug)
    tree = build_relationship_tree(indexes, posts)
    filtered_tree = filter_tree(tree, parent_slug, child_slug, post_slug, args.status)

    if args.status != "all" and args.status not in ALLOWED_STATUSES:
        raise SystemExit(f"Unsupported status: {args.status}")

    output = (
        render_tree(filtered_tree, show_headings=show_headings)
        if args.format == "tree"
        else render_json(filtered_tree)
    )
    print(output)


if __name__ == "__main__":
    main()
