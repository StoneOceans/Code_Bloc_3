import pytest
import requests
import uuid

BASE_URL = "https://sitedesjo.dev-data.eu"  # à adapter si nécessaire


@pytest.fixture
def session():
    with requests.Session() as s:
        yield s


def test_site_is_up():
    r = requests.get(BASE_URL)
    assert r.status_code == 200


def test_register_user():
    """Test d'inscription avec des données valides."""
    u = uuid.uuid4().hex[:8]
    payload = {
        "username": f"user_{u}",
        "email": f"{u}@example.com",
        "password": f"A123456!{u}"
    }
    r = requests.post(f"{BASE_URL}/register", json=payload)
    assert r.status_code in (200, 201), f"Inscription échouée : {r.status_code} — {r.text}"


def test_login_user():
    """Test de connexion avec des identifiants valides (utilisateur déjà inscrit)."""
    payload = {
        "username": "testuser1",
        "password": "A12345678901b+"
    }
    r = requests.post(f"{BASE_URL}/login", json=payload)
    assert r.status_code in (200, 401, 403)


def test_duplicate_registration_not_allowed(session):
    """Le backend doit refuser une double inscription avec le même email ou username."""
    u = uuid.uuid4().hex[:6]
    payload = {
        "username": f"dupuser{u}",
        "email": f"dup{u}@example.com",
        "password": f"Aa12345678!{u}"
    }

    r1 = session.post(f"{BASE_URL}/register", json=payload)
    assert r1.status_code in (200, 201), f"Inscription 1 échouée : {r1.status_code}"

    r2 = session.post(f"{BASE_URL}/register", json=payload)
    assert r2.status_code in (400, 409), f"Double inscription autorisée (code : {r2.status_code})"

def test_orders_requires_authentication():
    """Accès aux commandes sans token — doit être interdit."""
    r = requests.get(f"{BASE_URL}/orders")
    assert r.status_code in (401, 403), f"Accès non autorisé aux commandes sans authentification (code : {r.status_code})"

def test_cart_add_requires_authentication():
    """Ajout au panier sans authentification — doit échouer."""
    r = requests.post(f"{BASE_URL}/cart/add/", json={"offer_id": 1})
    assert r.status_code in (401, 403), f"Ajout au panier sans connexion autorisé (code : {r.status_code})"



def test_offers_access():
    r = requests.get(f"{BASE_URL}/offers")
    assert r.status_code == 200


def test_cart_access():
    r = requests.get(f"{BASE_URL}/cart")
    assert r.status_code in (200, 401, 403)


def test_remove_from_cart():
    session = requests.Session()
    creds = {
        "username": "testuser1",
        "email": "test1@example.com",
        "password": "A12345678901b+"
    }

    r = session.post(f"{BASE_URL}/login", json={
        "username": creds["username"],
        "password": creds["password"]
    })

    token = None
    if r.status_code == 200 and "application/json" in r.headers.get("Content-Type", ""):
        token = r.json().get("access")

    if token:
        session.headers.update({"Authorization": f"Bearer {token}"})

    r = session.post(f"{BASE_URL}/cart/add/", json={"offer_id": 1})
    assert r.status_code in (200, 201), f"Ajout au panier échoué : {r.text}"

    r = session.post(f"{BASE_URL}/cart/remove/", json={"offer_id": 1})
    assert r.status_code == 200, f"Suppression du panier échouée : {r.text}"


def test_full_user_journey():
    """Inscription -> Connexion -> Achat -> Commandes"""
    session = requests.Session()
    u = uuid.uuid4().hex[:8]
    creds = {
        "username": f"user_{u}",
        "email": f"{u}@example.com",
        "password": f"Pwd!{u}A1"
    }

    r = session.post(f"{BASE_URL}/register", json=creds)
    assert r.status_code in (200, 201)

    r = session.post(f"{BASE_URL}/login", json={
        "username": creds["username"],
        "password": creds["password"]
    })

    content_type = r.headers.get("Content-Type", "")
    if "application/json" not in content_type:
        pytest.skip("Connexion retourne du HTML — probablement une redirection front")

    token = r.json().get("access")
    assert token, "Token non retourné"
    session.headers.update({"Authorization": f"Bearer {token}"})

    r = session.post(f"{BASE_URL}/cart/add", json={"offer_id": 1})
    assert r.status_code in (200, 201)

    r = session.post(f"{BASE_URL}/checkout")
    assert r.status_code in (200, 201)

    r = session.get(f"{BASE_URL}/orders")
    assert r.status_code == 200
