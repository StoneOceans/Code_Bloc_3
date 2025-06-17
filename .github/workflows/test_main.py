# conftest.py
import pytest
import requests
import uuid

BASE_URL = "https://sitedesjo.dev-data.eu"

@pytest.fixture
def session():
    return requests.Session()

@pytest.fixture
def random_credentials():
    u = uuid.uuid4().hex[:8]
    return {
        "username": f"user_{u}",
        "email": f"{u}@example.com",
        "password": f"Pwd!{u}A1"
    }

@pytest.fixture
def new_user(session, random_credentials):
    creds = random_credentials
    r = session.post(f"{BASE_URL}/register", json=creds)
    assert r.status_code in (200, 201)

    r = session.post(f"{BASE_URL}/login", json={"username": creds["username"], "password": creds["password"]})
    if 'application/json' not in r.headers.get('Content-Type', ''):
        pytest.fail(f"Expected JSON response but got: {r.text}")

    token = r.json().get("token")
    assert token, "No token returned"
    session.headers.update({"Authorization": f"Bearer {token}"})
    return creds

# test_main.py
import pytest
import requests

BASE_URL = "https://sitedesjo.dev-data.eu"

def test_site_is_up(session):
    r = session.get(BASE_URL)
    assert r.status_code == 200


@pytest.mark.parametrize("endpoint", ["/offers", "/cart"])
def test_public_pages(session, endpoint):
    r = session.get(f"{BASE_URL}{endpoint}")
    assert r.status_code == 200


def test_invalid_login(session):
    r = session.post(f"{BASE_URL}/login", json={
        "username": "invaliduser",
        "password": "wrongpassword"
    })
    assert r.status_code in (401, 403)


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
def test_registration_missing_fields(session, payload, missing_field):
    r = session.post(f"{BASE_URL}/register", json=payload)
    assert r.status_code != 200, f"Registration succeeded with missing {missing_field}"


def test_registration_weak_password(session):
    weak_creds = {
        "username": "weakuser",
        "email": "weak@example.com",
        "password": "123"
    }
    r = session.post(f"{BASE_URL}/register", json=weak_creds)
    assert r.status_code in (400, 422)


def test_full_user_journey(new_user, session):
    # Ajout au panier
    r = session.post(f"{BASE_URL}/cart/add", json={"offer_id": 1})
    assert r.status_code == 200

    # Checkout (si dispo)
    r = session.post(f"{BASE_URL}/checkout")
    assert r.status_code in (200, 201)

    # Historique des commandes
    r = session.get(f"{BASE_URL}/orders")
    assert r.status_code == 200
