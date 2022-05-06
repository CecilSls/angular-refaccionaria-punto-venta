import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../../auth/interfaces/auth.interfaces';
import { Proveedor } from '../interfaces/productos.interface';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  private baseUrl: string = environment.baseUrl + 'sinve_api/';
  constructor( private http: HttpClient ) { }

  getAllProveedores(busqueda?:string){
    const url = this.baseUrl + "proveedores";
    return this.http.get<AuthResponse>(url).pipe(
      catchError( err => of({"ok":false, "message":err.message} as AuthResponse))
    );
  }

  addProveedor(proveedor:Proveedor){
    const url = this.baseUrl + "proveedor";
    const boddy = JSON.stringify(proveedor);
    return this.http.post<AuthResponse>(url, boddy).pipe(
      catchError( err => of({"ok":false, "message":err.message} as AuthResponse))
    );
  }

  updateProveedor(proveedor:Proveedor){
    const url = this.baseUrl + "updateProveedor";
    const boddy = JSON.stringify(proveedor);
    return this.http.put<AuthResponse>(url, boddy).pipe(
      catchError( err => of({"ok":false, "message":err.message} as AuthResponse))
    );
  }

  deleteProveedor(id:number){
    const url = this.baseUrl + "removeProveedor";
    const boddy = JSON.stringify({"id_proveedor":id});
    return this.http.post<AuthResponse>(url, boddy).pipe(
      catchError( err => of({"ok":false, "message":err.message} as AuthResponse))
    );
  }
}
