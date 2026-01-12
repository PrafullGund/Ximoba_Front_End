import { AuthConfig } from 'angular-oauth2-oidc';

export const linkedinAuthConfig: AuthConfig = {
  issuer: '',
  redirectUri: window.location.origin + '/auth/linkedin',
  clientId: '869x28peobof4y',
  responseType: 'code',
  scope: 'openid profile email', // Scope for basic profile and email access
  showDebugInformation: true,
  oidc: false,  // LinkedIn does not support OpenID Connect
  strictDiscoveryDocumentValidation: false,
  requireHttps:false,
  loginUrl:'https://www.linkedin.com/oauth/v2/authorization',
  tokenEndpoint:'https://www.linkedin.com/oauth/v2/accessToken',
  logoutUrl:''
};