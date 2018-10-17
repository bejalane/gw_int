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
export class ProviderListService {
	constructor(
		private _http: HttpClientService,
		private _datePipe: DatePipe
	){}

	getServicesList() : Observable<any> {
		return this._http.get(environment.url + 'informCtrl/getServices')
        // .map((response:Response) => response.json())
			.catch((error:any) => Observable.throw(error))
	}

	getTopProviders() : Observable<any> {
		return this._http.get(environment.url + 'usersCtrl/getTopProviders')
        // .map((response:Response) => response.json())
			.catch((error:any) => Observable.throw(error))
	}

	getProvidersListByService(id:number) : Observable<any> {
		return this._http.get(environment.url + 'usersCtrl/getProvidersByService/' + id)
        // .map((response:Response) => response.json())
			.catch((error:any) => Observable.throw(error))
	}
}