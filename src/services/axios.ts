import { PREFIX_API } from '@/configs/const';
import axios from 'axios';

const axiosApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}${PREFIX_API}`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Content-Disposition',
        'Pragma': 'no-cache'
    }
});

export { axiosApi };
