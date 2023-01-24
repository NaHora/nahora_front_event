import axios from 'axios';
import { appUrl } from '../config/web';

const api = axios.create({
  baseURL: appUrl.apiProd,
});

export default api;