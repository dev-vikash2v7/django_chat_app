import os

import django

from channels.routing import ProtocolTypeRouter , URLRouter
from channels.auth import   AuthMiddlewareStack
import chat.routing
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")

# django.setup()

application = ProtocolTypeRouter(
    {
        "http" : get_asgi_application() , 
        "websocket" : AuthMiddlewareStack(
            URLRouter(
                chat.routing.websocket_urlpatterns
            )    
        )
    }
)


