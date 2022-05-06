import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import Swal from 'sweetalert2';

import { environment } from 'src/environments/environment';
import { Producto } from '../../interfaces/ventas.interfaces';
import { ProductoResponse, Marca, Proveedor } from '../../interfaces/productos.interface';

import { MarcasService } from '../../services/marcas.service';
import { ProveedoresService } from '../../services/proveedores.service';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styles: []
})
export class ProductosComponent implements OnInit {
  
  private reportesUrl = environment.reportesUrl;

  @ViewChild('tablaProducto') tablaProducto!:Table;
  
  formProductos: FormGroup = this.fb.group({
    codigo_barras: ['', Validators.pattern("^[a-zA-Z0-9\s]{1,15}$")],
    description: ['', Validators.pattern(/^[a-zA-Z0-9\s]*$/)],
    id_marca: [{} as Marca, Validators.required],
    id_proveedor: [{} as Proveedor, Validators.required],
    id_producto: [''],
    existencia: ['', Validators.required],
    precio_compra: ['', Validators.required],
    precio_venta: ['', Validators.required],
    anaquel: ['', Validators.pattern("^[0-9]*$")],
    modulo: ['', Validators.pattern("^[0-9]*$")],
    stock_minimo: ['', Validators.pattern("^[0-9]*$")],
    stock_maximo: ['', Validators.pattern("^[0-9]*$")],
  });

  proveedorDisponibles:Proveedor[] = [];
  productos:ProductoResponse[] = [];
  marcasDisponibles:Marca[] = [];
  infoAMostrar:Producto = {} as Producto;
  loading:boolean = false;
  verInfo:boolean = false;
  esEditar:boolean = false;
  verModal:boolean = false;
  alphaNumericS:RegExp = /^[a-zA-Z0-9\s]*$/;

  constructor(
      private productService:ProductosService,
      private marcasServiee:MarcasService,
      private proveedoresService:ProveedoresService,      
      public messageService: MessageService,
      private fb: FormBuilder) { 
        this.verInfo = false;
        this.esEditar = false;
        //* Busqueda de todos los proveedores
        this.proveedoresService.getAllProveedores().subscribe(
          data => {
            if(data.ok){ this.proveedorDisponibles = data.data! as Proveedor[]; }
            else{ this.toastMessageErr("Proveedores: " + data.message); }
          }
        );
        //* Busqueda de todas las marcas
        this.marcasServiee.getAllMarcas().subscribe(
          data => {
            if(data.ok){ this.marcasDisponibles = data.data! as Marca[]; }
            else{ this.toastMessageErr("Marcas: " + data.message); }
          }
        );
  }

  ngOnInit(): void {
    this.loading = true;
    //* Obtencion de todos los productos
    this.productService.getAllProducts().subscribe(
        data => {
          if(data.ok){
            this.productos = data.data! as ProductoResponse[];
          }else{
            this.toastMessageErr("Productos: " + data.message);
          }
          this.loading = false;
        }
    );
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.tablaProducto!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  showDialog(producto:Producto):void{
    this.verInfo = true;
    this.infoAMostrar = producto;
  }

  showModalAgregar(){
    this.verModal = true;
    this.formProductos.reset();
    this.formProductos.controls['id_marca'].setValue({} as Marca);
    this.formProductos.controls['id_proveedor'].setValue({} as Proveedor);
  }

  showModalEdit(producto:Producto, marca:string, proveedor:string):void{
    this.formProductos.reset();
    this.formProductos.patchValue(producto);
    this.infoAMostrar = producto;
    this.formProductos.controls['id_marca'].setValue(
      this.marcasDisponibles.find(marca => marca.id_marca === producto.id_marca)
    );
    this.formProductos.controls['id_proveedor'].setValue(
      this.proveedorDisponibles.find(prov => prov.id_proveedor === producto.id_proveedor)
    );
    this.esEditar = true;
    this.verModal = true;
  }

  openBarcodeWindow(codigo:string){
    window.open(this.reportesUrl+`barcode.php?codigo_b=${codigo}&tipo_barra=1`, '_blank');
  }

  openReport(type:string){
    window.open(`${this.reportesUrl}${type}`, '_blank');
  }
  //* Verificar duplicados mediante la comprobación en la memoria de productos
  verificarDuplicados(producto:Producto):boolean{
    let duplicado:boolean = false;
    this.productos.forEach(productoDB => {
      if(productoDB.codigo_barras === producto.codigo_barras){
        duplicado = true;
        return;
      }
    });
    return duplicado;
  }

  //* Operaciones con comunicacion al servicio ==============================

  deleteProducto(id:number){
    this.productService.deleteProducto(id).subscribe(
      data => {
        if(data.ok){
          this.msjSuccess(data.message);
          this.ngOnInit();
        }else{
          this.msjError(data.message);
        }
      }
    );
  }

  agregarProducto(){
    const validar = this.formProductos.valid;
    const producto:any = {...this.formProductos.value};
    const duplicado = this.verificarDuplicados(producto);
    if(validar){
          producto["id_proveedor"] = producto.id_proveedor.id_proveedor;
          producto["id_marca"] = producto.id_marca.id_marca;
          this.productService.addProducto(producto).subscribe(
            data => {
              if(data.ok){
                producto['id_producto'] = data.data! as number;
                this.productos.push(producto);
                this.formProductos.reset();
                this.tablaProducto.clear();
                this.verModal = false;
                this.msjSuccess(data.message);
              }else{
                if(data.message.indexOf('ku_codigo_barras') > -1){
                  this.toastMessageErr('Codigo de barras duplicado');
                }else{
                  this.toastMessageErr(data.message);
                }
              }
            }
          );
    }else if(duplicado){
      this.toastMessageErr('Codigo de barras duplicado');
    }else{
      this.toastMessageErr('Faltan datos por llenar');
    }
  }

  editarProducto(){
    let producto:any = {...this.formProductos.value};
    const duplicado = this.verificarDuplicados(producto);
    if( this.formProductos.valid ){
      producto["id_proveedor"] = producto.id_proveedor.id_proveedor;
      producto["id_marca"] = producto.id_marca.id_marca;
      this.productService.editProducto(producto).subscribe(
        data => {
          if(data.ok){
            const index = this.productos
                            .findIndex(x => x.id_producto === producto.id_producto);
            this.productos[index] = producto;
            this.formProductos.reset();
            this.tablaProducto.reset();
            this.verModal = false;
            this.esEditar = false;
            this.msjSuccess(data.message);
          }else{
            if(data.message.indexOf('ku_codigo_barras') > -1){
              this.toastMessageErr('Codigo de barras duplicado');
            }else{
              this.toastMessageErr(data.message);
            }
          }
        }
      );
    }else if(duplicado){
      this.toastMessageErr('Codigo de barras duplicado');
    }else{
      this.toastMessageErr('Faltan datos por llenar');
    }
  }
  
  conversor(tipo:number, query:number){
    let resultado:string = "";
    if(tipo === 1){
      resultado = this.marcasDisponibles.find(marca => marca.id_marca === query)!.description;
    }else{      
      resultado = this.proveedorDisponibles.find(prov => prov.id_proveedor === query)!.nombre;
    }
    return resultado;
  }

  clear() {
    this.tablaProducto.clear();
  }

  toastMessageErr(message:string){    
    this.messageService.add({severity:'error', summary:'Error', detail:message});
  }

  msjError(mensaje:string) {
    Swal.fire({
      title: 'Error',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
  }

  msjSuccess(mensaje:string) {
    Swal.fire({
      title: 'Exito',
      text: mensaje,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }

  msjConfirm(nombre:string, id:number){
    Swal.fire({
      title: 'Eliminar ' + nombre,
      text: "¿Estas seguro de eliminar el producto?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.deleteProducto(id);
      }
    });
  }

}