import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NotifierService {
    private notify = new Subject<any>();
    /**
     * Observable string streams
     */
    notifyObservable$ = this.notify.asObservable();

    constructor() {}

    public notifyOther(data: any) {
        if (data) {
            this.notify.next(data);
        }
    }

    public displayErrors(error: any) {
        const errorData = error.error;
        if (errorData.errors) {
            const errorsArray = [];
            for (const x in errorData.errors) {
                const err = {
                    field: x,
                    value: errorData.errors[x]
                };
                errorsArray.push(err);
            }
            this.notifyOther({option: 'generalError', data: {title: 'invalid_fields', text: errorsArray}});
        } else {
            this.notifyOther({option: 'generalError', data: {title: errorData.message}});
        }
        this.notifyOther({option: 'appLoader', turnOn: false});
    }
}
