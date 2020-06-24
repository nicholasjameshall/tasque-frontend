import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { CreateUserRequest } from '../models/createuserrequest';

import { LoginService } from '../login.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  loading: boolean;
  submitted: boolean;
  title: string = "Tasque";
  success: boolean = false;

  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {    this.signupForm = this.fb.group({
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

  ngOnInit(): void {
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 6000,
    });
  }

  signup() {
    if(this.signupForm.valid) {
      this.loading = true;
      this.submitted = true;
      let createUserRequest = new CreateUserRequest(
        this.signupForm.get('username').value,
        this.signupForm.get('password').value,
        this.signupForm.get('email').value
      )

      this.loginService.signup(createUserRequest)
        .subscribe(
          result => {
            this.loading = false;
            this.success = true;
            this.openSnackBar(
              "Successfully signed up! Please log in.", "CLOSE");
            this.redirectUser('/login');
          },
          error => {
            this.loading = false;
            console.log(error);
            this.openSnackBar("Sign-up failed. Please try again.", "CLOSE");
            this.submitted = false;
          }
        )
    }
  }

  redirectUser(routerLink: string) {
    this.router.navigate([routerLink]);
  }

}
