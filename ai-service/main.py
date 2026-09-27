import uvicorn
import base64
from typing import Optional
from fastapi import FastAPI, HTTPException, status, File, UploadFile, Query, Form
from fastapi.middleware.cors import CORSMiddleware
from models import (
    HiveHealthRequest, HiveHealthResponse,
    ProductivityRequest, ProductivityResponse,
    DiseaseRiskRequest, DiseaseRiskResponse,
    AnomalyAnalysisRequest, AnomalyAnalysisResponse,
    VisionDiagnosisResponse, Base64VisionRequest
)
from ml_engine import ml_engine

app = FastAPI(
    title="BeeProof AI Analytics & Vision Microservice",
    version="1.1.0",
    description="Statistical & Machine Learning Engine with Integrated Ultralytics YOLOv11 Computer Vision for Comb Pathology Detection"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "BeeProof-AI-Service",
        "version": "1.1.0",
        "engine": "Scikit-Learn / Ultralytics YOLOv11 / FastAPI",
        "cv_model_loaded": ml_engine.yolo_model is not None
    }

@app.post("/predict/hive-health", response_model=HiveHealthResponse)
def predict_health(req: HiveHealthRequest):
    if req.temperature < -40.0 or req.temperature > 80.0:
        raise HTTPException(status_code=400, detail="Temperature reading outside valid physical sensor limits.")
    if req.humidity < 0.0 or req.humidity > 100.0:
        raise HTTPException(status_code=400, detail="Humidity must be between 0% and 100%.")
    return ml_engine.predict_hive_health(req)

@app.post("/predict/productivity", response_model=ProductivityResponse)
def predict_yield(req: ProductivityRequest):
    if req.current_weight < 0.0 or req.current_weight > 300.0:
        raise HTTPException(status_code=400, detail="Hive weight outside valid physical limits.")
    return ml_engine.predict_productivity(req)

@app.post("/predict/disease-risk", response_model=DiseaseRiskResponse)
def predict_disease(req: DiseaseRiskRequest):
    if req.temperature < -40.0 or req.temperature > 80.0:
        raise HTTPException(status_code=400, detail="Temperature reading outside valid physical sensor limits.")
    return ml_engine.predict_disease_risk(req)

@app.post("/analyze/anomalies", response_model=AnomalyAnalysisResponse)
def analyze_anomalies(req: AnomalyAnalysisRequest):
    return ml_engine.analyze_anomalies(req)

# --- Computer Vision Endpoints ---
@app.post("/predict/vision-health", response_model=VisionDiagnosisResponse)
async def predict_vision_health(
    file: Optional[UploadFile] = File(None, description="Comb / brood photo file"),
    hive_code: Optional[str] = Form("SUN-HIVE-001"),
    conf: float = Query(0.25, ge=0.01, le=1.0),
    iou: float = Query(0.45, ge=0.01, le=1.0),
    imgsz: int = Query(416, ge=128, le=1280)
):
    if file is None:
        raise HTTPException(status_code=400, detail="An image file is required for vision diagnosis.")

    try:
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        filename = file.filename or "comb_photo.jpg"
        return ml_engine.diagnose_comb_image(
            image_bytes=contents,
            filename=filename,
            hive_code=hive_code,
            conf_threshold=conf,
            iou_threshold=iou,
            imgsz=imgsz
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vision model inference error: {str(e)}")

@app.post("/predict/vision-health-base64", response_model=VisionDiagnosisResponse)
def predict_vision_health_base64(req: Base64VisionRequest):
    try:
        raw_b64 = req.image_base64
        if "," in raw_b64:
            raw_b64 = raw_b64.split(",", 1)[1]
        image_bytes = base64.b64decode(raw_b64)
        return ml_engine.diagnose_comb_image(
            image_bytes=image_bytes,
            filename=req.filename or "comb_sample.jpg",
            hive_code=req.hive_code or "SUN-HIVE-001",
            conf_threshold=req.conf or 0.25
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid base64 image data: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)
