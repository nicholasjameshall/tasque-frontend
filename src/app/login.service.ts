import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UrlBuilder } from './models/urlbuilder';
import { CreateUserRequest } from './models/createuserrequest';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  //DOMAIN = "localhost:8000"
  DOMAIN = 'tasque-backend.herokuapp.com';
  LOGIN = 'login';
  LOGOUT = 'logout';
  SIGNUP = 'signup';

  constructor(private http: HttpClient) { }

  getCookie(cname: string) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  buildHeaders() {
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-CSRFToken', this.getCookie("csrftoken"))
      .set('Authorization', 'Token ' + token);

    let options = {
      'withCredentials': true,
      'headers': headers
    }

    return options;
  }

  login(username: string, password: string): Observable<any> {
    let ub = new UrlBuilder();
    ub.addDomain(this.DOMAIN);
    ub.addPath(this.LOGIN);
    let url = ub.build();

    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-CSRFToken', this.getCookie("csrftoken"))

    let options = {
      'withCredentials': true,
      'headers': headers
    }

    return this.http.post(
      url,
      {
        'username' : username,
        'password': password
      },
      options
    ).pipe(
      map(json => {
        localStorage.setItem('token', json['token']);
      })
    );
  }

  logout() {
    let options = this.buildHeaders();
    let ub = new UrlBuilder();
    ub.addDomain(this.DOMAIN);
    ub.addPath(this.LOGOUT);
    let url = ub.build();
    return this.http.get(
      url,
      options
    ).pipe(
      map(json => json)
    );
  }

  signup(createUserRequest: CreateUserRequest) {
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-CSRFToken', this.getCookie("csrftoken"))

    let options = {
      'headers': headers
    }

    let url = new UrlBuilder()
      .addDomain(this.DOMAIN)
      .addPath(this.SIGNUP)
      .build();

    return this.http.post(
      url,
      createUserRequest,
      options
    ).pipe(
      map(json => json)
    );

  }

}
