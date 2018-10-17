import { ModuleWithProviders, NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HttpModule, JsonpModule } from '@angular/http';

import { RegistrationComponent }  from './registration.component';

const loginRoute: ModuleWithProviders = RouterModule.forChild ([
 { path: 'registration', component: RegistrationComponent}
]);

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
  imports:      [ BrowserModule, loginRoute, ReactiveFormsModule, HttpModule, TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }) ],
  declarations: [ RegistrationComponent ],
  exports: [RegistrationComponent]
})
export class RegistrationModule { }