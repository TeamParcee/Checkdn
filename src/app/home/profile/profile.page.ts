import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { HelperService } from 'src/app/shared/helper.service';
import { AuthService } from 'src/app/auth/auth.service';
import { NavController } from '@ionic/angular';
import { CropImagePage } from './crop-image/crop-image.page';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private helper: HelperService,
    private authService: AuthService,
    private navCtrl: NavController,
    private sanitizer: DomSanitizer
  ) { }

  user;
  originalUser;


  ngOnInit() {
  }

  ionViewWillEnter() {
    let uid = localStorage.getItem('uid');
    firebase.firestore().doc("/users/" + uid).get().then((userSnap) => {
      this.user = userSnap.data();
      this.originalUser = userSnap.data();
    })
  }

  cropImage(input) {
    let file = input.srcElement.files[0];
    // this.user.photo =  this.sanitizer.bypassSecurityTrustResourceUrl(this.user.photo);
    this.helper.openModalPromise(CropImagePage, { dataUrl: file }).then((image) => {
      if (image == undefined) {
        image = this.originalUser.photo;
      }
      this.user.photo = image;
    })
  }


  sanitizePhoto(photo) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(photo)
  }
  cancelPic() {
    this.user.photo = this.originalUser.photo;
  }

  savePic() {
    firebase.firestore().doc("/users/" + this.user.uid).update({ photo: this.user.photo });
    this.originalUser.photo = this.user.photo;
  }

  saveFacebook() {
    firebase.firestore().doc("/users/" + this.user.uid).update({ facebook: this.user.facebook });
    this.originalUser.facebook = this.user.facebook;
  }

  saveLinkedin() {
    firebase.firestore().doc("/users/" + this.user.uid).update({ linkedin: this.user.linkedin });
    this.originalUser.linkedin = this.user.linkedin;


    console.log(this.user.linkedin, this.originalUser.linkedin);
  }


  testFacebook() {

    // ex. link https://www.facebook.com/test
    let facebook = "fb://facewebmodal/f?href=";
    let facebookLink = facebook + this.user.facebook;
    window.open('fb://facewebmodal/f?href=https://www.facebook.com/adiontae.gerron', '_system');


  }

  testLinkedin() {

  }
}
