import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { HttpModule, JsonpModule } from '@angular/http';

import { DashboardBackOfficeComponent } from './dashboardBackOffice.component';

const dashboardBackOfficeRoute: ModuleWithProviders = RouterModule.forChild ([
 { path: 'bodashboard', component: DashboardBackOfficeComponent}
]);

@NgModule({
  imports:      [ BrowserModule, dashboardBackOfficeRoute, ReactiveFormsModule, HttpModule, FormsModule ],
  declarations: [ DashboardBackOfficeComponent ]
})
export class DashboardBackOfficeModule { }