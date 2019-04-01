import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import {
    OidcConfigService,
    OidcSecurityService,
    AuthWellKnownEndpoints,
    OpenIDImplicitFlowConfiguration
} from 'angular-auth-oidc-client';
import { take } from 'rxjs/operators';
import { LoginInfo } from '../models/loginInfo';

@Injectable({providedIn: 'root'})
export class AuthService {
    public isAuthorized = false;
    private clientId = '290958631661-p03esksf53tnh34g1svcc5flhbrgcbsl.apps.googleusercontent.com';

    constructor(
        private oidcConfigService: OidcConfigService,
        private oidcSecurityService: OidcSecurityService,
        private location: Location) {
        this.oidcSecurityService.getIsAuthorized().subscribe((isAuthorized: boolean) => {
            this.isAuthorized = isAuthorized;
        });
    }

    public config() {
        const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
        openIDImplicitFlowConfiguration.stsServer = 'https://accounts.google.com';
        openIDImplicitFlowConfiguration.redirect_url = window.location.origin + this.location.prepareExternalUrl('redirect');
        openIDImplicitFlowConfiguration.client_id = this.clientId;
        openIDImplicitFlowConfiguration.response_type = 'id_token token';
        openIDImplicitFlowConfiguration.scope = 'openid email profile https://www.googleapis.com/auth/analytics.readonly';
        openIDImplicitFlowConfiguration.post_logout_redirect_uri = '/home';
        openIDImplicitFlowConfiguration.post_login_route = 'redirect';
        openIDImplicitFlowConfiguration.unauthorized_route = '/home';
        openIDImplicitFlowConfiguration.auto_userinfo = false;
        openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 30;

        const authWellKnownEndpoints = new AuthWellKnownEndpoints();
        authWellKnownEndpoints.setWellKnownEndpoints(this.oidcConfigService.wellKnownEndpoints);
        this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, authWellKnownEndpoints);
    }

    public login() {
        this.oidcConfigService.onConfigurationLoaded.pipe(take(1)).subscribe(() => {
            this.config();
            this.oidcSecurityService.authorize();
        });
        this.oidcConfigService.load_using_stsServer('https://accounts.google.com');
    }
    public getUserInfo(): Promise<LoginInfo> {
        let resolve: (val: LoginInfo) => void;
        let reject: () => void;
        const user = new Promise<LoginInfo>((res, rej) => {
            resolve = res;
            reject = rej;
        });
        this.oidcConfigService.onConfigurationLoaded.pipe(take(1)).subscribe(() => {
            this.config();
            this.oidcSecurityService.onAuthorizationResult.subscribe(() => {
                this.oidcSecurityService.getUserData().subscribe(userData => {
                    const formatedUserData = this.formatUserData(userData);
                    localStorage.setItem('ig_user', JSON.stringify(formatedUserData));
                    resolve(formatedUserData);
                });
            });
            this.oidcSecurityService.authorizedImplicitFlowCallback();
        });
        this.oidcConfigService.load_using_stsServer('https://accounts.google.com');
        return user;
    }

    public logout() {
        this.oidcSecurityService.logoff();
    }

    private formatUserData(userData): LoginInfo {
        const token = this.oidcSecurityService.getToken();
        const login: LoginInfo = {
            id: userData.sub,
            name: userData.name,
            email: userData.email,
            givenName: userData.given_name,
            familyName: userData.family_name,
            picture: userData.picture,
            externalToken: token
        };
        return login;
    }
}
