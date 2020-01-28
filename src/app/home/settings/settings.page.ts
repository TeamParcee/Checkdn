import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { AuthService } from 'src/app/auth/auth.service';
import { HelperService } from 'src/app/shared/helper.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private authService: AuthService,
    private helper: HelperService,
    private navCtrl: NavController,
  ) { }

  originalUser;
  user;

  ngOnInit() {
  }

  ionViewWillEnter() {
    let uid = localStorage.getItem('uid');
    firebase.firestore().doc("/users/" + uid).get().then((userSnap) => {
      this.user = userSnap.data();
      this.originalUser = userSnap.data();
    })
  }
  
  saveFname() {
    firebase.firestore().doc("/users/" + this.user.uid).update({ fname: this.user.fname });
    this.originalUser.fname = this.user.fname;
  }

  saveLname() {
    firebase.firestore().doc("/users/" + this.user.uid).update({ lname: this.user.lname });
    this.originalUser.lname = this.user.lname;
  }

  saveEmail() {
    firebase.firestore().doc("/users/" + this.user.uid).update({ email: this.user.email })
    firebase.auth().currentUser.updateEmail(this.user.email);
    this.originalUser.email = this.user.email
  }

  logout() {
    this.authService.logout().then(() => {
      this.navCtrl.navigateBack("/login")
    })
  }

  delete() {
    this.helper.confirmationAlert("Delete Account", "Are you sure you want to delete you account?", { denyText: "Cancel", confirmText: "Delete Account" })
      .then((result) => {
        if (result) {
          this.authService.deleteAccount().then(() => {
            this.navCtrl.navigateBack("/login");
          })
        }
      })
  }



}
