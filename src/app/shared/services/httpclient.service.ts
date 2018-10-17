import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class HttpClientService {

    constructor(
        private http: HttpClient,
    ) {}

    createAuthorizationHeader(headers: HttpHeaders) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('gw_token'));
    }

    get(url: string) {
        return this.sendRequest(url, 'get');
    }

    post(url: string, data: any) {
        return this.sendRequest(url, 'post', data);
    }

    put(url: string, data: any) {
        return this.sendRequest(url, 'put', data);
    }

    sendRequest(url: string, method: string, data?: any) {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('gw_token')
        });
        // this.createAuthorizationHeader(headers);
        if (data) {
            return this.http[method](url, data, {
                headers: headers
            });
        } else {
            return this.http[method](url, {
                headers: headers
            });
        }
    }
}
