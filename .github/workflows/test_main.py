
import pytest
import requests

BASE_URL = "https://sitedesjo.dev-data.eu/"  

def test_acces_site_web():
    response = requests.get(BASE_URL)
    assert response.status_code == 200

def test_choix_tickets():
    response = requests.get(f"{BASE_URL}/api/tickets/")
    assert response.status_code == 200
    data = response.json()
    assert "Duo" in [ticket["name"] for ticket in data]
    assert "Familiale" in [ticket["name"] for ticket in data]

def test_creation_utilisateur():
    payload = {
        "username": "testuser",
        "password": "securepass123"
    }
    response = requests.post(f"{BASE_URL}/api/register/", json=payload)
    assert response.status_code == 201

def test_connexion_utilisateur():
    payload = {
        "username": "testuser",
        "password": "securepass123"
    }
    response = requests.post(f"{BASE_URL}/api/login/", json=payload)
    assert response.status_code == 200
    assert "token" in response.json()

def test_paiement():
    # Simulation du paiement (dépend du backend)
    payload = {
        "ticket_id": 1,
        "user_id": 1
    }
    response = requests.post(f"{BASE_URL}/api/payment/", json=payload)
    assert response.status_code == 200 or response.status_code == 302

def test_securite_billet():
    response = requests.get(f"{BASE_URL}/api/tickets/1/")
    assert response.status_code == 200
    data = response.json()
    assert "secure_token" in data
    assert "user" in data

def test_authentification_double_facteur():
    payload = {
        "username": "testuser",
        "otp": "123456"  # Supposé OTP de test
    }
    response = requests.post(f"{BASE_URL}/api/verify-otp/", json=payload)
    assert response.status_code == 200
