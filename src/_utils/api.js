import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:8000/api',
  baseURL: 'https://fruitsvegetablesbackend-production.up.railway.app/api',
  //   timeout: 10000, // 10 seconds
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': 'Bearer YOUR_TOKEN',
  //   },
});

export default api;
