import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LoaderComponent } from './loader.component';

@NgModule({
  imports: [ BrowserModule ],
  declarations: [LoaderComponent],
  exports: [LoaderComponent]
})
export class LoaderModule { }