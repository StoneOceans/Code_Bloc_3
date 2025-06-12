import pytest, requests, uuid

BASE_URL = "https://sitedesjo.dev-data.eu"

@pytest.fixture(scope="session")
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
    # register
    r = session.post(f"{BASE_URL}/register", json=creds)
    assert r.status_code in (200, 201)
    # login
    r = session.post(f"{BASE_URL}/login",
                     json={"username": creds["username"], "password": creds["password"]})
    assert r.status_code == 200
    token = r.json().get("token")
    assert token, "No token returned"
    session.headers.update({"Authorization": f"Bearer {token}"})
    return creds

def test_site_is_up(session):
    assert session.get(BASE_URL).status_code == 200


@pytest.mark.parametrize("endpoint", ["/offers", "/cart"])
def test_public_pages(session, endpoint):
    r = session.get(f"{BASE_URL}{endpoint}")
    assert r.status_code == 200

def test_cart_requires_auth():
    # fresh session without auth
    r = requests.get(f"{BASE_URL}/cart")
    assert r.status_code == 401

def test_invalid_login(session, faker):
    payload = {"username": faker.user_name(), "password": "WrongPass1!"}
    r = session.post(f"{BASE_URL}/login", json=payload)
    assert r.status_code == 401

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
    assert r.status_code == 400
    errors = r.json().get("errors", {})
    assert missing_field in errors

def test_registration_weak_password(session, faker):
    payload = {
        "username": faker.user_name(),
        "email": faker.email(),
        "password": "123"
    }
    r = session.post(f"{BASE_URL}/register", json=payload)
    assert r.status_code == 400

def test_full_user_journey(session, new_user):
    # new_user fixture has already authenticated
    r = session.get(f"{BASE_URL}/cart")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, dict) and data.get("items") == []
