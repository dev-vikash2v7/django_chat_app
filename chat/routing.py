from django.urls import re_path , path

from . import consumer


websocket_urlpatterns = [
    path("ws/chat/<str:room_name>/<str:user_name>" , consumer.ChatConsumer.as_asgi()) , 
] 