import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { FireStoreService } from 'src/app/shared/firestore.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private firestoreService: FireStoreService,
    private navCtrl: NavController,
  ) {

  }

  ngOnInit() {
  }





 

  register(registerForm: NgForm) {
      let form = registerForm.value;
      this.authService.registerWithEmail(form.email, form.password).then((user) => {
        localStorage.setItem('uid', user.uid);
        this.firestoreService.setDocument("/users/" + user.uid, {
          fname: form.fname,
          lanme: form.lname,
          email: form.email,
          uid: user.uid
        }).then(() => {
          this.navCtrl.navigateForward("/auth/confirm-email")
        })
      })
  }

}
