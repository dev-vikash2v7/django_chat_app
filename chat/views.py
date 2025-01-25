from django.shortcuts import render

from chat.models import Room,User


def index_view(request):
    rooms = Room.objects.all()
    return render(request, 'chat/index.html', {
        'rooms': rooms if rooms.exists() else [],
    })
     

    


def room_view(request, room_name , user_name):
 
    return render(request, 'chat/room.html', {
        'room_name': room_name,
        'user_name': user_name,
    })

