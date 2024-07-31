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
  mensajeLogin: string = '';

  loginForm!: FormGroup ;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router : Router, 
    private alert: AlertService
  ) {

    if(localStorage.getItem('id') != null){
      this.router.navigate(['/app/principal']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });


  }

  abrir(){
    this.router.navigate(['/app/principal']);
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { username, password } = this.loginForm.value;
    
    this.loginService.login(username, password)
      .subscribe(
        response => {
          localStorage.setItem('id', response.id); 
          this.mensajeLogin = response;
          this.router.navigate(['/app/principal']);
             
          },
        error => {
          this.alert.simpleErrorAlert('Usuario o contraseña incorrectos');
        });



  }

}