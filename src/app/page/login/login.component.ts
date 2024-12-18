import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioLoginDTO } from 'src/app/dto/usuario/UsuarioLoginDTO';
import { HttpLoginService} from 'src/app/services/http-services/httpLogin.service';
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
    private httploginService: HttpLoginService,
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
    let usuarioLogin = new UsuarioLoginDTO();
    usuarioLogin = usuarioLogin.crearUsuarioLogin(username, password);


    this.httploginService.login(usuarioLogin)
      .subscribe({
        next: response => {
          localStorage.setItem('id', response.id+""); 
          this.mensajeLogin = response+"";
          this.router.navigate(['/app/principal']);
             
          },
        error: (error: HttpErrorResponse) => {
          this.alert.simpleErrorAlert('Usuario o contraseña incorrectos');
        }
      });
  }

}