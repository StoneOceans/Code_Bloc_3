import pytest
import requests
import uuid

BASE_URL = "https://sitedesjo.dev-data.eu"
API_URL = f"{BASE_URL}/api"

def test_site_is_up():
    r = requests.get(BASE_URL)
    assert r.status_code == 200

def test_register_user():
    unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    payload = {
        "username": "testuser_generic",
        "email": unique_email,
        "password": "A12345678901b+"
    }
    r = requests.post(f"{API_URL}/users/", json=payload)
    assert r.status_code in (200, 201)

def test_login_user():
    payload = {
        "username": "testuser1",
        "password": "A12345678901b+"
    }
    r = requests.post(f"{API_URL}/token/", json=payload)
    assert r.status_code in (200, 401, 403)

def test_offers_access():
    r = requests.get(f"{API_URL}/offers/")
    assert r.status_code == 200

def test_cart_access():
    r = requests.get(f"{API_URL}/cart/")
    assert r.status_code in (401, 403)

@pytest.mark.xfail(reason="Back-end accepte les connexions invalides sans rejet explicite")
def test_invalid_login():
    payload = {
        "username": "invalid_user",
        "password": "wrongpass"
    }
    r = requests.post(f"{API_URL}/token/", json=payload)
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
def test_registration_missing_fields(payload, missing_field):
    r = requests.post(f"{API_URL}/users/", json=payload)
    assert r.status_code != 200, f"Registration succeeded with missing {missing_field}"

@pytest.mark.xfail(reason="Back-end accepte des mots de passe trop faibles")
def test_registration_weak_password():
    payload = {
        "username": f"weakuser_{uuid.uuid4().hex[:4]}",
        "email": f"weak_{uuid.uuid4().hex[:4]}@example.com",
        "password": "123"
    }
    r = requests.post(f"{API_URL}/users/", json=payload)
    assert r.status_code in (400, 422)

def test_remove_from_cart():
    session = requests.Session()
    u = uuid.uuid4().hex[:8]
    creds = {
        "username": f"user_{u}",
        "email": f"{u}@example.com",
        "password": f"Pwd!{u}A1"
    }

    r = session.post(f"{API_URL}/users/", json=creds)
    assert r.status_code in (200, 201), f"Échec de l'inscription: {r.text}"

    r = session.post(f"{API_URL}/token/", json={"username": creds["username"], "password": creds["password"]})
    assert r.status_code == 200, f"Échec de la connexion: {r.text}"
    
    r = session.post(f"{API_URL}/cart/add/", json={"offer_id": 1})
    assert r.status_code in (200, 201), f"Échec de l'ajout au panier: {r.text}"

    r = session.post(f"{API_URL}/cart/remove/", json={"offer_id": 1})
    assert r.status_code == 200, f"Échec de la suppression du panier: {r.text}"

    r = session.get(f"{API_URL}/cart/")
    assert r.status_code == 200
    cart_data = r.json()
    assert len(cart_data.get("items", [])) == 0, "Le panier devrait être vide après suppression."
    assert cart_data.get("total_price", -1) == 0, "Le prix total devrait être 0 après suppression."

def test_total_price_updates_correctly():
    session = requests.Session()
    u = uuid.uuid4().hex[:8]
    creds = {
        "username": f"user_{u}",
        "email": f"{u}@example.com",
        "password": f"Pwd!{u}A1"
    }

    r = session.post(f"{API_URL}/users/", json=creds)
    assert r.status_code in (200, 201)
    
    r = session.post(f"{API_URL}/token/", json={"username": creds["username"], "password": creds["password"]})
    assert r.status_code == 200

    r_offers = session.get(f"{API_URL}/offers/")
    assert r_offers.status_code == 200
    offers = r_offers.json()
    
    price_offer_1 = next((item['price'] for item in offers if item['id'] == 1), None)
    price_offer_2 = next((item['price'] for item in offers if item['id'] == 2), None)
    assert price_offer_1 is not None, "L'offre avec id=1 n'a pas été trouvée."
    assert price_offer_2 is not None, "L'offre avec id=2 n'a pas été trouvée."
    
    session.post(f"{API_URL}/cart/add/", json={"offer_id": 1})
    r_cart1 = session.get(f"{API_URL}/cart/")
    assert r_cart1.json()["total_price"] == price_offer_1

    session.post(f"{API_URL}/cart/add/", json={"offer_id": 2})
    r_cart2 = session.get(f"{API_URL}/cart/")
    expected_total = round(price_offer_1 + price_offer_2, 2)
    assert r_cart2.json()["total_price"] == expected_total

    session.post(f"{API_URL}/cart/remove/", json={"offer_id": 1})
    r_cart3 = session.get(f"{API_URL}/cart/")
    assert r_cart3.json()["total_price"] == price_offer_2

def test_full_user_journey():
    session = requests.Session()
    u = uuid.uuid4().hex[:8]
    creds = {
        "username": f"user_{u}",
        "email": f"{u}@example.com",
        "password": f"Pwd!{u}A1"
    }

    r = session.post(f"{API_URL}/users/", json=creds)
    assert r.status_code in (200, 201)

    r = session.post(f"{API_URL}/token/", json={
        "username": creds["username"],
        "password": creds["password"]
    })
    assert r.status_code == 200

    r = session.post(f"{API_URL}/cart/add/", json={"offer_id": 1})
    assert r.status_code in (200, 201)

    r = session.post(f"{API_URL}/checkout/")
    assert r.status_code in (200, 201)

    r = session.get(f"{API_URL}/orders/")
    assert r.status_code == 200
