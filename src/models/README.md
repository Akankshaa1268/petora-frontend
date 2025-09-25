# Model Integration Guide

This directory contains trained machine learning models for the Petora healthcare platform.

## Directory Structure
```
models/
├── human-health/          # Models for human health assessment
│   ├── skin-disease/      # Skin disease detection models
│   ├── symptom-analysis/  # Symptom analysis models
│   └── risk-assessment/   # Health risk assessment models
├── animal-health/         # Models for animal health assessment
│   ├── pet-diagnosis/     # Pet health diagnosis models
│   └── breed-detection/   # Pet breed identification models
├── shared/               # Shared utility models
│   ├── image-processing/  # Image preprocessing models
│   └── text-analysis/    # Natural language processing models
└── config/              # Model configuration files
    ├── model-config.json
    └── api-endpoints.json
```

## Model File Formats
- **TensorFlow.js**: `.json` (model architecture) + `.bin` (weights)
- **ONNX**: `.onnx` files
- **PyTorch**: `.pt` or `.pth` files
- **Custom**: Any other format with appropriate loaders

## Usage
Models are loaded dynamically based on the application requirements. See `src/utils/modelLoader.js` for implementation details.

