import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor() { }

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

  saveFname() {
    firebase.firestore().doc("/users/" + this.user.uid).update({ fname: this.user.fname });
    this.originalUser.fname = this.user.fname;
  }

  saveLname() {
    firebase.firestore().doc("/users/" + this.user.uid).update({ lname: this.user.lname });
    this.originalUser.lname = this.user.lname;
  }

  saveEmail() {
    firebase.firestore().doc("/users/" + this.user.uid).update({ email: this.user.email})
    firebase.auth().currentUser.updateEmail(this.user.email);
    this.originalUser.email = this.user.email
  }
}
