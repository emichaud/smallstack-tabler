"""
GitHub API helper for fetching repo stats and changelog.

Uses Django's cache framework with 1-hour TTL.
All data is fetched from the public GitHub REST API — no auth needed.
"""

import json
import logging
from collections import OrderedDict
from urllib.request import Request, urlopen

from django.conf import settings
from django.core.cache import cache

logger = logging.getLogger(__name__)

REPO = getattr(settings, "GITHUB_REPO", "emichaud/django-smallstack")
CACHE_TTL = 3600  # 1 hour


def _github_get(path, timeout=5):
    """Make a GET request to the GitHub API."""
    headers = {"Accept": "application/vnd.github.v3+json"}
    req = Request(f"https://api.github.com{path}", headers=headers)
    return json.loads(urlopen(req, timeout=timeout).read())


def get_repo_stats():
    """Return dict with stars, forks, version, description. Cached 1hr."""
    cache_key = "github_repo_stats"
    data = cache.get(cache_key)
    if data:
        return data
    try:
        resp = _github_get(f"/repos/{REPO}")
        tags = _github_get(f"/repos/{REPO}/tags?per_page=1")

        data = {
            "stars": resp.get("stargazers_count", 0),
            "forks": resp.get("forks_count", 0),
            "open_issues": resp.get("open_issues_count", 0),
            "description": resp.get("description", ""),
            "html_url": resp.get("html_url", ""),
            "version": tags[0]["name"] if tags else "",
        }
        cache.set(cache_key, data, CACHE_TTL)
        return data
    except Exception:
        logger.warning("Failed to fetch GitHub repo stats")
        return None


def get_changelog(count=100):
    """Return changelog grouped by version tags. Cached 1hr.

    Returns an OrderedDict like:
        {"Unreleased": [commits...], "v0.1.0": [commits...]}
    Each commit is {"sha", "message", "url"}.
    """
    cache_key = "github_changelog"
    data = cache.get(cache_key)
    if data:
        return data
    try:
        tags_raw = _github_get(f"/repos/{REPO}/tags?per_page=100")
        tag_shas = {}
        for tag in tags_raw:
            tag_shas[tag["commit"]["sha"]] = tag["name"]

        commits_raw = _github_get(f"/repos/{REPO}/commits?per_page={count}")

        changelog = OrderedDict()
        current_section = "Unreleased"

        for c in commits_raw:
            sha_full = c["sha"]
            commit = {
                "sha": sha_full[:7],
                "message": c["commit"]["message"].split("\n")[0],
                "url": c["html_url"],
            }
            changelog.setdefault(current_section, []).append(commit)

            if sha_full in tag_shas:
                current_section = tag_shas[sha_full]

        if "Unreleased" in changelog and not changelog["Unreleased"]:
            del changelog["Unreleased"]

        cache.set(cache_key, changelog, CACHE_TTL)
        return changelog
    except Exception:
        logger.warning("Failed to fetch GitHub changelog")
        return None
