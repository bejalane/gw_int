import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { User } from './user.model';
import { Observable } from 'rxjs/Rx';
import { environment  } from '../environment';
import 'rxjs/add/operator/catch';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class RegistrationService {
    constructor(private _http: HttpClient) {}
    register(user: User, userType: string): Observable<any> {
        const route = (userType === 'client') ? 'registerClient' : 'registerProvider';
        return this._http.post(environment.url + 'auth/registrationCtrl/' + route, user)
        // .map((response:Response) => response.json())
            .catch((error: any) => Observable.throw(error));
    }


    facebookSingUp(data: any): Observable<any> {
        return this._http.post(environment.url + 'auth/registrationCtrl/facebookSingUp', data)
        //  .map((response:Response) => response.json())
            .catch((error: any) => Observable.throw(error));
    }
}