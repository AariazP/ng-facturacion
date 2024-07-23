import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  

  constructor() { }


  simpleSuccessAlert(message: string): void {

    Swal.fire({
      title: "Remates la 7ma",
      text: message,
      icon: "success"
    });
  }

  simpleErrorAlert(message: string): void {

    Swal.fire({
      title: "Remates la 7ma",
      text: message,
      icon: "error"
    });
  }

  confirmAlert(title:string,message: string): Promise<boolean> {
    return Swal.fire({
      title: title,
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, estoy seguro",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      return result.isConfirmed;
    });
  }

  simpleInfoAlert(message: string) {
    Swal.fire({
      title: "Remates la 7ma",
      text: message,
      icon: "info"
    }); 
  }

}
