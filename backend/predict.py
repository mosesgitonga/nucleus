import torch
import torch.nn.functional as F
from utils import transform_image
from model import load_model
import google.generativeai as genai
import os

model = load_model()
class_names = [
    "Tomato_Early_blight", "Tomato_Late_blight",
    "Tomato_healthy"
]

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_prediction(image_bytes):
    tensor = transform_image(image_bytes)
    with torch.no_grad():
        outputs = model(tensor)
        probabilities = F.softmax(outputs, dim=1)
        confidence, predicted_idx = torch.max(probabilities, dim=1)

    predicted_label = class_names[predicted_idx.item()]
    confidence_score = confidence.item() * 100  
    confidence_score = confidence.item() * 100  

    return {
        "label": predicted_label,
        "confidence": round(confidence_score, 2)
    }

def farmer_advice():
    pass 