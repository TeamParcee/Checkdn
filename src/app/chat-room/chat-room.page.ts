import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlaceService, Place } from '../home/place.service';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { IonContent, NavController } from '@ionic/angular';
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
    private navCtrl: NavController,
  ) { }

  place;
  text;
  user;
  people: any[];
  messages;
  hideHeader;
  ngOnInit() {

  }
  async ionViewWillEnter() {

    this.getPlace().then(() => {
      this.checkPlace();
      this.getPeopleInRoom();
      this.getMessages();
      this.scrollBottom();
    })
  }


  checkPlace() {
    if (!this.place) {
      this.navCtrl.navigateBack("/home");
    }
  }


  async getPlace() {
    return new Promise(async (resolve) => {
      let user: any = await this.getUser();
      firebase.firestore().doc("/places/" + user.place).get().then((placeSnap) => {
        this.place = placeSnap.data();
        return resolve();
      })
    })

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
      user: { ...this.user },
    }
    firebase.firestore().collection("/places/" + this.place.id + "/messages").add({ ...message }).then((obj) => {
      obj.update({ id: obj.id })
    })
    this.text = "";
  }

  scrollBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 100);
  }
  getMessages() {
    firebase.firestore().collection("/places/" + this.place.id + "/messages").orderBy("timestamp").onSnapshot((messageSnap) => {
      let messages = [];
      messageSnap.forEach((message) => {
        messages.push(message.data())
      })
      this.messages = messages;
      this.scrollBottom();
    })
  }


  getFormatDate(timestamp) {
    let today = new Date();
    let messageDate = new Date(timestamp);

    if (today.getDate() == messageDate.getDate() && today.getDay() == messageDate.getDay() && today.getFullYear() == messageDate.getFullYear()) {
      return 'short'
    } else {
      return 'long'
    }

  }
  getPersonName(uid) {
    let person = this.people.find(user => uid == user.uid)
    if (person) {
      return person.fname + " " + person.lname;
    }
  }


  viewProfile(person) {
    this.helper.openModal(ViewProfilePage, { user: person })
  }


  navigateBack() {
    this.navCtrl.navigateBack("/home")
  }



  getUser() {
    return new Promise(async (resolve) => {
      let uid = localStorage.getItem('uid');
      firebase.firestore().doc("/users/" + uid).get().then((userData) => {
        this.user = userData.data();
        return resolve(userData.data())
      })
    })
  }
}
