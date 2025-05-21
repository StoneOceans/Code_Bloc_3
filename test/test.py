
import pytest
import requests

BASE_URL = "https://sitedesjo.dev-data.eu/"  

def test_acces_site_web():
    response = requests.get(BASE_URL)
    assert response.status_code == 200

def test_creation_utilisateur():
    payload = {
        "username": "testuser",
        "email" : "testt@gmail.com",
        "password": "Securepass123+"
    }
    response = requests.post(f"{BASE_URL}/register/", json=payload)
    assert response.status_code == 201

def test_connexion_utilisateur():
    payload = {
        "username": "testuser",
        "password": "Securepass123+"
    }
    response = requests.post(f"{BASE_URL}/login/", json=payload)
    assert response.status_code == 200
    assert "token" in response.json()


