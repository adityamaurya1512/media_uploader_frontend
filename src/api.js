import axios from 'axios';
const Base_Url="https://media-uploader-backend-i34s.onrender.com"
const api = axios.create({
    baseURL: `${Base_Url}/auth/`,
    // withCredentials: true,
});

export const googleAuth = (code) => api.get(`/google?code=${code}`);