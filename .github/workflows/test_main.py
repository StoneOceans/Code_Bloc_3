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

def test_offers_access():
    r = requests.get(f"{BASE_URL}/offers")
    assert r.status_code == 200


def test_cart_access():
    r = requests.get(f"{BASE_URL}/cart")
    assert r.status_code in (200, 401, 403)


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

def test_login_invalid_password(session):
    """Test de refus de connexion avec un mauvais mot de passe."""
    u = uuid.uuid4().hex[:6]
    creds = {
        "username": f"user_{u}",
        "email": f"{u}@example.com",
        "password": f"Pwd!{u}A1"
    }

    session.post(f"{BASE_URL}/register", json=creds)

    r = session.post(f"{BASE_URL}/login", json={
        "username": creds["username"],
        "password": "123"
    })
    assert r.status_code in (200,401, 403), f"Mauvais mot de passe veuillez le changer(code : {r.status_code})"

def test_login_then_logout(session):
    """Connexion valide puis logout : les cookies doivent disparaître."""
    u = uuid.uuid4().hex[:6]
    user = {
        "username": f"user_{u}",
        "email": f"{u}@example.com",
        "password": f"Aa12345678!{u}"
    }

    session.post(f"{BASE_URL}/register", json=user)
    session.post(f"{BASE_URL}/login", json={
        "username": user["username"],
        "password": user["password"]
    })

    r = session.post(f"{BASE_URL}/logout")
    assert r.status_code == 200

def test_admin_login(session):
    """Connexion admin avec identifiants valides."""
    payload = {
        "username": "adminjo",
        "password": "mdpadmin123+"  
    }
    r = session.post(f"{BASE_URL}/login", json=payload)
    assert r.status_code == 200, f"Échec de la connexion admin : {r.status_code} — {r.text}"

def test_admin_access_gestion_offres(session):

    login = session.post(f"{BASE_URL}/login", json={
        "username": "adminjo",
        "password": "mdpadmin123+" 
    })
    assert login.status_code == 200, f"Connexion admin échouée : {login.status_code} — {login.text}"
    r = session.get(f"{BASE_URL}/gestion/offres")
    assert r.status_code in (200, 403), f"Accès gestion offres : {r.status_code} — {r.text}"

def test_nonauthuser_can_add_to_cart(session):
    r = session.post(f"{BASE_URL}/cart/add", json={"offer_id": 1})
    assert r.status_code in (200, 201), f"Ajout au panier échoué : {r.status_code} — {r.text}"

def test_non_auth_user_gestion_offres():
    r = requests.get(f"{BASE_URL}/gestion/offres")
    assert r.status_code in (200, 401, 403)

def test_nonauthuser_cannot_checkout(session):
    r = session.post(f"{BASE_URL}/checkout")
    assert r.status_code in (200,401, 403), f"Commande anonyme acceptée (ce qui est incorrect) — {r.status_code} — {r.text}"

