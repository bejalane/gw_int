import { Component, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProviderListService } from './providerList.service';
import { ProviderProfileService } from '../providerProfile/providerProfile.service';
import { Observable } from 'rxjs/Rx';
import { DatePipe } from '@angular/common';
import {Subscription} from 'rxjs/Subscription';
import {NotifierService} from '../../shared/services/notifier.service';

@Component({
    moduleId: module.id,
    selector: 'provider-list',
    templateUrl: 'providerList.component.html'
})

export class ProviderListComponent  {

    servicesList: any[];
    providersList: any[];
    currentService: string;
    fadeOut = false;
    mql: any;
    private subscriptions = new Subscription();


    constructor(
        private _router: Router,
        private route: ActivatedRoute,
        private _providerListService: ProviderListService,
        private _datePipe: DatePipe,
        private _providerProfileService: ProviderProfileService,
        private _notifierService: NotifierService
    ) {
        this.mql = window.matchMedia('screen and (max-width: 640px)');
    }

    ngOnInit() {
        this.getProviderListData();
        this.subscriptions.add(
            this._notifierService.notifyObservable$.subscribe((res) => {
                    if (res.hasOwnProperty('option') && res.option === 'windowResized') {
                        this.mql = window.matchMedia('screen and (max-width: 640px)');
                    }
                }
            )
        );
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    getProviderListData(){
        Observable.forkJoin([
            this._providerListService.getServicesList(),
            this._providerListService.getTopProviders()
        ])
            .subscribe(
                data =>{
                    console.log(data);
                    this.servicesList = data[0];
                    this.providersList = data[1];
                    console.log(this.providersList);
                    this.rewriteRating();
                    this.fadeOut = true;
                },
                errorData => { console.log(errorData.error); }
            );
    }

    chooseService(index) {
        if (index === 'top') {
            this.getProviderListData();
            this.currentService = index;
        } else {
            const id = this.servicesList[index].id;
            this.currentService = this.servicesList[index].name;
            this.getProvidersListByService(id);
        }
    }

    getProvidersListByService(id) {
        this._providerListService.getProvidersListByService(id)
            .subscribe(
                data => {
                    console.log(data);
                    this.providersList = data.data;
                    console.log(this.providersList);
                    this.rewriteRating();
                },
                errorData => { console.log(errorData.error); }
            );
    }

    rewriteRating() {
        for (var i = 0; i < this.providersList.length; ++i) {
            this.providersList[i].rate = this._providerProfileService.getFloatRateArr(this.providersList[i].rating);
        }
        console.log(this.providersList);
    }

    openProviderProfile(index){
        this._router.navigate(['/providerprofile/' + this.providersList[index].username]);
    }

    // fadeOutOverlay(){
    //     let s:any = document.getElementById('fade-overlay').style;
    //     s.opacity = 1;
    //     (function fade(){(s.opacity-=.1)<0?s.display="none":setTimeout(fade,10)})();
    // }

}