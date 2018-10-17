import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DashboardBackOfficeService } from './dashboardBackOffice.service';
import { Question } from './question.model';

@Component({
	moduleId: module.id,
	selector: 'dashboardBackOffice',
	templateUrl: 'dashboardBackOffice.component.html',
	styleUrls: ['bodashboard.component.css']
})

export class DashboardBackOfficeComponent  { 

	constructor(private _dashboardBackOfficeService: DashboardBackOfficeService){}

	ngOnInit(){
		
	}

}