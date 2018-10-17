import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment  } from '../../environment';
import { HttpClientService } from '../../shared/services/httpclient.service';
import { DatePipe } from '@angular/common';
import { NewReview } from './profile.models';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ProviderProfileService {
	constructor(
		private _http: HttpClientService,
		private _datePipe: DatePipe
	){}

	getProviderProfile(username:string) : Observable<any> {
		return this._http.get(environment.url + 'usersCtrl/getProviderInfo/' + username)
        // .map((response:Response) => response.json())
			.catch((error:any) => Observable.throw(error))
	}

	// getReviews(username:string) : Observable<any> {
    //     console.log(`${environment.url}reviewsCtrl/getProviderReviews/${username}`);
	// 	return this._http.get(`${environment.url}reviewsCtrl/getProviderReviews/${username}`)
	// 		.map((response:Response) => response.json())
	// 		.catch((error:any) => Observable.throw(error))
	// }

	// submitReview(data:NewReview, username:string) : Observable<any> {
	// 	return this._http.post(environment.url + 'reviewsCtrl/postProviderReview/' + username, data)
	// 		.map((response:Response) => response.json())
	// 		.catch((error:any) => Observable.throw(error))
	// }

	// rewriteReviews(data:any){
	// 	let reviews = [];
	// 	for (var i = 0; i < data.length; ++i) {
	// 		data[i].postDate = this._datePipe.transform(data[i].postDate, 'dd/MM/yyyy');
	//     	data[i].rateArr = this.getRateArr(data[i].rate);
	//     	reviews.push(data[i]);
	// 	}
	// 	return reviews;
	// }

	getRateArr(rate){
		rate = parseInt(rate);
		let newRate = [0,0,0,0,0];
		for (var n = newRate.length - 1; n >= 0; n--) {
	    	newRate[n] = (n > (Math.round(rate)-1)) ? 0 : 1;
	    }
	    return newRate;
	}

	getFloatRateArr(rate){
		rate = parseFloat(rate).toFixed(1);
		let newRate = [0,0,0,0,0];
		for (var n = newRate.length - 1; n >= 0; n--) {
			if((rate - n) < 0.71 && (rate - n) > 0.2 ){
				newRate[n] = 2;
			} else {
				newRate[n] = (n > (Math.round(rate)-1)) ? 0 : 1;	
			}
	    }
	    let rateObj = {
	    	rating: rate,
	    	rate: newRate
	    }
	    return rateObj;
	}

	getNewReview(){
		let newReview: NewReview = {
			text: "",
			rate: 0
		}
		return newReview;
	}

	getAllPortfolio(username: string): Observable<any> {
		return this._http.get(environment.url + 'usersCtrl/getProviderPortfolio/' + username)
        // .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error));
	}
}