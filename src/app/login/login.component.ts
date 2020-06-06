import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { User } from '../models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  title = "Tasque";

  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required]
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 6000,
    });
  }

  login() {
    let username = this.loginForm.get('username').value;
    let password = this.loginForm.get('password').value;

    if(this.loginForm.valid) {
      return this.loginService.login(username, password)
        .subscribe(
          resp => {
            console.log(resp);
            this.openSnackBar("Login successful", "CLOSE");
            this.redirectUser();
          },
          error => {
            console.log(error);
            this.openSnackBar("Login failed", "CLOSE");
          }
        );
    }
  }

  redirectUser() {
    this.router.navigate(['timeline']);
  }


  ngOnInit(): void {}

}
