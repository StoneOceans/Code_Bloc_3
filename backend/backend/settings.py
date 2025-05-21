import os
from pathlib import Path
from datetime import timedelta

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-z9ljf@$_l9mr#c')
DEBUG = False
ALLOWED_HOSTS = [
    '212.132.97.178',
    'sitedesjo.dev-data.eu',
]

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',

    'base',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('MYSQL_DB', 'codejo'),
        'USER': os.getenv('MYSQL_USER', 'root'),
        'PASSWORD': os.getenv('MYSQL_PASSWORD', 'dev-data2023'),
        'HOST': os.getenv('MYSQL_HOST', '127.0.0.1'),
        'PORT': os.getenv('MYSQL_PORT', '3306'),
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator' },
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator' },
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator' },
    {
        'NAME': 'base.validators.CNILPasswordValidator',
        'OPTIONS': { 'min_length': 12 },
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR.parent / 'frontend' / 'build' / 'static',
]
STATIC_ROOT = BASE_DIR / 'staticfiles'

# CORS / CSRF
# For development: allow all origins temporarily to debug CORS issues
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# In production, restrict to specific front-end domains:
CORS_ALLOWED_ORIGINS = [
    'https://sitedesjo.dev-data.eu',
    'http://sitedesjo.dev-data.eu',
    
]
CSRF_TRUSTED_ORIGINS = [
    'https://sitedesjo.dev-data.eu',
    'http://sitedesjo.dev-data.eu',
    
]
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = 'Lax'

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'base.authentication.CookiesJWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# Simple JWT
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
    'UPDATE_LAST_LOGIN': False,

    'AUTH_COOKIE': 'access_token',
    'AUTH_COOKIE_REFRESH': 'refresh_token',
    'AUTH_COOKIE_SECURE': False,  # Set to True in production
    'AUTH_COOKIE_HTTP_ONLY': True,
    'AUTH_COOKIE_PATH': '/',
    'AUTH_COOKIE_SAMESITE': 'Lax',
}

# Default primary key
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
