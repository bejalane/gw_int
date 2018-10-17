import { ModuleWithProviders, NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ModalComponent }  from './modal.component';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ ModalComponent ],
  exports: [ModalComponent]
})
export class ModalModule { }