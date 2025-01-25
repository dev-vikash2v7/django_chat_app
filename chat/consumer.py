import json
import django
django.setup()

from asgiref.sync import async_to_sync , sync_to_async
from channels.generic.websocket import  AsyncWebsocketConsumer


from .models import Room , Message , User


class ChatConsumer(AsyncWebsocketConsumer):

    def __init__(self):
        super().__init__()

        self.room_name = None
        self.room_group_name = None
        self.room = None

        self.user_name =None 
        self.user =None 
        self.user_inbox = None  # new
        self.isCreated  = None


    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name'] #'url_route': {'args': (), 'kwargs': {'room_name': 'mk'}}}
        self.room_group_name = f'chat_{self.room_name}'



        self.user_name = self.scope['url_route']['kwargs']['user_name'] #'url_route': {'args': (), 'kwargs': {'room_name': 'mk'}}}
        self.user_inbox = f'inbox_{self.user_name}'  # new
       
        self.user, user_iscreated = await sync_to_async(User.objects.get_or_create)(name=self.user_name)
        self.room, self.isCreated = await sync_to_async(Room.objects.get_or_create)(name=self.room_name)

        # Call the room join method in a thread
        await sync_to_async(self.room.join)(self.user)

        await self.accept()
        await self.channel_layer.group_add(  self.room_group_name,   self.channel_name)

        users = await sync_to_async(list)(self.room.online_users.all())

        # print([user.name for user in users])

        await self.send(json.dumps({
            'type': 'user_list',
            'users': [user.name for user in users]
        }))

        if not self.isCreated :
            await self.channel_layer.group_send(   self.room_group_name,
            {
                'type': 'user_join',
                'user_name' : self.user_name
            }
        )




    async def disconnect(self, close_code):
        print(self.user)
        await sync_to_async(self.room.leave)(self.user)
        await self.channel_layer.group_discard (   self.room_group_name ,self.channel_name  )
        await self.close()




    async def receive(self, text_data=None, bytes_data=None):

        text_data_json = json.loads(text_data)
        # print(text_data_json)

        
        message = text_data_json['message']
        await sync_to_async(Message.objects.create)(user=self.user, room=self.room, content=message)

        await self.channel_layer.group_send(     self.room_group_name,
            {
                'type': 'chat_message',
                'user_name' : text_data_json['user_name'],
                "room_name":  text_data_json['room_name'],
                'message': message,
            }
        )


    async def chat_message(self, event):
       await self.send(text_data=json.dumps(event))

    async def user_join(self, event):
      await  self.send(text_data=json.dumps(event))

    async def user_leave(self, event):
       await self.send(text_data=json.dumps(event))