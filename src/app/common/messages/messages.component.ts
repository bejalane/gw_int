import {Component, OnInit, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { DialogsService } from '../dialogs/dialogs.service';
import { Message, MessageData } from '../dialogs/message.model';
import { DatePipe } from '@angular/common';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import * as $ from 'jquery';
import { SharedUtilsService } from '../../shared/services/sharedUtils.service';
import {NotifierService} from '../../shared/services/notifier.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html'
})
export class MessagesComponent implements OnInit {

    companionUsername: any;
    dialog: any;
    messages: any;
    error = false;
    newMessage: string;
    attaches = [];
    timezone: any;
    userAvatar: any;
    userName: any;
    messageAttachments = false;
    isMobile = false;
    resizeOptions: ResizeOptions = {
        resizeMaxHeight: 1200,
        resizeMaxWidth: 1200,
        resizeQuality: 0.7,
        resizeType: 'image/jpeg'
    };
    fadeOut = false;
    private subscriptions = new Subscription();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private eleRef: ElementRef,
        private _dialogsService: DialogsService,
        private _datePipe: DatePipe,
        private _sharedUtilsService: SharedUtilsService,
        private _notifierService: NotifierService
    ) {
        this.isMobile = this._sharedUtilsService.isMobile();
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.companionUsername = params['companion'];
        });
        this.getDialogWithCompanion(this.companionUsername);
        this.timezone = new Date().getTimezoneOffset();
        this.userAvatar = localStorage.getItem('gw_user_avatar');
        this.userName = localStorage.getItem('gw_user_name') + ' ' + localStorage.getItem('gw_user_last_name');
        console.log( this.userName );
        $('body').addClass('dialogs');

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
        $('body').removeClass('dialogs');
    }

    getDialogWithCompanion(companion) {
        this._dialogsService.getDialogByCompanion(companion)
            .subscribe(
                data => {
                    console.log(data);
                    this.dialog = data.dialog;
                    if (data.messages) {
                        this.messages = data.messages;
                        this.setMessagesClasses(this.messages);
                    } else {
                        this.messages = [];
                    }
                    setTimeout(() => {
                        $('html, body').animate({ scrollTop: $(document).height() }, 0);
                        this.fadeOut = true;
                        }, 350);
                },
                errorData => {
                    console.log(errorData.error);
                    this._notifierService.displayErrors(errorData);
                }
            );
    }

    setMessagesClasses(messages) {
        for (let i = 0; i < messages.length; i++) {
            this.setMessageClass(messages[i]);
        }
    }

    setMessageClass(message) {
        if (message.user1Username === this.companionUsername) {
            message.class = 'left';
        } else {
            message.class = 'right';
        }
    }

    selected(imageResult: ImageResult) {
        const img_base64 = imageResult.resized
            && imageResult.resized.dataURL
            || imageResult.dataURL;
        this.attaches = [img_base64];
    }

    removeImage(index) {
        this.attaches.splice(index);
    }

    clickFire(i) {
        const btn = this.eleRef.nativeElement.querySelector('#uploadFilesBtn');
        btn.click();
    }

    sendMessage() {
        const newMessage = new Message(this.companionUsername, this.newMessage, new MessageData(this.attaches));
        console.log(newMessage);
        this._notifierService.notifyOther({option: 'appLoader', turnOn: true});
        this._dialogsService.sendMessage(this.dialog.id, newMessage)
            .subscribe(
                data => {
                    console.log(data);
                    if (data.dialog) {
                        this.dialog.id = data.dialog.id;
                    }
                    newMessage.created_at = data.message.created_at;
                    newMessage.data.images = data.message.data.images;
                    this.messages.push(newMessage);
                    this.newMessage = '';
                    this.attaches = [];
                    this._notifierService.notifyOther({option: 'appLoader', turnOn: false});
                    $('html, body').animate({ scrollTop: $(document).height() }, 1000);
                },
                errorData => {
                    console.log(errorData.error);
                    this._notifierService.displayErrors(errorData);
                }
            );
    }

    openMessageAttachments() {
        this.messageAttachments = !this.messageAttachments;
    }

    // updateScroll() {
    //
    //     var element = document.getElementById("main-dialog-messages");
    //     console.log(element);
    //     element.scrollTop = element.scrollHeight;
    //     this.fadeOut = true;
    //
    //     $('#main-dialog-messages').on('mousewheel DOMMouseScroll', function (e) {
    //         var scrollTo = null;
    //         if (e.type === 'mousewheel') {
    //             scrollTo = (e.originalEvent.wheelDelta * -1);
    //         }
    //         else if (e.type === 'DOMMouseScroll') {
    //             scrollTo = 40 * e.originalEvent.detail;
    //         }
    //         if (scrollTo) {
    //             e.preventDefault();
    //             console.log($('#main-dialog-messages').scrollTop());
    //             console.log(scrollTo);
    //             if ($('#main-dialog-messages').scrollTop() === 0) {
    //                 // this.getMoreMessages();
    //             }
    //             $('#main-dialog-messages').scrollTop(scrollTo + $('#main-dialog-messages').scrollTop());
    //
    //         }
    //     });
    //
    // }
}
