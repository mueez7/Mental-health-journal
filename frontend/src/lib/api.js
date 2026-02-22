import axios from 'axios';
import { supabase } from './supabaseClient';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
});

api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
});

export default api;
