import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, of, tap, Observable } from 'rxjs';
import { Producto, Venta, VentaProductos, CobroVenta, VentaRequest, Cobro, SaveProducts } from '../interfaces/ventas.interfaces';
import { AuthResponse } from '../../auth/interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  private baseUrl: string = environment.baseUrl + 'sinve_api/';

  constructor( private http: HttpClient ) { }

  serachProducto(operacion:number, value:string){
    const url = this.baseUrl + "getProducto?" 
        + ( (operacion === 1 ) ? `codigo=${value}`
        : `description=${value}`);
    return this.http.get<AuthResponse>(url).pipe(
      catchError( err => of({"ok":false, "message":err.message} as AuthResponse))
    );
  }

  searchVenta(operacion:string, value:string){
    const url = this.baseUrl + "ventas";
    return this.http.get<AuthResponse>(url);
  }

  searchTicket(txtTicket:string){
    let url = this.baseUrl + "buscarVenta?ticket=" + txtTicket;
    return this.http.get<AuthResponse>(url).pipe(
      catchError( err => of({"ok":false, "message":err.message} as AuthResponse))
    );
  }

  searchClienteTelefono(telefono:string){
    let url = this.baseUrl + "getClienteTel?value=" + telefono;
    return this.http.get<AuthResponse>(url).pipe(
      catchError( err => of({"ok":false, "message":err.message} as AuthResponse))
    );
  }

  saveVenta(venta: SaveProducts){
    const url = this.baseUrl + "saveVenta";
    let boddy = JSON.stringify(venta);
    return this.http.post<AuthResponse>(url, boddy).pipe(
      // tap(data => console.log(data))
      catchError( err => of({"ok":false, "message":err.message} as AuthResponse))
    );  
  }
  
  cobrarVenta(venta: Cobro){
    let url = this.baseUrl + "cobrar";
    let boddy = JSON.stringify(venta);
    return this.http.post<AuthResponse>(url, boddy).pipe(
      catchError( err => of({"ok":false, "message":err} as AuthResponse))
    );
  }

  cancelarVenta(venta: number){
    let url = this.baseUrl + "cancelarVenta";
    let boddy = JSON.stringify( {"id_venta": venta} );
    return this.http.post<AuthResponse>(url, boddy).pipe(
      catchError( err => of({"ok":false, "message":err.message} as AuthResponse))
    );
  }
}
