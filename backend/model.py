import torch
from torchvision import models

MODEL_PATH = "./nucleusV5_model.pth"

def load_model():
    with torch.serialization.safe_globals([models.resnet34]):  
        model = torch.load(MODEL_PATH, map_location=torch.device("cpu"), weights_only=False)
    model.eval()
    return model
