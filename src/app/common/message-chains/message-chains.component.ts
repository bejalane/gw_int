import { Component, OnInit } from '@angular/core';
import { DialogsService } from '../dialogs/dialogs.service';
import { Router } from '@angular/router';
import { SharedUtilsService } from '../../shared/services/sharedUtils.service';
import {NotifierService} from '../../shared/services/notifier.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-message-chains',
    templateUrl: './message-chains.component.html'
})
export class MessageChainsComponent implements OnInit {

    dialogs: any;
    isMobile = false;
    fadeOut = false;
    private subscriptions = new Subscription();

    constructor(
        private _dialogsService: DialogsService,
        private _router: Router,
        private _sharedUtilsService: SharedUtilsService,
        private _notifierService: NotifierService
    ) {
        this.isMobile = this._sharedUtilsService.isMobile();
    }

    ngOnInit() {
        this.getClientDialogs();
        this.subscriptions.add(
            this._notifierService.notifyObservable$.subscribe((res) => {
                    if (res.hasOwnProperty('option') && res.option === 'windowResized') {
                        this.isMobile = this._sharedUtilsService.isMobile();
                    }
                }
            )
        );
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    getClientDialogs() {
        this._dialogsService.getClientDialogs()
            .subscribe(
                data => {
                    console.log(data);
                    this.dialogs = data;
                    this.fadeOut = true;
                },
                errorData => {
                    console.log(errorData.error);
                    this._notifierService.notifyOther({option: 'generalError', data: {title: errorData.error.message}});
                    this.fadeOut = true;
                }
            );
    }

    openDialod(i) {
        this._router.navigate(['/messages/' + this.dialogs[i].companion]);
    }

}
