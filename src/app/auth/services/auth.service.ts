import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { AuthResponse, Login } from '../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = environment.baseUrl + 'sinve_api/';
  private _usuario!: Login;

  getUsuario(){
    return { ...this._usuario };
  }

  constructor( private http: HttpClient ) { }

  login( username: string, password: string ){
    const url = `${this.baseUrl}signin`;
    const body = { username, password };
    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap( 
          resp => {
            if (resp.ok){
              const info = {...resp.data} as Login;
              this._usuario = {
                id: info.id,
                username: info.username,
                accesToken: info.accesToken,
                tokenType: info.tokenType,
                roles: info.roles,
              };
              localStorage.setItem('token', info.accesToken!);
            }
        }),
        // map( resp => true ),
        catchError( err =>  of({"ok":"false", "message":err.message}) )
      );
  }
  
  validarToken(): Observable<boolean>{
    const url = `${this.baseUrl}renew`;
    const headers = new HttpHeaders()
          .set('Authorization', `Bearer ${localStorage.getItem('token')}` || '');
    return this.http.get<AuthResponse>(url, { headers })
      .pipe(
        map(
          resp => {
            if (resp.ok){
              const info = {...resp.data} as Login;
              this._usuario = {
                id: info.id,
                username: info.username,
                accesToken: info.accesToken,
                tokenType: info.tokenType,
                roles: info.roles,
              };
              localStorage.setItem('token', info.accesToken!);
            }
            return true
          }
        ),
        catchError(err => of(false) )
      );
  }

  logout(){
    localStorage.clear();
  }

}
