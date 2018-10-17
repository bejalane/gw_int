import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { Pipe } from '@angular/core';

@Component({
    selector: 'app-image-gallery',
    templateUrl: './image-gallery.component.html',
    styleUrls: ['./image-gallery.component.scss']
})
export class ImageGalleryComponent implements OnInit {
    @Input() images: any[];
    // @Input() videos: any[];
    @Input() startIndex: number;
    @Output() onClose = new EventEmitter();
    currentImage: any;
    currentIndex: number;
    gallery: any[];

    constructor(
       // private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        this.gallery = (this.images && this.images.length) ? this.images.slice() : [];

        for (let i = 0; i < this.gallery.length; i++) {
            // if (this.gallery[i].type === 'video') {
            //     this.gallery[i] = {
            //         type: 'video',
            //         url: this.sanitizer.bypassSecurityTrustHtml(this.getYoutubeEmbed(this.gallery[i].url))
            //     };
            // } else
            if (this.gallery[i].iframe) {
                this.gallery[i].type = 'video';
            } else {
                this.gallery[i] = this.gallery[i].url;
            }
        }
        console.log(this.startIndex);
        this.currentIndex = (this.startIndex) ? this.startIndex : 0;
        this.showImg();
    }

    showImg() {
        this.currentImage = this.gallery[this.currentIndex];
    }

    nextImg() {
        let max = this.gallery.length - 1;
        if (this.currentIndex === max) {
            this.currentIndex = 0;
        } else {
            this.currentIndex = this.currentIndex + 1;
        }
        this.showImg();
    }

    prevImg() {
        let max = this.gallery.length - 1;
        if (this.currentIndex === 0) {
            this.currentIndex = max;
        } else {
            this.currentIndex = this.currentIndex - 1;
        }
        this.showImg();
    }

    close() {
        this.onClose.emit();
    }

    getYoutubeEmbed(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);

        if (match && match[2].length === 11) {
            const html = '<iframe width="560" height="315" src="//www.youtube.com/embed/' + match[2] + '" frameborder="0" allowfullscreen></iframe>';
            return html;
        } else {
            return 'error';
        }
    }

}