import { Injectable } from '@angular/core';
import * as $ from 'jquery';

@Injectable()
export class LanguageClassService {

    setBodyClass(language){
        if ($('html').attr('lang')) {
            let previousClass = $('html').attr('lang');
            $('body').removeClass(`lang-${previousClass}`);
        }
        $('body').removeClass('rtl');
        $('html').attr('dir', 'ltr');
        if(language === 'he_IL'){
            $('body').addClass('rtl');
            $('html').attr('dir', 'rtl');
        }
        $('html').attr('lang', language);
        $('body').addClass(`lang-${language}`);
    }

}