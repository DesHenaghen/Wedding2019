import { Injectable } from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {AuthService} from "../services/auth.service";
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(public auth: AuthService, public router: Router, public jwtHelper: JwtHelperService) {}

  canActivate(): boolean {
    if (localStorage.getItem('access_token')) {
      let decodeToken = this.jwtHelper.decodeToken(localStorage.getItem('access_token'));
      console.log("decode token", decodeToken);
      return !this.jwtHelper.isTokenExpired() && decodeToken.username == "admin";
    }

    this.router.navigate(['login']);
    return false;
  }
}
