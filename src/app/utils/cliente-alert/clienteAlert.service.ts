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
                Swal.fire(
                    "Eliminado",
                    "El cliente ha sido eliminado correctamente.",
                    "success"
                );
                return true; // Confirmación
            } else {
                Swal.fire(
                    "Cancelado",
                    "La operación de eliminación fue cancelada.",
                    "info"
                );
                return false; // Cancelación
            }
        });
    }

}