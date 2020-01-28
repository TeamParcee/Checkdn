import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { HelperService } from 'src/app/shared/helper.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-crop-image',
  templateUrl: './crop-image.page.html',
  styleUrls: ['./crop-image.page.scss'],
})
export class CropImagePage implements OnInit {

  constructor(
    private helper: HelperService,
    private modalCtrl: ModalController,
  ) { }
  dataUrl;
  failedLoad = false;
  ngOnInit() {
  }
  ionViewWillEnter() {
  }

  ;
  imageChangedEvent: any = '';
  croppedImage: any = '';

  ionViewDidEnter() {
    if (!this.dataUrl) {
      this.failedLoad = true;
    }
  }
  doRefresh(event) {
    // this.dataUrl = this.userService.cropImage;
    event.target.complete();
  }
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    this.failedLoad = true;
  }

  close() {
    this.helper.closeModal()
  }
  save() {
    // this.userService.photoURL = this.croppedImage;
    // this.helper.closeModal();
    this.modalCtrl.dismiss(this.croppedImage)
  }
}