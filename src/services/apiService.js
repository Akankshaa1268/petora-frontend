import axios from 'axios';

class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:8000';
    this.timeout = 30000;
    
    // Create axios instance with default config
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`Making API request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`API response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Health check endpoint
   */
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  }

  /**
   * List all available models
   */
  async listModels() {
    try {
      const response = await this.client.get('/models');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to list models: ${error.message}`);
    }
  }

  /**
   * Get information about a specific model
   */
  async getModelInfo(category, modelName) {
    try {
      const response = await this.client.get(`/models/${category}/${modelName}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get model info: ${error.message}`);
    }
  }

  /**
   * Make prediction on uploaded image
   */
  async predictImage(file, modelName = 'skin-disease-detection', category = 'human-health') {
    try {
      // Validate file
      if (!file || !file.type.startsWith('image/')) {
        throw new Error('Invalid file type. Please upload an image.');
      }

      // Check file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File too large. Maximum size is 10MB.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('model_name', modelName);
      formData.append('category', category);

      const response = await this.client.post('/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error(`Prediction failed: ${error.message}`);
    }
  }

  /**
   * Make prediction on text input
   */
  async predictText(text, modelName = 'symptom-analyzer', category = 'human-health') {
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('Text input is required');
      }

      const response = await this.client.post('/predict/text', null, {
        params: {
          text: text,
          model_name: modelName,
          category: category,
        },
      });

      return response.data;
    } catch (error) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error(`Text prediction failed: ${error.message}`);
    }
  }

  /**
   * Upload a new model
   */
  async uploadModel(file, modelName, category) {
    try {
      if (!modelName || !category) {
        throw new Error('Model name and category are required');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('model_name', modelName);
      formData.append('category', category);

      const response = await this.client.post('/models/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      throw new Error(`Model upload failed: ${error.message}`);
    }
  }

  /**
   * Upload multiple files for batch prediction
   */
  async batchPredict(files, modelName = 'skin-disease-detection', category = 'human-health') {
    try {
      const promises = files.map(file => this.predictImage(file, modelName, category));
      const results = await Promise.allSettled(promises);
      
      return results.map((result, index) => ({
        filename: files[index].name,
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason.message : null,
      }));
    } catch (error) {
      throw new Error(`Batch prediction failed: ${error.message}`);
    }
  }

  async predictSkinDisease(file, category = "human-health") {
  return this.predictImage(file, "skin-disease-detection", category);
  }


  /**
   * Test API connection
   */
  async testConnection() {
    try {
      const healthData = await this.healthCheck();
      const modelsData = await this.listModels();
      
      return {
        connected: true,
        health: healthData,
        models: modelsData,
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message,
      };
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
