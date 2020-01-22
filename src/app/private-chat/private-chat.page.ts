import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { IonContent } from '@ionic/angular';
@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.page.html',
  styleUrls: ['./private-chat.page.scss'],
})
export class PrivateChatPage implements OnInit {
  @ViewChild('content', { static: false }) content: IonContent;
  constructor(
    private route: ActivatedRoute,
  ) { }

  user;
  recipient;
  text;
  messages;

  ngOnInit() {
  }
  async ionViewWillEnter() {
    await this.getUser();
    await this.getRecipient();
    await this.getMessages();
    setTimeout(() => {
      this.scrollToBottom()
    }, 500)
  }

  async getRecipient() {
    return new Promise((resolve) => {
      this.route.paramMap.subscribe((paramMap) => {
        let uid = paramMap.get('id');
        firebase.firestore().doc("/users/" + uid).get().then((userSnap) => {
          this.recipient = userSnap.data();
          return resolve();
        })
      })
    })
  }

  async getUser() {
    return new Promise((resolve) => {
      let uid = localStorage.getItem('uid');
      firebase.firestore().doc("/users/" + uid).get().then((userSnap) => {
        this.user = userSnap.data();
        return resolve()
      })
    })
  }

  async getMessages() {
    let uid = localStorage.getItem('uid');
    firebase.firestore().collection("/users/" + uid + "/messagesList/" + this.recipient.uid + "/messages")
    .orderBy("timestamp")
    // .limit(20)
    .onSnapshot((messagesSnap) => {
      let messages = [];
      messagesSnap.forEach((message) => {
        messages.push(message.data())
      })
      this.messages = messages;
    })
  }


  async sendMessage() {
    let messageReceived = {
      id: "0",
      text: this.text,
      timestamp: new Date().getTime(),
      user: { ...this.user },
      type: "received"
    }

    let messageSent = {
      id: "0",
      text: this.text,
      timestamp: new Date().getTime(),
      user: { ...this.user },
      type: "send"
    }
    firebase.firestore().collection("/users/" + this.user.uid + "/messagesList/" + this.recipient.uid + "/messages").add({ ...messageSent }).then((obj) => {
      obj.update({ id: obj.id })
    })
    firebase.firestore().collection("/users/" + this.recipient.uid + "/messagesList/" + this.user.uid + "/messages").add({ ...messageReceived }).then((obj) => {
      obj.update({ id: obj.id })
    })
    this.text = "";
    setTimeout(() => {
      this.scrollToBottom()
    }, 100)
  }

  scrollToBottom() {
    this.content.scrollToBottom();

  }
}
