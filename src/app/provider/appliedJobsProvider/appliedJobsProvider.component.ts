import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppliedJobsProviderService } from './appliedJobsProvider.service';
import { InfoDataService } from '../../shared/services/infoData.service';
import { Observable } from 'rxjs/Rx';
import { DatePipe } from '@angular/common';
import { SharedUtilsService } from '../../shared/services/sharedUtils.service';
import {NotifierService} from '../../shared/services/notifier.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    moduleId: module.id,
    selector: 'jobsList-provider-page',
    templateUrl: 'appliedJobsProvider.component.html'
})

export class AppliedJobsProviderComponent  {
    areas: any[];
    jobs: any[] = [];
    nextPage: string;
    busyQuery = false; // infinite scroll flag to block multiple queries
    fadeOut = false;
    isMobile: boolean = false;
    private subscriptions = new Subscription();


    constructor(
        private _router: Router,
        private route: ActivatedRoute,
        private _appliedJobsProviderService: AppliedJobsProviderService,
        private _datePipe: DatePipe,
        private _infoDataService: InfoDataService,
        private _sharedUtilsService: SharedUtilsService,
        private _notifierService: NotifierService
    ) {
        this.isMobile = this._sharedUtilsService.isMobile();
    }

    getJobsList() {
        this.busyQuery = true; // infinite scroll flag to block multiple queries
        Observable.forkJoin([
            this._appliedJobsProviderService.getJobsList(this.nextPage),
            this._infoDataService.getAreas()
        ])
            .subscribe(
                (data: any) => {
                    console.log(data);
                    this.nextPage = (data[0].next_page_url) ? ('?' + data[0].next_page_url.split('?').pop()) : '';
                    if (this.jobs.length) {
                        this.jobs = this.jobs.concat(data[0].data);
                    } else {
                        this.jobs = data[0].data;
                    }
                    this.areas = data[1];
                    this.rewriteAreas();
                    this.busyQuery = false; // infinite scroll flag to block multiple queries
                    this.fadeOut = true;
                },
                errorData => {
                    console.log(errorData.error);
                    this._notifierService.notifyOther({option: 'generalError', data: {title: errorData.error.message}});
                    this.fadeOut = true;
                }
            );
    }

    rewriteAreas() {
        for (let i = 0; i < this.jobs.length; ++i) {
            const searchArea = this.areas.find(o => o.id === this.jobs[i].areaId);
            this.jobs[i].area = searchArea.name;
        }
    }

    ngOnInit() {
        this.nextPage = '';
        this.getJobsList();

        // infinite scroll detection
        this.subscriptions.add(
            Observable.fromEvent(window, 'scroll').subscribe(e => {
                const top = self.scrollY;
                const h = window.innerHeight;
                const btnPosition = document.getElementById('loadMoreAppld').offsetTop;
                if ((top + h) >= btnPosition) {
                    if (this.nextPage && !this.busyQuery) {
                        this.getJobsList();
                    }
                }
            })
        );

        this.subscriptions.add(
            this._notifierService.notifyObservable$.subscribe((res) => {
                    if (res.hasOwnProperty('option') && res.option === 'windowResized') {
                        this.isMobile = this._sharedUtilsService.isMobile();
                    }
                }
            )
        );
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}
