import json
import tempfile
import threading
import unittest
from http.server import ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from unittest.mock import patch

from engine import server


class StoreApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.db_path = Path(cls.tmp.name) / "test.sqlite3"
        cls.db_patch = patch.object(server, "DB_PATH", cls.db_path)
        cls.token_patch = patch.object(server, "ADMIN_TOKEN", "test-secret")
        cls.db_patch.start()
        cls.token_patch.start()
        cls.httpd = ThreadingHTTPServer(("127.0.0.1", 0), server.Handler)
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()
        cls.base = f"http://127.0.0.1:{cls.httpd.server_port}"

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()
        cls.thread.join(timeout=2)
        cls.token_patch.stop()
        cls.db_patch.stop()
        cls.tmp.cleanup()

    def setUp(self):
        db = server.connect()
        try:
            db.execute("DELETE FROM events")
            db.execute("DELETE FROM products")
            db.commit()
        finally:
            db.close()

    def get_json(self, path, token=None):
        headers = {}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        with urlopen(Request(self.base + path, headers=headers)) as response:
            return response.status, json.loads(response.read())

    def post_json(self, path, body, token=None):
        headers = {"Content-Type": "application/json"}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        request = Request(self.base + path, data=json.dumps(body).encode(), headers=headers, method="POST")
        with urlopen(request) as response:
            return response.status, json.loads(response.read())

    def test_health_and_empty_catalog(self):
        status, health = self.get_json("/api/health")
        self.assertEqual(status, 200)
        self.assertTrue(health["ok"])
        _, catalog = self.get_json("/api/products")
        self.assertEqual(catalog["products"], [])

    def test_admin_requires_token(self):
        with self.assertRaises(HTTPError) as error:
            self.get_json("/api/admin/summary")
        self.assertEqual(error.exception.code, 401)

    def test_add_offer_and_record_click_without_exposing_destination(self):
        product = {
            "name": "Verified sample tool",
            "vendor": "Example Vendor",
            "category": "SEO & growth",
            "description": "A test record for the automated test suite.",
            "affiliate_url": "https://affiliate.example/tracked",
            "vendor_url": "https://vendor.example/product",
            "source_url": "https://vendor.example/affiliate-terms",
            "tags": ["test"],
            "verified_at": "2026-10-24"
        }
        status, created = self.post_json("/api/admin/products", product, "test-secret")
        self.assertEqual(status, 201)
        _, catalog = self.get_json("/api/products")
        item = next(p for p in catalog["products"] if p["id"] == created["id"])
        self.assertTrue(item["has_affiliate_url"])
        self.assertNotIn("affiliate_url", item)

        # Use a non-following opener so the 302 is tested without contacting a vendor.
        from urllib.request import HTTPRedirectHandler, build_opener
        class NoRedirect(HTTPRedirectHandler):
            def redirect_request(self, req, fp, code, msg, headers, newurl):
                return None
        opener = build_opener(NoRedirect())
        request = Request(self.base + "/api/click/" + created["id"])
        with self.assertRaises(HTTPError) as error:
            opener.open(request)
        self.assertEqual(error.exception.code, 302)
        self.assertEqual(error.exception.headers.get("Location"), product["affiliate_url"])
        _, summary = self.get_json("/api/admin/summary", "test-secret")
        self.assertEqual(summary["tracked_outbound_clicks"], 1)


if __name__ == "__main__":
    unittest.main()
