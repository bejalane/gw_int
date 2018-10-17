import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { WishlistClientService } from '../../wishlistClient/wishlistClient.service';
import { JobClientService } from './../jobClient.service';
import { ImagesService } from '../../../shared/services/images.service';
import { SharedUtilsService } from '../../../shared/services/sharedUtils.service';
import { ModalService } from '../../../shared/modal/modal.service';
import { NotifierService } from '../../../shared/services/notifier.service';
import { ReviewsComponent } from '../../../common/reviews/reviews.component';
import {VideoUrlService} from '../../../shared/services/videoUrl.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-job-client-tmpl',
    templateUrl: './jobClientTmpl.component.html'
})
export class JobClientTmplComponent implements OnInit {

    @Input() offer: any;
    @Input() mode: string;
    @Input() index: any;
    @Input() isMobile: boolean;
    @Output() unsetFromWishlist = new EventEmitter<number>();
    @Output() chooseOfferTrigger = new EventEmitter<boolean>();
    imagesForGallery: any[];
    indexForGallery: any;
    showImageGallery = false;
    offerMessageReadMore = false;
    showFullOfferMessage = false;
    showReviews = false;
    showOnChooseProvider = false;
    portfolioVideoForDisplay: any[] = [];
    fullPortfolio: any[] = [];

    constructor(
        private _wishlistClientService: WishlistClientService,
        private _jobClientService: JobClientService,
        private _router: Router,
        private _imagesService: ImagesService,
        private _sharedUtilsService: SharedUtilsService,
        private _modalService: ModalService,
        private _notifierService: NotifierService,
        private _videoUrlService: VideoUrlService,
    ) { }

    addToWishlist(offerId) {
        this._wishlistClientService.addToWishlist(offerId)
            .subscribe(
                data => {
                    this.offer.inFavorites = true;
                },
                errorData => { console.log(errorData.error); }
            );
    }

    removeFromWishlist(offerId) {
        this._wishlistClientService.removeFromWishlist(offerId)
            .subscribe(
                data => {
                    this.offer.inFavorites = false;
                    if (this.mode === 'wishlist') {
                        this.unsetFromWishlist.emit(this.index);
                    }
                },
                errorData => { console.log(errorData.error); }
            );
    }

    sendMessage(username) {
        // TODO 10 to username(instead of id)
        // this._router.navigate(['/messages/' + this.offer.username]);
        this._router.navigate(['/messages/' + username]);
    }

    ngOnInit() {
        this.offer.excerpt = (this.offer.text) ? this._sharedUtilsService.getExcerpt(this.offer.text, 'offerMessage') : '';
        this.offer.message = this.offer.excerpt.excerpt;
        this.offerMessageReadMore = this.offer.excerpt.readmore;
        if (this.offer.user.portfolioVideo) {
            for (let i = 0; i < this.offer.user.portfolioVideo.length; ++i) {
                const video = this._videoUrlService.createVideoObj(this.offer.user.portfolioVideo[i]);
                this.portfolioVideoForDisplay[i] = video;
            }
        }
        if (this.offer.user.portfolio && this.portfolioVideoForDisplay) {
            this.offer.user.portfolio = this.offer.user.portfolio.concat(this.portfolioVideoForDisplay);
            delete this.portfolioVideoForDisplay;
        }
    }

    openPortfolio(index) {

        if (this.fullPortfolio.length < 1) {
            this._jobClientService.getAllPortfolio(this.offer.user.username)
                .subscribe(data => {
                    console.log(data);
                    this.fullPortfolio = data;
                    for (let i = 0; i < this.fullPortfolio.length; ++i) {
                        if (this.fullPortfolio[i].type === 'video') {
                            const video = this._videoUrlService.createVideoObj(this.fullPortfolio[i].url);
                            this.fullPortfolio[i] = video;
                        }
                    }
                    this.openImageGallery(this.fullPortfolio, index);
                });
        } else {
            this.openImageGallery(this.fullPortfolio, index);
        }
    }

    chooseOffer(offer) {
        let chosenOffer = {
            jobId: offer.jobId,
            offerId: offer.id
        };
        console.log(chosenOffer);
        this._notifierService.notifyOther({ option: 'appLoader', turnOn: true });
        this._jobClientService.chooseAnOffer(chosenOffer)
            .subscribe(
                data => {
                    console.log(data);
                    this._notifierService.notifyOther({ option: 'offerChosen', data: 'success' });
                    this._notifierService.notifyOther({ option: 'appLoader', turnOn: false });
                    this._notifierService.notifyOther({ option: 'generalMessages', data: { title: 'success', text: 'offer_chosen', translateValue: this.offer.user.name + ' ' + this.offer.user.lastName} });
                },
                errorData => {
                    console.log(errorData.error);
                    errorData.error.message = (errorData.error.message === 'not found') ? 'you_ve_already_chosen_provider' : errorData.error.message;
                    this._notifierService.notifyOther({option: 'generalError', data: {title: errorData.error.message}});
                    this._notifierService.notifyOther({option: 'appLoader', turnOn: false});
                }
            );
    }

    reopenJob() {
        this._notifierService.notifyOther({ option: 'appLoader', turnOn: true });
        this._jobClientService.reopenJob(this.offer.jobId)
            .subscribe(data => {
                    // this.chooseOfferTrigger.emit(false);
                    this._notifierService.notifyOther({ option: 'offerUnchosen', data: 'success' });
                    this._notifierService.notifyOther({ option: 'appLoader', turnOn: false });
                    this._notifierService.notifyOther({ option: 'generalMessages', data: { title: 'success', text: 'offer_unchosen', translateValue: this.offer.user.name + ' ' + this.offer.user.lastName} });
                },
                errorData => {
                    console.log(errorData.error);
                    this._notifierService.notifyOther({option: 'generalError', data: {title: errorData.error.message}});
                    this._notifierService.notifyOther({option: 'appLoader', turnOn: false});
                });
    }

    openImageGallery(images, index) {
        if (images.length) {
            this.imagesForGallery = images;
            // this.videosForGallery = videos;
            this.indexForGallery = index;
            this.showImageGallery = true;
        }
    }

    showFullMessage(val) {
        this.showFullOfferMessage = val;
        this.offer.message = (val) ? this.offer.text : this.offer.excerpt.excerpt;
    }

    openReviews() {
        this.showReviews = true;
        this.openModal(`offer-reviews_${this.offer.user.username}`);
    }

    closeReviews() {
        this.showReviews = false;
        this.closeModal(`offer-reviews_${this.offer.user.username}`);
    }

    // MODAL API
    openModal(id: string) {
        this._modalService.open(id);
    }

    closeModal(id: string) {
        this._modalService.close(id);
    }

}
