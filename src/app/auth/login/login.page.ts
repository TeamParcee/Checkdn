import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HelperService } from 'src/app/shared/helper.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private helper: HelperService,
    private navCtrl: NavController,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  ngOnInit() {
  }

  
  
  loginForm: FormGroup;

  login() {
    let form = this.loginForm.value
    this.authService.loginWithEmail(form.email, form.password).then((user) => {
      localStorage.setItem('uid', user.uid);
      this.navCtrl.navigateForward("/home")
    })
  }

  passwordReset(){
    this.helper.okAlert("Password Reset", "To have your password reset please email team@parcee.com")
  }
}
