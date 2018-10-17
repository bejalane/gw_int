import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PlansService } from './plans.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
// import { CalculatorComponent } from '../calculator/calculator.component';
import { DatePipe } from '@angular/common';
import { ModalService } from '../../shared/modal/modal.service';
import { Observable } from 'rxjs/Rx';
import { InfoDataService } from '../../shared/services/infoData.service';
import * as $ from 'jquery';
import { SharedSettingsService } from '../../shared/services/sharedSettings.service';
import { JobClientService } from '../jobClient/jobClient.service';
import { NotifierService } from '../../shared/services/notifier.service';
import { cloneDeep } from 'lodash';
import { SharedUtilsService } from '../../shared/services/sharedUtils.service';
import {Subscription} from 'rxjs/Subscription';


@Component({
    moduleId: module.id,
    selector: 'plans-page',
    templateUrl: 'plans.component.html'
})

export class PlansComponent {
    activePlans: any[];
    currentPlanId: number;
    plan: any;
    states: any[];
    mode: string = "plan";
    addServicesToPlan: boolean = false;
    showModal: boolean;
    currentJobOfPlan: any;
    private bodyText: string;
    nameForCustomClose: string;
    priceForCustomClose: number;
    areas: any[];
    value: Date;
    customProvidersOpen: boolean = false;
    dp_locale: any;
    jobForEdit: any;
    fadeOut = false;
    editPlanForm: FormGroup;
    addCustomProviderForm: FormGroup;
    planCopy: any;
    isMobile = false;
    showPlanFullDescription = false;
    readMoreText = 'read_more';
    private subscriptions = new Subscription();

    constructor(
        private _router: Router,
        private _plansService: PlansService,
        private _datePipe: DatePipe,
        private _modalService: ModalService,
        private _infoDataService: InfoDataService,
        private _jobClientService: JobClientService,
        private _sharedSettingsService: SharedSettingsService,
        private _notifierService: NotifierService,
        private _sharedUtilsService: SharedUtilsService
    ) {
        this.editPlanForm = new FormGroup({
            'name': new FormControl('', Validators.required),
            'date': new FormControl('', Validators.required),
            'area': new FormControl('', Validators.required),
            'guests': new FormControl('', [
                Validators.required,
                Validators.pattern('^\\d+$'),
            ]),
            'about': new FormControl('', Validators.required)
        });
        this.addCustomProviderForm = new FormGroup({
            'name': new FormControl('', Validators.required),
            'summ': new FormControl('', [
                Validators.required,
                Validators.pattern('^\\d+$'),
            ])
        });

        this.isMobile = this._sharedUtilsService.isMobile();
    }

    ngOnInit() {
        console.log('begin plans...');
        this.bodyText = 'This text can be updated in modal 1';
        this.getClientPlans();

        const language = Cookie.get('userLanguage');
        this.dp_locale = this._sharedSettingsService.getDatepickerLocale(language);

        $(document).on('click', 'a', function (ev) {
            console.log('clicked');
            ev.stopPropagation();
        });

        this.subscriptions.add(this._notifierService.notifyObservable$.subscribe((res) => {
                if (res.hasOwnProperty('option') && res.option === 'updatePlanInfo') {
                    this.getPlanById();
                } else if (res.hasOwnProperty('option') && res.option === 'windowResized') {
                    this.isMobile = this._sharedUtilsService.isMobile();
                }
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    handleJobsUpdate(e) {
        console.log(e);
        this.getPlanById();
        this.addServicesToPlan = !this.addServicesToPlan;
        this.customProvidersOpen = false;
    }

    getClientPlans() {
        Observable.forkJoin([
            this._plansService.getClientPlans(),
            this._infoDataService.getAreas()
        ]).subscribe(
            data => {
                console.log(data);
                if (data[0].length) {
                    this.activePlans = data[0];
                    if (localStorage.getItem("currentPlanId")) {
                        this.currentPlanId = parseInt(localStorage.getItem("currentPlanId"));
                    } else if (this.activePlans.length) {
                        this.currentPlanId = parseInt(this.activePlans[0].id);
                        localStorage.setItem("currentPlanId", JSON.stringify(this.currentPlanId));
                    }
                    this.getPlanById();
                    this.areas = data[1];
                } else {
                    this.fadeOut = true;
                }
            },
            errorData => { console.log(errorData.error); }
        );
    }

    getPlanById() {
        this._plansService.getPlanById(this.currentPlanId)
            .subscribe(
                data => {
                    console.log(data);
                    this.plan = data.plan;
                    this.states = data.states;
                    let searchArea = this.areas.find(o => o.id === this.plan.areaId);
                    this.plan.area = searchArea.name;
                    this.plan.date = new Date(this.plan.date);
                    this.fadeOut = true;
                    for (let i = 0; i < this.plan.jobs.length; i++) {
                        this.plan.jobs[i].mobileExpanded = false;
                    }
                    this.plan.excerpt = (this.plan.aboutUs) ? this._sharedUtilsService.getExcerpt(this.plan.aboutUs, 'jobDescription') : "";
                    this.plan.planDescription = this.plan.excerpt.excerpt;
                },
                errorData => { console.log(errorData.error); }
            );
    }

    openCalc(val) {
        this.addServicesToPlan = true;
        this.openModal('add-service-to-plan');
        this.customProvidersOpen = val;
    }

    // rewriteAreas(){
    // 	let searchArea = this.areas.find(o => o.id === this.postedJob.areaId);
    //     this.postedJob.area = searchArea.name;
    // }

    activePlansChange() {
        console.log(this.currentPlanId)
        localStorage.setItem('currentPlanId', JSON.stringify(this.currentPlanId));
        this.getPlanById();
    }

    goToOffers(id) {
        this._router.navigate(['/joboffers/' + id]);
    }

    addCustomProvider(index) {
        this.openModal('add-custom-provider');
        this.currentJobOfPlan = this.plan.jobs[index];
        this.nameForCustomClose = "";
        this.priceForCustomClose = 0;
    }

    saveCustomProvider() {
        let data = {
            chosenProvider: this.nameForCustomClose,
            priceOffer: this.priceForCustomClose
        };
        this._plansService.customCloseJob(this.currentJobOfPlan.id, data)
            .subscribe(
                data => {
                    console.log(data);
                    if (data.message === 'success') {
                        this.closeModal('add-custom-provider');
                        this.getPlanById();
                    }
                },
                errorData => { console.log(errorData.error); }
            );
    }

    getTotalBudget() {
        let sum = 0;
        for (let i = 0; i < this.plan.jobs.length; i++) {
            if (this.plan.jobs[i].priceOffer) {
                if(!this.plan.jobs[i].perGuest){
                    sum = sum + this.plan.jobs[i].priceOffer;
                } else {
                    sum = sum + (parseInt(this.plan.guests) * this.plan.jobs[i].priceOffer);
                }
            }
        }
        return sum;
    }

    onSelectDp() {
        setTimeout(() => {
            // $('#edit-plan').css('display', 'block');
            $('#edit-plan').stop(true, true).fadeIn(1);
            console.log('work');
        }, 0);
    }
    getCurrentDate() {
        let date = new Date(this.plan.date);
        console.log(date);
        return date;
    }

    editPlan() {
        let self = this;
        let editObj = {
            active: true,
            name: this.planCopy.name,
            date: this._datePipe.transform(this.planCopy.date, 'dd.MM.yyyy'),
            guests: this.planCopy.guests,
            areaId: this.planCopy.areaId,
            aboutUs: this.planCopy.aboutUs
        };
        console.log(editObj);
        this._plansService.editPlan(this.currentPlanId, editObj)
            .subscribe(
                data => {
                    console.log(data);
                    self.plan = self.planCopy;
                    this.closeModal('edit-plan');
                },
                errorData => { console.log(errorData.error); }
            );
    }

    getJobToEdit(index) {
        console.log(this.plan.jobs[index].id);
        this._notifierService.notifyOther({option: 'appLoader', turnOn: true});
        this._jobClientService.getJob(this.plan.jobs[index].id)
            .subscribe(
                data => {
                    console.log(data);
                    this.jobForEdit = data;
                    this._notifierService.notifyOther({option: 'appLoader', turnOn: false});
                    this.openModal('edit-job');

                },
                errorData => { console.log(errorData.error); }
            );
    }

    editJob() {

    }

    openEditPlan() {
        this.planCopy = cloneDeep(this.plan);
        console.log(this.planCopy);
        this.openModal('edit-plan');
    }

    areaChange() {
        let searchArea = this.areas.find(o => o.id === this.planCopy.areaId);
        this.planCopy.area = searchArea.name;

    }

    expnadMobile(i){
        this.plan.jobs[i].mobileExpanded = !this.plan.jobs[i].mobileExpanded;
    }

    showFullDescription(val) {
        this.showPlanFullDescription = val;
        this.readMoreText = (val) ? 'show_less' : 'read_more';
        this.plan.planDescription = (val) ? this.plan.aboutUs : this.plan.excerpt.excerpt;
    }

    // MODAL API
    openModal(id: string) {
        this._modalService.open(id);
    }

    closeModal(id: string) {
        this._modalService.close(id);
    }
}