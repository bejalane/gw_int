import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { JobClientService } from '../../jobClient/jobClient.service';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import { ModalService } from '../../../shared/modal/modal.service';
import { NotifierService } from '../../../shared/services/notifier.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { setTimeout } from 'timers';

@Component({
    selector: 'app-job-client-edit',
    templateUrl: './job-client-edit.component.html'
})
export class JobClientEditComponent implements OnInit {

    editJobForm: FormGroup;

    @Input() job: any;
    resizeOptions: ResizeOptions = {
        resizeMaxHeight: 1200,
        resizeMaxWidth: 1200,
        resizeQuality: 0.7,
        resizeType: 'image/jpeg'
    };

    constructor(
        private fb: FormBuilder,
        private eleRef: ElementRef,
        private _jobClientService: JobClientService,
        private _modalService: ModalService,
        private _notifierService: NotifierService
    ) {
        this.editJobForm = this.fb.group({
            budgetFrom : new FormControl('', [
                Validators.required,
                Validators.pattern('^\\d+$')
            ]),
            budgetTo : new FormControl('', [
                Validators.required,
                Validators.pattern('^\\d+$')
            ]),
            description : new FormControl(''),
            images : new FormControl('')
        }, {
            validator: this.budgetsCompare
        });
    }

    ngOnInit() {
        console.log(this.job);
        this._notifierService.notifyOther({ option: 'appLoader', turnOn: false });
    }

    budgetsCompare(control) {
        let budgetFrom = control.get('budgetFrom').value;
        let budgetTo = control.get('budgetTo').value;
        if ( parseInt(budgetFrom) >= parseInt(budgetTo) ) {
            control.get('budgetTo').setErrors( { greaterThan : true } );
        } else {
            control.get('budgetTo').setErrors( null );
        }
    }

    selected(imageResult: ImageResult, index) {
        let img_base64 = imageResult.resized
            && imageResult.resized.dataURL
            || imageResult.dataURL;
        this.job.images.push(img_base64);
    }

    removeNoteImage(event, index) {
        event.stopPropagation();
        this.job.images.splice(index, 1);
    }

    clickFire(i) {
        let btn = this.eleRef.nativeElement.querySelector('#uploadFilesBtn');
        btn.click();
    }

    update() {
        this._notifierService.notifyOther({ option: 'appLoader', turnOn: true });
        let images = [];
        for (let img of this.job.images) {
            let imgForUpdate = (img.id) ? img.id : img;
            images.push(imgForUpdate);
        }
        let update = {
            budgetFrom: parseInt(this.job.budgetFrom),
            budgetTo: parseInt(this.job.budgetTo),
            description: this.job.description,
            images: images
        };
        console.log(update);
        this._jobClientService.editJob(this.job.id, update)
            .subscribe(
                data => {
                    console.log(data);
                    this.closeModal('edit-job');
                    this._notifierService.notifyOther({
                        option: 'generalMessages',
                        data: {title: 'success', text: 'job_edited_successfully'}
                    });
                    this._notifierService.notifyOther({option: 'appLoader', turnOn: false});
                    this._notifierService.notifyOther({option: 'updatePlanInfo'});
                },
                errorData => {
                    console.log(errorData.error);
                    this._notifierService.displayErrors(errorData);
                }
            );
    }

    cancelJob() {
        this._jobClientService.cancelJob(this.job.id)
            .subscribe(
                data => {
                    this.closeModal('edit-job');
                    this._notifierService.notifyOther({option: 'updatePlanInfo'});
                },
                errorData => {
                    console.log(errorData.error);
                    this._notifierService.notifyOther({option: 'generalError', data: {title: errorData.error.message}});
                }
            );
    }

    reopenJob(){
        this._jobClientService.reopenJob(this.job.id)
            .subscribe(
                data => {
                    console.log(data);
                    this.closeModal('edit-job');
                    this._notifierService.notifyOther({option: 'updatePlanInfo'});
                },
                errorData => {
                    console.log(errorData.error);
                    this._notifierService.notifyOther({option: 'generalError', data: {title: errorData.error.message}});
                }
            );
    }

    //MODAL API
    openModal(id: string) {
        this._modalService.open(id);
    }

    closeModal(id: string) {
        this._modalService.close(id);
    }

}
