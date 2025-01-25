web: gunicorn project.asgi --log-file - 
web: python manage.py migrate && gunicorn --bind 0.0.0.0:8000 project.wsgi:application
