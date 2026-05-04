import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const contentAPI = {
  getMissaoDiaria: () => api.get('/content/daily'),
  getTodosConteudos: () => api.get('/content/all'),
  checkin: (id, acertos, total) => api.post('/content/checkin', { content_id: id, acertos, total }),
};

export const userAPI = {
  getMe: () => api.get('/users/me'),
  atualizarWhatsApp: (whatsapp) => api.put('/users/whatsapp', { whatsapp }),
};

export const rankingAPI = {
  getSemanal: () => api.get('/ranking/semanal'),
};

export const wordsAPI = {
  getVocab: () => api.get('/content/vocab'),
  marcarErro: (word) => api.post('/words/error', { word }),
  marcarAcerto: (word) => api.post('/words/correct', { word }),
  getPalavrasFracas: () => api.get('/words/weak'),
};

export default api;