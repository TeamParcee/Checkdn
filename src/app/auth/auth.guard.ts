import { Injectable } from "@angular/core";
import { CanActivate } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/auth'
import { NavController } from '@ionic/angular';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private navCtrl: NavController,
    ) {

    }
    async canActivate() {
        return await this.userLoggedIn();
    }
    userLoggedIn(): Promise<boolean> {
        return new Promise((resolve) => {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    return resolve(true);
                } else {
                    let seenIntro = localStorage.getItem('seenIntro');
                    if (seenIntro == 'true') {
                        this.navCtrl.navigateRoot("/login")
                        return resolve(false)
                    } else {
                        this.navCtrl.navigateRoot("/auth")
                    }

                }
            })
        })

    }
}