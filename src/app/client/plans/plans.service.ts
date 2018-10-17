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
export class PlansService {
    constructor(
        private _http: HttpClientService,
        private _datePipe: DatePipe
    ) { }

    getClientPlans(): Observable<any> {
        return this._http.get(environment.url + 'planCtrl/getClientPlans')
           // .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error))
    }

    getPlanById(id: number): Observable<any> {
        return this._http.get(environment.url + 'planCtrl/getClientPlan/' + id)
           // .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error))
    }

    customCloseJob(id: number, data: any): Observable<any> {
        return this._http.post(environment.url + 'jobsCtrl/customCloseJob/' + id, data)
           // .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error))
    }

    editPlan(id: number, plan: any) {
        return this._http.put(environment.url + 'planCtrl/updateClientPlan/' + id, plan)
            // .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error))
    }
    
}