import torch
import torch.nn.functional as F
from utils import transform_image
from model import load_model
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

model = load_model()
class_names = ["Tomato_Early_blight", "Tomato_Late_blight", "Tomato_healthy"]

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

async def get_prediction(image_bytes):
    tensor = transform_image(image_bytes)
    with torch.no_grad():
        outputs = model(tensor)
        probabilities = F.softmax(outputs, dim=1)
        confidence, predicted_idx = torch.max(probabilities, dim=1)

    predicted_label = class_names[predicted_idx.item()]
    confidence_score = confidence.item() * 100  

    return {
        "label": predicted_label,
        "confidence": round(confidence_score, 2)
    }

async def farmerCropHealthAdvice(image_bytes):
    prediction = await get_prediction(image_bytes)
    prompt = (
        f"Act as a highly experienced agricultural officer. "
        f"Briefly, Give advice to a farmer based on the predicted tomato disease: "
        f"{prediction['label']} with {prediction['confidence']}% confidence."
    )
    response = client.models.generate_content(
        model="gemini-2.5-flash", contents=prompt)   
    return {
        "prediction": prediction,
        "advice": response.text
    }
