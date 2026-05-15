import sys
import tempfile
import textwrap
import unittest
from pathlib import Path
from typing import Optional


ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

import print_series_relationships as psr


def index(
    file: str,
    title: str,
    series: str,
    parent: Optional[str] = None,
    order: Optional[int] = None,
) -> psr.SeriesIndex:
    return psr.SeriesIndex(
        file=file,
        title=title,
        series=series,
        parent=parent,
        order=order,
        description=None,
    )


def post(
    file: str,
    slug: str,
    title: str,
    series: str,
    order: Optional[int] = None,
    status: Optional[str] = None,
    headings: Optional[list[str]] = None,
) -> psr.Post:
    return psr.Post(
        file=file,
        slug=slug,
        title=title,
        series=series,
        order=order,
        status=status,
        headings=headings or [],
    )


class PrintSeriesRelationshipsTest(unittest.TestCase):
    def test_parse_frontmatter_parses_quotes_and_order(self) -> None:
        text = textwrap.dedent(
            """\
            ---
            title: "네트워크 기초"
            series: computer-networks
            order: 2
            status: draft
            ---
            Body
            """
        )

        self.assertEqual(
            psr.parse_frontmatter(text),
            {
                "title": "네트워크 기초",
                "series": "computer-networks",
                "order": 2,
                "status": "draft",
            },
        )

    def test_loaders_use_temp_fixtures_and_extract_headings(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            indexes_dir = root / "series_indexes"
            posts_dir = root / "posts"
            indexes_dir.mkdir()
            posts_dir.mkdir()

            (indexes_dir / "computer-networks.md").write_text(
                textwrap.dedent(
                    """\
                    ---
                    title: Computer Networks
                    series: computer-networks
                    description: Parent
                    ---
                    """
                ),
                encoding="utf-8",
            )
            (posts_dir / "dns.md").write_text(
                textwrap.dedent(
                    """\
                    ---
                    title: DNS
                    series: name-resolution
                    order: 3
                    status: draft
                    ---
                    # Ignored
                    ## Overview
                    ### Resolver
                    #### Cache
                    """
                ),
                encoding="utf-8",
            )

            indexes = psr.load_series_indexes(indexes_dir)
            posts = psr.load_posts(posts_dir)

        self.assertEqual(indexes[0].series, "computer-networks")
        self.assertEqual(posts[0].slug, "dns")
        self.assertEqual(posts[0].headings, ["## Overview", "### Resolver", "#### Cache"])

    def test_build_relationship_tree_sorts_children_and_posts_by_order(self) -> None:
        indexes = [
            index("database-systems.md", "Database Systems", "database-systems"),
            index(
                "query-processing.md",
                "Query Processing",
                "query-processing",
                parent="database-systems",
                order=2,
            ),
            index(
                "transactions.md",
                "Transactions",
                "transactions",
                parent="database-systems",
                order=1,
            ),
        ]
        posts = [
            post("third.md", "third", "Third", "transactions", order=3, status="draft"),
            post("first.md", "first", "First", "transactions", order=1, status="idea"),
            post("second.md", "second", "Second", "transactions", order=2, status="published"),
        ]

        tree = psr.build_relationship_tree(indexes, posts)

        self.assertEqual(
            [child["slug"] for child in tree[0]["children"]],
            ["transactions", "query-processing"],
        )
        self.assertEqual(
            [entry["slug"] for entry in tree[0]["children"][0]["posts"]],
            ["first", "second", "third"],
        )

    def test_filter_tree_supports_status_parent_child_and_post_targets(self) -> None:
        tree = psr.build_relationship_tree(
            [
                index("computer-networks.md", "Computer Networks", "computer-networks"),
                index(
                    "transport.md",
                    "Transport",
                    "transport",
                    parent="computer-networks",
                    order=2,
                ),
                index(
                    "routing.md",
                    "Routing",
                    "routing",
                    parent="computer-networks",
                    order=1,
                ),
            ],
            [
                post("tcp.md", "tcp", "TCP", "transport", order=2, status="draft"),
                post("udp.md", "udp", "UDP", "transport", order=1, status="published"),
                post("ospf.md", "ospf", "OSPF", "routing", order=1, status="draft"),
            ],
        )

        parent_filtered = psr.filter_tree(tree, "computer-networks", None, None, "all")
        child_filtered = psr.filter_tree(tree, None, "transport", None, "all")
        post_filtered = psr.filter_tree(tree, None, None, "udp", "all")
        status_filtered = psr.filter_tree(tree, None, None, None, "draft")

        self.assertEqual(len(parent_filtered), 1)
        self.assertEqual(
            [child["slug"] for child in child_filtered[0]["children"]],
            ["transport"],
        )
        self.assertEqual(
            [entry["slug"] for entry in post_filtered[0]["children"][0]["posts"]],
            ["udp"],
        )
        self.assertEqual(
            [entry["slug"] for entry in status_filtered[0]["children"][0]["posts"]],
            ["ospf"],
        )

    def test_resolve_filters_prefers_slug_matches_even_when_titles_collide(self) -> None:
        indexes = [
            index("computer-networks.md", "Computer Networks", "computer-networks"),
            index(
                "transport.md",
                "udp",
                "transport",
                parent="computer-networks",
                order=1,
            ),
        ]
        posts = [post("udp.md", "udp", "Transport", "transport", order=1, status="draft")]

        parent_slug, child_slug, post_slug = psr.resolve_filters(["udp"], indexes, posts)

        self.assertEqual((parent_slug, child_slug, post_slug), (None, None, "udp"))

    def test_resolve_filters_rejects_duplicate_titles_within_each_type(self) -> None:
        cases = [
            (
                "Database Systems",
                [
                    index("a.md", "Database Systems", "database-systems"),
                    index("b.md", "Database Systems", "db-fundamentals"),
                ],
                [],
                "parent series: database-systems, db-fundamentals",
            ),
            (
                "Network Foundations",
                [
                    index("parent.md", "Computer Networks", "computer-networks"),
                    index("a.md", "Network Foundations", "network-foundations-a", parent="computer-networks"),
                    index("b.md", "Network Foundations", "network-foundations-b", parent="computer-networks"),
                ],
                [],
                "child series: network-foundations-a, network-foundations-b",
            ),
            (
                "HTTP",
                [],
                [
                    post("http-1.md", "http-1", "HTTP", "web", status="draft"),
                    post("http-2.md", "http-2", "HTTP", "web", status="draft"),
                ],
                "post: http-1, http-2",
            ),
        ]

        for target, indexes, posts, message in cases:
            with self.subTest(target=target):
                with self.assertRaises(SystemExit) as ctx:
                    psr.resolve_filters([target], indexes, posts)
                self.assertIn("Ambiguous title target", str(ctx.exception))
                self.assertIn(message, str(ctx.exception))
                self.assertIn("Use a slug instead.", str(ctx.exception))

    def test_resolve_filters_rejects_cross_type_title_collisions(self) -> None:
        indexes = [
            index("database-systems.md", "Database Systems", "database-systems"),
            index(
                "database-foundations.md",
                "Shared Title",
                "database-foundations",
                parent="database-systems",
                order=1,
            ),
        ]
        posts = [
            post(
                "shared-title.md",
                "shared-title",
                "Shared Title",
                "database-foundations",
                status="draft",
            )
        ]

        with self.assertRaises(SystemExit) as ctx:
            psr.resolve_filters(["Shared Title"], indexes, posts)

        self.assertIn("matches multiple content types", str(ctx.exception))
        self.assertIn("child series: database-foundations", str(ctx.exception))
        self.assertIn("post: shared-title", str(ctx.exception))

    def test_render_json_preserves_korean_text(self) -> None:
        tree = [
            {
                "slug": "computer-networks",
                "title": "컴퓨터 네트워크",
                "description": "설명",
                "file": "computer-networks.md",
                "children": [],
            }
        ]

        rendered = psr.render_json(tree)

        self.assertIn("컴퓨터 네트워크", rendered)
        self.assertIn("설명", rendered)


if __name__ == "__main__":
    unittest.main()
