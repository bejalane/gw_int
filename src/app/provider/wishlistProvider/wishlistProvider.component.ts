import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { WishlistProviderService } from './wishlistProvider.service';
import { DatePipe } from '@angular/common';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Rx';

@Component({
    moduleId: module.id,
    selector: 'wishlist-client-page',
    templateUrl: 'wishlistProvider.component.html'
})

export class WishlistProviderComponent  {
    wishlist: any[] = [];
    fadeOut = false;
    nextPage: string;
    busyQuery = false; // infinite scroll flag to block multiple queries
    private subscriptions = new Subscription();

    constructor(
        private _router: Router,
        private route: ActivatedRoute,
        private _wishlistProviderService: WishlistProviderService
    ) {	}

    getWishlist() {
        this.busyQuery = true; // infinite scroll flag to block multiple queries
        this._wishlistProviderService.getWishlist(this.nextPage)
            .subscribe(
                data => {
                    console.log(data);
                    this.nextPage = (data.next_page_url) ? ('?' + data.next_page_url.split('?').pop()) : '';
                    if (this.wishlist.length) {
                        this.wishlist = this.wishlist.concat(data.data);
                    } else {
                        this.wishlist = data.data;
                    }
                    this.busyQuery = false; // infinite scroll flag to block multiple queries
                    this.fadeOut = true;
                },
                errorData => { console.log(errorData.error); }
            );
    }

    removeHandler(index) {
        this.wishlist.splice(index, 1);
    }

    ngOnInit() {
        this.nextPage = '';
        this.getWishlist();
        // infinite scroll detection
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
