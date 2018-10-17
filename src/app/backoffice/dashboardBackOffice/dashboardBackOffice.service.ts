import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Question } from './question.model';
import { Observable } from 'rxjs/Rx';
import { HttpClientService } from '../../shared/services/httpclient.service';
import { environment  } from '../../environment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class DashboardBackOfficeService {
	constructor(private _http: HttpClientService){}

}