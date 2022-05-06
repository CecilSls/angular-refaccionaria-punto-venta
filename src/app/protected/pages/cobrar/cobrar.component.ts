import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { VentaRequest, CobroVenta, Producto, Cobro } from '../../interfaces/ventas.interfaces';
import { VentasService } from '../../services/ventas.service';
import { Cliente } from '../../interfaces/clientes.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { AutoComplete } from 'primeng/autocomplete';

@Component({
  selector: 'app-cobrar',
  templateUrl: './cobrar.component.html',
  styles: [
  ]
})
export class CobrarComponent implements OnInit {
  
  @ViewChild('selectInput') selectInput!:AutoComplete;

  constructor(
    private authService:AuthService,
    private ventasService:VentasService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.stateOptions = [{label: 'Contado', value: '2'}, {label: 'Credito', value: '1'}];
    this.ventaForm.disable(); //* Deshabilitar formulario desde el inicio
    this.text_select = "2"; //* Sirve para que la opcion "CONTADO" este por defecto
  }
  
  @ViewChild('txtTicket') txtTicket!:ElementRef<HTMLInputElement>;
  @ViewChild('tipoVenta') tipoVenta!:any;
  stateOptions:any = [];
  buscando:boolean = false;
  ventaActual!:CobroVenta;
  siExiste:boolean = false;
  aCredito:boolean = false;
  text_select!: string;
  results!: string[];
  clientesSuggest!:any[];
  clienteCredito: Cliente = {} as Cliente;
  productosVenta: Producto[] = [];
  procedeCobro:boolean = false;

  ventaForm: FormGroup = this.fb.group({
    total_pagado: ['', Validators.pattern("^[0-9]*$")],
    recibido: ['', Validators.pattern("^[0-9]*$")],
    cambio: ['', Validators.required],
  })

  buscarTicket():void{
    this.buscando = true;
    this.siExiste = false;
    const valido = this.txtTicket.nativeElement.validity.patternMismatch;
    if(valido){
      this.msjError('El ticket no es valido');
      return;
    }
    const ticket = this.txtTicket.nativeElement.value;
    this.ventasService.searchTicket(ticket).subscribe(
      data => {
        this.buscando = false;
        if(data.ok){
          const venta = (data.data as CobroVenta);
          if( venta.productos.length <= 0){ //? Si la busqueda no arroja resultados
            this.msjError('El ticket solicitado no se encuentra registrado o ya se encuentra cobrado');
            return;
          }
          //* Si existe el ticket ================
          this.siExiste = true;
          this.ventaForm.patchValue({
            venta_total: venta.venta_total,
            pendiente: venta.pendiente,
            cambio: 0
          });
          this.ventaActual = venta;
          this.productosVenta = venta.productos;
          this.ventaForm.enable();
        }else{
          this.msjError(data.message);
          return;
        }
      },
      error => {
        this.msjError(error.message);
      }
    );
  }

  // Buscar CLiente por telefono o rfc
  buscarCliente(event:any):void{
    this.ventasService.searchClienteTelefono(event.query).subscribe(
      data => {
        this.clienteCredito = {} as Cliente;
        this.results = [];
        this.clientesSuggest = [];
        if( data.ok){
          this.clientesSuggest = [];
          let auxiliar:string[] = [];
          (data.data as Cliente[])!.forEach(element => {
            this.clientesSuggest.push(element);
            auxiliar.push(element.rfc);
          });
          this.results = auxiliar;
        }
      }
    );
  }

  selectTipoVenta():void{
    const check = this.tipoVenta.value; //2 = credito, 1 = contado
    this.aCredito = (check == 1) ? true : false;
    this.procedeCobro = false;
    this.ventaForm.reset();
    this.clienteCredito = {} as Cliente;
    this.selectInput.writeValue('');
  }


  // Seleccionar cliente
  selectCliente(event:any):void{
    this.clienteCredito = {} as Cliente;
    const seleccion = event;
    const res = this.clientesSuggest.filter(element => element.rfc == seleccion);
    this.clienteCredito = res[0];
  }

  calcularCambio():void{
    const check = this.tipoVenta.value; //1 = credito, 2 = contado
    let total = this.ventaForm.value.total_pagado;
    let recibido = this.ventaForm.value.recibido;
    let cambio = recibido - total;
    this.ventaForm.patchValue({
      cambio: (cambio)
    });
    if(check != 1){
      this.procedeCobro = ( this.ventaForm.value.cambio < 0 ) ? false : true;
    }else{
      this.procedeCobro = true;
    }
  }
  

  saveVenta():void{
    //TODO -> En caso de que se desee saber quien realizo la venta además del cobro, se debe agregar el id del usuario
    const id_usuario = this.authService.getUsuario().id;
    if(this.aCredito && this.clienteCredito.rfc == undefined){
      this.msjError("Falta seleccionar un cliente");
      return;
    }
    let venta:Cobro = {
      id_venta: this.ventaActual.id_venta,
      total_pagado: Number(this.ventaForm.value.total_pagado),
      venta_descuento: this.ventaActual.venta_total - this.ventaForm.value.total_pagado,
      recibido: Number(this.ventaForm.value.recibido),
      cambio: this.ventaForm.value.recibido - this.ventaForm.value.total_pagado,
    }
    if(this.aCredito){
      venta.id_cliente = this.clienteCredito.id_cliente;
      venta.credito = 1;
    }
    this.ventasService.cobrarVenta(venta).subscribe(
      data => {
        if(data.ok){
          this.msjSuccess("Venta cobrada correctamente");
          
          this.ventaForm.reset();
          this.ventaForm.disable();
          this.ventaActual = {} as CobroVenta;
          this.productosVenta = [];
          this.clienteCredito = {} as Cliente;
          this.siExiste = false;
          this.aCredito = false;
          this.results = [];
          this.clientesSuggest = [];
          this.txtTicket.nativeElement.value = "";
          this.text_select = "";
        }else{
          this.msjError(data.message);
        }
      }
    );
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
}
