import torch
from torchvision import models

MODEL_PATH = "../AI/nucleusV5_model.pth"

def load_model():
    with torch.serialization.safe_globals([models.resnet34]):  # <--- Allow only trusted classes
        model = torch.load(MODEL_PATH, map_location=torch.device("cpu"), weights_only=False)
    model.eval()
    return model
