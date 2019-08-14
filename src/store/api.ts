import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://data.computingfreedomcollective.com/api'
});
