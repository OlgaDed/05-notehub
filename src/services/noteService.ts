import axios from 'axios';

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';

axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
