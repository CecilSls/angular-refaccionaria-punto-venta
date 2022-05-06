import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { AuthResponse } from 'src/app/auth/interfaces/auth.interfaces';
import { Producto } from '../interfaces/ventas.interfaces';
import { catchError, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductosService{
    private baseUrl: string = environment.baseUrl + 'sinve_api/';
    constructor( private http: HttpClient ) { }

    getAllProducts(){
        const url = this.baseUrl + "productos";
        return this.http.get<AuthResponse>(url).pipe(
            // tap(console.log),        
            catchError(err => of({ok:false, message:err.message} as AuthResponse) )
        );
    }

    editProducto(producto:Producto){
        const boddy = JSON.stringify(producto);
        const url = this.baseUrl + "updateProducto";
        return this.http.put<AuthResponse>(url, boddy).pipe(
            catchError(err => of({ok:false, message:err.message} as AuthResponse) )
        );
    }

    deleteProducto(id:number){
        const boddy = JSON.stringify({"productos":[id]});
        const url = this.baseUrl + "removeProducto";
        return this.http.post<AuthResponse>(url, boddy).pipe(
            catchError(err => of({ok:false, message:err.message} as AuthResponse) )
        );
    }

    addProducto(producto:Producto){
        const boddy = JSON.stringify(producto);
        const url = this.baseUrl + "addProducto";
        return this.http.post<AuthResponse>(url, boddy).pipe(
            catchError(err => of({ok:false, message:err.message} as AuthResponse) )
        );
    }
}