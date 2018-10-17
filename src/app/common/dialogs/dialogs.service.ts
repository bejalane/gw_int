import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment  } from '../../environment';
import { HttpClientService } from '../../shared/services/httpclient.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class DialogsService {
	constructor(
		private _http: HttpClientService
	){}

	getClientDialogs() : Observable<any> {
		return this._http.get(environment.url + 'dialogsCtrl/getDialogs')
        // .map((response:Response) => response.json())
			.catch((error:any) => Observable.throw(error))
	}

	getDialogById(id:any, nextPage: string) : Observable<any> {
		return this._http.get(environment.url + 'dialogsCtrl/getDialog/' + id + nextPage)
        // .map((response:Response) => response.json())
			.catch((error:any) => Observable.throw(error))
	}

    getDialogByCompanion(id:any): Observable<any> {
        return this._http.get(environment.url + 'dialogsCtrl/getDialog/' + id)
        // .map((response:Response) => response.json())
            .catch((error:any) => Observable.throw(error));
    }

	sendMessage(id:any, message:any) : Observable<any> {
		return this._http.post(environment.url + 'dialogsCtrl/postMessage/' + id, message)
        // .map((response:Response) => response.json())
			.catch((error:any) => Observable.throw(error))
	}

}