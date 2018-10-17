import { Component } from '@angular/core';
// import { TopMenuComponent } from './common/topMenu/topMenu.component';
// import { FooterComponent } from './common/footer/footer.component';
import { TranslateService } from '@ngx-translate/core';
// import * as $ from 'jquery';
import { LanguageClassService } from './shared/services/languageClass.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    selector: 'app-root',
    template: `
  	<top-menu></top-menu>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
    styleUrls: ['./app.component.scss']
})

export class AppComponent {
    constructor(
        private translate: TranslateService,
        private _languageClassService: LanguageClassService
    ) {
        let language = Cookie.get('userLanguage');
        if (!language) {
            language = 'he_IL';
            Cookie.set('userLanguage', language);
        }
        translate.use(language);
        _languageClassService.setBodyClass(language);
    }
}
