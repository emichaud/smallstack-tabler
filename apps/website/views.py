"""
Website views - customize these for your project.

This app is the designated place for project-specific pages like
your homepage, landing pages, about page, etc.

These pages are intentionally separated from SmallStack core so you
can customize them freely without conflicts when pulling upstream updates.
SmallStack's own demo pages live in ``apps/showcase``, which you can delete.
"""

from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def home_view(request: HttpRequest) -> HttpResponse:
    """
    Project homepage.

    Customize this view and its template (templates/website/home.html)
    for your project's landing page.
    """
    return render(request, "website/home.html")


def changelog_view(request: HttpRequest) -> HttpResponse:
    """Changelog page with repo stats and version history from GitHub (Tabler fork page)."""
    from .github import get_changelog, get_repo_stats

    return render(
        request,
        "website/changelog.html",
        {
            "repo": get_repo_stats(),
            "changelog": get_changelog(),
        },
    )
