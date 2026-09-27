import unittest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

class TestBeeProofAIService(unittest.TestCase):

    def test_health_endpoint(self):
        res = client.get("/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "UP")

    def test_predict_hive_health_normal(self):
        payload = {
            "hive_id": 1,
            "hive_code": "BP-SUN-H01",
            "temperature": 34.5,
            "humidity": 58.0,
            "weight": 34.0,
            "acoustic_frequency": 225.0
        }
        res = client.post("/predict/hive-health", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["health_status"], "HEALTHY")
        self.assertGreaterEqual(data["health_score"], 80.0)
        self.assertIn("Optimal", data["contributing_factors"][0])
        self.assertIn("AI DEMO / PREDICTION", data["disclaimer"])

    def test_predict_hive_health_thermal_stress(self):
        payload = {
            "hive_id": 1,
            "temperature": 40.5,
            "humidity": 58.0,
            "weight": 34.0
        }
        res = client.post("/predict/hive-health", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn(data["health_status"], ["WARNING", "CRITICAL"])
        self.assertLess(data["health_score"], 70.0)

    def test_invalid_temperature_rejected(self):
        payload = {
            "hive_id": 1,
            "temperature": 99.0,
            "humidity": 58.0,
            "weight": 34.0
        }
        res = client.post("/predict/hive-health", json=payload)
        self.assertEqual(res.status_code, 400)

    def test_productivity_sufficient_data(self):
        payload = {
            "hive_id": 1,
            "current_weight": 38.0,
            "historical_yield_kg": 26.5,
            "historical_points_count": 12,
            "season": "SPRING",
            "location": "Sundarbans"
        }
        res = client.post("/predict/productivity", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "SUCCESS")
        self.assertGreater(data["predicted_production_kg"], 5.0)
        self.assertGreater(len(data["contributing_factors"]), 0)

    def test_productivity_insufficient_data(self):
        payload = {
            "hive_id": 1,
            "current_weight": 14.0,
            "historical_points_count": 1,
            "historical_yield_kg": 0.0
        }
        res = client.post("/predict/productivity", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "INSUFFICIENT_DATA")
        self.assertIn("Insufficient historical data", data["message"])

    def test_disease_risk_elevated_mites(self):
        payload = {
            "hive_id": 1,
            "temperature": 34.5,
            "humidity": 58.0,
            "weight": 32.0,
            "observed_mite_count": 8
        }
        res = client.post("/predict/disease-risk", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["risk_category"], "ELEVATED_VARROA_RISK")
        self.assertIn("Varroa destructor", data["pathogen_or_pest_name"])
        self.assertIn("Disease Risk (Demo Inference)", data["label"])

    def test_anomaly_analysis_insufficient_history(self):
        payload = {
            "hive_id": 1,
            "history": [
                {"temperature": 34.0, "humidity": 55.0, "weight": 30.0}
            ]
        }
        res = client.post("/analyze/anomalies", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "INSUFFICIENT_HISTORY")

if __name__ == "__main__":
    unittest.main()
