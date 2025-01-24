from django.shortcuts import render

from chat.models import Room,User


def index_view(request):

    return render(request, 'chat/index.html', {
        'rooms': Room.objects.all(),
    })


def room_view(request, room_name , user_name):
 
    return render(request, 'chat/room.html', {
        'room_name': room_name,
        'user_name': user_name,
    })

