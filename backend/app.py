from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from predict import get_prediction, farmerCropHealthAdvice
import logging

app = FastAPI(title="Plant Disease Classifier API")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4943",
        "http://uzt4z-lp777-77774-qaabq-cai.localhost:4943", "*"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "🌿 Plant Disease Classifier API"}

@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")
        if file.size > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB.")
        image_bytes = await file.read()
        result = await get_prediction(image_bytes)
        label = result["label"]  # Extract string label
        logger.info(f"Prediction for {file.filename}: {label}")
        return {"prediction": label}
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/api/advice")
async def advice(file: UploadFile = File(...)):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")
        if file.size > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB.")
        image_bytes = await file.read()
        result = await farmerCropHealthAdvice(image_bytes)
        logger.info(f"Advice for {file.filename}: {result}")
        return {"advice": result}
    except Exception as e:
        logger.error(f"Advice error: {str(e)}")
        return JSONResponse(content={"error": str(e)}, status_code=500)