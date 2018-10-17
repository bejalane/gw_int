import { Component, ElementRef, Renderer, Input, Output, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CalculatorService } from './calculator.service';
import { Calculator, Job } from './calculator.model';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { ModalService } from '../../shared/modal/modal.service';
import { NotifierService } from '../../shared/services/notifier.service';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import { SharedSettingsService } from '../../shared/services/sharedSettings.service';
import { SharedUtilsService } from '../../shared/services/sharedUtils.service';
import { LoginService } from '../../login/login.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    moduleId: module.id,
    selector: 'calculator',
    templateUrl: 'calculator.component.html'
})

export class CalculatorComponent {
    @Input() mode: string;
    @Input() currentPlan: any;
    @Input() customProviders: boolean;
    @Output() jobAdded = new EventEmitter<boolean>();
    authForm: FormGroup;
    token: any = '';
    services: any[];
    areas: any[];
    calculator: any;
    job: Job;
    test: string;
    currentIndex: number;
    currentSubIndex: any;
    resizeOptions: ResizeOptions = {
        resizeMaxHeight: 1200,
        resizeMaxWidth: 1200,
        resizeQuality: 0.7,
        resizeType: 'image/jpeg'
    };
    dp_locale: any;
    mobileService: any;
    deviceInfo = null;
    isMobile = false;
    calculatorTotals: any;
    isUserLoggedIn: boolean;
    // someKeyboardConfig: any = {
    // 	behaviour: 'drag',
    // 	connect: true,
    // 	tooltips: false,
    // 	step: 100
    // };
    private subscriptions = new Subscription();

    private fragment: string;

    constructor(
        private fb: FormBuilder,
        private _router: Router,
        private route: ActivatedRoute,
        private _calculatorService: CalculatorService,
        private _datePipe: DatePipe,
        private eleRef: ElementRef,
        private chRef: ChangeDetectorRef,
        private _modalService: ModalService,
        private _notifierService: NotifierService,
        private _sharedSettingsService: SharedSettingsService,
        private _sharedUtilsService: SharedUtilsService,
        private _loginService: LoginService
    ) {
        this.isMobile = this._sharedUtilsService.isMobile();
    }

    // Modifications
    ngOnInit() {
        console.log('begin...');
        console.log(this.mode);
        console.log(this.currentPlan);
        this.subscriptions.add(
            this._notifierService.notifyObservable$.subscribe((res) => {
                    if (res.hasOwnProperty('option') && res.option === 'windowResized') {
                        this.isMobile = this._sharedUtilsService.isMobile();
                        this.expandServices();
                    }
                    if (res.hasOwnProperty('option') && res.option === 'checkLoggedUser') {
                        this.isUserLoggedIn = this._loginService.isUserLoggedIn();
                    }
                }
            )
        );
        const language = Cookie.get('userLanguage') ? Cookie.get('userLanguage') : 'en_US';
        this.dp_locale = this._sharedSettingsService.getDatepickerLocale(language);
        this.getCalculatorData();
        this.isUserLoggedIn = this._loginService.isUserLoggedIn();
        this.route.fragment.subscribe(fragment => { this.fragment = fragment; });
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
    ngAfterViewInit(): void {
        try {
            document.querySelector('#' + this.fragment).scrollIntoView();
        } catch (e) { }
    }

    getCalculatorData() {
        let planId = (this.currentPlan) ? this.currentPlan.id : null;
        if (this.mode !== 'home') {
            this._notifierService.notifyOther({ option: 'appLoader', turnOn: true });
        }
        this._calculatorService.getCalculatorData(this.mode, planId)
            .subscribe(
                data => {
                    console.log(data);
                    this.areas = data.areas;
                    this.services = (data.services) ? data.services : data;
                    this.createCalculator(this.services);
                    this._notifierService.notifyOther({ option: 'appLoader', turnOn: false });
                },
                errorData => {
                    console.log(errorData.error);
                    this._notifierService.notifyOther({ option: 'appLoader', turnOn: false });
                }
            );
    }

    openNote(index) {
        this.calculator.jobs[index].noteExpanded = (!this.calculator.jobs[index].noteExpanded);
    }

    openSubNote(parent, index) {
        this.calculator.jobs[parent].children[index].noteExpanded = (!this.calculator.jobs[parent].children[index].noteExpanded);
    }

    createCalculator(services) {
        this.calculator = this._calculatorService.createCalculator(services, this.mode, this.currentPlan);
        this.calculator.jobs = _.orderBy(this.calculator.jobs, ['order'], ['asc']);
        console.log(this.calculator);
        for (let i = 0; i < this.calculator.jobs.length; ++i) {
            this.calculator.jobs[i].range = [this.calculator.jobs[i].from, this.calculator.jobs[i].to];
            this.calculator.jobs[i].maxValRange = this.calculator.jobs[i].to * 2 - 1;
            if (this.isMobile) {
                this.calculator.jobs[i].noteExpanded = true;
                this.calculator.jobs[i].mobileExpanded = false;
            }
        }
        this.prepareFieldsForCustomProviders(this.customProviders);
        this.calculateTotals();
        console.log(this.calculator);
    }

    expandServices() {
        for (let i = 0; i < this.calculator.jobs.length; ++i) {
            this.calculator.jobs[i].noteExpanded = this.isMobile;
            this.calculator.jobs[i].mobileExpanded = !this.isMobile;
        }
    }


    calculateTotals() {
        this.calculatorTotals = this._calculatorService.calculateTotals(this.calculator, this.calculator.guests);
    }

    prepareFieldsForCustomProviders(set) {
        for (let i = 0; i < this.calculator.jobs.length; i++) {
            this.calculator.jobs[i].customProviderOpen = set;
        }
    }

    changeMaxRange() {
        for (let i = 0; i < this.calculator.jobs.length; ++i) {
            console.log(this.calculator.jobs[i].maxValRange);
            this.calculator.jobs[i].maxValRange = this.calculator.jobs[i].maxValRange + 1;
        }
    }

    sendCalculator() {
        if (this.mode === 'plan') {
            this.addJobsToPlan();
        } else {
            this.savePlan();
        }
    }

    savePlan() {
        this._notifierService.notifyOther({ option: 'appLoader', turnOn: true });
        this._calculatorService.savePlan(this.calculator)
            .subscribe(
                data => {
                    console.log(data);
                    this._notifierService.notifyOther({ option: 'appLoader', turnOn: false });
                    localStorage.setItem('currentPlanId', JSON.stringify(data.new_plan_id));
                    this.openModal('plan-success-created');
                },
                errorData => {
                    this._notifierService.displayErrors(errorData);
                }
            );
    }

    addJobsToPlan() {
        this._notifierService.notifyOther({ option: 'appLoader', turnOn: true });
        console.log(this.calculator);
        this._calculatorService.addJobsToPlan(this.calculator, this.currentPlan.id, this.mode)
            .subscribe(
                data => {
                    this.closeModal('add-service-to-plan');
                    console.log(data);
                    this.jobAdded.emit(true);
                    this._notifierService.notifyOther({ option: 'appLoader', turnOn: false });
                    this._notifierService.notifyOther({ option: 'generalMessages', data: { title: 'success', text: 'jobs_added' } });
                },
                errorData => {
                    console.log(errorData.error);
                    this._notifierService.displayErrors(errorData);
                }
            );
    }

    areaChange(val: any) {
        this.calculator.area = val;
    }

    updateLS() {
        this.calculateTotals();
        if (this.mode !== 'plan') {
            this._calculatorService.updateLS(this.calculator);
        }
    }

    cleanCalculator() {
        this._calculatorService.cleanCalculator();
        this.getCalculatorData();
    }

    recalculateBudgets(val) {
        //unused function, changes in rendering per guests option
        console.log(val);
        let guests = parseInt(val);
        for (let i = 0; i < this.calculator.jobs.length; ++i) {
            if (this.calculator.jobs[i].budgetPerGuest) {
                this.calculator.jobs[i].from = guests * this.calculator.jobs[i].budgetMin;
                this.calculator.jobs[i].to = guests * this.calculator.jobs[i].budgetMax;
                this.calculator.jobs[i].range = [this.calculator.jobs[i].from, this.calculator.jobs[i].to];
            }
        }
    }

    // addImageToNote(evt, index, subIndex){
    //     var files = evt.target.files;
    //     this.currentIndex = index;
    //     this.currentSubIndex = subIndex;
    //     for (var i = 0; i < files.length; ++i) {
    //     	var file = files[i];
    // 		if (files && file) {
    // 		    var reader = new FileReader();
    // 		    reader.onload = this._handleReaderLoaded.bind(this);
    // 		    reader.readAsBinaryString(file);
    // 		}	
    //     }
    // }

    // _handleReaderLoaded(readerEvt) {
    //  	var binaryString = readerEvt.target.result;
    //  	if(this.currentSubIndex === undefined){
    //     	this.calculator.jobs[this.currentIndex].images.push('data:image/png;base64,' + btoa(binaryString));
    //     } else {
    //     	this.calculator.jobs[this.currentIndex].children[this.currentSubIndex].images.push('data:image/png;base64,' + btoa(binaryString));
    //     }
    //     this.updateLS();
    // }

    removeNoteImage(index, parent, subIndex) {
        if (subIndex === undefined) {
            this.calculator.jobs[parent].images.splice(index, 1);
        } else {
            this.calculator.jobs[parent].children[subIndex].images.splice(index, 1);
        }
        this.updateLS();
    }

    clickFire(i) {
        let btn = this.eleRef.nativeElement.querySelector('#uploadFilesBtn-' + i);
        btn.click();
    }

    setCustomProvider(index) {
        console.log(this.calculator.jobs[index]);
        // if(!this.calculator.jobs[index].chosenProvider){
        // 	this.calculator.jobs[index].chosenProvider = "";
        // 	this.calculator.jobs[index].priceOffer = "";
        // }
        // this.calculator.jobs[index].customProviderOpen = true;
        // this.updateLS();
    }

    closeCustomProvider(index) {
        this.calculator.jobs[index].customProviderOpen = false;
        this.updateLS();
    }

    needChange(index) {
        if (!this.calculator.jobs[index].need) {
            this.setCustomProvider(index);
        }
    }

    addSubService(parent, index) {
        let id = this.calculator.jobs[parent].children[index].id;
        let need = this.calculator.jobs[parent].children[index].need;
        let subService = this.calculator.jobs.find(x => x.id === id);
        this.calculator.jobs[parent].children[index].defaultShow = need;
        subService.defaultShow = need;
        subService.need = need;
        this.updateLS();
    }

    goToPlan() {
        this.closeModal('plan-success-created');
        this._router.navigate(['/plans']);
    }

    selected(imageResult: ImageResult, index) {
        let img_base64 = imageResult.resized
            && imageResult.resized.dataURL
            || imageResult.dataURL;
        this.calculator.jobs[index].images.push(img_base64);
    }

    expandMobile(event, i) {
        event.stopPropagation();
        this.calculator.jobs[i].mobileExpanded = !this.calculator.jobs[i].mobileExpanded;
    }

    // openMobileService(i){
    //     console.log(i);
    //     this.mobileService = this.calculator.jobs[i];
    //     console.log(this.mobileService);
    //     this.openModal('mobile-service');
    // }

    // MODAL API
    openModal(id: string) {
        this._modalService.open(id);
    }

    closeModal(id: string) {
        this._modalService.close(id);
    }

}