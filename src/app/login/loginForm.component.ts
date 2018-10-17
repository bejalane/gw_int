import { Component, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { NotifierService } from '../shared/services/notifier.service';
import { AuthService } from 'angular4-social-login';
import { SocialUser } from 'angular4-social-login';
import { FacebookLoginProvider } from 'angular4-social-login';
import { ModalService } from '../shared/modal/modal.service';


@Component({
    moduleId: module.id,
    selector: 'login-popup',
    templateUrl: 'loginformTmpl.component.html'
})

export class LoginFormComponent {
    @Output() closeForm = new EventEmitter<boolean>();
    @Output() createAccount = new EventEmitter<boolean>();
    authForm: FormGroup;
    forgotPassword: FormGroup;
    token: any = "";
    userResponse: any;
    user: SocialUser;
    showForgotPaswordForm = false;

    constructor(
        private fb: FormBuilder,
        private _router: Router,
        private _loginService: LoginService,
        private _notifierService: NotifierService,
        private authService: AuthService,
        private _modalService: ModalService
    ) {
        // use FormBuilder to create a form group
        this.authForm = this.fb.group({
            'email': ['', Validators.compose([Validators.email, Validators.required])],
            'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        });

        this.forgotPassword = this.fb.group({
            'email': ['', Validators.compose([Validators.email, Validators.required])]
        });
    }

    ngOnInit() {
        this.authService.authState.subscribe((user) => {
            this.user = user;
            console.log(this.user);
        });
    }

    signInWithFB(): void {
        let self = this;
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
            function(data){
                let dataToSend = {
                    socialAccount: data,
                    role: ''
                };
                self._loginService.facebookLogin(dataToSend)
                    .subscribe(
                        data => {
                            console.log(data);
                            self.loginUser(data);
                        },
                        errorData => {
                            console.log(errorData.error);
                            self._notifierService.notifyOther({option: 'generalError', data: {title: errorData.error.message}});
                        }
                    );
            }
        );
    }

    signOut(): void {
        this.authService.signOut();
    }

    submitForm() {
        const credentials = this.authForm.value;
        console.log(credentials);
        this._loginService.login(credentials)
            .subscribe(
                data => {
                    console.log(data);
                    this.loginUser(data);
                },
                errorData => {
                    console.log(errorData.error);
                    this.showLoginErrorPopup();
                }
            );
    }

    requestPassword() {
        console.log(this.forgotPassword.value);
        this._loginService.sendResetPasswordReqeust(this.forgotPassword.value)
            .subscribe(data => {console.log(data);});
    }

    closePopup() {
        this.closeForm.emit(false);
    }

    createAccountRedirect() {
        this.createAccount.emit(true);
    }

    loginUser(data) {
        this.userResponse = data;
        if (this.userResponse.token) {
            localStorage.setItem('gw_token', this.userResponse.token);
            localStorage.setItem('gw_user_name', this.userResponse.user.name);
            localStorage.setItem('gw_user_last_name', this.userResponse.user.lastName);
            localStorage.setItem('gw_user_avatar', this.userResponse.user.avatar.url);
            localStorage.setItem('gw_user_role', this.userResponse.user.roleName);
            localStorage.setItem('gw_user_username', this.userResponse.user.username);
            localStorage.setItem('gw_user_first_login', this.userResponse.user.firstLogin);
            // this._router.navigate(['/home']);
            this.closePopup();
            this._notifierService.notifyOther({option: 'checkLoggedUser', value: 'User Logged In'});
        } else {
            console.log(data);
            this.showLoginErrorPopup();
        }
    }

    showLoginErrorPopup() {
        this._modalService.open('login-error');
    }

    closeLoginPopupError() {
        this._modalService.close('login-error');
    }

    showSingInPopup() {
        this._modalService.close('login-error');
        this._notifierService.notifyOther({option: 'showSignUp', value: 'true'});
    }
}
