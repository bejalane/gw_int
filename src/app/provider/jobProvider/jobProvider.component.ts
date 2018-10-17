import { Component, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { JobProviderService } from './jobProvider.service';
import { InfoDataService } from '../../shared/services/infoData.service';
import { Observable } from 'rxjs/Rx';
import { DatePipe } from '@angular/common';
import { JobModel } from './job.model';
import { NotifierService } from '../../shared/services/notifier.service';
import { ModalService } from '../../shared/modal/modal.service';
import {ImagesService} from '../../shared/services/images.service';
import {WishlistProviderService} from '../wishlistProvider/wishlistProvider.service';

@Component({
    moduleId: module.id,
    selector: 'job-provider-page',
    templateUrl: 'jobProvider.component.html'
})

export class JobProviderComponent {
    areas: any[];
    job: JobModel;
    offersRange: any;
    jobId: number;
    sub: any;
    newOffer: any;
    start: boolean;
    postedOffer: any;
    offerToEdit: any;
    imagesForGallery: any[] = [];
    showImageGallery = false;
    indexForGallery: number;
    jobImages: any[] = [];
    fadeOut = false;
    sendOfferForm: FormGroup;
    editOfferForm: FormGroup;

    constructor(
        private _router: Router,
        private route: ActivatedRoute,
        private _jobProviderService: JobProviderService,
        private _wishlistProviderService: WishlistProviderService,
        private _datePipe: DatePipe,
        private _infoDataService: InfoDataService,
        private _notifierService: NotifierService,
        private _modalService: ModalService,
        private _imagesService: ImagesService
    ) {
        this.sendOfferForm = new FormGroup ({
            'price': new FormControl('', [
                Validators.required,
                Validators.pattern('^\\d+$'),
            ]),
            'offerText': new FormControl('', Validators.required)
        });
        this.editOfferForm = new FormGroup ({
            'price': new FormControl('', [
                Validators.required,
                Validators.pattern('^\\d+$'),
            ]),
            'offerText': new FormControl('', Validators.required)
        });
    }

    getJob() {
        this.start = false;
        Observable.forkJoin([
            this._jobProviderService.getJob(this.jobId),
            this._infoDataService.getAreas()
        ])
            .subscribe(
                data => {
                    console.log(data);
                    this.job = data[0].job;
                    this.job.images = (this.job.images) ? this.job.images : [];
                    this.newOffer.text = data[0].offerTemplate;
                    this.offersRange = data[0].offersRange;
                    const postedOffer = data[0].postedOffer;
                    if (postedOffer) {
                        this.getPostedOffer(postedOffer);
                    }
                    this.areas = data[1];
                    console.log(this.areas);
                    const searchArea = this.areas.find(o => o.id === this.job.areaId);
                    this.job.area = searchArea.name;
                    this.start = true;
                    this.fadeOut = true;
                },
                errorData => {
                    console.log(errorData.error);
                    this._notifierService.notifyOther({option: 'generalError', data: {title: errorData.error.message}});
                    this.fadeOut = true;
                }
            );
    }

    parseImages() {
        this.job.images = JSON.parse("[" + this.job.images + "]");
        this.start = true;
    }

    goToJob(id) {
        this._router.navigate(['/job/' + id]);
    }

    sendOffer() {
        this._notifierService.notifyOther({option: 'appLoader', turnOn: true});
        this._jobProviderService.sendOffer(this.newOffer, this.jobId)
            .subscribe(
                data => {
                    console.log(data);
                    this.getJob();
                    this._notifierService.notifyOther({ option: 'generalMessages', data: { title: 'success', text: 'your_offer_has_been_sent_succesfully' } });
                    this._notifierService.notifyOther({option: 'appLoader', turnOn: false});
                },
                errorData => {
                    console.log(errorData.error);
                    this._notifierService.displayErrors(errorData);
                }
            );
    }

    addToWishlist() {
        this._wishlistProviderService.addToProviderWishlist(this.jobId)
            .subscribe(
                data => {
                    console.log(data);
                    this.job.inFavorites = true;
                },
                errorData => { console.log(errorData.error); }
            );
    }

    removeFromWishlist() {
        this._wishlistProviderService.removeFromWishlist(this.jobId)
            .subscribe(
                data => {
                    console.log(data);
                    this.job.inFavorites = false;
                },
                errorData => { console.log(errorData.error); }
            );
    }

    getPostedOffer(id) {
        this._jobProviderService.getPostedOffer(id)
            .subscribe(
                data => {
                    console.log(data);
                    this.postedOffer = data;
                },
                errorData => { console.log(errorData.error); }
            );
    }

    editOffer(){
        this.offerToEdit = {
            price: this.postedOffer.price,
            text: this.postedOffer.text
        };
        this.openModal('edit-offer');
    }

    updateOffer() {
        this._notifierService.notifyOther({option: 'appLoader', turnOn: true});
        this._jobProviderService.editOffer(this.offerToEdit, this.postedOffer.id)
            .subscribe(
                data => {
                    console.log(data);
                    this.postedOffer.price = this.offerToEdit.price;
                    this.postedOffer.text = this.offerToEdit.text;
                    this._notifierService.notifyOther({ option: 'generalMessages', data: { title: 'success', text: 'your_offer_has_been_changed' } });
                    this._notifierService.notifyOther({option: 'appLoader', turnOn: false});
                },
                errorData => {
                    console.log(errorData.error);
                    this._notifierService.displayErrors(errorData);
                }
            );
        this.closeModal('edit-offer');
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.jobId = parseInt(params['id']);
        });
        this.getJob();
        this.newOffer = {
            price: '',
            text: ''
        };
    }

    openGallery(index) {
        // this.postedJob.images[index];
        if (this.jobImages.length) {
            this.openImageGallery(this.jobImages, index);
        } else {
            let getImagesArray = [];
            for (let value of this.job.images) {
                console.log(value);
                let req = this._imagesService.getImage(value.id);
                getImagesArray.push(req);
            }
            Observable.forkJoin(getImagesArray)
                .subscribe((data: any) => {
                    console.log(data);
                    this.jobImages = [];
                    for (let i = 0; i < data.length; i++) {
                        this.jobImages.push(data[i].image);
                    }
                    this.openImageGallery(this.jobImages, index);
                });
        }
    }

    openImageGallery(images, index) {
        if (images.length) {
            this.imagesForGallery = images;
            this.indexForGallery = index;
            this.showImageGallery = true;
        }
    }

    // MODAL API
    openModal(id: string) {
        this._modalService.open(id);
    }

    closeModal(id: string) {
        this._modalService.close(id);
    }

}