import { Injectable } from '@angular/core';
// import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { environment  } from '../../environment';
import 'rxjs/add/operator/catch';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {HttpClientService} from '../../shared/services/httpclient.service';

@Injectable()
export class TopMenuService {

    constructor(
       // private _http: HttpClient,
        private _httpService: HttpClientService
    ) {}

    // logout(): Observable<any> {
    //     return this._http.get(environment.url + 'auth/loginCtrl/logout')
    //     // .map((response:Response) => response.json())
    //         .catch((error: any) => Observable.throw(error));
    // }

    sendForm(form: string, data: any): Observable<any>  {
        return this._httpService.post(environment.url + 'formsCtrl/' + form , data)
            .catch((error: any) => Observable.throw(error));
    }
}
