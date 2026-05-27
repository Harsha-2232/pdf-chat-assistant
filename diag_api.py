from fastapi.testclient import TestClient
from main import app
import traceback

client = TestClient(app)
paths = [('GET', '/'), ('GET', '/ask?query=test'), ('POST', '/upload-pdf')]
for method, path in paths:
    try:
        if method == 'POST':
            resp = client.post(path)
        else:
            resp = client.get(path)
        print(method, path, resp.status_code, resp.text)
    except Exception:
        traceback.print_exc()
