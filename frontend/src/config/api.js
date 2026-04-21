import axios from 'axios';

// Use environment variable for API base URL.
// In development this reads from frontend/.env (REACT_APP_API_URL=http://localhost:5000).
// On Render, set the REACT_APP_API_URL environment variable to your backend service URL,
// e.g. https://your-backend-service.onrender.com
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
