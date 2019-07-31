import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthDataService } from '../services/auth-data.service'

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {
  router: Router;
  isAuth: boolean = false;

  constructor(router: Router, auth: AuthDataService) {
    auth.getUser().subscribe(me => me.uid ? this.isAuth = true : this.isAuth = false);
    this.router = router;
  }

  canActivate = () => this.isAuth ? true : this.router.navigate(['/login']); false;
}