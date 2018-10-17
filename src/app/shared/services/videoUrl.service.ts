import { Injectable, Inject } from '@angular/core';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';

@Injectable()
export class VideoUrlService {



    constructor (
        private _http: HttpClient,
        private sanitizer: DomSanitizer
    ) {}


    parseVideo (url) {
        // - Supported YouTube URL formats:
        //   - http://www.youtube.com/watch?v=My2FRPA3Gf8
        //   - http://youtu.be/My2FRPA3Gf8
        //   - https://youtube.googleapis.com/v/My2FRPA3Gf8
        // - Supported Vimeo URL formats:
        //   - http://vimeo.com/25451551
        //   - http://player.vimeo.com/video/25451551
        // - Also supports relative URLs:
        //   - //player.vimeo.com/video/25451551

        url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

        let type;
        if (RegExp.$3.indexOf('youtu') > -1) {
            type = 'youtube';
        } else if (RegExp.$3.indexOf('vimeo') > -1) {
            type = 'vimeo';
        } else {
            return {
                type: '',
                id: ''
            };
        }

        return {
            type: type,
            id: RegExp.$6
        };
    }

    createUrlIframe (videoObj) {
        // Returns an iframe of the video with the specified URL.
        let url = {};
        if (videoObj.type === 'youtube') {
            url = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + videoObj.id);
        } else if (videoObj.type === 'vimeo') {
            url = this.sanitizer.bypassSecurityTrustResourceUrl('//player.vimeo.com/video/' + videoObj.id);
        }
        return url;
        // if (videoObj) {
        //     const $iframe = $('<iframe>', {width: width, height: height});
        //     $iframe.attr('frameborder', 0);
        //     if (videoObj.type == 'youtube') {
        //         $iframe.attr('src', '//www.youtube.com/embed/' + videoObj.id);
        //     } else if (videoObj.type == 'vimeo') {
        //         $iframe.attr('src', '//player.vimeo.com/video/' + videoObj.id);
        //     }
        //     return $iframe;
        // } else {
        //     return '';
        // }
    }


    getYoutubeThumbnail (videoObj) {
        return '//img.youtube.com/vi/' + videoObj.id + '/0.jpg';
    }

    getVimeoThumbnail (videoObj) {
        return this._http.get('http://vimeo.com/api/v2/video/' + videoObj.id + '.json');
    }


    createVideoObj (url) {
        const video = {
            link: '',
            thumbnail: '',
            iframe: {}
        };
        video.link = url;

        let videoObj = this.parseVideo(url);

        if (videoObj.type !== '') {
            video.iframe = this.createUrlIframe(videoObj);
        }

        if (videoObj.type === 'youtube') {
            video.thumbnail = this.getYoutubeThumbnail(videoObj);
        } else if (videoObj.type === 'vimeo') {
            this.getVimeoThumbnail(videoObj)
                .subscribe(data => {
                    video.thumbnail = data[0].thumbnail_medium;
                });
        } else { return false; }

        console.log(video);
        return video;
    }
}