import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../../auth/interfaces/auth.interfaces';
import { Marca } from '../interfaces/productos.interface';

@Injectable({
  providedIn: 'root'
})
export class MarcasService {
  private baseUrl: string = environment.baseUrl + 'sinve_api/';
  constructor( private http: HttpClient ) { }


  buscarMarcas(busqueda:string){
    const url = this.baseUrl + "getMarcas?d=" + busqueda;
    return this.http.get<any>(url);
  }

  getAllMarcas(){
    const url = this.baseUrl + "marcas";
    return this.http.get<AuthResponse>(url);
  }

  addMarca(marca: Marca){
    const boddy = JSON.stringify(marca);
    const url = this.baseUrl + "marca";
    return this.http.post<AuthResponse>(url, boddy);
  }

  editMarca(marca: Marca){
    const boddy = JSON.stringify(marca);
    const url = this.baseUrl + "updateMarca";
    return this.http.put<AuthResponse>(url, boddy);
  }

  removeMarca(id: number){
    const boddy = JSON.stringify({id_marca: id});
    const url = this.baseUrl + "removeMarca";
    return this.http.post<AuthResponse>(url, boddy);
  }
}
