import { Component, OnInit } from '@angular/core';
import { PlaceService, Place } from './place.service';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { HelperService } from '../shared/helper.service';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private placeService: PlaceService,
    private helper: HelperService,
    private routerLink: Router,
    private geolocation: Geolocation
  ) { }

  places: Place[];
  people;
  coords: {
    lat: number,
    lng: number,
  }
  ngOnInit() {
  }

  ionViewWillEnter() {
    let uid = localStorage.getItem('uid');
    firebase.firestore().doc("/users/" + uid).update({ place: "" });
    this.getUserLocation();
    setTimeout(() => {
      if (!this.places || this.places.length == 0) {
        this.helper.hideLoading();
        this.helper.okAlert("No Location", "We are not able to find any places near you")
      }
    }, 10000);

  }

  doRefresh(event) {
    this.getUserLocation();
    setTimeout(() => {
      if (!this.places || this.places.length == 0) {
        this.helper.hideLoading();
        this.helper.okAlert("No Location", "We are not able to find any places near you")
      }
    }, 10000);
    event.target.complete();
  }

  getUserLocation() {
    this.helper.showLoading();
    let that = this;
    this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then((position) => {
      that.coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      that.getPlaces().then(() => {
        that.helper.hideLoading();
      })
    })
  }

  getPlaces() {
    this.places = [];
    return new Promise((resolve) => {
      let currentLocation = new google.maps.LatLng(this.coords.lat, this.coords.lng);
      let map = new google.maps.Map(document.getElementById('map'), {
        center: currentLocation,
        zoom: 15
      });

      var request = {
        location: currentLocation,
        rankBy: google.maps.places.RankBy.DISTANCE,
        type: "establishment",
      };

      let service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);

      let that = this;
      async function callback(results: [], status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          let places = [];
          results.forEach(async (place: any) => {
            let p: Place = {
              id: place.place_id,
              name: place.name,
              userCount: await that.getUserCount(place),
            }
            that.places.push(p)
          })
          return resolve();
        }
      }
    })
  }

  getUserCount(googlePlace): Promise<number> {
    return new Promise((resolve) => {
      firebase.firestore().doc("places/" + googlePlace.place_id).get().then((placeSnap) => {
        if (placeSnap.exists) {
          firebase.firestore().collection("/users/")
            .where("place", "==", googlePlace.place_id).get().then((usersSnap) => {
              this.people = usersSnap.size;
              return resolve(usersSnap.size)
            })
        } else {
          return resolve(0)
        }
      })
    })
  }

  selectPlace(place) {
    let uid = localStorage.getItem('uid');
    console.log(place.name, place.id);
    firebase.firestore().doc("/users/" + uid).update({ place: place.id })
    firebase.firestore().doc("/places/" + place.id).get().then((placeSnap) => {
      if (placeSnap.exists) {
        this.routerLink.navigateByUrl("/chat-room")
      } else {
        firebase.firestore().doc("/places/" + place.id).set({ ...place })
        this.routerLink.navigateByUrl("/chat-room")
      }
    })
  }
}

