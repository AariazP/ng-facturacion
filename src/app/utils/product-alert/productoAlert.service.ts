import { inject } from "@angular/core";
import { AlertService } from "../alert.service";
import Swal from "sweetalert2";

export class ProductoAlertService {
    
    private alertService: AlertService = inject(AlertService);

    public eliminarProducto(): Promise<boolean> {
        return Swal.fire({
            title: "¿Estás seguro de eliminar este producto?",
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