import { Component, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { RegistrationService } from './registration.service';
import { AuthService } from 'angular4-social-login';
import { SocialUser } from 'angular4-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angular4-social-login';
import { NotifierService } from '../shared/services/notifier.service';
// import {SharedUtilsService} from '../shared/services/sharedUtils.service';

@Component({
    moduleId: module.id,
    selector: 'signup-popup',
    templateUrl: 'registration.component.html'
})

export class RegistrationComponent {
    @Output() closeForm = new EventEmitter<boolean>();
    authForm: FormGroup;
    token: any = '';
    userType: string = 'client';
    userResponse: any;
    socialUser: SocialUser;
    triggerFBdata = false;
    successRegistration = false;

    constructor(
        private fb: FormBuilder,
        private _router: Router,
        private _registrationService: RegistrationService,
        private authService: AuthService,
        private _notifierService: NotifierService,
    ) {
        // use FormBuilder to create a form group
        this.authForm = this.fb.group({
            'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            'lastName': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            'username': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            'email': ['', Validators.compose([Validators.required, Validators.email])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            'password_confirmation': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        }, {
            validator: [
                this.confirmPassword,
                this.usernameValidation
            ]
        });
    }

    ngOnInit() {
        // this.authService.authState.subscribe((user) => {
        //     this.socialUser = user;
        //     if(user){
        //        if(this.triggerFBdata){
        //         this.submitForm(true);
        //        }
        //     }
        // });
    }

    // confirm password validation
    confirmPassword (control) {
        const password = control.get('password').value;
        const confirmPassword = control.get('password_confirmation').value;
        if (password !== confirmPassword) {
            control.get('password_confirmation').setErrors( { confirmPassword : true } );
        }
    }

    usernameValidation (control) {
        const username = control.get('username').value;
        const regExp = /^[a-z0-9]+$/i;
        if (!regExp.test(username)) {
            control.get('username').setErrors({ invalidUsername: true });
        }
    }

    submitForm(social?: boolean) {
        let credentials;
        if (social) {
            credentials = {
                name: this.socialUser.firstName,
                lastName: this.socialUser.lastName,
                email: this.socialUser.email,
                password: this.socialUser.id,
                password_confirmation: this.socialUser.id,
                avatar: this.socialUser.photoUrl,
                facebookAccount: true
            };
        } else {
            credentials = this.authForm.value;

            if (credentials.password !== credentials.password_confirmation) {
                // throw ui error;
                console.log('didnt match');
                return false;
            }
        }
        this.triggerFBdata = false;
        this._registrationService.register(credentials, this.userType)
            .subscribe(
                (data: any) => {
                    console.log(data);
                    if ( data.message === 'success') {
                        this.successRegistration = true;
                    }
                },
                errorData => {
                    console.log(errorData.error);
                    this._notifierService.displayErrors(errorData);
                }
            );
    }

    signUpWithFB(): void {
        this.triggerFBdata = true;
        const self = this;
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
            function (data) {
                let dataToSend = {
                    socialAccount: data,
                    role: self.userType
                };
                self._registrationService.facebookSingUp(dataToSend)
                    .subscribe(
                        data => {
                            console.log(data);
                            self.loginUser(data);
                        },
                        errorData => {
                            console.log(errorData.error);
                            self._notifierService.displayErrors(errorData);
                        }
                    );
            }
        );
    }

    setUserType(type: string) {
        this.userType = type;
    }

    closePopup() {
        this.closeForm.emit(false);
    }

    loginUser(data) {
        this.userResponse = data;
        if (this.userResponse.token) {
            localStorage.setItem('gw_token', this.userResponse.token);
            localStorage.setItem('gw_user_name', this.userResponse.user.name);
            localStorage.setItem('gw_user_last_name', this.userResponse.user.lastName);
            localStorage.setItem('gw_user_avatar', this.userResponse.user.avatar.url);
            localStorage.setItem('gw_user_role', this.userResponse.user.roleName);
            this.closePopup();
            this._notifierService.notifyOther({option: 'checkLoggedUser', value: 'User Logged In'});
        } else {
            alert('Sorry, something went wrong. Try again.');
        }

    }
}