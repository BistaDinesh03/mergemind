def test_health_check(api):
    response = api.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data

def test_root_endpoint(api):
    response = api.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["app"] == "MergeMind"

def test_docs_available(api):
    response = api.get("/docs")
    assert response.status_code == 200

def test_openapi_schema(api):
    response = api.get("/openapi.json")
    assert response.status_code == 200
    schema = response.json()
    assert "paths" in schema
    assert "/health" in schema["paths"]
    assert "/api/github/repositories" in schema["paths"]