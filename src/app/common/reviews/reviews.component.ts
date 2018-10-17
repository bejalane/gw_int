import {Component, ViewContainerRef, Input, ElementRef} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
// import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ReviewsService } from './reviews.service';
import { Observable } from 'rxjs/Rx';
import { DatePipe } from '@angular/common';
import { NewReview } from './reviews.models';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import { FacebookService, UIParams, UIResponse, InitParams } from 'ngx-facebook';
import {SharedSettingsService} from '../../shared/services/sharedSettings.service';
import {NotifierService} from '../../shared/services/notifier.service';

@Component({
    moduleId: module.id,
    selector: 'reviews',
    templateUrl: 'reviews.component.html'
})

export class ReviewsComponent {
    @Input() mode: string;
    @Input() offerUserName: string;
    profile: any;
    userId: string;
    sub: any;
    reviews: any;
    newRateLength: any[];
    postNewReview: NewReview;
    emptyRate = false;
    postingError: string;
    userRole: string;

    constructor(
        private _router: Router,
        private route: ActivatedRoute,
        private _reviewsService: ReviewsService,
        private _datePipe: DatePipe,
        private eleRef: ElementRef,
        private fb: FacebookService,
        private _sharedSettingsService: SharedSettingsService,
        private _notifierService: NotifierService
    ) {

        let initParams: InitParams = {
            appId: this._sharedSettingsService.facebookAppId,
            xfbml: true,
            version: 'v2.9'
        };

        fb.init(initParams);

    }

    getProviderData(id) {
        Observable.forkJoin([
            this._reviewsService.getReviews(id)
        ])
            .subscribe(
                data => {
                    console.log('getReviews');
                    console.log(data);
                    this.rewriteReviews(data[0]);
                },
                errorData => { console.log(errorData.error); }
            );
    }

    rewriteReviews(data) {
        this.reviews = [];
        if (data.length) {
            this.reviews = this._reviewsService.rewriteReviews(data);
        }
    }

    hoverRate(i) {
        for (var n = this.newRateLength.length - 1; n >= 0; n--) {
            this.newRateLength[n] = (n > i) ? 0 : 1;
        }
    }
    mOutRating() {
        if (!this.postNewReview.rate) {
            this.newRateLength.fill(0);
        } else {
            for (var n = this.newRateLength.length - 1; n >= 0; n--) {
                this.newRateLength[n] = (n > (this.postNewReview.rate - 1)) ? 0 : 1;
            }
        }
    }
    chooseRate(i) {
        this.postNewReview.rate = (i + 1);
        for (var n = this.newRateLength.length - 1; n >= 0; n--) {
            this.newRateLength[n] = (n > i) ? 0 : 1;
        }
    }

    submitReview() {
        if (this.postNewReview.rate === 0) {
            this.emptyRate = true;
        } else {
            let response;
            this.emptyRate = false;
            this._reviewsService.submitReview(this.postNewReview, this.userId)
                .subscribe(
                    data => {
                        console.log(data);
                        response = data;
                        if (response.message === 'success' && response.newReview) {
                            const reviews = this.reviews;
                            this.rewriteReviews([response.newReview]);
                            this.reviews = reviews.concat(this.reviews);
                            console.log(this.reviews);
                        }
                    },
                    errorData => {
                        console.log(errorData.error);
                        this._notifierService.displayErrors(errorData);
                    }
                );
        }

    }

    ngOnInit() {
        if (this.mode === 'offer') {
            this.userId = this.offerUserName;
        } else {
            this.sub = this.route.params.subscribe(params => {
                this.userId = params['id'];
            });
            this.userRole = localStorage.getItem('gw_user_role');
        }
        console.log(this.userId);
        if (this.userId) {
            this.getProviderData(this.userId);
        }
        this.newRateLength = [0, 0, 0, 0, 0];
        this.postNewReview = this._reviewsService.getNewReview();
    }


    selectedImage(imageResult: ImageResult) {
        let img_base64 = imageResult.resized
            && imageResult.resized.dataURL
            || imageResult.dataURL;
        this.postNewReview.image = img_base64;
    }

    removeImage() {
        this.postNewReview.image = null;
    }

    clickFire(id) {
        let btn = this.eleRef.nativeElement.querySelector(id);
        console.log(btn);
        btn.click();
    }

    share(review) {

        console.log(this.reviews[review].text);

        let params: UIParams = {
            href: this._sharedSettingsService.appUrl,
            method: 'share',
            app_id: this._sharedSettingsService.facebookAppId,
            quote: this.reviews[review].text
        };

        this.fb.ui(params)
            .then((res: UIResponse) => console.log(res))
            .catch((e: any) => console.error(e));

    }
}