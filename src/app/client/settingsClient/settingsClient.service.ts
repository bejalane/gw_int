import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment  } from '../../environment';
import { HttpClientService } from '../../shared/services/httpclient.service';
import { DatePipe } from '@angular/common';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class SettingsClientService {
	constructor(
		private _http: HttpClientService,
		private _datePipe: DatePipe
	){}

	getSettings() : Observable<any> {
		return this._http.get(environment.url + 'userSettingsCtrl/getSettings')
        // .map((response:Response) => response.json())
			.catch((error:any) => Observable.throw(error))
	}

	saveSettings(user:any) : Observable<any> {
		if (user.avatar.id) {
			user.avatar = user.avatar.id;
		}
		return this._http.put(environment.url + 'userSettingsCtrl/updateClientSettings', user)
        // .map((response:Response) => response.json())
			.catch((error:any) => Observable.throw(error))
	}


}