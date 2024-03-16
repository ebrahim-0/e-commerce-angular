import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = new BehaviorSubject(null);

  constructor(
    private _HttpClient: HttpClient,
    @Inject('ECOMMERCE_API_URL') private ECOMMERCE_API_URL: string
  ) {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser.next(JSON.parse(user));
    }
  }

  login(loginForm: object) {
    return this._HttpClient.post(`${this.ECOMMERCE_API_URL}/login`, loginForm);
  }

  register(registerForm: object) {
    return this._HttpClient.post(
      `${this.ECOMMERCE_API_URL}/register`,
      registerForm
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.next(null);
  }

  isAllowedToChange() {
    let user = this.currentUser.value as any;

    return user.rule ? (user.rule === 'admin' ? true : false) : false;
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}
