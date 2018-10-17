import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { User } from './user.model';
import { Observable } from 'rxjs/Rx';
import { environment  } from '../environment';
import { HttpClientService } from '../shared/services/httpclient.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LoginService {
    constructor(private _http: HttpClientService){}
    login(user: User): Observable<User[]> {
        return this._http.post(environment.url + 'auth/loginCtrl/login', user)
           // .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error));
    }

    facebookLogin(data: any): Observable<any> {
        return this._http.post(environment.url + 'auth/loginCtrl/facebookLogin', data)
          //  .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error));
    }

    logout(): Observable<any> {
        return this._http.get(environment.url + 'auth/loginCtrl/logout')
           // .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error));
    }

    sendResetPasswordReqeust(data: any): Observable<User[]> {
        return this._http.post(environment.url + 'sendResetLinkEmail', data)
           // .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error));
    }

    // refreshauth(): Observable<any> {
    //     return this._http.get(environment.url + 'auth/refreshToken')
    //        .map((response: Response) => response.json())
    //         .catch((error: any) => Observable.throw(error));
    // }

    isUserLoggedIn() {
        return Boolean(localStorage.getItem('gw_token') && localStorage.getItem('gw_user_name'));
    }
    // api/sendResetLinkEmail
}
