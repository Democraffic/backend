import Axios from 'axios';

import CONFIG from '@/config';

export async function checkSpam(text:string): Promise<boolean> {
    try {
        const response = await Axios.post(CONFIG.API_SPAM_URL, { message : text });
        return response.data
    }
    catch (error) {
        return false;
    }
};
