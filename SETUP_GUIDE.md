# Petora Model Integration Setup Guide

This guide will help you integrate your trained machine learning models with the Petora healthcare platform.

## 📁 Project Structure

```
petora-frontend/
├── src/
│   ├── models/                    # Model files and configuration
│   │   ├── human-health/          # Human health models
│   │   ├── animal-health/         # Animal health models
│   │   └── config/               # Model configuration
│   ├── services/                 # API services
│   ├── components/               # React components
│   └── utils/                    # Utility functions
├── backend/                      # FastAPI backend
└── models/                       # Backend model storage
```

## 🚀 Quick Start

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

### 2. Add Your Model Files

Place your trained models in the appropriate directories:

**For TensorFlow.js models (recommended for frontend):**
```
src/models/
├── human-health/
│   ├── skin-disease/
│   │   ├── model.json
│   │   └── weights.bin
│   └── symptom-analysis/
│       ├── model.json
│       └── weights.bin
└── animal-health/
    ├── pet-diagnosis/
    │   ├── model.json
    │   └── weights.bin
    └── breed-detection/
        ├── model.json
        └── weights.bin
```

**For TensorFlow/PyTorch models (backend):**
```
backend/models/
├── human-health/
│   ├── skin-disease/
│   │   └── model.h5
│   └── symptom-analysis/
│       └── model.h5
└── animal-health/
    ├── pet-diagnosis/
    │   └── model.h5
    └── breed-detection/
        └── model.h5
```

### 3. Configure Models

Update the model configuration files:

**Frontend:** `src/models/config/model-config.json`
**Backend:** `backend/model_config.json`

Example configuration:
```json
{
  "models": {
    "human-health": {
      "skin-disease-detection": {
        "name": "Your Skin Disease Model",
        "type": "image-classification",
        "framework": "tensorflow-js",
        "file_path": "human-health/skin-disease/your-model.json",
        "classes": ["acne", "eczema", "melanoma", "healthy"]
      }
    }
  }
}
```

### 4. Start the Application

**Backend:**
```bash
cd backend
python app.py
```

**Frontend:**
```bash
npm run dev
```

## 🔧 Model Integration Options

### Option 1: Frontend-Only (TensorFlow.js)

**Pros:**
- No backend required
- Real-time predictions
- Privacy-friendly (no data leaves browser)

**Cons:**
- Limited model size
- Browser performance constraints

**Setup:**
1. Convert your model to TensorFlow.js format
2. Place in `src/models/` directory
3. Update `model-config.json`
4. Use `modelLoader.js` for inference

### Option 2: Backend API (Recommended)

**Pros:**
- Support for larger models
- Better performance
- More framework options

**Cons:**
- Requires backend server
- Data transmitted to server

**Setup:**
1. Place model files in `backend/models/`
2. Update `backend/model_config.json`
3. Use `apiService.js` for predictions

### Option 3: Hybrid Approach

Use frontend for simple models and backend for complex ones.

## 📝 Model Conversion

### Converting to TensorFlow.js

**Python to TensorFlow.js:**
```python
import tensorflow as tf
import tensorflowjs as tfjs

# Load your model
model = tf.keras.models.load_model('your_model.h5')

# Convert to TensorFlow.js
tfjs.converters.save_keras_model(model, 'tfjs_model')
```

### Converting to ONNX (Alternative)

```python
import onnx
from onnx_tf.backend import prepare

# Convert TensorFlow to ONNX
onnx_model = prepare(model).export_graph()
```

## 🎯 Adding New Models

### 1. Create Model Directory
```bash
mkdir -p src/models/human-health/your-new-model
```

### 2. Add Model Files
Place your model files in the directory.

### 3. Update Configuration
Add model configuration to `model-config.json`:

```json
{
  "your-new-model": {
    "name": "Your Model Name",
    "type": "image-classification",
    "framework": "tensorflow-js",
    "file_path": "human-health/your-new-model/model.json",
    "classes": ["class1", "class2", "class3"]
  }
}
```

### 4. Create Component (Optional)
Create a React component to use your model:

```jsx
import React, { useState } from 'react';
import modelLoader from '../utils/modelLoader';

const YourModelComponent = () => {
  const [result, setResult] = useState(null);

  const handlePredict = async (input) => {
    try {
      const prediction = await modelLoader.predict(
        'your-new-model',
        'human-health',
        input
      );
      setResult(prediction);
    } catch (error) {
      console.error('Prediction failed:', error);
    }
  };

  return (
    <div>
      {/* Your component UI */}
    </div>
  );
};
```

## 🔌 API Integration

### Making Predictions

**Frontend TensorFlow.js:**
```javascript
import modelLoader from '../utils/modelLoader';

const prediction = await modelLoader.predict(
  'skin-disease-detection',
  'human-health',
  imageElement
);
```

**Backend API:**
```javascript
import apiService from '../services/apiService';

const prediction = await apiService.predictImage(
  file,
  'skin-disease-detection',
  'human-health'
);
```

### Batch Predictions

```javascript
const results = await apiService.batchPredict(
  files,
  'model-name',
  'category'
);
```

## 🛠️ Customization

### Adding New Model Types

1. Update model configuration schema
2. Add preprocessing functions in `modelLoader.js`
3. Create appropriate UI components

### Custom Preprocessing

```javascript
// In modelLoader.js
preprocessCustom(input) {
  // Your custom preprocessing logic
  return processedInput;
}
```

### Custom Postprocessing

```javascript
// In your component
const processResults = (rawResults) => {
  // Your custom postprocessing logic
  return formattedResults;
};
```

## 🧪 Testing

### Test Model Loading
```javascript
import modelLoader from '../utils/modelLoader';

const testModel = async () => {
  try {
    await modelLoader.initialize();
    const models = modelLoader.getAvailableModels();
    console.log('Available models:', models);
  } catch (error) {
    console.error('Model loading failed:', error);
  }
};
```

### Test API Connection
```javascript
import apiService from '../services/apiService';

const testAPI = async () => {
  const connection = await apiService.testConnection();
  console.log('API Status:', connection);
};
```

## 📊 Performance Optimization

### Model Optimization
- Use model quantization for smaller file sizes
- Implement model caching
- Use progressive loading for large models

### Frontend Optimization
- Implement lazy loading for model components
- Use Web Workers for heavy computations
- Cache predictions locally

### Backend Optimization
- Implement model caching
- Use async processing for batch predictions
- Add request rate limiting

## 🔒 Security Considerations

- Validate all input data
- Implement file type restrictions
- Add size limits for uploads
- Use HTTPS in production
- Implement authentication for sensitive models

## 🚨 Troubleshooting

### Common Issues

**Model not loading:**
- Check file paths in configuration
- Verify model format compatibility
- Check browser console for errors

**API connection failed:**
- Ensure backend is running
- Check CORS configuration
- Verify API endpoints

**Prediction errors:**
- Validate input data format
- Check model input requirements
- Review preprocessing steps

### Debug Mode

Enable debug logging:
```javascript
// In modelLoader.js
const DEBUG = true;

if (DEBUG) {
  console.log('Model loading:', modelInfo);
}
```

## 📚 Additional Resources

- [TensorFlow.js Documentation](https://www.tensorflow.org/js)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review console logs
3. Test with sample data
4. Contact the development team

---

**Note:** This guide assumes basic familiarity with React, Python, and machine learning concepts. For advanced customization, refer to the specific framework documentation.

