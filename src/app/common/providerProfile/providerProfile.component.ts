import { Component, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
// import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProviderProfileService } from './providerProfile.service';
// import { ReviewsComponent }  from '../reviews/reviews.component';
import { Observable } from 'rxjs/Rx';
import { DatePipe } from '@angular/common';
import { NewReview } from './profile.models';
// import { ImagesService } from '../../shared/services/images.service';
import {VideoUrlService} from '../../shared/services/videoUrl.service';

@Component({
	moduleId: module.id,
	selector: 'provider-profile',
	templateUrl: 'providerProfile.component.html'
})

export class ProviderProfileComponent  {

	profile: any;
	userId: string;
	sub: any;
	reviews: any;
	newRateLength: any[];
	postNewReview: NewReview;
	fadeOut = false;
	imagesForGallery: any[];
	indexForGallery: any;
	showImageGallery = false;
    portfolioVideoForDisplay: any[] = [];
    fullPortfolio: any[] = [];

	constructor(
		private _router: Router,
		private route: ActivatedRoute,
		private _providerProfileService: ProviderProfileService,
		private _datePipe: DatePipe,
        private _videoUrlService: VideoUrlService,
	) {	}

	getProviderData(id){
		Observable.forkJoin([
			this._providerProfileService.getProviderProfile(id)
		])
            .subscribe(
				data => {
					console.log(data);
					this.profile = data[0];
					this.profile.rate = this._providerProfileService.getFloatRateArr(this.profile.rating);

                    for (let i = 0; i < this.profile.account_settings.portfolioVideo.length; ++i) {
                        const video = this._videoUrlService.createVideoObj(this.profile.account_settings.portfolioVideo[i]);
                        this.portfolioVideoForDisplay[i] = video;
                    }
                    this.profile.account_settings.portfolio = this.profile.account_settings.portfolio.concat(this.portfolioVideoForDisplay);

					this.fadeOut = true;

				},
				errorData => { console.log(errorData.error); }
			);
	}

	// rewriteReviews(data){
	// 	this.reviews = [];
	// 	if(data.length){
	// 		this.reviews = this._providerProfileService.rewriteReviews(data);
	// 	}
	// }

	// hoverRate(i){
	// 	for (var n = this.newRateLength.length - 1; n >= 0; n--) {
	// 		this.newRateLength[n] = (n > i) ? 0 : 1;
	// 	}
	// }
	// mOutRating(){
	// 	if(!this.postNewReview.rate){
	// 		this.newRateLength.fill(0);
	// 	} else {
	// 		for (var n = this.newRateLength.length - 1; n >= 0; n--) {
	//     		this.newRateLength[n] = (n > (this.postNewReview.rate - 1)) ? 0 : 1;
	//     	}
	// 	}
	// }
	// chooseRate(i){
	// 	this.postNewReview.rate = (i+1);
	// 	for (var n = this.newRateLength.length - 1; n >= 0; n--) {
	// 		this.newRateLength[n] = (n > i) ? 0 : 1;
	// 	}
	// }

	// submitReview(){
	// 	this._providerProfileService.submitReview(this.postNewReview, this.userId) 
	// 		.subscribe(
	// 			data =>{ 
	// 				console.log(data);				
	// 			},
	// 			errorData => { console.log(errorData.error); }
	// 		);
	// }

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			this.userId = params['id'];
		});
		this.getProviderData(this.userId);
		this.newRateLength = [0,0,0,0,0];
		this.postNewReview = this._providerProfileService.getNewReview();
	}

	openPortfolio(index) {
		if (this.fullPortfolio.length < 1) {
            this._providerProfileService.getAllPortfolio(this.profile.username)
                .subscribe(data => {
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

	openImageGallery(images, index) {
		if (images.length) {
			this.imagesForGallery = images;
			this.indexForGallery = index;
			this.showImageGallery = true;
		}
	}
}