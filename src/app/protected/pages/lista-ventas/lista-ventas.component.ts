import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { VentasService } from '../../services/ventas.service';
import { Venta } from '../../interfaces/ventas.interfaces';
import { Table } from 'primeng/table';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-ventas',
  templateUrl: './lista-ventas.component.html',
  styleUrls: []
})

export class ListaVentasComponent implements OnInit {
  @ViewChild('dt2') dt2!:Table;

  loading: boolean = true;
  busquedaForm = this.fb.group({
    tipo_busqueda: ['all', Validators.required],
    valor_busqueda: [{value:'', disabled:true}, 
        Validators.required],
  });

  constructor(
            private fb: FormBuilder,
            private service: VentasService) {
    this.opcion_busqueda = [
      {label: 'Todo', value: 'all'},
      {label: '# Ticket', value: 'ticket'},
      {label: 'Usuario', value: 'usuario'},
      {label: 'Pendiente', value: 'pendiente'},
    ];
    this.filtrarVentas();
  }

  ventas: Venta[] = [];
  opcion_busqueda: any[] = [];

  ngOnInit(): void {
  }

  activarBusqueda(){
    const diffAll = this.busquedaForm.value.tipo_busqueda === 'all';
    this.busquedaForm.patchValue({
      valor_busqueda: ''
    });
    if (diffAll) {
      this.busquedaForm.controls['valor_busqueda']?.disable();
      this.filtrarVentas();
    }else{
      this.busquedaForm.controls['valor_busqueda']?.enable();
    }
  }

  filtrarVentas() {
    const{ tipo_busqueda:tipo, valor_busqueda:texto } =  this.busquedaForm.value;
    this.service.searchVenta(tipo, texto).subscribe(
      (data) => {
        if(data.ok){
          this.ventas = data.data as Venta[];
        }
        this.loading = false;
      },
      error => {
        this.msjError(error.message);
        this.loading = false;
      }
    )
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt2!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  imprimirTicket(ticket:string):void{    
    window.open(environment.reportesUrl+"ticket.php?ticket="+ticket, "_blank");
  }
  
  cancelarVenta(venta:Venta){
    if(venta.pendiente != 1) return;
    Swal.fire({
      title: '¿Esta seguro de cancelar la venta?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cancelar venta'
    }).then((result) => {
      if (result.value) {
        this.service.cancelarVenta(venta.id_venta).subscribe(
          (data) => {
            if(data.ok){
              this.msjSuccess(data.message);
              this.filtrarVentas();
            }else{
              this.msjError(data.message);
            }
          }
        );
      }
    })
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
