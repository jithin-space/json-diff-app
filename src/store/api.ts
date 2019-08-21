import axios from 'axios';

export const pybossa_api = axios.create({
  baseURL: 'http://data.computingfreedomcollective.com/api',
});
export const lumen_api = axios.create({
  baseURL: 'http://localhost:8000/api',
})
