import {Component, ElementRef, ViewContainerRef} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SettingsClientService } from './settingsClient.service';
import { CalculatorComponent } from '../calculator/calculator.component';
import { Observable } from 'rxjs/Rx';
// import { FormsModule, NgModel } from '@angular/forms';
// import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NotifierService } from '../../shared/services/notifier.service';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import { cloneDeep } from 'lodash';

@Component({
    moduleId: module.id,
    selector: 'settings-client-page',
    templateUrl: 'settingsClient.component.html'
})

export class SettingsClientComponent  {
    areas: any[];
    user: any;
    file: File;
    avatar: string = '';
    fadeOut = false;
    resizeOptions: ResizeOptions = {
        resizeMaxHeight: 1200,
        resizeMaxWidth: 1200,
        resizeQuality: 0.7,
        resizeType: 'image/jpeg'
    };

    constructor(
        private _router: Router,
        private route: ActivatedRoute,
        private _settingsClientService: SettingsClientService,
        private _datePipe: DatePipe,
        private _notifierService: NotifierService,
        private eleRef: ElementRef,
    ) {	}

    getSettings(){
        this._settingsClientService.getSettings()
            .subscribe(
                data =>{
                    console.log(data);
                    this.user = data;
                    console.log(this.user);
                    this.fadeOut = true;
                },
                errorData => { console.log(errorData.error); }
            );
    }

    saveSettings() {
        let user = cloneDeep(this.user);
        this._notifierService.notifyOther({option: 'appLoader', turnOn: true});
        this._settingsClientService.saveSettings(user)
            .subscribe(
                data => {
                    console.log(data);
                    localStorage.setItem('gw_user_avatar', data.newUserAvatar.url);
                    this._notifierService.notifyOther({option: 'checkNewAvatar'});
                    this._notifierService.notifyOther({option: 'generalMessages', data: { title: 'settings_update_text'} });
                    this._notifierService.notifyOther({option: 'appLoader', turnOn: false});
                },
                errorData => {
                    console.log(errorData.error);
                    this._notifierService.displayErrors(errorData);
                }
            );
    }

    avatarChange(evt){
        var files = evt.target.files;
        var file = files[0];
        if (files && file) {
            var reader = new FileReader();
            reader.onload =this._handleReaderLoaded.bind(this);
            reader.readAsBinaryString(file);
        }
    }

    _handleReaderLoaded(readerEvt) {
        var binaryString = readerEvt.target.result;
//            this.avatar = 'data:image/png;base64,' + btoa(binaryString);
        this.user.avatar = 'data:image/jpeg;base64,' + btoa(binaryString);
    }

    ngOnInit() {
        this.getSettings();
    }

    selectedAvatar(imageResult: ImageResult) {
        let img_base64 = imageResult.resized
            && imageResult.resized.dataURL
            || imageResult.dataURL;
        this.user.avatar = img_base64;
    }

    removeAvatar() {
        this.user.avatar = null;
    }

    clickFire(id) {
        let btn = this.eleRef.nativeElement.querySelector(id);
        console.log(btn)
        btn.click();
    }

    turnOffSending(val) {
        switch (val) {
            case "EmailsOffer":
                this.user.account_settings.getImmediatelyOffersEmail = false;
                this.user.account_settings.getDailyOffersEmail = false;
                break;
            case "EmailsMsg":
                this.user.account_settings.getImmediatelyMessagesEmail = false;
                this.user.account_settings.getDailyMessagesEmail = false;
                break;
            case "SMS":
                this.user.account_settings.getDailyMessagesSms = false;
                this.user.account_settings.getDailyOffersSms = false;
                break;
        }
    }

}