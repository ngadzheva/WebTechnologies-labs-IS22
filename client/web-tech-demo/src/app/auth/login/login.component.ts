import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isSubmitted: boolean;
  user: { [key: string]: string } = {};
  errorMessage: string | undefined;
  loginSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router, private cookieService: CookieService) {
    this.isSubmitted = false;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if(this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  onSubmit(){
    this.loginSubscription = this.authService.login(this.user['userName'], this.user['password']).subscribe(response => {
      if(response['success']){
        this.errorMessage = '';
        this.isSubmitted = true;
        this.cookieService.set('Log-Cookie', response['token']);
        this.cookieService.set('Role-Cookie', response['userRole']);
        this.router.navigateByUrl('/user/info');
      } 
    }, error => {
      this.errorMessage = error.error.message;
    });    
  }
}
