import * as tf from '@tensorflow/tfjs';

class ModelLoader {
  constructor() {
    this.loadedModels = new Map();
    this.modelConfig = null;
  }

  /**
   * Initialize the model loader with configuration
   */
  async initialize() {
    try {
      const configResponse = await fetch('/src/models/config/model-config.json');
      this.modelConfig = await configResponse.json();
      console.log('Model configuration loaded successfully');
    } catch (error) {
      console.error('Failed to load model configuration:', error);
      throw error;
    }
  }

  /**
   * Load a specific model by name
   * @param {string} modelName - The name of the model to load
   * @param {string} category - The category (human-health, animal-health, etc.)
   * @returns {Promise<Object>} - The loaded model
   */
  async loadModel(modelName, category = 'human-health') {
    const modelKey = `${category}-${modelName}`;
    
    // Return cached model if already loaded
    if (this.loadedModels.has(modelKey)) {
      console.log(`Model ${modelKey} already loaded, returning cached version`);
      return this.loadedModels.get(modelKey);
    }

    try {
      if (!this.modelConfig) {
        await this.initialize();
      }

      const modelInfo = this.modelConfig.models[category][modelName];
      if (!modelInfo) {
        throw new Error(`Model ${modelName} not found in category ${category}`);
      }

      console.log(`Loading model: ${modelInfo.name}`);
      
      // Load TensorFlow.js model
      if (modelInfo.framework === 'tensorflow-js') {
        const model = await tf.loadLayersModel(modelInfo.file_path);
        this.loadedModels.set(modelKey, {
          model,
          info: modelInfo,
          type: 'tensorflow'
        });
        console.log(`Successfully loaded TensorFlow.js model: ${modelInfo.name}`);
        return this.loadedModels.get(modelKey);
      }
      
      // Add support for other frameworks here
      throw new Error(`Framework ${modelInfo.framework} not yet supported`);
      
    } catch (error) {
      console.error(`Failed to load model ${modelKey}:`, error);
      throw error;
    }
  }

  /**
   * Preprocess image for model input
   * @param {HTMLImageElement|HTMLCanvasElement} image - Input image
   * @param {Array} inputShape - Expected input shape [height, width, channels]
   * @returns {tf.Tensor} - Preprocessed tensor
   */
  preprocessImage(image, inputShape) {
    const [height, width, channels] = inputShape;
    
    // Convert to tensor and resize
    let tensor = tf.browser.fromPixels(image);
    tensor = tf.image.resizeBilinear(tensor, [height, width]);
    
    // Normalize if specified in config
    const preprocessConfig = this.modelConfig?.preprocessing?.image;
    if (preprocessConfig?.normalize) {
      tensor = tensor.div(255.0);
      
      // Apply mean and std normalization
      if (preprocessConfig.mean && preprocessConfig.std) {
        const mean = tf.tensor(preprocessConfig.mean);
        const std = tf.tensor(preprocessConfig.std);
        tensor = tensor.sub(mean).div(std);
      }
    }
    
    // Add batch dimension
    return tensor.expandDims(0);
  }

  /**
   * Preprocess text for model input
   * @param {string} text - Input text
   * @returns {Object} - Preprocessed text data
   */
  preprocessText(text) {
    const preprocessConfig = this.modelConfig?.preprocessing?.text;
    
    let processedText = text;
    
    if (preprocessConfig?.lowercase) {
      processedText = processedText.toLowerCase();
    }
    
    // Add more text preprocessing here (tokenization, etc.)
    
    return {
      text: processedText,
      maxLength: preprocessConfig?.max_length || 512
    };
  }

  /**
   * Make prediction using loaded model
   * @param {string} modelName - Name of the model
   * @param {string} category - Category of the model
   * @param {*} input - Input data (image, text, etc.)
   * @returns {Promise<Object>} - Prediction results
   */
  async predict(modelName, category, input) {
    try {
      const modelData = await this.loadModel(modelName, category);
      const { model, info } = modelData;

      let processedInput;
      
      // Process input based on model type
      if (info.type === 'image-classification') {
        processedInput = this.preprocessImage(input, info.input_shape);
      } else if (info.type === 'text-classification') {
        processedInput = this.preprocessText(input);
      } else {
        processedInput = input;
      }

      // Make prediction
      const prediction = await model.predict(processedInput);
      
      // Process prediction based on model type
      let results;
      if (info.type === 'image-classification' || info.type === 'text-classification') {
        // Get class probabilities
        const probabilities = await prediction.softmax().data();
        const classIndex = probabilities.indexOf(Math.max(...probabilities));
        
        results = {
          predicted_class: info.classes[classIndex],
          confidence: probabilities[classIndex],
          all_predictions: info.classes.map((className, index) => ({
            class: className,
            probability: probabilities[index]
          }))
        };
      } else {
        results = await prediction.data();
      }

      // Clean up tensors
      if (processedInput.dispose) processedInput.dispose();
      if (prediction.dispose) prediction.dispose();

      return results;
      
    } catch (error) {
      console.error(`Prediction failed for ${modelName}:`, error);
      throw error;
    }
  }

  /**
   * Load model from backend API
   * @param {string} modelName - Name of the model
   * @param {string} category - Category of the model
   * @returns {Promise<Object>} - Model data from backend
   */
  async loadModelFromBackend(modelName, category) {
    try {
      const apiConfig = this.modelConfig?.api;
      const response = await fetch(`${apiConfig.base_url}/models/${category}/${modelName}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load model from backend: ${response.statusText}`);
      }
      
      const modelData = await response.json();
      return modelData;
      
    } catch (error) {
      console.error(`Failed to load model from backend:`, error);
      throw error;
    }
  }

  /**
   * Make prediction via backend API
   * @param {string} modelName - Name of the model
   * @param {string} category - Category of the model
   * @param {*} input - Input data
   * @returns {Promise<Object>} - Prediction results from backend
   */
  async predictViaBackend(modelName, category, input) {
    try {
      const apiConfig = this.modelConfig?.api;
      
      // Prepare form data for file uploads
      let formData;
      if (input instanceof File || input instanceof Blob) {
        formData = new FormData();
        formData.append('file', input);
        formData.append('model_name', modelName);
        formData.append('category', category);
      } else {
        formData = new FormData();
        formData.append('data', JSON.stringify(input));
        formData.append('model_name', modelName);
        formData.append('category', category);
      }

      const response = await fetch(`${apiConfig.base_url}${apiConfig.endpoints.predict}`, {
        method: 'POST',
        body: formData,
        timeout: apiConfig.timeout
      });

      if (!response.ok) {
        throw new Error(`Backend prediction failed: ${response.statusText}`);
      }

      const results = await response.json();
      return results;
      
    } catch (error) {
      console.error(`Backend prediction failed for ${modelName}:`, error);
      throw error;
    }
  }

  /**
   * Clear all loaded models from memory
   */
  dispose() {
    this.loadedModels.forEach((modelData, key) => {
      if (modelData.model.dispose) {
        modelData.model.dispose();
      }
    });
    this.loadedModels.clear();
    console.log('All models disposed');
  }

  /**
   * Get list of available models
   * @returns {Object} - Available models by category
   */
  getAvailableModels() {
    return this.modelConfig?.models || {};
  }
}

// Create singleton instance
const modelLoader = new ModelLoader();

export default modelLoader;
