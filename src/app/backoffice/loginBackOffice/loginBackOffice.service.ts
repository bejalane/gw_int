import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { User } from './user.model';
import { Observable } from 'rxjs/Rx';
import { environment  } from '../../environment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LoginBackOfficeService {
	constructor(private _http: Http){}
	loginBackOffice(user: User) : Observable<any> {
		return this._http.post(environment.url + 'admin/auth', user)
        // .map((response:Response) => response.json())
			.catch((error:any) => Observable.throw(error.json().error || 'Server error'))
	}
}