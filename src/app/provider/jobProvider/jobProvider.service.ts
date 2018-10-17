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
export class JobProviderService {
	constructor(
		private _http: HttpClientService,
		private _datePipe: DatePipe
	){}

	getJob(id:number) : Observable<any> {
		return this._http.get(environment.url + 'jobsCtrl/getJobForProvider/' + id)
        // 	.map((response:Response) => response.json())
			.catch((error:any) => Observable.throw(error))
	}

	sendOffer(offer:any, id:number) : Observable<any> {
		return this._http.post(environment.url + 'offersCtrl/postOffer/' + id, offer)
        // .map((response:Response) => response.json())
			.catch((error:any) => Observable.throw(error))
	}

    // addToWishlist(id: number) : Observable<any> {
		// return this._http.get(environment.url + 'favoritesCtrl/setProviderFavorites/' + id)
		// 	.map((response:Response) => response.json())
		// 	.catch((error:any) => Observable.throw(error))
    // }
    
    getPostedOffer(id: number) : Observable<any> {
		return this._http.get(environment.url + 'offersCtrl/getOffer/' + id)
        // .map((response:Response) => response.json())
			.catch((error:any) => Observable.throw(error))
    }

    editOffer(offer:any, id:number) : Observable<any> {
		return this._http.post(environment.url + 'offersCtrl/updateOffer/' + id, offer)
        // .map((response:Response) => response.json())
			.catch((error:any) => Observable.throw(error))
	}

}