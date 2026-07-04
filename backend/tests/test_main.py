def test_health_check(api):
    response = api.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_root_endpoint(api):
    response = api.get("/")
    assert response.status_code == 200

def test_openapi_schema(api):
    response = api.get("/openapi.json")
    assert response.status_code == 200