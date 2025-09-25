# Petora

**Petora** is an AI-powered healthcare platform that provides instant health analysis for both humans and animals. Users can upload images (such as skin conditions) or enter symptoms to receive rapid, automated diagnosis and recommendations. The platform is built with a modern React frontend and a FastAPI backend, supporting modular machine learning model management and inference.

---

## Features

- **Human & Animal Health Analysis:** Upload images for instant AI-based diagnosis for both human and pet health.
- **Text Symptom Analysis:** Enter symptoms as text for quick AI-powered recommendations.
- **Modular Model Management:** Easily add or update ML models via backend configuration or upload.
- **RESTful API:** FastAPI backend with endpoints for prediction, model info, health checks, and model uploads.
- **Modern UI:** Responsive React frontend with a clean, user-friendly interface.
- **Secure & Extensible:** CORS-enabled, scalable architecture, and easy to extend with new models or features.

---

## Project Structure

```
petora-frontend/
│
├── backend/
│   ├── app.py                # FastAPI backend server
│   ├── model_config.json     # (Optional) Model configuration file
│   └── models/               # Directory for ML model files
│
├── src/
│   ├── components/           # React components (LandingPage, SkinDiseasePredictor, etc.)
│   ├── services/
│   │   └── apiService.js     # API service for frontend-backend communication
│   ├── App.jsx               # Main React app entry
│   └── ...                   # Other frontend files
│
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** (v16+ recommended)
- **Python** (v3.8+ recommended)
- **pip** (for Python dependencies)

### 1. Backend Setup

1. **Install dependencies:**
   ```bash
   pip install fastapi uvicorn tensorflow pillow numpy opencv-python
   ```

2. **Add your ML models:**
   - Place your trained `.h5` model files in the appropriate subfolders under `backend/models/`.
   - Update or create `backend/model_config.json` if you want to customize model names, categories, or classes.

3. **Run the backend server:**
   ```bash
   cd backend
   uvicorn app:app --reload
   ```

### 2. Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the frontend:**
   ```bash
   npm run dev
   ```

3. **Access the app:**  
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Overview

- `GET /health` — Health check endpoint.
- `GET /models` — List available models and their configuration.
- `POST /predict` — Upload an image for prediction (`model_name` and `category` required).
- `POST /predict/text` — Submit text symptoms for analysis.
- `POST /models/upload` — Upload a new model file.
- `GET /models/{category}/{model_name}` — Get info about a specific model.

---

## Configuration

- **Model Configuration:**  
  The backend loads models based on `model_config.json`. If not present, a default config is used (see `app.py`).
- **Adding Models:**  
  - Place new models in `backend/models/{category}/{model_name}/`.
  - Update `model_config.json` with the new model details.

---

## Example Usage

- **Human Skin Disease Detection:**  
  Upload a skin image via the frontend or call `/predict` with `model_name=skin-disease-detection` and `category=human-health`.
- **Animal Health Diagnosis:**  
  Upload a pet image with `model_name=pet-diagnosis` and `category=animal-health`.

---

## Future Scope

- Add more disease models (dental, eye, rare conditions, etc.)
- Integrate voice and advanced text analysis.
- Launch mobile app versions.
- Support for multiple languages and regions.
- Integration with telemedicine and health record systems.

---

## License

This project is for educational and demonstration purposes. For production or clinical use, consult medical professionals and ensure compliance with relevant regulations.

---

**Petora** — Smart healthcare for every life you care about.
