import os
import logging
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from predict import get_prediction, farmerCropHealthAdvice

app = FastAPI(title="🌿 Plant Disease Classifier API")

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4943",
        "http://u6s2n-gx777-77774-qaaba-cai.localhost:8000/",
        "http://uzt4z-lp777-77774-qaabq-cai.localhost:4943",
        "https://uco7r-jaaaa-aaaam-qdxda-cai.icp0.io"
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "🌿 Plant Disease Classifier API is live."}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")
        
        image_bytes = await file.read()
        if len(image_bytes) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB.")

        result = await get_prediction(image_bytes)
        label = result.get("label", "Unknown")
        logger.info(f"Prediction for {file.filename}: {label}")
        return {"prediction": label}

    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/api/advice")
async def advice(file: UploadFile = File(...)):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")

        image_bytes = await file.read()
        if len(image_bytes) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB.")

        advice = await farmerCropHealthAdvice(image_bytes)
        logger.info(f"Advice for {file.filename}: {advice}")
        return {"advice": advice}

    except Exception as e:
        logger.error(f"Advice error: {str(e)}")
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("app:app", host="0.0.0.0", port=port)
