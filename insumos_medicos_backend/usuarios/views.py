from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from usuarios.serializers import UsuarioSerializer


def index(request):
    return HttpResponse('Hola mundo!')

@api_view(['POST'])
def nuevo_usuario(request):
    serializer = UsuarioSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)