export class UsuarioLoginDTO {
    usuario!: string;
    contrasena!: string;


    static crearUsuarioLogin(usuario: string, contrasena: string): UsuarioLoginDTO {
        let usuarioLogin = new UsuarioLoginDTO();
        usuarioLogin.usuario = usuario;
        usuarioLogin.contrasena = contrasena;
        return usuarioLogin;
    }
}