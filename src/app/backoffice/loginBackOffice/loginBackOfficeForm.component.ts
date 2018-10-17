import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginBackOfficeService } from './loginBackOffice.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'loginBackOfficeformTmpl.component.html'
})

export class LoginBackOfficeFormComponent  { 
	authForm: FormGroup;
	token: any = "";

	constructor(
		private fb: FormBuilder,
		private _router: Router,
		private _loginBackOfficeService: LoginBackOfficeService
		) {
		// use FormBuilder to create a form group
		this.authForm = this.fb.group({
			'name': ['', Validators.required],
			// 'email': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      		'password': ['', Validators.required]
		});
	}

	submitForm() {
		let credentials = this.authForm.value;
		this._loginBackOfficeService.loginBackOffice(credentials)
			.subscribe(data =>{ 
				this.token = data;
				if(this.token.token){
					Cookie.set('quiz_token', this.token.token);
					this._router.navigate(['/bodashboard']);
				} else {
					alert('Sorry, the credentials you have entered are not right. Try again.')
				}
			});
	}
}