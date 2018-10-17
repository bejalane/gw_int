import { ModuleWithProviders, NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';

import { HttpModule, JsonpModule } from '@angular/http';

import { LoginBackOfficeFormComponent }  from './loginBackOfficeForm.component';

const loginBackOfficeRoute: ModuleWithProviders = RouterModule.forChild ([
 { path: 'bologin', component: LoginBackOfficeFormComponent}
]);

@NgModule({
  imports:      [ BrowserModule, loginBackOfficeRoute, ReactiveFormsModule, HttpModule ],
  declarations: [ LoginBackOfficeFormComponent ]
})
export class LoginBackOfficeModule { }