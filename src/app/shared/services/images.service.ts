import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environment';
import { HttpClientService } from '../services/httpclient.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ImagesService {

    constructor(
        private _http: HttpClientService,
    ) { }

    getImage(id: number, size?: any): Observable<any> {
        let url = (size) ? `${environment.url}imagesCtrl/getImage/${id}/${size}` : `${environment.url}imagesCtrl/getImage/${id}`;
        return this._http.get(url)
        // .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error))
    }

}
