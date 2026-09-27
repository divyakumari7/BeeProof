from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class TelemetryPoint(BaseModel):
    timestamp: Optional[str] = None
    temperature: float = Field(..., description="Temperature in Celsius")
    humidity: float = Field(..., description="Relative humidity percentage")
    weight: float = Field(..., description="Hive weight in kg")
    acoustic_frequency: Optional[float] = Field(220.0, description="Dominant acoustic frequency in Hz")

class HiveHealthRequest(BaseModel):
    hive_id: int
    hive_code: Optional[str] = None
    temperature: float
    humidity: float
    weight: float
    acoustic_frequency: Optional[float] = 220.0
    history: Optional[List[TelemetryPoint]] = []
    active_anomalies_count: Optional[int] = 0

class HiveHealthResponse(BaseModel):
    hive_id: int
    health_score: float
    health_status: str  # HEALTHY, WARNING, CRITICAL
    risk_level: str  # LOW, MEDIUM, HIGH
    swarming_risk_probability: float
    queen_loss_probability: float
    contributing_factors: List[str]
    recommendation: str
    model_version: str = "BeeProof-HealthAI-v1.4"
    disclaimer: str = "AI DEMO / PREDICTION — Statistical modeling demo, not clinical veterinary certainty."

class ProductivityRequest(BaseModel):
    hive_id: int
    hive_code: Optional[str] = None
    current_weight: float
    historical_yield_kg: Optional[float] = None
    historical_points_count: Optional[int] = 0
    temperature: Optional[float] = 34.5
    humidity: Optional[float] = 58.0
    health_score: Optional[float] = 88.0
    season: Optional[str] = "SPRING"
    location: Optional[str] = "Sundarbans"

class ProductivityResponse(BaseModel):
    hive_id: int
    status: str  # SUCCESS, INSUFFICIENT_DATA
    predicted_production_kg: Optional[float] = None
    expected_range_min_kg: Optional[float] = None
    expected_range_max_kg: Optional[float] = None
    confidence_score: Optional[float] = None
    confidence_indicator: str  # HIGH, MEDIUM, LOW, INSUFFICIENT
    contributing_factors: List[str]
    message: Optional[str] = None
    disclaimer: str = "AI DEMO / PREDICTION — Honey yield forecast based on environmental & hive mass trends."

class DiseaseRiskRequest(BaseModel):
    hive_id: int
    hive_code: Optional[str] = None
    temperature: float
    humidity: float
    weight: float
    acoustic_frequency: Optional[float] = 220.0
    brood_pattern_uniformity: Optional[float] = 0.85
    observed_mite_count: Optional[int] = 0

class DiseaseRiskResponse(BaseModel):
    hive_id: int
    risk_category: str  # LOW_RISK, ELEVATED_VARROA_RISK, ELEVATED_NOSEMA_RISK, SUSPECTED_CHALK_BROOD
    risk_severity: str  # LOW, MODERATE, HIGH
    confidence: float
    pathogen_or_pest_name: str
    detection_probability: float
    contributing_factors: List[str]
    recommended_action: str
    label: str = "Disease Risk (Demo Inference)"
    disclaimer: str = "AI DEMO / PREDICTION — Requires physical NABL/veterinary inspection to confirm pathology."

class AnomalyAnalysisRequest(BaseModel):
    hive_id: int
    history: List[TelemetryPoint]

class AnomalyAnalysisResponse(BaseModel):
    hive_id: int
    status: str
    anomalies_detected: int
    detected_patterns: List[Dict[str, Any]]
    contributing_factors: List[str]
    message: Optional[str] = None

# ==========================================
# Computer Vision (BEEPROOF_cv2 YOLOv11) Schemas
# ==========================================
class BoundingBox(BaseModel):
    x1: int
    y1: int
    x2: int
    y2: int
    normalized_x1: Optional[float] = None
    normalized_y1: Optional[float] = None
    normalized_x2: Optional[float] = None
    normalized_y2: Optional[float] = None

class Detection(BaseModel):
    class_name: str
    display_name: str
    indicator: str
    category: str
    is_pathology: bool
    confidence: float
    risk: str
    urgency: str
    bbox: BoundingBox
    recommendation: str

class ClassSummary(BaseModel):
    class_name: str
    display_name: str
    category: str
    is_pathology: bool
    detected: bool
    count: int
    max_confidence: float
    risk: str
    recommendation: str

class UrgentAction(BaseModel):
    condition: str
    risk: str
    confidence: float
    action: str

class ImageDimensions(BaseModel):
    width: int
    height: int

class VisionDiagnosisResponse(BaseModel):
    hive_code: Optional[str] = None
    image_name: str
    image_dimensions: ImageDimensions
    total_detections: int
    overall_hive_health_risk: str  # LOW, MEDIUM, HIGH, CRITICAL
    model_name: str = "Ultralytics YOLOv11 Nano"
    confidence_score: float = 0.0
    primary_condition: str = "Healthy Brood & Worker Bees"
    primary_symptoms: str = "No critical pests or pathological indicators detected."
    recommended_action: str = "Continue regular monitoring and hive management."
    urgent_actions: List[UrgentAction] = []
    detections: List[Detection] = []
    summary: Dict[str, ClassSummary] = {}
    annotated_image_base64: Optional[str] = None
    is_real_cv_model: bool = True
    disclaimer: str = (
        "AI-assisted visual screening indicator only. Detections do NOT constitute "
        "a confirmed veterinary diagnosis. Certified laboratory test & physical examination recommended."
    )

class Base64VisionRequest(BaseModel):
    image_base64: str
    filename: Optional[str] = "comb_sample.jpg"
    hive_code: Optional[str] = "SUN-HIVE-001"
    conf: Optional[float] = 0.25
