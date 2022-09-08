import { Injectable } from '@angular/core';
import { Router,ActivatedRoute,CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private _router:Router,private _activatedRouter:ActivatedRoute) {}

  canActivate() {    
    let authorized = this.authService.isLoggedIn();
    // console.log("authorized:"+authorized);
    if(!authorized){
      this._router.navigate(['/login']);
    }
    return this.authService.isLoggedIn();
  }
}