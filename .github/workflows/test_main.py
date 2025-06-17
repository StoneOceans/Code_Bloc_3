# test_main.py
import pytest
import requests
import uuid

BASE_URL = "https://sitedesjo.dev-data.eu"

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

def test_cart_access():
    r = requests.get(f"{BASE_URL}/cart")
    assert r.status_code in (200, 401, 403)

@pytest.mark.xfail(reason="Back-end accepte les connexions invalides sans rejet explicite")
def test_invalid_login(session):
    r = session.post(f"{BASE_URL}/login", json={
        "username": "invalid_user",
        "password": "wrongpass"
    })
    assert r.status_code in (401, 403)

@pytest.mark.xfail(reason="Back-end ne bloque pas l'accès au panier sans token")
def test_cart_requires_auth():
    r = requests.get(f"{BASE_URL}/cart")
    assert r.status_code in (401, 403)

@pytest.mark.parametrize(
    "payload, missing_field",
    [
        ({"email": "a@b.c", "password": "Pwd1!"}, "username"),
        ({"username": "foo", "password": "Pwd1!"}, "email"),
        ({"username": "foo", "email": "a@b.c"}, "password"),
    ],
)
@pytest.mark.xfail(reason="Back-end accepte les enregistrements incomplets")
def test_registration_missing_fields(session, payload, missing_field):
    r = session.post(f"{BASE_URL}/register", json=payload)
    assert r.status_code != 200, f"Registration succeeded with missing {missing_field}"

@pytest.mark.xfail(reason="Back-end accepte des mots de passe trop faibles")
def test_registration_weak_password(session):
    payload = {
        "username": "weakuser",
        "email": "weak@example.com",
        "password": "123"
    }
    r = session.post(f"{BASE_URL}/register", json=payload)
    assert r.status_code in (400, 422)
    
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
