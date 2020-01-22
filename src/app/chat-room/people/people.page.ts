import { Component, OnInit } from '@angular/core';
import { PlaceService } from 'src/app/home/place.service';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { NavController } from '@ionic/angular';
import { HelperService } from 'src/app/shared/helper.service';
import { ViewProfilePage } from 'src/app/view-profile/view-profile.page';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit {

  constructor(
    private placeService: PlaceService,
    private navCtrl: NavController,
    private helper: HelperService,
  ) { }

  place = this.placeService.place;
  people;

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getPeople();
  }
  getPeople() {
    if (!this.place) {
      this.navCtrl.navigateRoot("/home");
      return; 
    }
    firebase.firestore().collection("/users/")
      .where("place", "==", this.place.id)
      .onSnapshot((peopleSnap) => {
        let people = [];
        peopleSnap.forEach((person) => {
          people.push(person.data())
        })
        this.people = people;
      })
  }

  getUsersFromUid(uid: string) {
    return new Promise((resolve) => {
      firebase.firestore().doc("/users/" + uid).get().then((userSnap) => {
        return resolve(userSnap.data())
      })
    })
  }

  viewProfile(person) {
    this.helper.openModal(ViewProfilePage, { user: person })
  }
}
