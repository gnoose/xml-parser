import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})

export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<any> | boolean {
    return this.authService.isLoggedIn$.pipe(
      take(1)
    );
  }
}
