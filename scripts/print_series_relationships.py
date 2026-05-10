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


def filter_tree(
    tree: list[dict[str, Any]], parent_slug: str | None, status: str
) -> list[dict[str, Any]]:
    filtered_tree = tree
    if parent_slug:
        filtered_tree = [node for node in filtered_tree if node["slug"] == parent_slug]

    if status == "all":
        return filtered_tree

    result: list[dict[str, Any]] = []
    for parent in filtered_tree:
        filtered_children = []
        for child in parent["children"]:
            filtered_posts = [post for post in child["posts"] if post["status"] == status]
            filtered_children.append({**child, "posts": filtered_posts})
        result.append({**parent, "children": filtered_children})
    return result


def render_tree(tree: list[dict[str, Any]]) -> str:
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

    return "\n".join(lines)


def render_json(tree: list[dict[str, Any]]) -> str:
    return json.dumps(tree, ensure_ascii=False, indent=2)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Print the repository's parent-series / child-series / post relationships."
    )
    parser.add_argument(
        "--format",
        choices=["tree", "json"],
        default="tree",
        help="Output format. Defaults to tree.",
    )
    parser.add_argument(
        "--parent",
        help="Filter output to a single parent series slug.",
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
    tree = build_relationship_tree(indexes, posts)
    filtered_tree = filter_tree(tree, args.parent, args.status)

    if args.parent and not filtered_tree:
        raise SystemExit(f"Unknown parent series slug: {args.parent}")

    if args.status != "all" and args.status not in ALLOWED_STATUSES:
        raise SystemExit(f"Unsupported status: {args.status}")

    output = render_tree(filtered_tree) if args.format == "tree" else render_json(filtered_tree)
    print(output)


if __name__ == "__main__":
    main()
