import { Injectable, Inject } from '@angular/core';

@Injectable()
export class SharedSettingsService {

    facebookAppId = '671495263041186';
    appUrl = 'http://getwedd.slstaging.tk';

    getDatepickerLocale(lang) {
        switch (lang) {
            case 'en_US':
                return {
                    firstDayOfWeek: 1,
                    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    today: 'Today',
                    clear: 'Clear'
                };
            case 'he_IL':
                return {
                    firstDayOfWeek: 0,
                    dayNames: [ "ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"],
                    dayNamesShort: ["א'","ב'","ג'","ד'","ה'","ו'","שבת"],
                    dayNamesMin: ["א'","ב'","ג'","ד'","ה'","ו'","שבת"],
                    monthNames: [ "ינואר","פברואר","מרץ","אפריל","מאי","יוני", "יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"],
                    monthNamesShort: [ "ינו","פבר","מרץ","אפר","מאי","יוני", "יולי","אוג","ספט","אוק","נוב","דצמ"],
                    today: 'היום',
                    clear: 'נקה'
                };
        }
    }

    getExcerptLength(entity){
        let excerpt = {
            jobDescription: 35,
            offerMessage: 20
        }
        return excerpt[entity];
    }
}