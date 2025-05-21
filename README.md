# Jeux Olympiques app&#x20;

## Description

Ce projet est une application web full-stack pour la gestion de billets d'événements autour des Jeux Olympiques. Il se compose d'un backend Django REST API et d'un frontend React (Chakra UI + React Router).

## Fonctionnalités

* Inscription / Authentification via JWT stockés en cookies sécurisés
* Consultation des offres disponibles (Solo, Duo, Familial)
* Gestion d'un panier interactif
* Paiement et génération de QR codes uniques pour chaque achat
* Page d'historique des commandes avec affichage des QR codes
* Interface d'administration des offres 

## Stack Technique

### Backend

* Django
* Django REST Framework
* Simple JWT (authentification par cookies)
* qrcode (génération de QR codes)
* MySQL&#x20;
* CORS headers

### Frontend

* React
* React Router DOM
* Chakra UI (design système)
* axios (requêtes HTTP)
* framer-motion (animations)

## Structure du Projet

```
app_code/
├── backend/              # Projet Django
│   ├── base/             # App principale 
│   ├── backend/          # settings, urls, wsgi
│   ├── staticfiles/      # fichiers statiques collectés
│   └── manage.py
├── frontend/             # App React 
│   ├── public/
│   └── src/              # composants, routes, contexts, endpoints                
└── .gitignore
```

## Prérequis

* Python 3.10+ et pip
* Node.js 16+ et npm (ou yarn)
* MySQL (ou SQLite)

## Installation

### Backend

```bash
cd app_code/backend

python -m venv ../env
source ../env/bin/activate  

pip install -r requirements.txt


python manage.py migrate


python manage.py loaddata fixtures/offers.json


python manage.py runserver
```

### Frontend

```bash

cd app_code/frontend


npm install


npm start
```

L'application React sera accessible sur `http://localhost:3000`.

## Variables d'Environnement

Dans `backend/settings.py`, ajuster :

* `SECRET_KEY`
* Paramètres de base de données (MySQL ou SQLite)
* `ALLOWED_HOSTS` et `CORS_ALLOWED_ORIGINS`

## Git Ignore

Exemple de règles pour `.gitignore` à la racine `app_code` :

```
/env/

**/db.sqlite3

/frontend/node_modules\`
/build

.DS_Store
```

## Utilisation

1. Créez un compte et connectez-vous.
2. Parcourez les offres et ajoutez-en au panier.
3. Procédez au paiement : un QR code unique est généré.
4. Rendez-vous dans l'onglet "Commandes" pour retrouver l'historique et réafficher vos billets.

## Endpoints API Principaux

| Route                 | Méthode  | Authentification | Description                           |
| --------------------- | -------- | ---------------- | ------------------------------------- |
| `/api/register/`      | POST     | Non              | Création d'un compte                  |
| `/api/tokens/`        | POST     | Non              | Obtention des tokens JWT              |
| `/api/authenticated/` | GET      | Non              | Vérifie si l'utilisateur est connecté |
| `/api/offers/`        | GET/POST | Non              | Liste / création d'offres             |
| `/api/purchase/`      | POST     | Oui              | Achat + génération de QR code         |
| `/api/orders/`        | GET      | Oui              | Historique des achats                 |

##

##
