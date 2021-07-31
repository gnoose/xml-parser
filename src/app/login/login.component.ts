import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

const AuthResponse = {
  restoredSession: 'RESTORED_SESSION',
  updatedSession: 'UPDATED_SESSION',
  savedSession: 'SAVED_SESSION',
  notEqual: 'NOT_EQUAL'
}

const credential = {
  id: 'leo',
  pass: 'leo'
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoading = false;
  isStateServer = false;
  userId = '';
  userPwd = '';

  constructor(
    private authService: AuthService,
    private route: Router
  ) { }

  ngOnInit(): void {
  }

  async login(): Promise<void> {
    let authFlag = false;
    let alertInfo = '';
    if (this.isStateServer) {
      const res = await this.authService.login(this.userId, this.userPwd);
      switch (res) {
        case AuthResponse.notEqual:
          alertInfo = 'UserId/UserPassword not equal';
          break;
        case AuthResponse.restoredSession:
          alertInfo = 'Session was already saved in the StateServer. We used it.';
          authFlag = true;
          break;
        case AuthResponse.savedSession:
          alertInfo = 'Session was not saved in the StateServer. We put credential info into SateServer.';
          authFlag = true;
          break;
        case AuthResponse.updatedSession:
          alertInfo = 'Session was already saved in the StateServer but not same as yours. We updated it.';
          authFlag = true;
          break;
      }
      if (alertInfo) {
        alert(alertInfo);
      }
    } else {
      if (this.userId == credential.id && this.userPwd == credential.pass) {
        authFlag = true;
      } else {
        alert ('UserId/UserPassword not equal');
      }
    }

    if (authFlag) {
      this.authService.isLoggedInSubject.next(true);
      this.route.navigate(['/xml-parser']);
    } else {
      this.authService.isLoggedInSubject.next(false);
    }
  }

}
