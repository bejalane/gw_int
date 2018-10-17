import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { NouisliderModule } from 'ng2-nouislider';
import { SharedModule } from '../shared/shared.module';
import { CalendarModule } from 'primeng/primeng';
import { ImageUploadModule } from 'ng2-imageupload';

import { CommonModule } from '../common/common.module';

import { CalculatorModule } from './calculator/calculator.module';
import { ModalModule } from '../shared/modal/modal.module';

import { JobClientComponent } from './jobClient/jobClient.component';
import { JobClientService } from './jobClient/jobClient.service';
import { PlansComponent } from './plans/plans.component';
import { PlansService } from './plans/plans.service';
import { SettingsClientComponent }  from './settingsClient/settingsClient.component';
import { SettingsClientService } from './settingsClient/settingsClient.service';
import { WishlistClientComponent }  from './wishlistClient/wishlistClient.component';
import { WishlistClientService } from './wishlistClient/wishlistClient.service';
import { JobClientTmplComponent } from './jobClient/jobClientTmpl/jobClientTmpl.component';
import { JobClientEditComponent } from './plans/job-client-edit/job-client-edit.component';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

const clientRoutes: ModuleWithProviders = RouterModule.forChild([
    { path: 'joboffers/:id', component: JobClientComponent },
    { path: 'plans', component: PlansComponent},
    { path: 'userSettings', component: SettingsClientComponent},
    { path: 'wishlist', component: WishlistClientComponent}
]);


@NgModule({
    imports: [
        BrowserModule,
        NouisliderModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        clientRoutes,
        CalculatorModule,
        ModalModule,
        SharedModule,
        CalendarModule,
        BrowserAnimationsModule,
        ImageUploadModule,
        CommonModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        JobClientService,
        PlansService,
        SettingsClientService,
        WishlistClientService
    ],
    declarations: [
        JobClientComponent,
        PlansComponent,
        SettingsClientComponent,
        WishlistClientComponent,
        JobClientTmplComponent,
        JobClientEditComponent,
    ],
    exports: [
        JobClientComponent,
        PlansComponent,
        SettingsClientComponent,
        WishlistClientComponent,
        JobClientTmplComponent
    ]
})
export class ClientModule { }