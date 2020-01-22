import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { HelperService } from '../shared/helper.service';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private helper: HelperService
    ) { }

    loginWithEmail(email: string, password: string): Promise<firebase.User> {
        this.helper.showLoading();
        return new Promise((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(email, password).then((result) => {
                this.helper.hideLoading();
                return resolve(result.user)
            }).catch((error) => {
                this.helper.hideLoading();
                this.helper.okAlert("We have a problem", error.message);
                return reject();
            })
        })
    }
    registerWithEmail(email: string, password: string): Promise<firebase.User> {
        this.helper.showLoading();
        return new Promise((resolve, reject) => {
            firebase.auth().createUserWithEmailAndPassword(email, password).then((result) => {
                this.helper.hideLoading();
                return resolve(result.user)
            }).catch((error) => {
                this.helper.hideLoading()
                this.helper.okAlert("We have a problem", error.message);
                return reject();
            })
        })
    }
    sendConfirmationEmail() {
        this.helper.showLoading();
        return new Promise((resolve, reject) => {
            firebase.auth().currentUser.sendEmailVerification().then(() => {
                this.helper.hideLoading();
                return resolve()
            }).catch((error) => {
                this.helper.okAlert("We have a problem", error.message);
                this.helper.hideLoading();
                return reject();
            })
        })
    }

    logout() {
        return new Promise((resolve) => {
            firebase.auth().signOut().then(() => {
                localStorage.clear()
                return resolve();
            })
        })
    }

    deleteAccount() {
        return new Promise((resolve) => {
            firebase.auth().currentUser.delete().then(() => {
                localStorage.clear();
                return resolve();
            }).catch((error) => {
                this.helper.okAlert("We have a problem", error.message)
            })
        })
    }
}