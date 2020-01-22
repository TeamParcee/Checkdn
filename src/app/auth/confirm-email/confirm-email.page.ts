import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { NavController } from '@ionic/angular';
import { HelperService } from 'src/app/shared/helper.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.page.html',
  styleUrls: ['./confirm-email.page.scss'],
})
export class ConfirmEmailPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private helper: HelperService,
    private authService: AuthService,
  ) {

  }

  interval;
  email = firebase.auth().currentUser.email;

  ngOnInit() {
    if (firebase.auth().currentUser.emailVerified == false) {
      this.sendEmailVerification();
    }
  }




  ionViewWillEnter(){
    this.checkEmailConfirmed();
  }

  ionViewWillLeave(){
    clearInterval(this.interval)
  }
  checkEmailConfirmed() {
    this.interval = setInterval(() => {
      firebase.auth().currentUser.reload();
      if (firebase.auth().currentUser.emailVerified) {
        this.navCtrl.navigateForward("/home")
      }
    }, 1000)
  }

  sendEmailVerification() {
    firebase.auth().currentUser.sendEmailVerification().then(() => {
      this.helper.okAlert("Email Verification", "A verification email has been sent.")
    })
  }

  changeEmail() {
    let alertInput = [{
      name: 'email',
      placeholder: "New Email",
      value: this.email,
    }];

    this.helper.inputAlert("Change Email", "Please enter your new email address", alertInput).then((result:any)=>{
      firebase.auth().currentUser.updateEmail(this.email).then(()=>{
        this.sendEmailVerification();
      }).catch((error)=>{
        this.helper.okAlert("We have a problem", error.message)
      })
    })
  }

  logout(){
    this.authService.logout().then(()=>{
      this.navCtrl.navigateBack("/login")
    })
  }
}
