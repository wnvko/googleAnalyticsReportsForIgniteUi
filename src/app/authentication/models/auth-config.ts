export interface AuthConfig {
    stsServer: string;
    clientId: string;
    scope: string;
    redirectUrl: string;
    response_type: string;
    postLogoutRedirectUri: string;
    postLoginRoute: string;
    autoUserInfo: boolean;
    maxIdTokenIatOffsetAllowedInSeconds: number;
}
