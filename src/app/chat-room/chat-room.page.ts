import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaceService, Place } from '../home/place.service';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { IonContent } from '@ionic/angular';
import { HelperService } from '../shared/helper.service';
import { ViewProfilePage } from '../view-profile/view-profile.page';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {
  @ViewChild('content', { static: false }) content: IonContent;
  constructor(
    private route: ActivatedRoute,
    private placeService: PlaceService,
    private helper: HelperService,
  ) { }

  place = this.placeService.place;
  text;
  user;
  people: any[];
  messages;

  ngOnInit() {

  }
  async ionViewWillEnter() {
    this.getUser();
    this.addUserToRoom();
    await this.getPlace();
    this.getPeopleInRoom();
    this.getMessages();
    
  }

  async getPlace() {
    this.route.paramMap.subscribe((paramMap) => {
      let placeId = paramMap.get('id');
      firebase.firestore().doc("/places/" + placeId).get().then((placeSnap) => {
        if (placeSnap.exists) {
          this.place = { ...placeSnap.data() };
          placeSnap.ref.update({ userCount  : this.place.userCount })
        } else {
          let place: Place = new Place(this.place.name, this.place.id, this.place.userCount)
          firebase.firestore().doc("/places/" + placeId).set({ ...place })
        }
      })
    })
  }

  addUserToRoom() {
    let uid = localStorage.getItem('uid');
    firebase.firestore().doc("users/" + uid).update({ place: this.place.id })
  }

  removeUserFromRoom() {
    let uid = localStorage.getItem('uid');
    firebase.firestore().doc("users/" + uid).update({ place: "" })
  }

  getPeopleInRoom() {
    firebase.firestore().collection("users")
      .where("place", "==", this.place.id)
      .onSnapshot((peopleSnap) => {
        let people = [];
        peopleSnap.forEach((person) => {
          people.push(person.data())
        })
        this.people = people;
        this.updateRoomCount();
      })
  }

  updateRoomCount() {
    firebase.firestore().doc("/places/" + this.place.id).update({ userCount: this.people.length })
  }


  async sendMessage() {
    let message = {
      id: "",
      text: this.text,
      timestamp: new Date().getTime(),
      user: {...this.user},
    }
    firebase.firestore().collection("/places/" + this.place.id + "/messages").add({ ...message }).then((obj) => {
      obj.update({ id: obj.id })
    })
    this.text = "";
  }

  getMessages() {
    firebase.firestore().collection("/places/" + this.place.id + "/messages").orderBy("timestamp").onSnapshot((messageSnap) => {
      let messages = [];
      messageSnap.forEach((message) => {
        messages.push(message.data())
      })
      this.messages = messages;
      this.content.scrollToTop(100)
    })
  }

  getPersonName(uid) {
    let person = this.people.find(user => uid == user.uid)
    if (person) {
      return person.fname + " " + person.lname;
    }
  }

  getUser() {
    return new Promise((resolve) => {
      let uid = localStorage.getItem('uid');
      firebase.firestore().doc("/users/" + uid).get().then((userSnap) => {
        this.user = userSnap.data();
        return resolve(userSnap.data())
      })
    })
  }


  viewProfile(person) {
    this.helper.openModal(ViewProfilePage, { user: person })
  }
}
