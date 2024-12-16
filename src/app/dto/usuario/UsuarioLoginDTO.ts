export class UsuarioLoginDTO {
    usuario!: string;
    contrasena!: string;


    crearUsuarioLogin(usuario: string, contrasena: string): UsuarioLoginDTO {
        this.usuario = usuario;
        this.contrasena = contrasena;
        return this;
    }
}