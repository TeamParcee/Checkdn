import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HelperService } from 'src/app/shared/helper.service';
import { NavController } from '@ionic/angular';
import { FireStoreService } from 'src/app/shared/firestore.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private authService: AuthService,
    private helper: HelperService,
    private navCtrl: NavController,
    private firestoreService: FireStoreService,
  ) { }

  ngOnInit() {
  }

  logout() {
    this.helper.confirmationAlert("Log Out", "Are you sure you want to log out?", { denyText: "Cancel", confirmText: "Log Out" }).then((result) => {
      if (result) {
        this.authService.logout().then(() => {
          this.navCtrl.navigateBack("/login");
        })
      }
    })
  }

  deleteAccount() {
    let uid = localStorage.getItem("uid");
    this.helper.confirmationAlert("Delete Account", "Are you sure you want to delete your account?", { denyText: "Cancel", confirmText: "Delete Account" }).then((result) => {
      if (result) {
        this.authService.deleteAccount().then(() => {
          this.firestoreService.deleteDocument("/users/" + uid)
          this.navCtrl.navigateBack("/login")
        })
      }
    })
  }
}
