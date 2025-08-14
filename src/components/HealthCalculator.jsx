import React, { useState } from 'react';
import './HealthCalculator.css';

const HealthCalculator = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('bmi');
  const [bmiData, setBmiData] = useState({ weight: '', height: '', unit: 'metric' });
  const [bpData, setBpData] = useState({ systolic: '', diastolic: '' });
  const [hrData, setHrData] = useState({ age: '', restingHR: '' });
  const [results, setResults] = useState(null);

  // BMI Calculator
  const calculateBMI = () => {
    const { weight, height, unit } = bmiData;
    if (!weight || !height) return;

    let bmi;
    if (unit === 'metric') {
      bmi = (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2));
    } else {
      bmi = (parseFloat(weight) * 703) / Math.pow(parseFloat(height), 2);
    }

    let category, color, risk;
    if (bmi < 18.5) {
      category = 'Underweight';
      color = '#3b82f6';
      risk = 'Low';
    } else if (bmi < 25) {
      category = 'Normal Weight';
      color = '#10b981';
      risk = 'Low';
    } else if (bmi < 30) {
      category = 'Overweight';
      color = '#f59e0b';
      risk = 'Moderate';
    } else {
      category = 'Obese';
      color = '#ef4444';
      risk = 'High';
    }

    setResults({
      type: 'bmi',
      value: bmi.toFixed(1),
      category,
      color,
      risk,
      details: {
        'BMI Range': `${bmi.toFixed(1)}`,
        'Category': category,
        'Health Risk': risk,
        'Recommendation': getBMIRecommendation(category)
      }
    });
  };

  const getBMIRecommendation = (category) => {
    switch (category) {
      case 'Underweight':
        return 'Consider increasing caloric intake with healthy foods and strength training';
      case 'Normal Weight':
        return 'Maintain current weight with balanced diet and regular exercise';
      case 'Overweight':
        return 'Focus on calorie deficit, increased physical activity, and healthy eating';
      case 'Obese':
        return 'Consult healthcare provider for personalized weight loss plan';
      default:
        return 'Maintain healthy lifestyle with balanced diet and exercise';
    }
  };

  // Blood Pressure Calculator
  const calculateBP = () => {
    const { systolic, diastolic } = bpData;
    if (!systolic || !diastolic) return;

    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);

    let category, color, risk, recommendation;
    if (sys < 120 && dia < 80) {
      category = 'Normal';
      color = '#10b981';
      risk = 'Low';
      recommendation = 'Maintain healthy lifestyle with regular exercise and balanced diet';
    } else if (sys < 130 && dia < 80) {
      category = 'Elevated';
      color = '#f59e0b';
      risk = 'Moderate';
      recommendation = 'Focus on lifestyle changes: reduce salt, exercise regularly, manage stress';
    } else if (sys < 140 || dia < 90) {
      category = 'Stage 1 Hypertension';
      color = '#f97316';
      risk = 'High';
      recommendation = 'Lifestyle changes + possible medication. Consult healthcare provider';
    } else {
      category = 'Stage 2 Hypertension';
      color = '#ef4444';
      risk = 'Very High';
      recommendation = 'Immediate medical attention required. Medication likely needed';
    }

    setResults({
      type: 'bp',
      value: `${sys}/${dia}`,
      category,
      color,
      risk,
      details: {
        'Blood Pressure': `${sys}/${dia} mmHg`,
        'Category': category,
        'Risk Level': risk,
        'Recommendation': recommendation
      }
    });
  };

  // Heart Rate Calculator
  const calculateHR = () => {
    const { age, restingHR } = hrData;
    if (!age || !restingHR) return;

    const maxHR = 220 - parseInt(age);
    const resting = parseInt(restingHR);
    
    const zones = {
      'Rest': { min: resting, max: resting, intensity: 'Rest' },
      'Zone 1 (Warm-up)': { min: Math.round(maxHR * 0.5), max: Math.round(maxHR * 0.6), intensity: 'Very Light' },
      'Zone 2 (Fat Burn)': { min: Math.round(maxHR * 0.6), max: Math.round(maxHR * 0.7), intensity: 'Light' },
      'Zone 3 (Aerobic)': { min: Math.round(maxHR * 0.7), max: Math.round(maxHR * 0.8), intensity: 'Moderate' },
      'Zone 4 (Anaerobic)': { min: Math.round(maxHR * 0.8), max: Math.round(maxHR * 0.9), intensity: 'Hard' },
      'Zone 5 (Peak)': { min: Math.round(maxHR * 0.9), max: maxHR, intensity: 'Maximum' }
    };

    let restingCategory, restingColor;
    if (resting < 60) {
      restingCategory = 'Excellent';
      restingColor = '#10b981';
    } else if (resting < 70) {
      restingCategory = 'Good';
      restingColor = '#3b82f6';
    } else if (resting < 80) {
      restingCategory = 'Average';
      restingColor = '#f59e0b';
    } else {
      restingCategory = 'Above Average';
      restingColor = '#ef4444';
    }

    setResults({
      type: 'hr',
      value: `${resting} bpm`,
      category: restingCategory,
      color: restingColor,
      zones,
      details: {
        'Age': `${age} years`,
        'Max Heart Rate': `${maxHR} bpm`,
        'Resting Heart Rate': `${resting} bpm (${restingCategory})`,
        'Recommendation': getHRRecommendation(restingCategory)
      }
    });
  };

  const getHRRecommendation = (category) => {
    switch (category) {
      case 'Excellent':
        return 'Maintain current fitness level with regular cardiovascular exercise';
      case 'Good':
        return 'Continue regular exercise routine with moderate intensity training';
      case 'Average':
        return 'Increase cardiovascular exercise frequency and intensity gradually';
      case 'Above Average':
        return 'Focus on regular aerobic exercise and consult healthcare provider if concerned';
      default:
        return 'Maintain regular exercise routine with balanced cardiovascular training';
    }
  };

  const handleCalculate = () => {
    switch (activeTab) {
      case 'bmi':
        calculateBMI();
        break;
      case 'bp':
        calculateBP();
        break;
      case 'hr':
        calculateHR();
        break;
      default:
        break;
    }
  };

  const resetCalculator = () => {
    setResults(null);
    setBmiData({ weight: '', height: '', unit: 'metric' });
    setBpData({ systolic: '', diastolic: '' });
    setHrData({ age: '', restingHR: '' });
  };

  return (
    <div className="health-calculator">
      <div className="calculator-header">
        <button className="back-button" onClick={onClose}>
          ← BACK
        </button>
        <h1>📊 Health Calculator</h1>
      </div>

      <div className="calculator-container">
        <div className="calculator-tabs">
          <button 
            className={`tab-btn ${activeTab === 'bmi' ? 'active' : ''}`}
            onClick={() => setActiveTab('bmi')}
          >
            🏃 BMI Calculator
          </button>
          <button 
            className={`tab-btn ${activeTab === 'bp' ? 'active' : ''}`}
            onClick={() => setActiveTab('bp')}
          >
            ❤️ Blood Pressure
          </button>
          <button 
            className={`tab-btn ${activeTab === 'hr' ? 'active' : ''}`}
            onClick={() => setActiveTab('hr')}
          >
            💓 Heart Rate Zones
          </button>
        </div>

        <div className="calculator-content">
          {activeTab === 'bmi' && (
            <div className="calculator-form">
              <h3>Body Mass Index (BMI) Calculator</h3>
              <div className="unit-toggle">
                <label>
                  <input
                    type="radio"
                    name="unit"
                    value="metric"
                    checked={bmiData.unit === 'metric'}
                    onChange={(e) => setBmiData({...bmiData, unit: e.target.value})}
                  />
                  Metric (kg/cm)
                </label>
                <label>
                  <input
                    type="radio"
                    name="unit"
                    value="imperial"
                    checked={bmiData.unit === 'imperial'}
                    onChange={(e) => setBmiData({...bmiData, unit: e.target.value})}
                  />
                  Imperial (lbs/in)
                </label>
              </div>
              <div className="input-group">
                <label>Weight ({bmiData.unit === 'metric' ? 'kg' : 'lbs'})</label>
                <input
                  type="number"
                  value={bmiData.weight}
                  onChange={(e) => setBmiData({...bmiData, weight: e.target.value})}
                  placeholder={bmiData.unit === 'metric' ? '70' : '154'}
                />
              </div>
              <div className="input-group">
                <label>Height ({bmiData.unit === 'metric' ? 'cm' : 'inches'})</label>
                <input
                  type="number"
                  value={bmiData.height}
                  onChange={(e) => setBmiData({...bmiData, height: e.target.value})}
                  placeholder={bmiData.unit === 'metric' ? '170' : '67'}
                />
              </div>
            </div>
          )}

          {activeTab === 'bp' && (
            <div className="calculator-form">
              <h3>Blood Pressure Calculator</h3>
              <div className="input-group">
                <label>Systolic Pressure (mmHg)</label>
                <input
                  type="number"
                  value={bpData.systolic}
                  onChange={(e) => setBpData({...bpData, systolic: e.target.value})}
                  placeholder="120"
                />
              </div>
              <div className="input-group">
                <label>Diastolic Pressure (mmHg)</label>
                <input
                  type="number"
                  value={bpData.diastolic}
                  onChange={(e) => setBpData({...bpData, diastolic: e.target.value})}
                  placeholder="80"
                />
              </div>
            </div>
          )}

          {activeTab === 'hr' && (
            <div className="calculator-form">
              <h3>Heart Rate Zone Calculator</h3>
              <div className="input-group">
                <label>Age (years)</label>
                <input
                  type="number"
                  value={hrData.age}
                  onChange={(e) => setHrData({...hrData, age: e.target.value})}
                  placeholder="30"
                />
              </div>
              <div className="input-group">
                <label>Resting Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={hrData.restingHR}
                  onChange={(e) => setHrData({...hrData, restingHR: e.target.value})}
                  placeholder="72"
                />
              </div>
            </div>
          )}

          <div className="calculator-actions">
            <button className="calculate-btn" onClick={handleCalculate}>
              Calculate
            </button>
            <button className="reset-btn" onClick={resetCalculator}>
              Reset
            </button>
          </div>

          {results && (
            <div className="results-section">
              <div className="result-header" style={{ borderColor: results.color }}>
                <h3>{results.type.toUpperCase()} Results</h3>
                <div className="result-value" style={{ color: results.color }}>
                  {results.value}
                </div>
                <div className="result-category" style={{ color: results.color }}>
                  {results.category}
                </div>
              </div>

              <div className="result-details">
                {Object.entries(results.details).map(([key, value]) => (
                  <div key={key} className="detail-item">
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>

              {results.type === 'hr' && results.zones && (
                <div className="heart-rate-zones">
                  <h4>Heart Rate Training Zones</h4>
                  <div className="zones-grid">
                    {Object.entries(results.zones).map(([zone, data]) => (
                      <div key={zone} className="zone-card">
                        <div className="zone-name">{zone}</div>
                        <div className="zone-range">{data.min}-{data.max} bpm</div>
                        <div className="zone-intensity">{data.intensity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthCalculator;
