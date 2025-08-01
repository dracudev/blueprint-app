/**
 * API Service for handling AJAX requests to REST endpoints
 * Provides a clean interface for CRUD operations
 */
class ApiService {
  constructor() {
    this.baseUrl = "/api";
  }

  /**
   * Generic request method
   * @param {string} url
   * @param {object} options
   * @returns {Promise<object>}
   */
  async request(url, options = {}) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));

        const error = new Error(errorData.message || "Request failed");
        error.status = response.status;
        error.errors = errorData.errors || [];
        error.isValidationError =
          response.status === 400 &&
          errorData.errors &&
          errorData.errors.length > 0;

        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  /**
   * GET request
   * @param {string} endpoint
   * @returns {Promise<object>}
   */
  async get(endpoint) {
    return this.request(`${this.baseUrl}${endpoint}`, {
      method: "GET",
    });
  }

  /**
   * POST request
   * @param {string} endpoint
   * @param {object} data
   * @returns {Promise<object>}
   */
  async post(endpoint, data) {
    return this.request(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      body: data,
    });
  }

  /**
   * PUT request
   * @param {string} endpoint
   * @param {object} data
   * @returns {Promise<object>}
   */
  async put(endpoint, data) {
    return this.request(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      body: data,
    });
  }

  /**
   * DELETE request
   * @param {string} endpoint
   * @returns {Promise<object>}
   */
  async delete(endpoint) {
    return this.request(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
    });
  }

  // Client-specific methods
  async getClients() {
    return this.get("/clients");
  }

  async createClient(clientData) {
    return this.post("/clients", clientData);
  }

  async updateClient(id, clientData) {
    return this.put(`/clients/${id}`, clientData);
  }

  async deleteClient(id) {
    return this.delete(`/clients/${id}`);
  }

  // Service-specific methods
  async getServices() {
    return this.get("/services");
  }

  async createService(serviceData) {
    return this.post("/services", serviceData);
  }

  async updateService(id, serviceData) {
    return this.put(`/services/${id}`, serviceData);
  }

  async deleteService(id) {
    return this.delete(`/services/${id}`);
  }

  // Project-specific methods
  async getProjects() {
    return this.get("/projects");
  }

  async createProject(projectData) {
    return this.post("/projects", projectData);
  }

  async updateProject(id, projectData) {
    return this.put(`/projects/${id}`, projectData);
  }

  async deleteProject(id) {
    return this.delete(`/projects/${id}`);
  }
}

window.apiService = new ApiService();
