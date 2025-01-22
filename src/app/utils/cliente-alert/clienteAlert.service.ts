import { inject, Inject, Injectable } from "@angular/core";
import Swal from 'sweetalert2';
import { AlertService } from "../alert.service";

@Injectable({
    providedIn: 'root'
})
export class ClienteAlertService {

    private alertService: AlertService = inject(AlertService);

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

    eliminarCliente(): Promise<boolean> {
        return Swal.fire({
            title: "¿Estás seguro de eliminar este cliente?",
            text: "No podrás recuperar la información después",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "No, cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                return true;
            } else {
                this.alertService.cancelarOperacionAlert();
                return false;
            }
        });
    }

}