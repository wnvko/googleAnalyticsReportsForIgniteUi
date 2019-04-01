import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoginInfo } from '../models/loginInfo';

@Component({
  selector: 'app-login-bar',
  templateUrl: './login-bar.component.html',
  styleUrls: ['./login-bar.component.scss']
})
export class LoginBarComponent {
  public loggedIn = false;
  public user: LoginInfo;
  constructor(
      public authService: AuthService,
      private router: Router) { }

  login() {
    this.authService.login();
  }

  logout() {
    this.router.navigate(['/home']);
    this.authService.logout();
  }
}
