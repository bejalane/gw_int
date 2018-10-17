import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-fade-overlay',
    templateUrl: './fade-overlay.component.html',
    styleUrls: ['./fade-overlay.component.css']
})
export class FadeOverlayComponent implements OnInit {

    @Input() fadeOut: boolean;

    constructor() { }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {  
            if(propName === 'fadeOut'){
                if(changes[propName].currentValue){
                    this.fadeOutOverlay();
                }
            }
        }
     }


    fadeOutOverlay() {
        let s: any = document.getElementById('fade-overlay').style;
        s.opacity = 1;
        (function fade() { (s.opacity -= .1) < 0 ? s.display = "none" : setTimeout(fade, 10) })();
    }

}
