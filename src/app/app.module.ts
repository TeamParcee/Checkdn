import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PlaceService } from './home/place.service';
import * as firebase from 'firebase/app';
import { ViewProfilePage } from './view-profile/view-profile.page';
import { FormsModule } from '@angular/forms';
import { Device } from '@ionic-native/device/ngx';


// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyA0cr5s_hTaHgCrxQz4O3zutU1Mcq-uSZA",
  authDomain: "checkdn-914.firebaseapp.com",
  databaseURL: "https://checkdn-914.firebaseio.com",
  projectId: "checkdn-914",
  storageBucket: "checkdn-914.appspot.com",
  messagingSenderId: "118221588888",
  appId: "1:118221588888:web:ef37f0b86626d8ffc743ed"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
@NgModule({
  declarations: [
    AppComponent,
    ViewProfilePage],
  entryComponents: [
    ViewProfilePage,
  ],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    FormsModule,
    AppRoutingModule],
  providers: [
    StatusBar,
    Device,
    PlaceService,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
