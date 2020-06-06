import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UrlBuilder } from './models/urlbuilder';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  DOMAIN = 'localhost:8000';
  LOGIN = 'login';
  LOGOUT = 'logout';

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
      map(json => {
        return json;
      })
    );
  }
}
