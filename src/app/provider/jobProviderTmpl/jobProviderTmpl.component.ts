import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {WishlistProviderService} from '../wishlistProvider/wishlistProvider.service';

@Component({
    selector: 'app-job-provider-tmpl',
    templateUrl: './jobProviderTmpl.component.html'
})
export class JobProviderTmplComponent {

    @Input() job: any;
    @Input() mode: string;
    @Input() isMobile: boolean;
    @Input() index: any;
    @Output() unsetFromWishlist = new EventEmitter<number>();

    constructor(
        private _router: Router,
        private _wishlistProviderService: WishlistProviderService,
    ) {}


    goToJob(id) {
        this._router.navigate(['/job/' + id]);
    }

    removeFromWishlist(event, index) {
        event.stopPropagation();
        this._wishlistProviderService.removeFromWishlist(this.job.id)
            .subscribe(
                data => {
                    console.log(data);
                    if (this.mode === 'wishlist') {
                        this.unsetFromWishlist.emit(this.index);
                    }
                },
                errorData => { console.log(errorData.error); }
            );
    }
}
