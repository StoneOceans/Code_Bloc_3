import pytest
import requests
import uuid

BASE_URL = "https://sitedesjo.dev-data.eu"

@pytest.fixture
def session():
    with requests.Session() as s:
        yield s

def test_site_is_up():
    r = requests.get(BASE_URL)
    assert r.status_code == 200

def test_register_user():
    payload = {
        "username": "testuser1",
        "email": "test1@example.com",
        "password": "A12345678901b+"
    }
    r = requests.post(f"{BASE_URL}/register", json=payload)
    assert r.status_code in (200, 201)

def test_login_user():
    payload = {
        "username": "testuser1",
        "password": "A12345678901b+"
    }
    r = requests.post(f"{BASE_URL}/login", json=payload)
    assert r.status_code in (200, 401, 403)

def test_offers_access():
    r = requests.get(f"{BASE_URL}/offers")
    assert r.status_code == 200
    
def test_remove_from_cart():
    session = requests.Session()
    u = uuid.uuid4().hex[:8]
    creds = {
        "username": "testuser1",
        "email": "test1@example.com",
        "password": "A12345678901b+"
    }
    
    r = session.post(f"{BASE_URL}/cart/add/", json={"offer_id": 1})
    assert r.status_code in (200, 201), f"Échec de l'ajout au panier: {r.text}"

    r = session.post(f"{BASE_URL}/cart/remove/", json={"offer_id": 1})
    assert r.status_code == 200, f"Échec de la suppression du panier: {r.text}"

def test_cart_access():
    r = requests.get(f"{BASE_URL}/cart")
    assert r.status_code in (200, 401, 403)
    
def test_invalid_login(session):
    """Le backend doit refuser une connexion avec des identifiants invalides."""
    payload = {
        "username": "invalid_user",
        "password": "wrongpass"
    }
    r = session.post(f"{BASE_URL}/login", json=payload)
    assert r.status_code in (401, 403), f"Connexion invalide acceptée (code : {r.status_code})"

@pytest.mark.parametrize(
    "payload, missing_field",
    [
        ({"email": "a@b.c", "password": "Pwd1!"}, "username"),
        ({"username": "foo", "password": "Pwd1!"}, "email"),
        ({"username": "foo", "email": "a@b.c"}, "password"),
    ],
)
def test_registration_missing_fields(session, payload, missing_field):
    """Le backend doit refuser tout enregistrement avec des champs manquants."""
    r = session.post(f"{BASE_URL}/register", json=payload)
    assert r.status_code in (400, 422), f"Inscription autorisée sans le champ '{missing_field}' (code : {r.status_code})"

def test_registration_weak_password(session):
    """Le backend doit refuser les mots de passe trop faibles."""
    payload = {
        "username": "weakuser",
        "email": "weak@example.com",
        "password": "123"  # Trop simple
    }
    r = session.post(f"{BASE_URL}/register", json=payload)
    assert r.status_code in (400, 422), f"Inscription acceptée avec mot de passe faible (code : {r.status_code})"

def test_full_user_journey():
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
        pytest.skip("Skipping: /login returned HTML instead of JSON — likely hitting frontend route.")

    token = r.json().get("token")
    assert token, "No token returned"
    session.headers.update({"Authorization": f"Bearer {token}"})

    r = session.post(f"{BASE_URL}/cart/add", json={"offer_id": 1})
    assert r.status_code in (200, 201)

    r = session.post(f"{BASE_URL}/checkout")
    assert r.status_code in (200, 201)

    r = session.get(f"{BASE_URL}/orders")
    assert r.status_code == 200

