import { environment } from 'src/app/env/env';
import { inject, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ConfiguracionService {
  /**
   * Obtiene el valor de una variable de entorno desde la clase `environment`.
   * @param key Clave de la variable de entorno que se desea obtener.
   * @returns El valor asociado a la clave o un mensaje de error si la clave no existe.
   */
  public getVariable(key: keyof typeof environment): string | number {
    if (environment.hasOwnProperty(key)) {
      return environment[key];
    } else {
      throw new Error(`La variable de entorno "${key}" no existe en el archivo environment.`);
    }
  }
}
