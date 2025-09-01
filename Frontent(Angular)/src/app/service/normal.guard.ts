import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';


import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
@Injectable(
  {
    providedIn:'root'
  }
)

export class NormalGuard implements CanActivate{
constructor(private login:LoginService, private router:Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
  
    // Add a small delay to ensure localStorage is accessible during page refresh
    if (typeof window !== 'undefined' && window.localStorage) {
      if (this.login.isLoggedIn() && this.login.getUserRole() == 'ROLE_NORMAL') {
        return true;
      }
    }

    // Only navigate to login if we're sure the user is not authenticated
    // and localStorage is accessible
    setTimeout(() => {
      if (!this.login.isLoggedIn()) {
        this.router.navigate(['login']);
      }
    }, 100);
    
    return false;
};
}
