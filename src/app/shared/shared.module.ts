import { ModuleWithProviders, NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { LanguageClassService } from './services/languageClass.service';
import { SharedSettingsService } from './services/sharedSettings.service';
import { VideoUrlService } from './services/videoUrl.service';
import { FadeOverlayComponent } from './fade-overlay/fade-overlay.component';
import { ImagesService } from './services/images.service';
import { ImageGalleryComponent } from './image-gallery/image-gallery.component';
import { SharedUtilsService } from './services/sharedUtils.service';

@NgModule({
  imports: [ BrowserModule, HttpModule ],
  declarations: [FadeOverlayComponent, ImageGalleryComponent],
  providers: [LanguageClassService, SharedSettingsService, ImagesService, SharedUtilsService, VideoUrlService],
  exports: [FadeOverlayComponent, ImageGalleryComponent]
})
export class SharedModule { }