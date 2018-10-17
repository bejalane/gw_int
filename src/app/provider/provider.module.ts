import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { SharedModule } from '../shared/shared.module';
import { ModalModule } from '../shared/modal/modal.module';
import { ImageUploadModule } from 'ng2-imageupload';

import { AppliedJobsProviderComponent }  from './appliedJobsProvider/appliedJobsProvider.component';
import { AppliedJobsProviderService } from './appliedJobsProvider/appliedJobsProvider.service';
import { JobProviderComponent }  from './jobProvider/jobProvider.component';
import { JobProviderService } from './jobProvider/jobProvider.service';
import { JobsListProviderComponent }  from './jobsListProvider/jobsListProvider.component';
import { JobsListProviderService } from './jobsListProvider/jobsListProvider.service';
import { SettingsProviderComponent }  from './settingsProvider/settingsProvider.component';
import { SettingsProviderService } from './settingsProvider/settingsProvider.service';
import { WishlistProviderComponent }  from './wishlistProvider/wishlistProvider.component';
import { WishlistProviderService } from './wishlistProvider/wishlistProvider.service';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {JobProviderTmplComponent} from './jobProviderTmpl/jobProviderTmpl.component';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

const clientRoutes: ModuleWithProviders = RouterModule.forChild([
    { path: 'applied-jobs', component: AppliedJobsProviderComponent},
    { path: 'job/:id', component: JobProviderComponent},
    { path: 'jobs-list', component: JobsListProviderComponent},
    { path: 'providerSettings', component: SettingsProviderComponent},
    { path: 'wishlist-provider', component: WishlistProviderComponent}
]);

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        clientRoutes,
        SharedModule,
        ModalModule,
        ImageUploadModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        AppliedJobsProviderService,
        JobProviderService,
        JobsListProviderService,
        SettingsProviderService,
        WishlistProviderService
    ],
    declarations: [
        AppliedJobsProviderComponent,
        JobProviderComponent,
        JobsListProviderComponent,
        SettingsProviderComponent,
        WishlistProviderComponent,
        JobProviderTmplComponent
    ],
    exports: [
        JobProviderTmplComponent
    ]
})
export class ProviderModule { }