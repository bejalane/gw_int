import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mobile-service',
  templateUrl: './mobile-service.component.html',
  styleUrls: ['./mobile-service.component.css']
})
export class MobileServiceComponent implements OnInit {
    @Input() service: any;
    @Output() onClose = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
      console.log(this.service);
  }

}
