import { Component, OnInit, ViewChild } from '@angular/core';
import { Proveedor } from '../../interfaces/productos.interface';
import { ProveedoresService } from '../../services/proveedores.service';
import { Table } from 'primeng/table';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styles: [
  ]
})
export class ProveedoresComponent implements OnInit {
  @ViewChild('tablaP') dt2!:Table;

  formProveedor: FormGroup = this.fb.group({
    nombre: ['', [Validators.pattern(/^[a-zA-Z0-9\s]{1,150}$/), Validators.required]],
    empresa: ['', [Validators.pattern(/^[a-zA-Z0-9\s]{1,150}$/), Validators.required]],
    telefono_contacto: ['', [Validators.required, Validators.pattern("^[0-9]{1,10}$")]],
    email_contacto: ['', [Validators.required, Validators.email]],
    id_proveedor: [0]
  });

  proveedores:Proveedor[] = [];
  loading: boolean = false;
  modalAgregar:boolean = false;
  esEditar:boolean = false;

  constructor(
    private messageService: MessageService,
    private proveedoresService:ProveedoresService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loading = true;
    this.esEditar = false;
    this.proveedoresService.getAllProveedores().subscribe(
      data => {
        this.loading = false;
        if(data.ok){
          this.proveedores = data.data! as Proveedor[];
        }
      }
    );
  }

  applyFilterGlobal($event: any, stringVal: any) {    
    this.dt2!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  agregarProveedor(){
    const procede = this.formProveedor.valid;
    if(procede){
      let proveedor = this.formProveedor.value as Proveedor;
      this.proveedoresService.addProveedor(proveedor).subscribe(
        data => {
          if(data.ok){
            proveedor['id_proveedor'] = data.data! as number;
            this.proveedores.push(proveedor);
            this.formProveedor.reset();
            this.modalAgregar = false;
            this.msjSuccess("Proveedor agregado");
          }else{
            this.toastMessageErr(data.message);
          }
        }
      );
    }
  }

  abrirModalEditar(proveedor:Proveedor){
    this.esEditar = true;
    this.modalAgregar = true;
    this.formProveedor.patchValue(proveedor);
  }

  editarProveedor(){
    const procede = this.formProveedor.valid;
    if(procede){
      const proveedor = this.formProveedor.value as Proveedor;
      this.proveedoresService.updateProveedor(proveedor).subscribe(
        data => {
          if(data.ok){
            this.proveedores.forEach(element => {
              if(element.id_proveedor == proveedor.id_proveedor){
                element.nombre = proveedor.nombre;
                element.empresa = proveedor.empresa;
                element.telefono_contacto = proveedor.telefono_contacto;
                element.email_contacto = proveedor.email_contacto;
              }
            });
            this.formProveedor.reset();
            this.modalAgregar = false;
            this.msjSuccess("Proveedor actualizado");
          }else{
            this.toastMessageErr(data.message);
          }
        }
      );
    }
  }

  deleteProveedor(id:number){
    this.proveedoresService.deleteProveedor(id).subscribe(
      data => {
        if(data.ok){
          this.proveedores = this.proveedores.filter(element => element.id_proveedor != id);
          this.msjSuccess("Proveedor eliminado");
        }else{
          this.toastMessageErr(data.message);
        }
      }
    );
  }

  ///MODALES DE APOYO

  toastMessageErr(message:string){    
    this.messageService.add({severity:'error', summary:'Error', detail:message});
  }

  msjConfirm(nombre:string, id:number){
    Swal.fire({
      title: 'Eliminar ' + nombre,
      text: "¿Estas seguro de eliminar el proveedor?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.deleteProveedor(id);
      }
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
