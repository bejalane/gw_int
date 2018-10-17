import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ModuleWithProviders } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MomentModule } from 'angular2-moment';
import { SocialLoginModule, AuthServiceConfig } from 'angular4-social-login';
import { FacebookLoginProvider } from 'angular4-social-login';

import { AppComponent } from './app.component';

import { LoginModule } from './login/login.module';
import { LoginService } from './login/login.service';

import { RegistrationModule } from './registration/registration.module';
import { RegistrationService } from './registration/registration.service';

// import { HomeModule }  from './home/home.module';
// import { HomeService } from './home/home.service';

import { ClientModule } from './client/client.module';
import { ProviderModule } from './provider/provider.module';
import { CommonModule } from './common/common.module';


import { CalculatorService } from './client/calculator/calculator.service';

// import { TopMenuModule } from './topMenu/topMenu.module';
import {TopMenuService} from './common/topMenu/topMenu.service';

import { SharedModule } from './shared/shared.module';
import { HttpClientService } from './shared/services/httpclient.service';
import { NotifierService } from './shared/services/notifier.service';
import { InfoDataService } from './shared/services/infoData.service';
import { DeviceDetectorModule } from 'ngx-device-detector';

import { LoginBackOfficeModule } from './backoffice/loginBackOffice/loginBackOffice.module';
import { LoginBackOfficeService } from './backoffice/loginBackOffice/loginBackOffice.service';
import { DashboardBackOfficeModule } from './backoffice/dashboardBackOffice/dashboardBackOffice.module';
import { DashboardBackOfficeService } from './backoffice/dashboardBackOffice/dashboardBackOffice.service';

// import { ProviderProfileModule }  from './common/providerProfile/providerProfile.module';
// import { ProviderProfileService } from './common/providerProfile/providerProfile.service';

// import { ProviderListModule }  from './common/providerList/providerList.module';
// import { ProviderListService } from './common/providerList/providerList.service';

// import { DialogsModule }  from './common/dialogs/dialogs.module';
// import { DialogsService } from './common/dialogs/dialogs.service';

import { ModalService } from './shared/modal/modal.service';

// import { ReviewsService } from './common/reviews/reviews.service';

// import { FooterComponent } from './footer/footer.component';

import { FacebookModule } from 'ngx-facebook';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RefreshTokenInterceptor } from './interceptors/refresh-token.interceptor';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

const rootRouting: ModuleWithProviders = RouterModule.forRoot([], { useHash: true });

let config = new AuthServiceConfig([
    {
        id: FacebookLoginProvider.PROVIDER_ID,
        // provider: new FacebookLoginProvider("135338103839796")
        provider: new FacebookLoginProvider("671495263041186")
    }
]);

export function provideConfig() {
    return config;
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        MomentModule,
        rootRouting,
        LoginModule,
        RegistrationModule,
        LoginBackOfficeModule,
        DashboardBackOfficeModule,
        SocialLoginModule,
        ClientModule,
        ProviderModule,
        CommonModule,
        DeviceDetectorModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        FacebookModule.forRoot()
    ],
    providers: [
        LoginService,
        RegistrationService,
        HttpClientService,
        NotifierService,
        InfoDataService,
        LoginBackOfficeService,
        DashboardBackOfficeService,
        CalculatorService,
        DatePipe,
        TopMenuService,
        ModalService,
        {
            provide: AuthServiceConfig,
            useFactory: provideConfig
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: RefreshTokenInterceptor,
            multi: true
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
