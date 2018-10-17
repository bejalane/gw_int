import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environment';
import { HttpClientService } from '../../shared/services/httpclient.service';
import { DatePipe } from '@angular/common';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class JobClientService {
    constructor(
        private _http: HttpClientService,
        private _datePipe: DatePipe
    ) { }

    getJob(id: number): Observable<any> {
        return this._http.get(environment.url + 'jobsCtrl/getJobForClient/' + id)
           // .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error));
    }

    getOffers(id: number, page: string): Observable<any> {
        return this._http.get(environment.url + 'offersCtrl/getOffersByJob/' + id + page)
           // .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error));
    }

    getAreas(): Observable<any> {
        return this._http.get(environment.url + 'informCtrl/getAreas')
           // .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error));
    }

    chooseAnOffer(offer: any): Observable<any> {
        return this._http.post(environment.url + 'jobsCtrl/chooseOffer', offer)
           // .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error));
    }

    addToWishlist(offerId: number): Observable<any> {
        return this._http.get(environment.url + 'favoritesCtrl/setClientFavorites/' + offerId)
           // .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error));
    }

    editJob(id: number, data: any): Observable<any> {
        return this._http.post(environment.url + 'jobsCtrl/updateJob/' + id, data)
           // .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error));
    }

    cancelJob(id: number): Observable<any> {
        return this._http.get(environment.url + 'jobsCtrl/cancelJob/' + id)
           // .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error));
    }

    getAllPortfolio(username: string): Observable<any> {
        return this._http.get(environment.url + 'usersCtrl/getProviderPortfolio/' + username)
           // .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error));
    }

    reopenJob(id: number): Observable<any> {
        return this._http.get(environment.url + 'jobsCtrl/reopenJob/' + id)
           // .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error));
    }

}