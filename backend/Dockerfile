# Use a minimal Python image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Install system dependencies (e.g., image handling, model deps)
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app files
COPY app.py predict.py model.py utils.py nucleusV5_model.pth ./

COPY .env ./

# Cloud Run requires listening on PORT env
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Run the app using uvicorn with dynamic port from environment
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port $PORT"] 

