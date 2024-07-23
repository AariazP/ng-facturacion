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

}
