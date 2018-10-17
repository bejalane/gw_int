import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

import { RegistrationModule } from '../registration/registration.module';
import { LoginModule } from '../login/login.module';
import { CalculatorModule } from '../client/calculator/calculator.module';

// import { DialogsComponent } from './dialogs/dialogs.component';
import { DialogsService } from './dialogs/dialogs.service';
import { ModalModule } from '../shared/modal/modal.module';
import { ProviderListComponent } from './providerList/providerList.component';
import { ProviderListService } from './providerList/providerList.service';
import { ProviderProfileComponent } from './providerProfile/providerProfile.component';
import { ProviderProfileService } from './providerProfile/providerProfile.service';
import { ReviewsComponent } from './reviews/reviews.component';
import { ReviewsService } from './reviews/reviews.service';
import { FooterComponent } from './footer/footer.component';
import { TopMenuComponent } from './topMenu/topMenu.component';
import { HomeComponent } from './home/home.component';
import { HomeService } from './home/home.service';
import { SharedModule } from '../shared/shared.module';
import { MessagesComponent } from './messages/messages.component';
import { MessageChainsComponent } from './message-chains/message-chains.component';
import { ImageUploadModule } from 'ng2-imageupload';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



const commonRoutes: ModuleWithProviders = RouterModule.forChild([
    { path: '', component: HomeComponent },
    { path: 'messages/:companion', component: MessagesComponent },
    { path: 'messages', component: MessageChainsComponent },
    { path: 'providers-list', component: ProviderListComponent },
    { path: 'providerprofile/:id', component: ProviderProfileComponent }
]);

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        commonRoutes,
        ModalModule,
        HttpClientModule,
        RegistrationModule,
        CalculatorModule,
        LoginModule,
        SharedModule,
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
        DialogsService,
        ProviderListService,
        ProviderProfileService,
        ReviewsService,
        HomeService
    ],
    declarations: [
        // DialogsComponent,
        ProviderListComponent,
        ProviderProfileComponent,
        ReviewsComponent,
        FooterComponent,
        TopMenuComponent,
        HomeComponent,
        MessagesComponent,
        MessageChainsComponent
    ],
    exports: [
        ReviewsComponent,
        FooterComponent,
        TopMenuComponent
    ]
})
export class CommonModule { }
