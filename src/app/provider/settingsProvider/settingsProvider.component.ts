import { Component, ViewContainerRef, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SettingsProviderService } from './settingsProvider.service';
import { Observable } from 'rxjs/Rx';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import { DatePipe } from '@angular/common';
import { NotifierService } from '../../shared/services/notifier.service';
import { cloneDeep } from 'lodash';
import {VideoUrlService} from '../../shared/services/videoUrl.service';

@Component({
    moduleId: module.id,
    selector: 'settings-provider-page',
    templateUrl: 'settingsProvider.component.html'
})

export class SettingsProviderComponent {
    areas: any[];
    user: any;
    userT: any;
    services: any[];
    file: File;
    avatar: String = '';
    updateSuccess: boolean;
    updateError: boolean;
    userSubscriptionSum: number;
    currentTab: string;
    subscriptions: any[] = [];
    currentUserPlan: any;
    resizeOptions: ResizeOptions = {
        resizeMaxHeight: 1200,
        resizeMaxWidth: 1200,
        resizeQuality: 0.7,
        resizeType: 'image/jpeg'
    };
    fadeOut = false;
    videoLink: string = '';
    portfolioVideoForDisplay: any[] = [];
    videoUrlError = false;
    mql: any;
    isFirstLogin = localStorage.getItem('gw_user_first_login') === 'true';
    currentStep = localStorage.getItem('gw_settings_step') ? parseInt(localStorage.getItem('gw_settings_step'), 10) : 0;
    settingsTabs = [
        {name: 'user', title: 'user_details'},
        {name: 'portfolio', title: 'portfolio'},
        {name: 'plans', title: 'plan'},
        {name: 'services', title: 'services'},
        {name: 'notifications', title: 'notification'},
    ];

    constructor(
        private _router: Router,
        private route: ActivatedRoute,
        private _settingsProviderService: SettingsProviderService,
        private _datePipe: DatePipe,
        private eleRef: ElementRef,
        private _notifierService: NotifierService,
        private _videoUrlService: VideoUrlService,
    ) {
        this.mql = window.matchMedia('screen and (max-width: 640px)');
    }

    getSettings() {

        Observable.forkJoin([
            this._settingsProviderService.getSettings(),
            this._settingsProviderService.getSubscriptionPlans()
        ])
            .subscribe(
                data => {
                    console.log(data);
                    this.user = data[0].user;
                    // checking because of problem that was on server
                    if (typeof this.user.account_settings.portfolio === 'string') {
                        this.user.account_settings.portfolio = [];
                    }
                    // still plans are not implemented
                    this.user.plan = 3;

                    this.services = data[0].services;
                    this.checkServices();
                    this.currentTab = this.settingsTabs[this.currentStep].name;
                    console.log(this.user);

                    this.subscriptions = data[1];
                    const userplanid = this.user.plan;
                    this.currentUserPlan = this.subscriptions.find(x => x.id === this.user.subscription);
                    console.log(this.currentUserPlan);
                    for (let i = 0; i < this.user.account_settings.portfolioVideo.length; ++i) {
                        const video = this._videoUrlService.createVideoObj(this.user.account_settings.portfolioVideo[i]);
                        this.portfolioVideoForDisplay[i] = video;
                    }
                    this.fadeOut = true;
                },
                errorData => { console.log(errorData.error); }
            );
    }

    checkServices() {
        for (let i = 0; i < this.services.length; ++i) {
            this.services[i].checked = (this.user.services.filter(e => e.id == this.services[i].id).length > 0) ? true : false;
        }
    }

    saveSettings() {
        // let user = Object.assign({}, this.user);
        const user = cloneDeep(this.user);
        this._notifierService.notifyOther({option: 'appLoader', turnOn: true});
        const portfolio = [];
        for (let img of user.account_settings.portfolio) {
            const imgForUpdate = (img.id) ? img.id : img;
            portfolio.push(imgForUpdate);
        }
        user.account_settings.portfolio = portfolio;
        console.log(user);
        this._settingsProviderService.saveSettings(user)
            .subscribe(
                data => {
                    console.log(data);
                    localStorage.setItem('gw_user_avatar', data.newUserAvatar.url);
                    this._notifierService.notifyOther({option: 'checkNewAvatar'});
                    if (this.isFirstLogin) {
                        this.currentStep++;
                        if (this.currentStep >= this.settingsTabs.length) {
                            this.isFirstLogin = false;
                            this.currentStep = 0;
                            localStorage.removeItem('gw_settings_step');
                            localStorage.setItem('gw_user_first_login', 'false');
                            this._settingsProviderService.finishProviderRegistration().subscribe(
                                data => {
                                    this._notifierService.notifyOther({option: 'generalMessages', data: { title: 'settings_update_text'} });
                                },
                                errorData => {
                                    console.log(errorData.error);
                                    this._notifierService.displayErrors(errorData);
                                }
                            );
                        } else {
                            localStorage.setItem('gw_settings_step', JSON.stringify(this.currentStep));
                            this.showTab(this.settingsTabs[this.currentStep].name);
                        }
                    } else {
                        this._notifierService.notifyOther({option: 'generalMessages', data: { title: 'settings_update_text'} });
                    }
                    this._notifierService.notifyOther({option: 'appLoader', turnOn: false});
                },
                errorData => {
                    console.log(errorData.error);
                    this._notifierService.displayErrors(errorData);
                }
            );
    }

    setSubscriptionPlan(i) {
        this._settingsProviderService.setSubscription(this.subscriptions[i].id)
            .subscribe(data => {
                this.currentUserPlan = this.subscriptions[i];
                console.log(data);
                this._notifierService.notifyOther({option: 'generalMessages', data: { title: 'subscription_updated_text'} });
            });
    }

    avatarChange(evt) {
        const files = evt.target.files;
        const file = files[0];
        console.log(file);
        if (files && file) {
            const reader = new FileReader();
            reader.onload = this._handleReaderLoaded.bind(this);
            reader.readAsBinaryString(file);
        }
    }

    _handleReaderLoaded(readerEvt) {
        const binaryString = readerEvt.target.result;
        this.avatar = 'data:image/png;base64,' + btoa(binaryString);
        this.user.avatar = this.avatar;
    }

    removeAvatar() {
        this.user.avatar = null;
    }

    addServiceToUser(service) {
        const newService = {
            id: service.id,
            name: service.name
        };
        let found = false;
        for (let i = 0; i < this.user.services.length; ++i) {
            if (this.user.services[i].id === newService.id) {
                this.user.services.splice(i, 1);
                found = true;
                break;
            }
        }
        if (!found) {
            this.user.services.push(newService);
        }
        // this.recalculateUserSubscription();
    }

    removeService(index) {
        for (let i = 0; i < this.services.length; ++i) {
            if (this.services[i].id === this.user.services[index].id) {
                this.services[i].checked = false;
            }
        }
        this.user.services.splice(index, 1);
        // this.recalculateUserSubscription();
    }

    turnOffSending(val) {
        switch (val) {
            case 'EmailsJob':
                this.user.account_settings.getImmediatelyJobsEmail = false;
                this.user.account_settings.getDailyJobsEmail = false;
                break;
            case 'EmailsMsg':
                this.user.account_settings.getImmediatelyMessagesEmail = false;
                this.user.account_settings.getDailyMessagesEmail = false;
                break;
            case 'SMSJobs':
                this.user.account_settings.getDailyJobsSms = false;
                break;
            case 'SMSMsg':
                this.user.account_settings.getDailyMessagesSms = false;
                break;
        }
    }

    changeUserPlan(val) {
        this.user.plan = val;
        console.log(this.user.plan);
        this.recalculateUserSubscription();
    }

    recalculateUserSubscription() {
        const plan = (this.user.plan === 0) ? 59 : 49;
        this.userSubscriptionSum = this.user.services.length * plan;
    }

    showTab(val) {
        console.log(val);
        this.currentTab = val;
    }

    addImageToPortfolio(evt) {
        const files = evt.target.files;
        for (let i = 0; i < files.length; ++i) {
            const file = files[i];
            if (files && file) {
                const reader = new FileReader();
                reader.onload = this._handleReaderLoadedForPortfolio.bind(this);
                reader.readAsBinaryString(file);
            }
        }
    }

    _handleReaderLoadedForPortfolio(readerEvt) {
        const binaryString = readerEvt.target.result;
        this.user.account_settings.portfolio.push('data:image/png;base64,' + btoa(binaryString));
        console.log(this.user);
    }

    selected(imageResult: ImageResult, index) {
        const img_base64 = imageResult.resized
            && imageResult.resized.dataURL
            || imageResult.dataURL;
        this.user.account_settings.portfolio.push(img_base64);
    }

    selectedAvatar(imageResult: ImageResult, index) {
        const img_base64 = imageResult.resized
            && imageResult.resized.dataURL
            || imageResult.dataURL;
        this.user.avatar = img_base64;
    }

    removeNoteImage(index) {
        this.user.account_settings.portfolio.splice(index, 1);
    }

    removeNoteVideo(index) {
        this.user.account_settings.portfolioVideo.splice(index, 1);
        this.portfolioVideoForDisplay.splice(index, 1);
        console.log('portfolio', this.user.account_settings.portfolioVideo);
        console.log('display portfolio', this.portfolioVideoForDisplay);
    }

    addNoteVideo() {
        if (this.videoLink !== '') {
            const video = this._videoUrlService.createVideoObj(this.videoLink);
            if (video) {
                this.videoUrlError = false;
                this.user.account_settings.portfolioVideo.push(this.videoLink);
                this.portfolioVideoForDisplay.push(video);
                this.videoLink = '';
            } else {
                this.videoUrlError = true;
            }
        }
    }

    removeProtfolioImage(index) {
        this.user.account_settings.portfolio.splice(index, 1);
    }

    clickFire(id) {
        const btn = this.eleRef.nativeElement.querySelector(id);
        console.log(btn);
        btn.click();
    }

    ngOnInit() {
        this.getSettings();
    }



    // api get plans plan = {id: 0, price: 59}
}
