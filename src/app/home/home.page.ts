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
  loadingMessage = "getting nearby places";
  geocoder = new google.maps.Geocoder();
  coords: {
    lat: number,
    lng: number,
  }
  ngOnInit() {
  }

  ionViewWillEnter() {
    this.helper.showLoadingMessage(this.loadingMessage);
    let uid = localStorage.getItem('uid');
    firebase.firestore().doc("/users/" + uid).update({ place: "" });
    this.getUsersLngLat().then(() => {
      this.getPlaces().then((places: any) => {
        if (places) {
          this.places = places;
          this.helper.hideLoading();
        } else {
          this.helper.hideLoading();
          this.helper.okAlert("No Location", "We are not able to find any places near you")
        }
      })
    }).catch((error) => {
      this.helper.hideLoading();
      this.helper.okAlert("No Location", error.message)
    })
  }

  doRefresh(event) {
    // this.getUserLocation();
    // setTimeout(() => {
    //   if (!this.places || this.places.length == 0) {
    //     this.helper.hideLoading();
    //     this.helper.okAlert("No Location", "We are not able to find any places near you")
    //   }
    // }, 10000);
    // event.target.complete();
  }

  getUsersLngLat() {
    return new Promise((resolve, reject) => {

      let that = this;
      this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((position) => {
        if (position) {
          that.coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          return resolve()
        } else {
          return reject("could not get users position");
        }
      })
    })
  }

  getPlaces() {
    return new Promise((resolve, reject) => {
      let currentLocation = new google.maps.LatLng(this.coords.lat, this.coords.lng);
      let map = new google.maps.Map(document.getElementById('map'), {
        center: currentLocation,
        zoom: 15
      });
      let latlng = { lat: this.coords.lat, lng: this.coords.lng };
      this.geocoder.geocode({ "location": latlng }, async (results: any, status) => {
        if (results) {
          let addresses = [];
          for (let index = 0; index < 3; index++) {
            const result = results[index];
            addresses.push(await this.getPlaceDetails(result.place_id));
          }
          return resolve(addresses);
        } else {
          return reject("Could convert users location to an address");
        }
      })
    })
  }

  getPlaceDetails(placeID) {
    return new Promise((resolve, reject) => {
      let currentLocation = new google.maps.LatLng(this.coords.lat, this.coords.lng);
      let map = new google.maps.Map(document.getElementById('map'), {
        center: currentLocation,
        zoom: 15
      });

      var request = {
        placeId: placeID,
        fields: ['name'],
      };

      let service = new google.maps.places.PlacesService(map);
      service.getDetails(request, async (place, status) => {
        if (place) {
          let p: Place = {
            id: placeID,
            name: place.name,
            userCount: await this.getUserCount(placeID),
          }
          return resolve(p)
        } else {
          return reject("Could not get a places details")
        }
      })

    })
  }

  getUserCount(placeID): Promise<number> {
    return new Promise((resolve) => {
      firebase.firestore().doc("places/" + placeID).get().then((placeSnap) => {
        if (placeSnap.exists) {
          firebase.firestore().collection("/users/")
            .where("place", "==", placeID).get().then((usersSnap) => {
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

