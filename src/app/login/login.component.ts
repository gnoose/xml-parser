import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoading = false;
  userId = '';
  userPwd = '';

  constructor(
    private authService: AuthService,
    private route: Router
  ) { }

  ngOnInit(): void {
  }

  login(): void {
    console.log('userId = ', this.userId)
    console.log('userPwd = ', this.userPwd)
    if (this.userId !== '' && this.userPwd !== '') {
      this.authService.isLoggedInSubject.next(true);
    } else {
      this.authService.isLoggedInSubject.next(false);
    }
    this.route.navigate(['/xml-parser']);
  }

}
