from django.urls import path
from . import views

urlpatterns = [
    path('', views.land_page, name='land_page'),
    path('lista/', views.lista_membros, name='lista_membros'),
    path('lista/exportar/', views.exportar_membros, name='exportar_membros'),
    path('familias/', views.family_page, name='family_page'),
    path('sorteio/', views.rafflew_page, name='rafflew_page'),
    path('aniversarios/', views.birthday_page, name='birthday_page'),
]
