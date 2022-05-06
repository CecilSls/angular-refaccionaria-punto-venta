import { Component, OnInit } from '@angular/core';
import { VentaProductos, Producto, SaveProducts, ResponseSaveVenta } from '../../interfaces/ventas.interfaces';
import { VentasService } from '../../services/ventas.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  providers: [ MessageService ]
})
export class VentasComponent implements OnInit {

  rgxAlphaNum: RegExp = /^[a-zA-Z0-9\s]*$/
  productos:VentaProductos[] = [];
  producto_search!:Producto;
  totalVenta:number = 0;
  loading:boolean = false;

  productoForm: FormGroup = this.fb.group({
    codigo_barras: [''],
    description: [''],
    cantidad:[{value:'0', disabled:true}],
    precio:['', [Validators.required]],
  });

  constructor( private ventasService:VentasService,
              public messageService: MessageService,
              private authService:AuthService,
              private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.totalVenta = this.productos.reduce((a, b) => a + b.total, 0);
  }

  // Funciones para agregar productos a la lista de venta
  searchProducto(operacion:number, e:any):void{  
    e.preventDefault();
    if(e.target.value.trim().length <= 0) return; // La busqueda esta vacia, no se realiza la operacion
    this.loading = true;
    this.producto_search = null!;
    this.productoForm.controls['cantidad']?.disable();
    this.ventasService.serachProducto(operacion, e.target.value).subscribe(
      data => {
        this.loading = false;
        if(data.ok){
          let info = data.data as [Producto];
          if( info.length < 1 ){ // No se encontro el producto
            this.messageService.add({severity:'warn', summary: 'Advertencia', detail: 'No se encontraron resultados'});
            return;
          }
          this.producto_search = info[0];
          this.productoForm.controls['cantidad']?.enable();
          this.productoForm.patchValue({
            codigo_barras: info[0].codigo_barras,
            description: info[0].description,
            precio: info[0].precio_venta,
            cantidad: 1,
          });
          this.messageService.add({severity:'info', summary: 'Información', detail: 'Producto encontrado'});
        }
      },
    );
  }

  addProducto():void{
    if(this.producto_search !== null){
      const producto = this.productos.find(producto => producto.id_producto === this.producto_search.id_producto) ;
       // Si el producto ya existe en la lista de venta
      if(producto === null || producto == undefined ) {        
        //Si el producto exede su cantidad en stock
        if( (this.productoForm.value.cantidad) > (this.producto_search.existencia)){
          // console.log("Sobrepasa el Stock")
          this.msjError("Fuera de stock. Existencia de: " + this.producto_search.existencia);
          return;
        }else{
          this.productos.push(
            {
              id_producto: this.producto_search.id_producto,
              codigo_barras: this.producto_search.codigo_barras,
              description: this.producto_search.description,
              existencia: this.producto_search.existencia,
              cantidad: this.productoForm.value.cantidad,
              precio: this.producto_search.precio_venta,
              total: this.productoForm.value.cantidad * this.producto_search.precio_venta,
            }
          )
        }
      }else{
        //? Si el producto exede su cantidad en stock
        if( (producto.cantidad + this.productoForm.value.cantidad) > (this.producto_search.existencia)){
          this.msjError("Sobrepasa el Stock");
          return;
        }else{
          producto.cantidad += this.productoForm.value.cantidad;
          producto.total = producto.cantidad * producto.precio;
        }
      }
      this.producto_search = null!;
      this.actualizarLista();
      this.productoForm.controls['cantidad']?.disable();
      this.productoForm.patchValue({
        codigo_barras: '',
        description: '',
        cantidad: '',
        precio: '',
      });
    }
    this.totalVenta = this.productos.reduce((a, b) => a + b.total, 0);
  }

  borrarProducto(producto:VentaProductos){
    const index = this.productos.indexOf(producto);
    this.productos.splice(index, 1);
    this.totalVenta -= producto.total;
  }

  actualizarLista():void{
    let total = 0;
    this.productos.forEach(producto => {
      total += producto.total;
    })
    // this.ventaForm.patchValue({ venta_total: total })
  }

  // Funciones para guardar la venta
  saveVenta():void{
    const venta:SaveProducts = {
      id_usuario: this.authService.getUsuario().id,
      // id_usuario: 1,
      venta_total: this.totalVenta,
      productos: this.productos
    }
    this.ventasService.saveVenta(venta).subscribe(
      data => {
        if(data.ok){
          const ticket = (data.data! as ResponseSaveVenta).ticket;
          window.open(environment.reportesUrl+"ticket.php?ticket="+ticket, "_blank");
        }else{
          this.msjError("Error al guardar la venta :: " + data.message);
        }
      }
    );
    this.productos = [];
    this.totalVenta = this.productos.reduce((a, b) => a + b.total, 0);
  }

  msjError(msj:string):void{
    Swal.fire({
      title: 'Error',
      text: msj,
      icon: 'error',
      confirmButtonText: 'Aceptar'
    })
  }

  msjSuccess(msj:string):void{
    Swal.fire({
      title: 'Exito',
      text: msj,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    })
  }

}