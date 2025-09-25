"""
Petora Backend API Server
FastAPI-based backend for ML model inference and healthcare data management
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import tensorflow as tf
import numpy as np
import cv2
import json
import os
import io
from PIL import Image
import uvicorn
from typing import Dict, List, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Petora Healthcare API",
    description="AI-powered healthcare platform backend",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model storage
loaded_models = {}

class ModelManager:
    """Manages ML model loading and inference"""
    
    def __init__(self):
        self.models_dir = "models"
        self.config_path = "model_config.json"
        self.config = self.load_config()
    
    def load_config(self):
        """Load model configuration"""
        try:
            with open(self.config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning("Model config not found, using default configuration")
            return self.get_default_config()
    
    def get_default_config(self):
        """Default model configuration"""
        return {
            "models": {
                "human-health": {
                    "skin-disease-detection": {
                        "name": "Skin Disease Classifier",
                        "type": "image-classification",
                        "file_path": "models/human-health/skin-disease/model.h5",
                        "classes": ["acne", "eczema", "melanoma", "psoriasis", "rosacea", "healthy"]
                    }
                },
                "animal-health": {
                    "pet-diagnosis": {
                        "name": "Pet Health Diagnosis",
                        "type": "image-classification", 
                        "file_path": "models/animal-health/pet-diagnosis/model.h5",
                        "classes": ["healthy", "skin_condition", "eye_problem", "injury"]
                    }
                }
            }
        }
    
    def load_model(self, category: str, model_name: str):
        """Load a specific model"""
        model_key = f"{category}-{model_name}"
        
        if model_key in loaded_models:
            return loaded_models[model_key]
        
        try:
            model_info = self.config["models"][category][model_name]
            model_path = model_info["file_path"]
            
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found: {model_path}")
            
            # Load TensorFlow model
            model = tf.keras.models.load_model(model_path)
            loaded_models[model_key] = {
                "model": model,
                "info": model_info
            }
            
            logger.info(f"Successfully loaded model: {model_key}")
            return loaded_models[model_key]
            
        except Exception as e:
            logger.error(f"Failed to load model {model_key}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Model loading failed: {str(e)}")
    
    def preprocess_image(self, image_data: bytes, target_size: tuple = (224, 224)):
        """Preprocess image for model inference"""
        try:
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize image
            image = image.resize(target_size)
            
            # Convert to numpy array and normalize
            image_array = np.array(image) / 255.0
            
            # Add batch dimension
            image_array = np.expand_dims(image_array, axis=0)
            
            return image_array
            
        except Exception as e:
            logger.error(f"Image preprocessing failed: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Image processing failed: {str(e)}")
    
    def predict_image(self, category: str, model_name: str, image_data: bytes):
        """Make prediction on image data"""
        try:
            # Load model
            model_data = self.load_model(category, model_name)
            model = model_data["model"]
            model_info = model_data["info"]
            
            # Preprocess image
            processed_image = self.preprocess_image(image_data)
            
            # Make prediction
            predictions = model.predict(processed_image)
            
            # Get class probabilities
            if len(predictions.shape) > 1:
                probabilities = predictions[0]
            else:
                probabilities = predictions
            
            # Get predicted class
            class_index = np.argmax(probabilities)
            predicted_class = model_info["classes"][class_index]
            confidence = float(probabilities[class_index])
            
            # Prepare results
            results = {
                "predicted_class": predicted_class,
                "confidence": confidence,
                "all_predictions": [
                    {
                        "class": model_info["classes"][i],
                        "probability": float(probabilities[i])
                    }
                    for i in range(len(model_info["classes"]))
                ]
            }
            
            return results
            
        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

# Initialize model manager
model_manager = ModelManager()

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Petora Healthcare API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "loaded_models": list(loaded_models.keys())}

@app.get("/models")
async def list_models():
    """List available models"""
    return model_manager.config

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    model_name: str = "skin-disease-detection",
    category: str = "human-health"
):
    """Make prediction on uploaded image"""
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image data
        image_data = await file.read()
        
        # Make prediction
        results = model_manager.predict_image(category, model_name, image_data)
        
        return {
            "success": True,
            "model_used": f"{category}-{model_name}",
            "results": results
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/predict/text")
async def predict_text(
    text: str,
    model_name: str = "symptom-analyzer",
    category: str = "human-health"
):
    """Make prediction on text input"""
    try:
        # For now, return mock results for text analysis
        # In a real implementation, you would load a text classification model
        
        mock_results = {
            "predicted_category": "respiratory",
            "confidence": 0.85,
            "analysis": {
                "keywords": ["cough", "breathing", "chest"],
                "severity": "moderate",
                "recommendations": ["Consult a doctor", "Monitor symptoms"]
            }
        }
        
        return {
            "success": True,
            "model_used": f"{category}-{model_name}",
            "results": mock_results
        }
        
    except Exception as e:
        logger.error(f"Text prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail="Text prediction failed")

@app.post("/models/upload")
async def upload_model(
    file: UploadFile = File(...),
    model_name: str = None,
    category: str = None
):
    """Upload a new model file"""
    try:
        if not model_name or not category:
            raise HTTPException(status_code=400, detail="model_name and category are required")
        
        # Create directory if it doesn't exist
        model_dir = f"models/{category}/{model_name}"
        os.makedirs(model_dir, exist_ok=True)
        
        # Save model file
        file_path = f"{model_dir}/{file.filename}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        return {
            "success": True,
            "message": f"Model uploaded successfully",
            "file_path": file_path
        }
        
    except Exception as e:
        logger.error(f"Model upload error: {str(e)}")
        raise HTTPException(status_code=500, detail="Model upload failed")

@app.get("/models/{category}/{model_name}")
async def get_model_info(category: str, model_name: str):
    """Get information about a specific model"""
    try:
        if category not in model_manager.config["models"]:
            raise HTTPException(status_code=404, detail="Category not found")
        
        if model_name not in model_manager.config["models"][category]:
            raise HTTPException(status_code=404, detail="Model not found")
        
        model_info = model_manager.config["models"][category][model_name]
        
        # Check if model is loaded
        model_key = f"{category}-{model_name}"
        is_loaded = model_key in loaded_models
        
        return {
            "model_info": model_info,
            "is_loaded": is_loaded,
            "loaded_at": loaded_models.get(model_key, {}).get("loaded_at")
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get model info error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get model info")

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
