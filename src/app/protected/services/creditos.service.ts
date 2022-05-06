import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { of, catchError } from 'rxjs';
import { AuthResponse } from '../../auth/interfaces/auth.interfaces';
import { CreditoRequest } from '../interfaces/ventas.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CreditosService {

  private baseUrl: string = environment.baseUrl + 'sinve_api/';

  constructor( private http: HttpClient ) { }

  getCreditos(){
    const url = this.baseUrl + "creditos";
    return this.http.get<AuthResponse>(url).pipe(
      catchError( err => of({"ok":false, "message":err.message} as AuthResponse))
    );
  }

  getAbonos(id_credito:number){
    const url = this.baseUrl + "abono/?credito=" + id_credito;
    return this.http.get<AuthResponse>(url).pipe(
      catchError( err => of({"ok":false, "message":err.message} as AuthResponse))
    );
  }

  abonarCredito(abono:CreditoRequest){
    const url = this.baseUrl + "abonar";
    return this.http.post<AuthResponse>(url, abono).pipe(
      catchError( err => of({"ok":false, "message":err.message} as AuthResponse))
    );
  }

}
