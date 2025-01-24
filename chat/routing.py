from django.urls import re_path , path

from . import consumer

# websocket_urlpatterns = [
#     re_path(r'ws/chat/(?P<room_name>\w+)/(?P<user_name>\w+)/$', consumer.ChatConsumer.as_asgi()),
# ]

# will handle the chat functionality.
websocket_urlpatterns = [
    path("ws/chat/<str:room_name>/<str:user_name>" , consumer.ChatConsumer.as_asgi()) , 
] 