import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService} from 'src/app/service/login.service';
import { AlertService } from 'src/app/utils/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm!: FormGroup ;
  mensajeLogin = '';

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router : Router,
    private alert:AlertService
  ) {

    if(localStorage.getItem('token')){
      this.router.navigate(['/app/cliente']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });


  }


  login(): void {

    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.value;
    
    this.loginService.login(username, password).subscribe(
      Response => {
        localStorage.setItem('id', Response.id);
        this.router.navigate(['/app/cliente']);
      },
      Error => {
        this.alert.simpleErrorAlert(Error.error.mensaje);
      }
    );



  }

}
