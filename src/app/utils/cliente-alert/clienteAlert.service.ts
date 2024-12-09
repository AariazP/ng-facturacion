import { Inject, Injectable } from "@angular/core";
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class ClienteAlertService {

    preguntarRecuperarCliente(): Promise<boolean> {
        return Swal.fire({
          title: "Este cliente fue eliminado antes",
          text: "¿Te gustaría recuperarlo?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, recuperar",
          cancelButtonText: "No, cancelar",
        }).then((result) => result.isConfirmed);
    }
}