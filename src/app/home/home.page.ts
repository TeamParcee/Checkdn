import { Component, OnInit } from '@angular/core';
import { PlaceService, Place } from './place.service';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { HelperService } from '../shared/helper.service';
import { Router } from '@angular/router';

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
  ) { }

  places: Place[];
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
    navigator.geolocation.getCurrentPosition(function (position) {
      that.coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      that.getPlaces().then(() => {
        that.helper.hideLoading();
      })
    }, function (error) { that.helper.okAlert("Error", error.message) }, { enableHighAccuracy: true })
  }

  getPlaces() {
    return new Promise((resolve) => {
      this.places = [];
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
      async function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < 5; i++) {
            console.log(results[i])
            let place: Place = {
              id: results[i].place_id,
              name: results[i].name,
              userCount: await that.getUserCount(results[i]),
            };
            that.places.push(place);
            return resolve();
          }
        }
      }
    })

  }

  getUserCount(googlePlace): Promise<number> {
    return new Promise((resolve) => {
      firebase.firestore().doc("places/" + googlePlace.place_id).get().then((placeSnap) => {
        if (placeSnap.exists) {
          console.log(placeSnap.data())
          return resolve(placeSnap.data().userCount)
        } else {
          return resolve(0)
        }
      })
    })
  }

  selectPlace(place) {
    this.placeService.place = place;
    this.routerLink.navigateByUrl("/chat-room/" + place.id)
  }
}

