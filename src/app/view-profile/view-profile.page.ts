import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { HelperService } from '../shared/helper.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.page.html',
  styleUrls: ['./view-profile.page.scss'],
})
export class ViewProfilePage implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private helper: HelperService,
    private navCtrl: NavController,
  ) { }

  user;
  ngOnInit() {
  }

  ionViewWillEnter() {
  }

  close() {
    this.helper.closeModal()
  }

  privateChat() {
    this.navCtrl.navigateForward("/private-chat/" + this.user.uid);
    this.close();
  }
}
