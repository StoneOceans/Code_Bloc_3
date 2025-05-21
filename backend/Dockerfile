# backend/Dockerfile

FROM python:3.9-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /

RUN apt-get update \
    && apt-get install -y default-libmysqlclient-dev gcc pkg-config \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Décommentez et adaptez si vous voulez que collectstatic s'exécute pendant le build
# Assurez-vous que STATIC_ROOT est correctement défini dans settings.py
# RUN python manage.py collectstatic --noinput

EXPOSE 8000

# Remplacez 'your_django_project_name' par le nom réel du dossier principal de votre projet Django
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:application"]
