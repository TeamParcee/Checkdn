import { Injectable } from "@angular/core";
import { CanActivate } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { NavController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ConfirmEmailGuard implements CanActivate {

    constructor(
        private navCtrl: NavController,
    ){}
    canActivate(): Promise<boolean> {
        return new Promise((resolve) => {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    if (user.emailVerified) {
                        return resolve(true)
                    } else {
                        this.navCtrl.navigateRoot("/confirm-email")
                        return resolve(false);
                    }
                }
            })
        })
    }
}