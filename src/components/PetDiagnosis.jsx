import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, AlertTriangle, Heart, Loader, X, MapPin } from 'lucide-react';
import apiService from '../services/apiService';
import './PetDiagnosis.css';

const PetDiagnosis = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [petInfo, setPetInfo] = useState({
    name: '',
    age: '',
    breed: '',
    symptoms: ''
  });
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
        'pet-diagnosis',
        'animal-health'
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
    setPetInfo({
      name: '',
      age: '',
      breed: '',
      symptoms: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSeverityColor = (condition) => {
    const urgentConditions = ['injury', 'parasite', 'emergency'];
    const moderateConditions = ['skin_condition', 'eye_problem', 'ear_infection', 'dental_issue'];
    
    if (urgentConditions.some(c => condition.includes(c))) return '#ef4444';
    if (moderateConditions.some(c => condition.includes(c))) return '#f59e0b';
    return '#10b981';
  };

  const getSeverityText = (condition) => {
    const urgentConditions = ['injury', 'parasite', 'emergency'];
    const moderateConditions = ['skin_condition', 'eye_problem', 'ear_infection', 'dental_issue'];
    
    if (urgentConditions.some(c => condition.includes(c))) return 'Urgent - Seek immediate care';
    if (moderateConditions.some(c => condition.includes(c))) return 'Moderate - Schedule vet visit';
    return 'Healthy - Continue monitoring';
  };

  const getConditionDescription = (condition) => {
    const descriptions = {
      'healthy': 'Your pet appears to be in good health!',
      'skin_condition': 'Possible skin irritation or condition detected',
      'eye_problem': 'Potential eye-related issue identified',
      'ear_infection': 'Signs of ear infection or irritation',
      'dental_issue': 'Dental problems or oral health concerns',
      'injury': 'Possible injury or trauma detected',
      'parasite': 'Potential parasite infection',
      'allergy': 'Allergic reaction or sensitivity',
      'digestive_issue': 'Digestive system concerns'
    };
    return descriptions[condition] || 'Condition requires further evaluation';
  };

  const getRecommendations = (condition) => {
    const recommendations = {
      'healthy': [
        'Continue regular veterinary checkups',
        'Maintain current diet and exercise routine',
        'Monitor for any changes in behavior'
      ],
      'skin_condition': [
        'Schedule veterinary examination',
        'Avoid self-treatment with over-the-counter medications',
        'Monitor for itching, redness, or changes'
      ],
      'eye_problem': [
        'Seek immediate veterinary attention',
        'Avoid touching or rubbing the eyes',
        'Note any discharge or behavioral changes'
      ],
      'ear_infection': [
        'Veterinary examination recommended',
        'Keep ears clean and dry',
        'Monitor for head shaking or scratching'
      ],
      'dental_issue': [
        'Schedule dental examination',
        'Consider dental cleaning',
        'Monitor eating habits'
      ],
      'injury': [
        'Immediate veterinary care required',
        'Keep pet calm and limit movement',
        'Do not attempt to treat serious injuries at home'
      ],
      'parasite': [
        'Veterinary treatment needed',
        'Prevent contact with other pets',
        'Follow deworming protocol'
      ]
    };
    return recommendations[condition] || ['Consult with a veterinarian for proper diagnosis'];
  };

  return (
    <div className="pet-diagnosis">
      <div className="diagnosis-header">
        <h2>🐾 AI Pet Health Diagnosis</h2>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="diagnosis-content">
        {/* Pet Information */}
        <div className="pet-info-section">
          <h3>Pet Information</h3>
          <div className="pet-info-grid">
            <div className="info-field">
              <label>Pet Name</label>
              <input
                type="text"
                value={petInfo.name}
                onChange={(e) => setPetInfo({...petInfo, name: e.target.value})}
                placeholder="Enter pet name"
              />
            </div>
            <div className="info-field">
              <label>Age</label>
              <input
                type="text"
                value={petInfo.age}
                onChange={(e) => setPetInfo({...petInfo, age: e.target.value})}
                placeholder="e.g., 3 years, 6 months"
              />
            </div>
            <div className="info-field">
              <label>Breed</label>
              <input
                type="text"
                value={petInfo.breed}
                onChange={(e) => setPetInfo({...petInfo, breed: e.target.value})}
                placeholder="e.g., Golden Retriever"
              />
            </div>
          </div>
          <div className="info-field full-width">
            <label>Current Symptoms (Optional)</label>
            <textarea
              value={petInfo.symptoms}
              onChange={(e) => setPetInfo({...petInfo, symptoms: e.target.value})}
              placeholder="Describe any symptoms or concerns..."
              rows="3"
            />
          </div>
        </div>

        {/* Upload Area */}
        <div className="upload-section">
          <h3>Upload Pet Photo</h3>
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
                  <p>Click to change photo</p>
                </div>
              </div>
            ) : (
              <div className="upload-placeholder">
                <Camera size={48} />
                <h4>Upload Pet Photo</h4>
                <p>Drag & drop or click to select</p>
                <p className="upload-hint">Clear, well-lit photos work best</p>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="file-info">
              <p><strong>File:</strong> {selectedFile.name}</p>
              <p><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
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
                <Heart size={16} />
                Analyze Pet Health
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
            <AlertTriangle size={16} />
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
            <h3>Health Analysis Results</h3>
            
            <div className="main-prediction">
              <div className="prediction-card">
                <div className="prediction-header">
                  <h4>{prediction.predicted_class.replace('_', ' ')}</h4>
                  <span 
                    className="confidence-badge"
                    style={{ backgroundColor: getSeverityColor(prediction.predicted_class) }}
                  >
                    {(prediction.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="condition-description">
                  {getConditionDescription(prediction.predicted_class)}
                </p>
                <p className="severity-text">
                  {getSeverityText(prediction.predicted_class)}
                </p>
              </div>
            </div>

            <div className="all-predictions">
              <h4>All Health Assessments</h4>
              <div className="predictions-list">
                {prediction.all_predictions
                  .sort((a, b) => b.probability - a.probability)
                  .map((pred, index) => (
                    <div key={index} className="prediction-item">
                      <span className="class-name">{pred.class.replace('_', ' ')}</span>
                      <div className="probability-bar">
                        <div
                          className="probability-fill"
                          style={{
                            width: `${pred.probability * 100}%`,
                            backgroundColor: index === 0 ? getSeverityColor(pred.class) : '#6b7280'
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
              <h4>Veterinary Recommendations</h4>
              <div className="recommendation-cards">
                {getRecommendations(prediction.predicted_class).map((rec, index) => (
                  <div key={index} className="recommendation-card">
                    <Heart size={16} />
                    <span>{rec}</span>
                  </div>
                ))}
                
                <div className="emergency-info">
                  <AlertTriangle size={20} />
                  <div>
                    <h5>Emergency Situations</h5>
                    <p>If your pet shows signs of distress, difficulty breathing, or severe injury, seek immediate veterinary care.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="vet-finder">
              <h4>Find Nearby Veterinarians</h4>
              <button className="btn btn-secondary">
                <MapPin size={16} />
                Locate Emergency Vets
              </button>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <div className="instructions">
          <h4>📋 Photo Guidelines</h4>
          <ul>
            <li>Take clear, well-lit photos of your pet</li>
            <li>Focus on the area of concern if applicable</li>
            <li>Include your pet's face and body for comprehensive analysis</li>
            <li>Ensure your pet is calm and cooperative</li>
            <li>Results are for informational purposes only</li>
            <li>Always consult a licensed veterinarian for diagnosis and treatment</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PetDiagnosis;

