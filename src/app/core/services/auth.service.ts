import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  login(userId: string, userPwd: string): Promise<any> {
    const url = `${environment.loginApi}auth/login?userId=${userId}&userPwd=${userPwd}`;
    return this.http.get(url, this.createHeader('application/json')).toPromise();
  }

  private createHeader(contentType: string): any {
    return { headers: new HttpHeaders({ 'Content-Type': contentType }), responseType: 'text' };
  }
}
