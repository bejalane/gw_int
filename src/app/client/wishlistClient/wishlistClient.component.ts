import { Component, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { WishlistClientService } from './wishlistClient.service';
import { CalculatorComponent } from '../calculator/calculator.component';
import { Observable } from 'rxjs/Rx';
// import { FormsModule, NgModel } from '@angular/forms';
// import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { JobClientTmplComponent } from './../jobClient/jobClientTmpl/jobClientTmpl.component';
import {Subscription} from 'rxjs/Subscription';
import {SharedUtilsService} from '../../shared/services/sharedUtils.service';
import {NotifierService} from '../../shared/services/notifier.service';

@Component({
    moduleId: module.id,
    selector: 'wishlist-client-page',
    templateUrl: 'wishlistClient.component.html'
})

export class WishlistClientComponent  {
    offers: any[] = [];
    fadeOut = false;
    private subscriptions = new Subscription();
    isMobile: boolean = false;
    nextPage = '';
    busyQuery = false; // infinite scroll flag to block multiple queries

    constructor(
        private _router: Router,
        private route: ActivatedRoute,
        private _wishlistClientService: WishlistClientService,
        private _datePipe: DatePipe,
        private _sharedUtilsService: SharedUtilsService,
        private _notifierService: NotifierService
    ) {
        this.isMobile = this._sharedUtilsService.isMobile();
    }

    getWishlist() {
        this.busyQuery = true; // infinite scroll flag to block multiple queries
        this._wishlistClientService.getWishlist(this.nextPage)
            .subscribe(
                data => {
                    console.log(data);
                    this.nextPage = (data.next_page_url) ? ('?' + data.next_page_url.split('?').pop()) : '';
                    if (this.offers.length) {
                        this.offers = this.offers.concat(data.data);
                    } else {
                        this.offers = data.data;
                    }
                    this.busyQuery = false; // infinite scroll flag to block multiple queries
                    this.fadeOut = true;
                },
                errorData => { console.log(errorData.error); }
            );
    }

    goToJob(index) {
        this._router.navigate(['/joboffers/' + this.offers[index].jobId]);
    }

    remove(index) {
        this._wishlistClientService.removeFromWishlist(this.offers[index].id)
            .subscribe(
                data => {
                    console.log(data);
                    this.offers.splice(index, 1);
                },
                errorData => { console.log(errorData.error); }
            );
    }

    removeHandler(index) {
        this.offers.splice(index, 1);
    }

    ngOnInit() {
        this.getWishlist();
        this.subscriptions.add(
            this._notifierService.notifyObservable$.subscribe((res) => {
                    if (res.hasOwnProperty('option') && res.option === 'windowResized') {
                        this.isMobile = this._sharedUtilsService.isMobile();
                    }
                }
            )
        );

        this.subscriptions.add(
            Observable.fromEvent(window, 'scroll').subscribe(e => {
                let top = self.scrollY;
                let h = window.innerHeight;
                let btnPosition = document.getElementById('loadMoreFvrts').offsetTop;
                if ((top + h) >= btnPosition) {
                    if (this.nextPage && !this.busyQuery) {
                        this.getWishlist();
                    }
                }
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}
