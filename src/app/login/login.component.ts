import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { User } from '../models/user';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateUserRequest } from '../models/createuserrequest';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  signupForm: FormGroup;
  title: string = "Tasque";
  loading: boolean = false;

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

    this.signupForm = this.fb.group({
      'username': ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30)]
      ],
      'email': ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(30)]
      ],
      'password': ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20)]
      ],
      'repeatPassword': ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20)]
      ],
    }, { validator: this.passwordsMatch} )
  }

  passwordsMatch(fg: FormGroup) {
    console.log(fg);
    let password = fg.get('password').value;
    let repeatPassword = fg.get('repeatPassword').value;
    return password == repeatPassword ? null : { 'nomatch': true }
  }

  passwordValidator(fc: FormControl) {

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
      this.loading = true;
      return this.loginService.login(username, password)
        .subscribe(
          resp => {
            this.loading = false;
            this.openSnackBar("Login successful", "CLOSE");
            this.redirectUser();
          },
          error => {
            this.loading = false;
            console.log(error);
            this.openSnackBar("Login failed", "CLOSE");
          }
        );
    }
  }

  signup() {
    if(this.signupForm.valid) {
      this.loading = true;
      let createUserRequest = new CreateUserRequest(
        this.signupForm.get('username').value,
        this.signupForm.get('password').value,
        this.signupForm.get('email').value
      )

      this.loginService.signup(createUserRequest)
        .subscribe(
          result => {
            this.loading = false;
            this.openSnackBar("Successfully signed up! Please log in.", "CLOSE");
          },
          error => {
            this.loading = false;
            console.log(error);
            this.openSnackBar("Sign-up failed. Please try again.", "CLOSE");
          }
        )
    }
  }

  redirectUser() {
    this.router.navigate(['timeline']);
  }


  ngOnInit(): void {}

}
