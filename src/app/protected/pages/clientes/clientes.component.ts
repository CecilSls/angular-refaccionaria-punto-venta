import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Cliente } from '../../interfaces/clientes.interface';
import { ClientesService } from '../../services/clientes.service';
import { Table } from 'primeng/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styles: [
  ]
})
export class ClientesComponent implements OnInit {

  @ViewChild('tablaC') dt2!:Table;

  formCliente: FormGroup = this.fb.group({
    //rfc: ['', [Validators.required, Validators.pattern(/^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/)]],
    rfc:['', Validators.required],
    telefono: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    id_cliente: [0],
    id_status: [1],
  });

  clientes:Cliente[] = [];
  loading:boolean = false;
  verModal:boolean = false;
  esEditar:boolean = false;
  alphaNumericS:RegExp = /^[a-zA-Z0-9\s]*$/;
  alphaSpace:RegExp = /^[a-zA-Z\s]*$/;

  constructor(
    private fb: FormBuilder,
    private clientesService:ClientesService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.clientesService.getAllClientes().subscribe(
      data => {
        this.loading = false;
        if(data.ok){
          this.clientes = data.data! as Cliente[];
        }
      }
    );
  }

  applyFilterGlobal($event: any, stringVal: any) {    
    this.dt2!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  abrirModalEditar(cliente:Cliente){
    this.esEditar = true;
    this.formCliente.reset();
    this.formCliente.patchValue(cliente);
    this.verModal = true;
  }

  agregarCliente(){
    const procede = this.formCliente.valid;
    if(procede){
      let cliente = this.formCliente.value;
      this.clientesService.addCliente(cliente).subscribe(
        data => {
          this.verModal = false;
          if(data.ok){
            cliente['id_cliente'] = data.data! as number;
            this.clientes.push(cliente);
            this.formCliente.reset();
            Swal.fire('Agregado', 'Cliente agregado correctamente', 'success');
          }else{
            Swal.fire('Error', data.message, 'error');
          }
        }
      );
    }
  }

  editarCliente(){
    const procede = this.formCliente.valid;
    if(procede){
      const editar = this.formCliente.value;
      this.clientesService.updateCliente(editar).subscribe(
        data => {
          if(data.ok){
            const index = this.clientes.findIndex(x => x.id_cliente === editar.id_cliente);
            this.clientes[index] = editar;
            this.formCliente.reset();
            this.verModal = false;
            Swal.fire('Editado', 'Cliente editado correctamente', 'success');
          }else{
            console.log(data);
          }
        }
      );
    }
  }

  eliminarCliente(id:number){
    this.clientesService.deleteCliente(id).subscribe(
      data => {
        console.log(data);
        if(data.ok){
          const index = this.clientes.findIndex(x => x.id_cliente === id);
          this.clientes.splice(index, 1);
          Swal.fire('Eliminado', 'Cliente eliminado correctamente', 'success');
        }else{
          Swal.fire('Error', data.message, 'error');
        }
      }
    );
  }

  msjConfirm(username:string, id:number){
    Swal.fire({
      title: 'Cliente: ' + username,
      text: "¿Desea eliminarlo?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.eliminarCliente(id);
      }
    });
  }

}
