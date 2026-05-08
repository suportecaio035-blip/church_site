import csv

from django.http import HttpResponse
from django.shortcuts import render, redirect
from .models import Membro, Familia

def login_page(request):
    return render(request, 'index.html')

def land_page(request):
    return render(request, 'land_page.html')

def family_page(request):
    return render(request, 'family.html')

def rafflew_page(request):
    return render(request, 'rafflew.html')

def birthday_page(request):
    return render(request, 'birthday.html')

def exportar_membros(request):
    response = HttpResponse(content_type='text/csv; charset=utf-8-sig')
    response['Content-Disposition'] = 'attachment; filename="membros.csv"'
    response.write('\ufeff')

    writer = csv.writer(response, delimiter=';')
    writer.writerow(['Nome do membro', 'Telefone', 'Endereco', 'Familia'])

    membros = Membro.objects.select_related('familia').order_by('nome')
    for membro in membros:
        writer.writerow([
            membro.nome,
            membro.telefone,
            membro.familia.endereco,
            membro.familia.sobrenome,
        ])

    return response

def lista_membros(request):
    if request.method == 'POST':
        # Lógica para CADASTRAR (Create)
        nome = request.POST.get('nome')
        telefone = request.POST.get('telefone')
        nascimento = request.POST.get('nascimento')
        familia_id = request.POST.get('familia')
        
        familia = Familia.objects.get(id=familia_id)
        Membro.objects.create(
            nome=nome, 
            telefone=telefone, 
            nascimento=nascimento, 
            familia=familia
        )
        return redirect('lista_membros')

    # Lógica para LISTAR (Read)
    membros = Membro.objects.all()
    familias = Familia.objects.all()
    return render(request, 'member.html', {'membros': membros, 'familias': familias})
