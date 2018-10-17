import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment  } from '../../environment';
import { HttpClientService } from './httpclient.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class InfoDataService {
    constructor(
        private _http: Http
    ) {}

    getAreas(): Observable<any> {
        const areas: any = JSON.parse(sessionStorage.getItem('areas'));

        if (areas != null) {
            return Observable.of(areas);
        }

        return this._http.get(environment.url + 'informCtrl/getAreas')
            .map((response: Response) => {
                const areas: any = response.json();
                sessionStorage.setItem('areas', JSON.stringify(areas));
                return areas || [];
            })
            .catch((error: any) => Observable.throw(error));

    }

}