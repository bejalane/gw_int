// import { ModuleWithProviders, NgModule }      from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { RouterModule, Routes } from '@angular/router';
// import { FormsModule } from '@angular/forms'
// import { ReactiveFormsModule } from '@angular/forms';
// import { HttpModule, JsonpModule } from '@angular/http';
// import { HomeComponent }  from './home.component';
// import { CalculatorModule }  from '../client/calculator/calculator.module';
// import { LoginModule }  from '../login/login.module';
// import { RegistrationModule }  from '../registration/registration.module';

// import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http);
// }

// const loginRoute: ModuleWithProviders = RouterModule.forChild ([
//  { path: '', component: HomeComponent}
// ]);

// @NgModule({
//   imports: [ 
//   BrowserModule, 
//   loginRoute, 
//   ReactiveFormsModule, 
//   FormsModule, 
//   HttpModule, 
//   CalculatorModule,
//   HttpClientModule,
//   LoginModule,
//   RegistrationModule,
//     TranslateModule.forRoot({
//       loader: {
//         provide: TranslateLoader,
//         useFactory: HttpLoaderFactory,
//         deps: [HttpClient]
//       }
//     }) 
//   ],
//   declarations: [ HomeComponent ]
// })
// export class HomeModule { }