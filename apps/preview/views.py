from django.shortcuts import render

PREVIEW_PAGES = [
    {"slug": "dashboard", "title": "Dashboard", "icon": "home", "description": "Main dashboard with stats and charts"},
    {"slug": "cards", "title": "Cards", "icon": "layout", "description": "Card components and layouts"},
    {"slug": "forms", "title": "Forms", "icon": "edit", "description": "Form elements and inputs"},
    {"slug": "tables", "title": "Tables", "icon": "grid", "description": "Data tables and lists"},
    {"slug": "charts", "title": "Charts", "icon": "bar-chart-2", "description": "Chart.js chart examples"},
    {"slug": "buttons", "title": "Buttons", "icon": "mouse-pointer", "description": "Button styles and variants"},
    {"slug": "colors", "title": "Colors", "icon": "droplet", "description": "Color palette reference"},
    {"slug": "typography", "title": "Typography", "icon": "type", "description": "Typography and text styles"},
]


def preview_index(request):
    return render(request, "preview/index.html", {"pages": PREVIEW_PAGES})


def preview_page(request, page):
    template_name = f"preview/{page}.html"
    current = next((p for p in PREVIEW_PAGES if p["slug"] == page), None)
    return render(request, template_name, {"pages": PREVIEW_PAGES, "current": current})
