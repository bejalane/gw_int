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
export class WishlistProviderService {
    constructor(
        private _http: HttpClientService,
        private _datePipe: DatePipe
    ) {}

    getWishlist(page: string): Observable<any> {
        return this._http.get(environment.url + 'favoritesCtrl/getProviderFavorites' + page)
        //  .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error));
    }

    removeFromWishlist(id: number): Observable<any> {
        return this._http.get(environment.url + 'favoritesCtrl/unsetProviderFavorites/' + id)
        //  .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error));
    }

    addToProviderWishlist(id: number): Observable<any> {
        return this._http.get(environment.url + 'favoritesCtrl/setProviderFavorites/' + id)
        //  .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error));
    }


}