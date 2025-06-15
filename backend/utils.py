# backend/utils.py
from PIL import Image
import io
from torchvision import transforms

val_tfms = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406],
                         [0.229, 0.224, 0.225])
])

def transform_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    return val_tfms(image).unsqueeze(0)  
