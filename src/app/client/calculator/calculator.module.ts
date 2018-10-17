import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { ImageUploadModule } from 'ng2-imageupload';

import { HttpModule, JsonpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CalculatorComponent }  from './calculator.component';
import { ModalModule } from '../../shared/modal/modal.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CalendarModule } from 'primeng/primeng';
import { MobileServiceComponent } from './mobile-service/mobile-service/mobile-service.component';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
@NgModule({
  imports: [
      BrowserModule,
      NouisliderModule,
      ReactiveFormsModule,
      FormsModule,
      HttpModule,
      ModalModule,
      ImageUploadModule,
      CalendarModule,
      TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    })],
  declarations: [ CalculatorComponent, MobileServiceComponent ],
  exports: [ CalculatorComponent ]
})
export class CalculatorModule { }