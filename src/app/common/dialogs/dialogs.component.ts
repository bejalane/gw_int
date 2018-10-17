// import { Component } from '@angular/core';
// import { Router, ActivatedRoute, Params } from '@angular/router';
// import { DialogsService } from './dialogs.service';
// import { DatePipe } from '@angular/common';
// import { ModalService } from '../../shared/modal/modal.service';
// import { Message, MessageData } from './message.model';
// import { MomentModule } from 'angular2-moment';
// import { setTimeout } from 'timers';
// import * as $ from 'jquery';
// import * as _ from 'lodash';
//
// @Component({
//     moduleId: module.id,
//     selector: 'dialogs-page',
//     templateUrl: 'dialogs.component.html'
// })
//
// export class DialogsComponent {
//     sub: any;
//     companion: string;
//     companionName: string;
//     dialog: any;
//     message: any;
//     dialogsList: any;
//     currentDialog: any;
//     openFirst: boolean = false;
//     fadeOut = false;
//     dialogMessages: any;
//     nextPage: string;
//     dialogScrollInit: any = null;
//
//     constructor(
//         private _router: Router,
//         private route: ActivatedRoute,
//         private _dialogsService: DialogsService,
//         private _datePipe: DatePipe,
//         private _modalService: ModalService
//     ) { }
//
//     getClientDialogs() {
//         this._dialogsService.getClientDialogs()
//             .subscribe(
//             data => {
//                 console.log(data);
//                 this.dialogsList = data;
//                 for (let i = 0; i < this.dialogsList.length; i++) {
//                     var ONE_HOUR = 60 * 60 * 1000 * 24; /* ms */
//                     var x = ((Date.now() - this.dialogsList[i].updated_at) < ONE_HOUR);
//                     console.log(x);
//                 }
//                 if (this.openFirst) {
//                     this.companion = this.dialogsList[0].companion;
//                     this.currentDialog = 0;
//                     this.getDialogById(this.dialogsList[0].companion);
//                 }
//                 this.fadeOut = true;
//             },
//             errorData => { console.log(errorData.error); }
//             );
//     }
//
//     getDialogById(id) {
//         this._dialogsService.getDialogById(id, this.nextPage)
//             .subscribe(
//             data => {
//                 console.log(data);
//                 this.nextPage = (data.messages.next_page_url) ? ('?' + data.messages.next_page_url.split('?').pop()) : '';
//                 this.dialog = data;
//                 this.companionName = this.dialog.dialog.companionName;
//                 data.messages.data.reverse();
//                 this.dialogMessages = data.messages.data.concat(this.dialogMessages);
//                 console.log(this.dialogMessages);
//                 console.log(this.companion)
//                 this.fadeOut = true;
//                 setTimeout(() => { this.updateScroll() }, 50);
//             },
//             errorData => { console.log(errorData.error); }
//             );
//     }
//
//     chooseDialog(index) {
//         this.currentDialog = index;
//         console.log(this.dialogsList[index]);
//         this.companion = this.dialogsList[index].companion;
//         this.getDialogById(this.dialogsList[index].companion);
//     }
//
//     ngOnInit() {
//         this.nextPage = "";
//         this.dialogMessages = [];
//         console.log('begin dialogs...');
//         this.sub = this.route.params.subscribe(params => {
//             if (params['id']) {
//                 this.companion = params['id'];
//                 if (this.companion) {
//                     this.getDialogById(this.companion);
//                 }
//             } else {
//                 this.openFirst = true;
//             }
//         });
//         this.getClientDialogs();
//     }
//
//     sendMessage() {
//         let newMessage = new Message(this.companion, this.message, new MessageData(this._datePipe.transform(Date.now(), 'dd.MM.yyyy HH:mm:ss'), []));
//         this._dialogsService.sendMessage(this.dialog.dialog.id, newMessage)
//             .subscribe(
//             data => {
//                 console.log(data);
//                 this.getDialogById(this.companion);
//                 this.message = "";
//             },
//             errorData => { console.log(errorData.error); }
//             );
//     }
//
//     getMoreMessages() {
//         this.getDialogById(this.companion);
//     }
//
//     updateScroll() {
//
//         var element = document.getElementById("main-dialog-messages");
//         element.scrollTop = element.scrollHeight;
//
//         function dbnc(e: any) {
//             var scrollTo = null;
//             if (e.type === 'mousewheel') {
//                 scrollTo = (e.originalEvent.wheelDelta * -1);
//             }
//             else if (e.type === 'DOMMouseScroll') {
//                 scrollTo = 40 * e.originalEvent.detail;
//             }
//             if (scrollTo) {
//                 e.preventDefault();
//                 console.log($('#main-dialog-messages').scrollTop());
//                 console.log(scrollTo);
//                 if ($('#main-dialog-messages').scrollTop() === 0) {
//                    // this.getMoreMessages();
//                 }
//                 $('#main-dialog-messages').scrollTop(scrollTo + $('#main-dialog-messages').scrollTop());
//
//             }
//         }
//
//         if (!this.dialogScrollInit) {
//             $('#main-dialog-messages').on('mousewheel DOMMouseScroll', function (e) {
//                 let debouncer = _.debounce(dbnc, 10);
//                 debouncer(e);
//             });
//             this.dialogScrollInit = true;
//         }
//
//
//     }
//
//
//
//     //MODAL API
//     openModal(id: string) {
//         this._modalService.open(id);
//     }
//
//     closeModal(id: string) {
//         this._modalService.close(id);
//     }
//
//
// }