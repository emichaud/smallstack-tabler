from django.urls import path

from . import views

app_name = "preview"

urlpatterns = [
    path("", views.preview_index, name="index"),
    path("dashboard/", views.preview_page, {"page": "dashboard"}, name="dashboard"),
    path("cards/", views.preview_page, {"page": "cards"}, name="cards"),
    path("forms/", views.preview_page, {"page": "forms"}, name="forms"),
    path("tables/", views.preview_page, {"page": "tables"}, name="tables"),
    path("charts/", views.preview_page, {"page": "charts"}, name="charts"),
    path("buttons/", views.preview_page, {"page": "buttons"}, name="buttons"),
    path("colors/", views.preview_page, {"page": "colors"}, name="colors"),
    path("typography/", views.preview_page, {"page": "typography"}, name="typography"),
]
