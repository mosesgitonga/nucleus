from fastapi import FastAPI, File, UploadFile
from predict import get_prediction

app = FastAPI()

@app.get("/")
def root():
    return {"message": "🌿 Plant Disease Classifier API"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    label = get_prediction(image_bytes)
    return {"prediction": label}