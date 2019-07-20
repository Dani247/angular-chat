import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { fireBase } from '../firebase/firebase'

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {
  private router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  canActivate = () => {
    if (fireBase.isAuth()) {
      return true;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login']);
    return false;
  }
}