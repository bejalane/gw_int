import {Component, HostListener} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
// import { LoginFormComponent } from '../../login/loginForm.component';
// import { RegistrationComponent } from '../../registration/registration.component';
import { NotifierService } from '../../shared/services/notifier.service';
import { Subscription } from 'rxjs/Subscription';
import { LoginService } from '../../login/login.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from '../../shared/modal/modal.service';
// import { Subject } from 'rxjs/Subject';
// import { lang } from 'moment';
import { LanguageClassService } from '../../shared/services/languageClass.service';
import { SharedUtilsService } from '../../shared/services/sharedUtils.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TopMenuService} from './topMenu.service';


@Component({
    moduleId: module.id,
    selector: 'top-menu',
    templateUrl: 'topMenu.component.html',
    animations: [
        trigger('popOverState', [
            state('show', style({
                opacity: 1,
                left: '0',
                width: '100%',
                overflow: 'hidden'
            })),
            state('hide', style({
                opacity: 0,
                left: '100%',
                width: 0,
                overflow: 'hidden'
            })),
            transition('show => hide', [
                animate('0.15s ease-in')
            ]),
            transition('hide => show', [
                animate('0.15s ease-in')
            ])
        ])
    ]
})

export class TopMenuComponent {
    showLogin: boolean = false;
    showSignUp: boolean = false;
    userName: string;
    userRole: string;
    userAvatar: string;
    genError: any = {};
    errorsArray = false;
    turnOnLoader = false;
    genMessage: any;
    currentLanguageName: string = '';
    expandTopMenu = true;
    isMobile = false;
    private subscriptions = new Subscription();
    isUserLoggedIn: Boolean;
    state: string = 'hide';
    contactForm: FormGroup;
    supportForm: FormGroup;

    @HostListener('window:resize') onResize() {
        this._notifierService.notifyOther({ option: 'windowResized', value: 'true' });
        this.setIsMobile();
    }

    constructor(
        private _router: Router,
        private _notifierService: NotifierService,
        private _loginService: LoginService,
        private translate: TranslateService,
        private _modalService: ModalService,
        private _languageClassService: LanguageClassService,
        private _sharedUtilsService: SharedUtilsService,
        private _topMenuService: TopMenuService,
        private fb: FormBuilder
    ) {
        this.currentLanguageName = (Cookie.get('userLanguage')) ? Cookie.get('userLanguage') : 'en_US';
        console.log(this.currentLanguageName);
        this.setIsMobile();
    }

    switchLanguage(language: string) {
        Cookie.set('userLanguage', language); // need change to api
        this.translate.use(language);
        this._languageClassService.setBodyClass(language);
        this.currentLanguageName = language;
    }

    redirect(pagename: string) {
        this._router.navigate(['/' + pagename]);
    }

    ngOnInit() {
        // if (sessionStorage.getItem('refreshed') !== 'true') {
        //     setTimeout(() => { this.refresh(); }, 500);
        // }
        this.checkMenu();
        this.subscriptions.add(this._notifierService.notifyObservable$.subscribe((res) => {
            if (res.hasOwnProperty('option') && res.option === 'checkLoggedUser') {
                this.userName = localStorage.getItem('gw_user_name');
                this.isUserLoggedIn = this._loginService.isUserLoggedIn();
                this.checkMenu();
                this.createForms();
                if (!this.isUserLoggedIn) {
                    this.redirect('');
                } else {
                    const isFirstLogin = localStorage.getItem('gw_user_first_login') === 'true';
                    const userRole = localStorage.getItem('gw_user_role');
                    if (isFirstLogin && userRole === 'provider') {
                        this.redirect('providerSettings');
                    }
                }
            } else if (res.hasOwnProperty('option') && res.option === 'checkNewAvatar') {
                this.userAvatar = localStorage.getItem('gw_user_avatar');
                this.checkMenu();
            } else if (res.hasOwnProperty('option') && res.option === 'generalError') {
                console.log(res);
                this.genError = res.data;
                if (res.data.text instanceof Array) {
                    this.errorsArray = true;
                }
                this.openModal('general-errors-popup');
            } else if (res.hasOwnProperty('option') && res.option === 'generalMessages') {
                this.genMessage = res.data;
                this.openModal('general-messages-popup');
            } else if (res.hasOwnProperty('option') && res.option === 'appLoader') {
                this.turnOnLoader = res.turnOn;
            } else if (res.hasOwnProperty('option') && res.option === 'showSignUp') {
                this.showSignUp = true;
                this.showLogin = false;
            } else if (res.hasOwnProperty('option') && res.option === 'openSupportForm') {
                this.openModal('supportForm');
            } else if (res.hasOwnProperty('option') && res.option === 'openContactForm') {
                this.openModal('contactForm');
            }
        }));
        this.isUserLoggedIn = this._loginService.isUserLoggedIn();

        this.createForms();

        // this.checkNewAvatar = this._notifierService.notifyObservable$.subscribe((res) => {
        //     if (res.hasOwnProperty('option') && res.option === 'checkNewAvatar') {
        //         this.userAvatar = Cookie.get('gw_user_avatar');
        //         this.checkMenu();
        //     }
        // });

        // this.generalErrors = this._notifierService.notifyObservable$.subscribe((res) => {
        //     if (res.hasOwnProperty('option') && res.option === 'generalError') {
        //         console.log(res);
        //         this.genError = res.data;
        //         if(res.data.text instanceof Array){
        //             this.errorsArray = true;
        //         }
        //         this.openModal('general-errors-popup');
        //     }
        // });

        // this.generalMessages = this._notifierService.notifyObservable$.subscribe((res) => {
        //     if (res.hasOwnProperty('option') && res.option === 'generalMessages') {
        //         this.genMessage = res.data;
        //         this.openModal('general-messages-popup');
        //     }
        // });

        // this.manageLoader = this._notifierService.notifyObservable$.subscribe((res) => {
        //     if (res.hasOwnProperty('option') && res.option === 'appLoader') {
        //         this.turnOnLoader = res.turnOn;
        //     }
        // });

        // this.showSignUpPopup = this._notifierService.notifyObservable$.subscribe((res) => {
        //     if (res.hasOwnProperty('option') && res.option === 'showSignUp') {
        //         this.showSignUp = true;
        //         this.showLogin = false;
        //     }
        // });
    }

    checkMenu() {
        if (localStorage.getItem('gw_user_name')) {
            this.userName = localStorage.getItem('gw_user_name');
        }

        if (localStorage.getItem('gw_user_avatar')) {
            this.userAvatar = localStorage.getItem('gw_user_avatar');
            console.log(this.userAvatar);
        }

        if (localStorage.getItem('gw_user_role')) {
            this.userRole = localStorage.getItem('gw_user_role');
        } else {
            this.userRole = 'guest';
        }
        console.log(this.userRole);
    }

    logout() {
        this.subscriptions.add(this._loginService.logout()
            .subscribe(
                data => {
                    console.log(data);
                    this._sharedUtilsService.logoutProcedure();
                },
                errorData => {
                    console.log(errorData.error);
                    this._sharedUtilsService.logoutProcedure();
                }
            ));
    }

    // refresh() {
    //     this.subscriptions.add(this._loginService.refreshauth()
    //         .subscribe(
    //             data => {
    //                 console.log(data);
    //                 Cookie.set('gw_token', data.token);
    //                 sessionStorage.setItem('refreshed', 'true');
    //             },
    //             errorData => {
    //                 console.log(errorData.error);
    //                 SharedUtilsService.logoutRemoveCookies();
    //                 this.showLogin = true;
    //             }
    //         ));
    // }

    // logoutRemoveCookies() {
    //     Cookie.delete('gw_token');
    //     Cookie.delete('gw_user_name');
    //     Cookie.delete('gw_user_last_name');
    //     Cookie.delete('gw_user_avatar');
    //     Cookie.delete('gw_user_role');
    //     Cookie.delete('gw_user_username');
    //     Cookie.delete('gw_token_expired');
    //     localStorage.removeItem('currentPlanId');
    // }
    //
    // logoutProcedure() {
    //     this.logoutRemoveCookies();
    //     this._notifierService.notifyOther({ option: 'checkLoggedUser', value: 'User Logged In' });
    //     this.checkMenu();
    //     this.redirect('');
    // }

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

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    openMobileMenu() {
        this.expandTopMenu = !this.expandTopMenu;
        this.state = this.expandTopMenu ? 'show' : 'hide';
        console.log(this.state);
    }

    // MODAL API
    openModal(id: string) {
        this._modalService.open(id);
    }

    closeModal(id: string) {
        this._modalService.close(id);
    }

    closeMobileMenu() {
        if (this.isMobile) {
            this.expandTopMenu = false;
            this.state = this.expandTopMenu ? 'show' : 'hide';
        }
    }

    setIsMobile() {
        this.isMobile = this._sharedUtilsService.isMobile();
        this.expandTopMenu = !this.isMobile;
    }


    createForms() {
        const formFields = {
            name: null,
            email: null,
            subject: ['', Validators.required],
            message: ['', Validators.required]
        };

        if (!this.isUserLoggedIn) {
            formFields.name = ['', Validators.required];
            formFields.email = ['', Validators.compose([Validators.required, Validators.email])];
        }

        this.contactForm = this.fb.group(formFields);
        this.supportForm = this.fb.group(formFields);
    }

    sendForm(form: string) {
        if (this.isUserLoggedIn) {
            delete this[form].value.name;
            delete this[form].value.email;
        }
        this._notifierService.notifyOther({option: 'appLoader', turnOn: true});
        this._topMenuService.sendForm(form, this[form].value)
            .subscribe( data => {
                    console.log(data);
                    this._notifierService.notifyOther({option: 'appLoader', turnOn: false});
                    this[form].reset();
                    this.closeModal(form);
                    this._notifierService.notifyOther({
                        option: 'generalMessages',
                        data: {title: 'success', text: 'your_message_has_been_sent'}
                    });
                },
                errorData => {
                    console.log(errorData.error);
                    this._notifierService.displayErrors(errorData);
                });
    }
}
