import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import {environment} from '../environment';
import {NotifierService} from '../shared/services/notifier.service';
import {SharedUtilsService} from '../shared/services/sharedUtils.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

    constructor(
        private injector: Injector,
        private _sharedUtilsService: SharedUtilsService,
        private _notifierService: NotifierService
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).catch((errorResponse: HttpErrorResponse) => {
            const error = (typeof errorResponse.error !== 'object') ? JSON.parse(errorResponse.error) : errorResponse;
            const oldToken = request.headers.get('Authorization');
            if (errorResponse.status === 401 && error.error.error === 'token_expired') {
                const http = this.injector.get(HttpClient);
                return http.get<any>(`${environment.url}auth/refreshToken`, {
                    headers: new HttpHeaders({
                        'Authorization': oldToken
                    })
                })
                    .flatMap(data => {
                        localStorage.setItem('gw_token', data.token);
                        const cloneRequest = request.clone({setHeaders: {'Authorization': `Bearer ${data.token}`}});

                        return next.handle(cloneRequest);
                    });
            }

            if (
                (errorResponse.status === 400
                || errorResponse.status === 401)
                &&
                (error.error.error === 'token_invalid'
                    || error.error.error === 'token_not_provided')
            ) {
                this.goToLogin();
            }

            if (errorResponse.status === 401 && error.error.error === 'token_has_been_blacklisted') {
                this.goToLogin();
            }


            return Observable.throw(errorResponse);
        });
    }

    goToLogin() {
        this._sharedUtilsService.logoutProcedure();
        this._notifierService.notifyOther({option: 'generalError', data: {title: 'your_session_has_expired'}});
    }
}
