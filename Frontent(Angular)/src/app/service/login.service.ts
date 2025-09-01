import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import baseUrl from './helper';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private isBrowser: boolean;

  public loginStatusSubject = new Subject<boolean>();

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  //getting current user : who is loggedin
  public getCurrentUser() {
    return this.http.get(`${baseUrl}/current-user`);
  }

  public generateToken(loginData: any) {
    return this.http.post(`${baseUrl}/generate-token`, loginData);
  }

  //Login User : Save token in local Storage
  public loginUser(token: any) {
    if (this.isBrowser) {
      localStorage.setItem('token', token);
    }
    return true;
  }

  // isLoggedin: user is login or not
  public isLoggedIn() {
    if (!this.isBrowser) {
      return false;
    }
    let tokenStr = localStorage.getItem('token');
    if (tokenStr == undefined || tokenStr == '' || tokenStr == null) {
      return false;
    } else {
      return true;
    }
  }

  // LogOut : loggin out the user by removing the token from local storage
  public logOut() {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return true;
  }

  //get token
  public getToken() {
    if (this.isBrowser) {
      return localStorage.getItem('token');
    }
    return null;
  }

  //saving user details to local storage
  public setUser(user: any) {
    if (this.isBrowser) {
      // Augment user authorities from token claims if empty
      if ((!user.authorities || user.authorities.length === 0) && this.getToken()) {
        const decoded = this.decodeToken(this.getToken());
        if (decoded && decoded.authorities && decoded.authorities.length > 0) {
          user.authorities = decoded.authorities.map((auth: any) => {
            if (typeof auth === 'string') {
              return { authority: auth };
            } else if (auth.authority) {
              return auth;
            } else {
              return { authority: String(auth) };
            }
          });
        }
      }
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  //get user
  public getUser() {
    if (!this.isBrowser) {
      return null;
    }
    let userStr = localStorage.getItem('user');
    if (userStr != null) {
      return JSON.parse(userStr);
    } else {
      this.logOut();
      return null;
    }
  }

  // Decode JWT token payload
  private decodeToken(token: string | null): any {
    if (!token) {
      return null;
    }
    const payload = token.split('.')[1];
    if (!payload) {
      return null;
    }
    try {
      const decoded = JSON.parse(atob(payload));
      console.log('Decoded JWT token payload:', decoded);
      return decoded;
    } catch (e) {
      console.error('Error decoding token payload', e);
      return null;
    }
  }

  //getting user role
  public getUserRole() {
    let user = this.getUser();
    if (user && user.authorities && user.authorities.length > 0) {
      return user.authorities[0].authority;
    }
    // If authorities empty, try to get role from token claims
    const token = this.getToken();
    const decoded = this.decodeToken(token);
    if (decoded && decoded.roles && decoded.roles.length > 0) {
      return decoded.roles[0];
    }
    if (decoded && decoded.role) {
      return decoded.role;
    }
    return null;
  }
}
