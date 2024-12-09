import { Inject, Injectable } from "@angular/core";
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class ClienteAlertService {

    recuperarClienteEliminadoAlert(): void {
        alert("Cliente recuperado correctamente");
    }

}