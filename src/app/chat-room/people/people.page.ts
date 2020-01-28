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

  place;
  people;
  filterPeople: any[];

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getPeople();
  }
  async getPeople() {
    let uid = localStorage.getItem('uid');
    let userSnap = await firebase.firestore().doc("/users/" + uid).get()
    let user = userSnap.data();

    firebase.firestore().collection("/users/")
      .where("place", "==", user.place)
      .onSnapshot((peopleSnap) => {
        let people = [];
        peopleSnap.forEach((person) => {
          people.push(person.data())
        })
        this.people = people;
        this.filterPeople = people;
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

  navigateBack() {
    this.navCtrl.navigateBack("/chat-room")
  }

  search(event) {
    let text = event.target.value.toLowerCase();
    this.filterPeople = [];
    if (!text) {
      this.filterPeople = [...this.people];
      return;
    }
    this.people.forEach((person) => {
      let fullNmae = person.fname + " " + person.lname;
      let shouldShow = person.fname.toLowerCase().indexOf(text) > -1 || person.lname.toLowerCase().indexOf(text) > -1 || fullNmae.toLowerCase().indexOf(text) > -1
      if (shouldShow) {
        this.filterPeople.push(person)
      }
    })
  }
}
