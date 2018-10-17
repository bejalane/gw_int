import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environment';
import { HttpClientService } from '../../shared/services/httpclient.service';
import { Calculator, Job, SaveJob, SaveCustomJob } from './calculator.model';
import { DatePipe } from '@angular/common';
import { cloneDeep } from "lodash";

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class CalculatorService {
    constructor(
        private _http: HttpClientService,
        private _datePipe: DatePipe
    ) { }
    getCalculatorData(mode: string, planId: any): Observable<any> {
        let url = (mode === 'plan') ? 'planCtrl/getMoreServicesForPlan/' + planId : 'calculatorCtrl/getCalculatorData';
        return this._http.get(environment.url + url)
        // .map((response:Response) => response.json())
            .catch((error: any) => Observable.throw(error))
    }

    savePlan(calculator: any): Observable<any> {
        let plan = this.getPlanToSave(calculator, null);
        var fd = new FormData();
        fd.append("plan", plan);
        return this._http.post(environment.url + 'calculatorCtrl/savePlan', plan)
        // .map((response:Response) => response.json())
            .catch((error: any) => Observable.throw(error))
    }

    addJobsToPlan(calculator: any, planId: number, mode: string): Observable<any> {
        let plan = this.getPlanToSave(calculator, mode);
        console.log(plan);
        var fd = new FormData();
        fd.append("plan", plan);
        return this._http.post(environment.url + 'planCtrl/addJobsToPlan/' + planId, plan)
        // .map((response:Response) => response.json())
            .catch((error: any) => Observable.throw(error))
    }

    createCalculator(services: any, mode: string, currentPlan: any) {
        let calculatorExisted = JSON.parse(localStorage.getItem("userCalculator"));
        let newCalculator;
        if (calculatorExisted && (mode !== "plan")) {
            newCalculator = calculatorExisted;
        } else {
            newCalculator = this.createCalculatorObject(services, mode, currentPlan);
        }
        return newCalculator;
    }

    createCalculatorObject(services, mode, currentPlan) {
        let planName = "";
        let today = new Date();
        let presetDate = this._datePipe.transform(today.setMonth(today.getMonth() + 6), 'dd.MM.yyyy');
        console.log(presetDate);
        let guests = 300;
        if (mode === "plan") {
            planName = currentPlan.name;
            presetDate = currentPlan.date;
            guests = 300;
        }
        let jobs = [];
        for (var i = 0; i < services.length; ++i) {
            let minBudget = (services[i].perGuestCalc) ? parseInt(services[i].minBudget) * guests : services[i].minBudget;
            let maxBudget = (services[i].perGuestCalc) ? parseInt(services[i].maxBudget) * guests : services[i].maxBudget;
            let children = [];
            for (var n = 0; n < services[i].children.length; ++n) {
                let minBudget = (services[i].children[n].perGuestCalc) ? parseInt(services[i].children[n].minBudget) * guests : services[i].children[n].minBudget;
                let maxBudget = (services[i].children[n].perGuestCalc) ? parseInt(services[i].children[n].maxBudget) * guests : services[i].children[n].maxBudget;
                if (!minBudget) { minBudget = 0 }
                if (!maxBudget) { maxBudget = 500 }
                // let order = parseInt((i+1) + '000') + n + 1;
                let need = (mode === 'plan') ? false : services[i].children[n].byDefault;
                let newChildrenJob = new Job(services[i].children[n].name, services[i].children[n].byDefault, services[i].children[n].id, minBudget, maxBudget, "", [], false, [], services[i].children[n].perGuest, services[i].children[n].minBudget, services[i].children[n].maxBudget, services[i].children[n].order, services[i].id, false, false, "", services[i].children[n].perGuest);
                // console.log(newChildrenJob);
                children.push(newChildrenJob);
            }
            // let order = parseInt((i+1) + '000');
            // let need = (services[i].id === 9 || services[i].id === 7) ? false : true;
            let hasChildren = (children.length) ? true : false;
            let need = (mode === 'plan') ? false : services[i].byDefault;
            let categoryName = '';
            switch (services[i].name) {
                case 'place_of_event_provider':
                    categoryName = 'place_categoty';
                    break;
                case 'photography_provider':
                    categoryName = 'media_category';
                    break;
                case 'hair_provider':
                    categoryName = 'look_category';
                    break;
                case 'invitations_provider':
                    categoryName = 'guests_category';
                    break;
                case 'attractions_provider':
                    categoryName = 'attractions_category';
                    break;
            }
            let newJob = new Job(services[i].name, need, services[i].id, minBudget, maxBudget, "", [], false, children, services[i].perGuest, services[i].minBudget, services[i].maxBudget, services[i].order, null, true, hasChildren, categoryName, services[i].perGuest);
            jobs.push(newJob);
            if (hasChildren) {
                let conc = jobs.concat(children);
                jobs = conc.slice();
            }
        }

        let calculator = new Calculator(planName, 1, guests, presetDate, "", jobs);
        return calculator;
    }

    getPlanToSave(calculator, mode) {
        let jobs = [];
        for (var i = 0; i < calculator.jobs.length; ++i) {
            if (calculator.jobs[i].need && !calculator.jobs[i].hasChildren) {
                if (!calculator.jobs[i].customProviderOpen) {
                    let newJob = new SaveJob(calculator.jobs[i].id, calculator.jobs[i].from, calculator.jobs[i].to, calculator.jobs[i].note, calculator.jobs[i].images);
                    jobs.push(newJob);
                } else {
                    let newCustomJob = new SaveCustomJob(calculator.jobs[i].id, calculator.jobs[i].from, calculator.jobs[i].to, calculator.jobs[i].note, calculator.jobs[i].images, calculator.jobs[i].chosenProvider, calculator.jobs[i].priceOffer);
                    jobs.push(newCustomJob);
                }
            }
        }
        let plan;
        if (mode === 'plan') {
            plan = {
                jobs: jobs
            }
        } else {
            plan = new Calculator(calculator.planName, calculator.area, calculator.guests, calculator.date, calculator.aboutUs, jobs);
        }
        console.log(plan);
        return plan;
    }

    updateLS(calculatorObject) {
        let calculatorForSave = cloneDeep(calculatorObject);
        for (var i = 0; i < calculatorForSave.jobs.length; ++i) {
            calculatorForSave.jobs[i].noteExpanded = false;
            if (calculatorForSave.jobs[i].children.length) {
                for (var n = 0; n < calculatorForSave.jobs[i].children.length; ++n) {
                    calculatorForSave.jobs[i].children[n].noteExpanded = false;
                }
            }
        }
        let dateToSave = new Date(calculatorForSave.date);
        calculatorForSave.date = dateToSave.getDate() + '.' + (dateToSave.getMonth() + 1) + '.' + dateToSave.getFullYear();
        localStorage.setItem("userCalculator", JSON.stringify(calculatorForSave));
    }

    cleanCalculator() {
        //let calculatorExisted = localStorage.getItem("userCalculator");
        //localStorage.removeItem("userCalculator_1");
        //console.log(calculatorExisted);
        //localStorage.setItem("userCalculator_1", JSON.stringify(calculatorExisted));
        localStorage.removeItem("userCalculator");
    }

    calculateTotals(calculator, guests) {
        let from = 0;
        let to = 0;
        for (let job of calculator.jobs) {
            if (job.need) {
                if (!job.perGuest) {
                    from = from + job.from;
                    to = to + job.to;
                } else {
                    from = from + (job.from * parseInt(guests));
                    to = to + (job.to * parseInt(guests));
                }
            }
        }
        return { from: from, to: to };
    }
}