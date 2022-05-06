import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthResponse, Usuario } from '../../auth/interfaces/auth.interfaces';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private baseUrl: string = environment.baseUrl + 'sinve_api/';

  constructor( private http: HttpClient ) { }

  getAllUsuarios(){
    return this.http.get<AuthResponse>(this.baseUrl + 'usuarios');
  }

  saveUsuario(usuario:Usuario){
    const boddy = JSON.stringify(usuario);
    return this.http.post<AuthResponse>(this.baseUrl + 'usuario', boddy).pipe(
      catchError(err => of({ok:false, message:err.message} as AuthResponse) )
    );
  }

  removeUsuario(id:number){
    const boddy = JSON.stringify( {"id_usuario": id} );
    return this.http.post<AuthResponse>(this.baseUrl + 'removeUsuario', boddy).pipe(
      catchError(err => of({ok:false, message:err.message} as AuthResponse) )
    );
  }

  editUsuario(usuario:Usuario){
    const boddy = JSON.stringify(usuario);
    return this.http.put<AuthResponse>(this.baseUrl + 'updateUsuario', boddy).pipe(        
      catchError(err => of({ok:false, message:err.message}) )
    );
  }

  getAllRoles(){
    return this.http.get<AuthResponse>(this.baseUrl + 'roles');
  }

  getAllStatus(){
    return this.http.get<AuthResponse>(this.baseUrl + 'status');
  }

}
