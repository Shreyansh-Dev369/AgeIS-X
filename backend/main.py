from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import pickle
from . import config

# -------------------------------
# FASTAPI INIT
# -------------------------------
app = FastAPI(title="AgeIS-X Backend")

# -------------------------------
# CORS (VERY IMPORTANT)
# -------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend (Next.js)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# LOAD MODEL & VECTORIZER
# -------------------------------
model = None
vectorizer = None

try:
    with open(config.MODEL_PATH, "rb") as f:
        model = pickle.load(f)

    with open(config.VECTORIZER_PATH, "rb") as f:
        vectorizer = pickle.load(f)

    print("✅ Model and vectorizer loaded successfully")

except Exception as e:
    print("❌ Error loading model:", e)
    # Do NOT crash server — allow health check to work


# -------------------------------
# REQUEST / RESPONSE SCHEMA
# -------------------------------
class PredictRequest(BaseModel):
    url: str = Field(..., example="http://example.com")


class PredictResponse(BaseModel):
    url: str
    label: int
    probability: float


# -------------------------------
# HEALTH CHECK
# -------------------------------
@app.get("/health")
def health():
    return {"status": "ok"}


# -------------------------------
# PREDICT API
# -------------------------------
@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    if model is None or vectorizer is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    url = request.url.strip().lower()

    # Basic validation
    if not url or len(url) < 5:
        raise HTTPException(status_code=400, detail="Invalid URL")

    try:
        # ML Prediction
        X_vect = vectorizer.transform([url])
        prob = float(model.predict_proba(X_vect)[0][1])
        label = int(prob >= 0.5)

        return {
            "url": url,
            "label": label,
            "probability": prob
        }

    except Exception as e:
        print("❌ Prediction error:", e)
        raise HTTPException(status_code=500, detail="Prediction failed")