import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, AlertCircle, CheckCircle, Loader, X } from 'lucide-react';
import apiService from '../services/apiService';
import './SkinDiseaseDetector.css';

const SkinDiseaseDetector = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
      setPrediction(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setError('Please select a valid image file');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiService.predictImage(
        selectedFile,
        'skin-disease-detection',
        'human-health'
      );
      
      setPrediction(result.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setPrediction(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSeverityColor = (confidence) => {
    if (confidence > 0.8) return '#ef4444'; // red - high confidence
    if (confidence > 0.6) return '#f59e0b'; // yellow - medium confidence
    return '#10b981'; // green - low confidence
  };

  const getSeverityText = (confidence) => {
    if (confidence > 0.8) return 'High Confidence';
    if (confidence > 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="skin-disease-detector">
      <div className="detector-header">
        <h2>🔬 AI Skin Disease Detection</h2>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="detector-content">
        {/* Upload Area */}
        <div className="upload-section">
          <div
            className={`upload-area ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              style={{ display: 'none' }}
            />
            
            {preview ? (
              <div className="image-preview">
                <img src={preview} alt="Selected" />
                <div className="preview-overlay">
                  <p>Click to change image</p>
                </div>
              </div>
            ) : (
              <div className="upload-placeholder">
                <Camera size={48} />
                <h3>Upload Skin Image</h3>
                <p>Drag & drop or click to select</p>
                <p className="upload-hint">Supports JPG, PNG, WebP up to 10MB</p>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="file-info">
              <p><strong>File:</strong> {selectedFile.name}</p>
              <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              <p><strong>Type:</strong> {selectedFile.type}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          {selectedFile && (
            <button className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={handlePredict}
            disabled={!selectedFile || loading}
          >
            {loading ? (
              <>
                <Loader className="spinning" size={16} />
                Analyzing...
              </>
            ) : (
              <>
                <Upload size={16} />
                Analyze Image
              </>
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Prediction Results */}
        {prediction && (
          <motion.div
            className="prediction-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3>Analysis Results</h3>
            
            <div className="main-prediction">
              <div className="prediction-card">
                <div className="prediction-header">
                  <h4>{prediction.predicted_class}</h4>
                  <span 
                    className="confidence-badge"
                    style={{ backgroundColor: getSeverityColor(prediction.confidence) }}
                  >
                    {(prediction.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="confidence-text">
                  {getSeverityText(prediction.confidence)}
                </p>
              </div>
            </div>

            <div className="all-predictions">
              <h4>All Classifications</h4>
              <div className="predictions-list">
                {prediction.all_predictions
                  .sort((a, b) => b.probability - a.probability)
                  .map((pred, index) => (
                    <div key={index} className="prediction-item">
                      <span className="class-name">{pred.class}</span>
                      <div className="probability-bar">
                        <div
                          className="probability-fill"
                          style={{
                            width: `${pred.probability * 100}%`,
                            backgroundColor: index === 0 ? getSeverityColor(pred.probability) : '#6b7280'
                          }}
                        />
                      </div>
                      <span className="probability-text">
                        {(pred.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="recommendations">
              <h4>Recommendations</h4>
              <div className="recommendation-cards">
                {prediction.confidence > 0.7 && (
                  <div className="recommendation-card urgent">
                    <AlertCircle size={20} />
                    <div>
                      <h5>High Confidence Detection</h5>
                      <p>Consider consulting a dermatologist for professional evaluation</p>
                    </div>
                  </div>
                )}
                <div className="recommendation-card info">
                  <CheckCircle size={20} />
                  <div>
                    <h5>General Advice</h5>
                    <p>This is an AI analysis. Always consult healthcare professionals for medical decisions</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="instructions">
          <h4>📋 Instructions</h4>
          <ul>
            <li>Upload a clear, well-lit photo of the skin area</li>
            <li>Ensure the affected area is clearly visible</li>
            <li>Remove any makeup or coverings if possible</li>
            <li>Results are for informational purposes only</li>
            <li>Always consult a healthcare professional for diagnosis</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SkinDiseaseDetector;

