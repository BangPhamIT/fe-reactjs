import { axiosApi } from '@/services/axios';

export default class ApiService {
    axiosInstance;
    url = '';
    headers: any;
    get: any;
    post: any;
    put: any;
    delete: any;
    patch: any;

    constructor(url = '', headers = {}) {
        this.axiosInstance = axiosApi;
        this.headers = headers;
        this.url = url ? `/${url}` : '';
        this.get = this.createRequestMethod('get');
        this.post = this.createRequestMethod('post');
        this.put = this.createRequestMethod('put');
        this.delete = this.createRequestMethod('delete');
        this.patch = this.createRequestMethod('patch');
    }

    createRequestMethod(method: string) {
        return (url: string, body = {}, apiConfigs = {}) => {
            return this.callApi(method, url, body, apiConfigs);
        };
    }

    callApi(
        method: string,
        url = '',
        body = {},
        { headers, responseType }: any = {}
    ) {
        let dataForm = body;
        
        const finalUrl = url ? `${this.url}/${url.replace(/^\//, '')}` : this.url;

        return this.axiosInstance({
            url: finalUrl,
            method,
            headers: Object.assign(
                {
                    'Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
                    'Authorization': localStorage.getItem('token') || '',
                },
                this.headers,
                headers
            ),
            params: method === 'get' && (body ?? {}),
            data: method !== 'get' && (dataForm ?? {}),
            responseType: responseType ?? 'json'
        });
    }
}
