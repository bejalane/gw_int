import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { JobClientService } from './jobClient.service';
import { InfoDataService } from '../../shared/services/infoData.service';
import { ProviderProfileService } from '../../common/providerProfile/providerProfile.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { DatePipe } from '@angular/common';
import { WishlistClientService } from '../wishlistClient/wishlistClient.service';
import { JobClientTmplComponent } from './jobClientTmpl/jobClientTmpl.component';
import { ImagesService } from '../../shared/services/images.service';
import { forEach } from '@angular/router/src/utils/collection';
import { SharedSettingsService } from '../../shared/services/sharedSettings.service';
import { SharedUtilsService } from '../../shared/services/sharedUtils.service';
import { NotifierService } from '../../shared/services/notifier.service';
import { ModalService } from '../../shared/modal/modal.service';

@Component({
    moduleId: module.id,
    selector: 'job-client-page',
    templateUrl: 'jobClient.component.html'
})

export class JobClientComponent {
    sub: any;
    jobId: number;
    postedJob: any;
    offers: any[];
    areas: any[];
    chosenOffer: any;
    fadeOut = false;
    imagesForGallery: any[] = [];
    showImageGallery = false;
    indexForGallery: number;
    jobImages: any[] = [];
    showJobFullDescription = false;
    jobDescriptionReadMore = false;
    private subscriptions = new Subscription();
    offerChosen = false;
    offerCancelled  = false;
    nextPage: string;
    busyQuery = false; // infinite scroll flag to block multiple queries
    isMobile: boolean = false;

    constructor(
        private _router: Router,
        private route: ActivatedRoute,
        private _jobClientService: JobClientService,
        private _datePipe: DatePipe,
        private _infoDataService: InfoDataService,
        private _providerProfileService: ProviderProfileService,
        private _wishlistClientService: WishlistClientService,
        private _imagesService: ImagesService,
        private _sharedSettingsService: SharedSettingsService,
        private _sharedUtilsService: SharedUtilsService,
        private _notifierService: NotifierService,
        private _modalService: ModalService
    ) {
        this.isMobile = this._sharedUtilsService.isMobile();
    }

    getJob() {
        this.sub = this.route.params.subscribe(params => {
            this.jobId = parseInt(params['id']);
            Observable.forkJoin([
                this._jobClientService.getJob(this.jobId),
                this._jobClientService.getOffers(this.jobId, this.nextPage),
                this._infoDataService.getAreas()
            ])
                .subscribe(
                    data => {
                        this.postedJob = data[0];
                        this.postedJob.images = (this.postedJob.images) ? this.postedJob.images : [];
                        this.offers = data[1].offers.data;
                        this.nextPage = (data[1].offers.next_page_url) ? ('?' + data[1].offers.next_page_url.split('?').pop()) : '';
                        this.areas = data[2];
                        this.rewriteAreas();
                        console.log(data[0], data[1], data[2]);
                        if (data[1].chosenOffer) {
                            this.chosenOffer = data[1].chosenOffer;
                        } else {
                            this.chosenOffer = null;
                        }
                        this.rewriteRating();
                        this.fadeOut = true;
                        this.postedJob.excerpt = (this.postedJob.description) ? this._sharedUtilsService.getExcerpt(this.postedJob.description, 'jobDescription') : '';
                        this.postedJob.jobDescription = this.postedJob.excerpt.excerpt;
                        this.jobDescriptionReadMore = this.postedJob.excerpt.readmore;
                    },
                    errorData => { console.log(errorData.error); }
                );
        });
    }

    getMoreOffers() {
        this.busyQuery = true; // infinite scroll flag to block multiple queries
        this._jobClientService.getOffers(this.jobId, this.nextPage)
            .subscribe(
                data => {
                    console.log(data);
                    this.nextPage = (data.offers.next_page_url) ? ('?' + data.offers.next_page_url.split('?').pop()) : '';
                    this.offers = this.offers.concat(data.offers.data);
                    this.busyQuery = false; // infinite scroll flag to block multiple queries
                },
                errorData => { console.log(errorData.error); }
            );
    }

    ngOnInit() {
        this.nextPage = '';
        this.getJob();

        // infinite scroll detection
        this.subscriptions.add(
            Observable.fromEvent(window, 'scroll').subscribe(e => {
                let top = self.scrollY;
                let h = window.innerHeight;
                let btnPosition = document.getElementById('loadMoreOffers').offsetTop;
                console.log(btnPosition);
                if ((top + h) >= btnPosition) {
                    if (this.nextPage && !this.busyQuery) {
                        this.getMoreOffers();
                    }
                }
            })
        );

        this.subscriptions.add(this._notifierService.notifyObservable$.subscribe((res) => {
                if (res.hasOwnProperty('option') && res.option === 'offerUnchosen') {
                    this.onChooseOffer(false);
                } else if (res.hasOwnProperty('option') && res.option === 'offerChosen') {
                    this.onChooseOffer(true);
                } else  if (res.hasOwnProperty('option') && res.option === 'windowResized') {
                    this.isMobile = this._sharedUtilsService.isMobile();
                }
            })
        );

    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    rewriteAreas() {
        let searchArea = this.areas.find(o => o.id === this.postedJob.areaId);
        this.postedJob.area = searchArea.name;
    }

    rewriteRating() {
        for (var i = 0; i < this.offers.length; ++i) {
            this.offers[i].user.rate = this._providerProfileService.getFloatRateArr(this.offers[i].user.rating);
        }
        if (this.chosenOffer) {
            this.chosenOffer.user.rate = this._providerProfileService.getFloatRateArr(this.chosenOffer.user.rating);
        }
    }

    openJobPhotoGallery(index) {
        // this.postedJob.images[index];
        if (this.jobImages.length) {
            this.openImageGallery(this.jobImages, index);
        } else {
            let getImagesArray = [];
            for (let value of this.postedJob.images) {
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

    showFullDescription(val) {
        this.showJobFullDescription = val;
        this.postedJob.jobDescription = (val) ? this.postedJob.description : this.postedJob.excerpt.excerpt;
    }

    sendMessage() {
        this._router.navigate(['/messages/' + 10]);
    }

    onChooseOffer(val) {
        //console.log('choose offer change', val);
        // if(val){
        //     this.offerChosen = true;
        //     this.offerCancelled = false;
        // } else {
        //     this.offerChosen = false;
        //     this.offerCancelled = true;
        // }
        this.getJob();
        // this.openModal('offer-choose');
    }

    //MODAL API
    openModal(id: string) {
        this._modalService.open(id);
    }

    closeModal(id: string) {
        this._modalService.close(id);
    }


}