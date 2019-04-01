import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { LoginInfo } from '../models/loginInfo';

@Component({
  template: '<p>Signing in...</p>'
})
export class RedirectComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    ) {}

    ngOnInit() {
      this.authService.getUserInfo().then((loginInfo: LoginInfo) => {
        if (loginInfo) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      });
    }
}
