import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../../auth/interfaces/auth.interfaces';
import { Cliente } from '../interfaces/clientes.interface';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private baseUrl: string = environment.baseUrl + 'sinve_api/';
  constructor( private http: HttpClient ) { }

  getAllClientes() {
    return this.http.get<AuthResponse>(this.baseUrl + 'clientes').pipe(
      catchError(err => of({ok:false, message:err.message} as AuthResponse) )
    );
  }

  addCliente(cliente: Cliente) {
    return this.http.post<AuthResponse>(this.baseUrl + 'addCliente', cliente).pipe(
      catchError(err => of({ok:false, message:err.message} as AuthResponse) )
    );
  }

  updateCliente(cliente: Cliente) {
    const boddy = JSON.stringify(cliente);
    return this.http.put<AuthResponse>(this.baseUrl + 'updateCliente', boddy).pipe(
      catchError(err => of({ok:false, message:err.message} as AuthResponse) )
    );
  }

  deleteCliente(id: number) {
    const boddy = JSON.stringify({id_cliente: id});
    return this.http.post<AuthResponse>(this.baseUrl + 'removeCliente', boddy).pipe(
      catchError(err => of({ok:false, message:err.message} as AuthResponse) )
    );
  }
}
