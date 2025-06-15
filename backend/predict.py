import torch
import torch.nn.functional as F
from utils import transform_image
from model import load_model
import google.generativeai as genai
import os

# Load model once at module level
model = load_model()
class_names = [
    "Tomato_Early_blight", "Tomato_Late_blight",
    "Tomato_healthy"
]

# Configure Gemini API (assumes API key is set in environment)
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_prediction(image_bytes):
    tensor = transform_image(image_bytes)
    with torch.no_grad():
        outputs = model(tensor)
        probabilities = F.softmax(outputs, dim=1)
        confidence, predicted_idx = torch.max(probabilities, dim=1)

    predicted_label = class_names[predicted_idx.item()]
    confidence_score = confidence.item() * 100  # convert to percentage

    return {
        "label": predicted_label,
        "confidence": round(confidence_score, 2)
    }

def get_disease_advice(disease_label, language="en"):
    """
    Integrates with Gemini API to provide treatment and prevention advice for a given plant disease.
    
    Args:
        disease_label (str): The predicted disease label (e.g., "Tomato_Early_blight").
        language (str): Language for advice ("en" for English, "sw" for Swahili).
    
    Returns:
        dict: Contains advice in the requested language with treatment and prevention tips.
    """
    if disease_label == "Tomato_healthy":
        return {
            "language": language,
            "treatment": "Your tomato plant appears healthy. No immediate treatment is needed.",
            "prevention": "Continue regular monitoring, ensure proper watering, and maintain soil health to keep plants strong."
        } if language == "en" else {
            "language": language,
            "treatment": "Mmea wako wa nyanya unaonekana kuwa na afya. Hakuna matibabu ya haraka yanayohitajika.",
            "prevention": "Endelea kufuatilia mara kwa mara, hakikisha umwagiliaji sahihi, na udumishe afya ya udongo ili mimea iwe na nguvu."
        }

    # Construct prompt for Gemini
    prompt = f"""
    You are an agricultural expert providing advice to farmers in Kenya. For a tomato plant diagnosed with {disease_label}, provide:
    1. A concise treatment plan (2-3 sentences) for addressing the disease, using locally available resources.
    2. A concise prevention strategy (2-3 sentences) to protect tomato plants from this disease in the future, considering local farming practices.
    The advice should be practical, tailored to small-scale farmers, and written in {'English' if language == 'en' else 'Swahili'}.
    Format the response as: 
    Treatment: <treatment advice>
    Prevention: <prevention advice>
    """

    try:
        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-1.5-pro')
        response = model.generate_content(prompt)
        
        # Parse response (assuming Gemini returns text in the requested format)
        advice_text = response.text.strip()
        treatment, prevention = advice_text.split("Prevention:")
        treatment = treatment.replace("Treatment:", "").strip()
        prevention = prevention.strip()

        return {
            "language": language,
            "treatment": treatment,
            "prevention": prevention
        }
    except Exception as e:
        fallback_advice = {
            "en": {
                "treatment": "Consult a local agronomist for specific treatment options. Remove affected leaves and apply a copper-based fungicide if available.",
                "prevention": "Practice crop rotation, ensure good air circulation, and avoid overhead watering to reduce disease risk."
            },
            "sw": {
                "treatment": "Wasiliana na mtaalamu wa kilimo wa ndani kwa chaguzi za matibabu. Ondoa majani yaliyoathiriwa na utumie dawa ya fungicide ya msingi wa shaba ikiwa inapatikana.",
                "prevention": "Fanya mzunguko wa mazao, hakikisha mzunguko mzuri wa hewa, na epuka kumwagilia juu ili kupunguza hatari ya ugonjwa."
            }
        }
        return {
            "language": language,
            "treatment": fallback_advice[language]["treatment"],
            "prevention": fallback_advice[language]["prevention"]
        }

def get_prediction_and_advice(image_bytes, language="en"):
    """
    Combines prediction and advice for a complete response.
    
    Args:
        image_bytes: Image data for prediction.
        language (str): Language for advice ("en" or "sw").
    
    Returns:
        dict: Prediction and advice combined.
    """
    prediction = get_prediction(image_bytes)
    advice = get_disease_advice(prediction["label"], language)
    return {
        "prediction": prediction,
        "advice": advice
    }