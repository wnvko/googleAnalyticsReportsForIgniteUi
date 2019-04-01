import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AuthService } from './services/auth.service';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginBarComponent } from './login-bar/login-bar.component';
import { RedirectComponent } from './redirect/redirect.component';

import { AuthModule, OidcConfigService } from 'angular-auth-oidc-client';
import {
  IgxButtonModule,
  IgxRippleModule
} from 'igniteui-angular';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    AuthModule.forRoot(),
    AuthenticationRoutingModule,
    IgxRippleModule,
    IgxButtonModule,
  ],
  declarations: [
    LoginBarComponent,
    RedirectComponent
  ],
  providers: [
    AuthService,
    OidcConfigService
  ],
  exports: [
    LoginBarComponent
  ]
})
export class AuthenticationModule { }
