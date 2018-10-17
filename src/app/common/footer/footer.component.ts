import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NotifierService } from '../../shared/services/notifier.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

    constructor(
        private _router: Router,
        private _notifierService: NotifierService
    ) { }

    ngOnInit() {
    }

    redirect(pagename: string) {
        this._router.navigate(['/' + pagename]);
    }

    openForm(form: string) {
        this._notifierService.notifyOther({ option: form, data: {} });
    }

}
