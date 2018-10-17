import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HomeService } from './home.service';
// import { CalculatorComponent } from '../../client/calculator/calculator.component';
// import { LoginFormComponent } from '../../login/loginForm.component';
// import { RegistrationComponent } from '../../registration/registration.component';
// import { FormsModule, NgModel } from '@angular/forms';
// import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { NotifierService } from '../../shared/services/notifier.service';
import { LoginService } from '../../login/login.service';

@Component({
    moduleId: module.id,
    selector: 'home-page',
    templateUrl: 'home.component.html'
})

export class HomeComponent {
    authForm: FormGroup;
    token: any = "";
    showLogin: boolean = false;
    showSignUp: boolean = false;
    fadeOut = false;
    isUserLoggedIn: boolean = false;
    userRole: string;
    showClientTab = true;
    showProviderTab = false;
    private subscriptions = new Subscription();


    constructor(
        private fb: FormBuilder,
        private _router: Router,
        private _homeService: HomeService,
        private _datePipe: DatePipe,
        private translate: TranslateService,
        private _notifierService: NotifierService,
        private _loginService: LoginService,
        private route: ActivatedRoute,

    ) {
        // use FormBuilder to create a form group
        this.authForm = this.fb.group({
            'email': ['', Validators.compose([Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        });
    }

    handleCloseSignupForm(e) {
        this.showSignUp = e;
    }

    handleCloseLoginForm(e) {
        this.showLogin = e;
    }

    handleCreateAccount(e) {
        this.showLogin = false;
        this.showSignUp = true;
    }

    ngOnInit() {
        this.fadeOut = true;
        this.subscriptions.add(this._notifierService.notifyObservable$.subscribe((res) => {
            if (res.hasOwnProperty('option') && res.option === 'showSignUp') {
                this.showLogin = false;
            } else if (res.hasOwnProperty('option') && res.option === 'checkLoggedUser') {
                this.isUserLoggedIn = this._loginService.isUserLoggedIn();
                this.userRole = localStorage.getItem('gw_user_role');
            }
        }));
        this.subscriptions.add(
            this.route.queryParams
                .filter(params => params.confirmed)
                .subscribe(params => {
                    if (params.confirmed) {
                        this._notifierService.notifyOther({ option: 'generalMessages', data: { title: 'congratulations', text: 'successfull_confirmation_account_text' } });
                        this._router.navigate(['']);
                    }
                })
        );

        this.isUserLoggedIn = this._loginService.isUserLoggedIn();
        this.userRole = localStorage.getItem('gw_user_role');
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    showTab(tab: string) {
        // if (tab === 'client'){
        //     this.showClientTab = true;
        //     this.showProviderTab = false;
        // } else if (tab === 'provider'){
        //     this.showClientTab = false;
        //     this.showProviderTab = true;
        // }

        this.showClientTab = (tab === 'client');
        this.showProviderTab = (tab === 'provider');
    }


}