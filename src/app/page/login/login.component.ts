import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioLoginDTO } from 'src/app/dto/usuario/UsuarioLoginDTO';
import { environment } from 'src/app/env/env';
import { HttpLoginService} from 'src/app/services/http-services/httpLogin.service';
import { AlertService } from 'src/app/utils/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  mensajeLogin: string = '';

  loginForm!: FormGroup;
  private formBuilder: FormBuilder = inject(FormBuilder);
  private httploginService: HttpLoginService = inject(HttpLoginService);
  private router: Router = inject(Router);
  private alert: AlertService = inject(AlertService);
  public nombreNegocio: string = environment.nombreNegocio;

  ngOnInit(): void {
    this.buildForm();
    if(localStorage.getItem('id') != null){
      this.router.navigate(['/app/principal']);
    }
  }

  /**
   * Este método se encarga de construir el formulario de login
   */
  private buildForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /**
   * Este método se encarga de abrir la página principal
   */
  protected abrir(){
    this.router.navigate(['/app/principal']);
  }

  /**
   * Este método se encarga de realizar el login
   */
  protected login(): void {
    if (this.loginForm.invalid) return;
    const { username, password } = this.loginForm.value;
    let usuarioLogin = UsuarioLoginDTO.crearUsuarioLogin(username, password);

    this.httploginService.login(usuarioLogin)
      .subscribe({
        next: response => {
          localStorage.setItem('id', response.id+""); 
          this.mensajeLogin = response+"";
          this.router.navigate(['/app/principal']);
          },
        error: (error) => {this.alert.simpleErrorAlert(error.error.mensaje);}
      });
  }

}