import axios from "axios";

class SearchService {
  constructor() {
    this.baseURL = process.env.SEARCHAPI_BASE_URL;
    this.apiKey = process.env.SEARCHAPI_KEY;
  }

  async searchExternalJobs(query, location = "", options = {}) {
    try {
      const params = {
        engine: "google_jobs",
        q: location ? `${query} in ${location}` : query,
        api_key: this.apiKey,
        ...options,
      };

      const response = await axios.get(this.baseURL, {
        params,
        timeout: 10000,
      });

      return {
        success: true,
        data: response.data,
        totalJobs: response.data.jobs?.length || 0,
      };
    } catch (error) {
      console.error("SearchService Error:", error.message);

      if (error.response) {
        return {
          success: false,
          error: error.response.data.message || "API request failed",
          status: error.response.status,
        };
      }

      return {
        success: false,
        error: "Network error or timeout",
        status: 500,
      };
    }
  }

  async searchJobsByCompany(company, location = "") {
    const query = `${company} jobs`;
    return this.searchExternalJobs(query, location);
  }

  async searchJobsBySkills(skills, location = "") {
    const query = skills.join(" ");
    return this.searchExternalJobs(query, location);
  }
}

export default new SearchService();
