from django.db import models  

class Familia(models.Model):  
    sobrenome = models.CharField(max_length=100)
    endereco = models.CharField(max_length=255)

    def __str__(self):
        return self.sobrenome

class Membro(models.Model): 
    nome = models.CharField(max_length=100)
    telefone = models.CharField(max_length=20)
    nascimento = models.DateField()
    familia = models.ForeignKey(Familia, on_delete=models.CASCADE)

    def __str__(self):
        return self.nome