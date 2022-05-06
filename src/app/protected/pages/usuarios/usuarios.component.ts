import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario, Estatus, Role } from '../../../auth/interfaces/auth.interfaces';
import { UsuariosService } from '../../services/usuarios.service';
import { Table } from 'primeng/table';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})

export class UsuariosComponent implements OnInit {
  @ViewChild('tablaU') dt2!:Table;
  formUsuarios: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    id_tipo: ['', [Validators.required]],
    id_usuario: [0],
    id_status: [1],
    create_date: [new Date()]
  });

  loading:boolean = false;
  usuarios:Usuario[] = [];
  rolesDisponibles:any[] = [];
  rolesPlantilla:string[] = [];
  statusPlantilla:string[] = [];
  verModal:boolean = false;
  esEditar:boolean = false;

  constructor(
        private usuariosService:UsuariosService,
        private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.usuariosService.getAllUsuarios().subscribe(
      data => {
        this.loading = false;
        if(data.ok){
          this.usuarios = data.data! as Usuario[];
        }
      }
    );
    this.usuariosService.getAllRoles().subscribe(
      data => {
        if(data.ok){
          const aux = data.data! as Role[];
          this.rolesDisponibles = aux.map(x => {
            return {
              name: x.description,
              code: x.id_tipo
            }
          });
          this.rolesPlantilla = aux.map(x => x.description);
        }
      }
    );
    this.usuariosService.getAllStatus().subscribe(
      data => {
        if(data.ok){
          const aux = data.data! as Estatus[];
          this.statusPlantilla = aux.map(x => x.description);
        }
      }
    );
  }

  applyFilterGlobal($event: any, stringVal: any) {    
    this.dt2!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  abrirModalEditar(user:Usuario){
    this.esEditar = true;
    this.verModal = true;
    this.formUsuarios.reset();
    this.formUsuarios.patchValue(user);
    this.formUsuarios.controls['password'].removeValidators(Validators.required);
    this.formUsuarios.controls['password'].updateValueAndValidity();
    this.formUsuarios.controls['id_tipo'].setValue(
      this.rolesDisponibles.find(x => x.code === user.id_tipo)
    );
  }

  agregarUsuario(){
    const procede = this.formUsuarios.valid;
    if(procede){
      let nuevo = this.formUsuarios.value as any;
      nuevo['id_tipo'] = nuevo.id_tipo.code as number;
      nuevo = nuevo as Usuario;
      this.usuariosService.saveUsuario(nuevo).subscribe(
        data => {
          if(data.ok){
            nuevo['id_usuario'] = data.data! as number;
            this.usuarios.push(nuevo);
            this.formUsuarios.reset();
            this.verModal = false;
            this.msjSuccefull();
          }else{
            this.verModal = false;
            if (data.message.indexOf('Duplicate entry') > -1) {
              this.msjError('El USERNAME ya esta siendo usado.');
              return;
            }
            this.msjError(data.message);
          }
        }
      );
    }
  }

  editarUsuario(){
    const procede = this.formUsuarios.valid;
    if(procede){
      let nuevo = this.formUsuarios.value as any;
      nuevo['id_tipo'] = nuevo.id_tipo.code as number;
      nuevo = nuevo as Usuario;
      if(nuevo['password'] == null || nuevo['password'].trim() === ''){
        delete nuevo['password'];
      }
      this.usuariosService.editUsuario(nuevo).subscribe(
        data => {
          if(data.ok){
            const index = this.usuarios.findIndex(x => x.id_usuario === nuevo.id_usuario);
            this.usuarios[index] = nuevo;
            this.formUsuarios.reset();
            this.verModal = false;
            this.msjSuccefull();
          }else{
            this.verModal = false;
            if (data.message.indexOf('Duplicate entry') > -1) {
              this.msjError('El USERNAME ya esta siendo usado.');
              return;
            }
            this.msjError(data.message);
          }
        }
      );
    }
  }

  deshabilitarUsuario(id:number){
    this.usuariosService.removeUsuario(id).subscribe(
      data => {
        if(data.ok){
          const index = this.usuarios.findIndex(x => x.id_usuario === id);
          this.usuarios.splice(index, 1);
          this.msjSuccefull();
        }else{
          this.verModal = false;
          this.msjError(data.message);
        }
      }
    );
  }

  activarValidacion(){
    this.formUsuarios.controls['password'].addValidators(Validators.required);
    this.formUsuarios.controls['password'].updateValueAndValidity();
  }

  msjSuccefull(){
    Swal.fire({
      title: 'Operacion realizada exitosamente',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }

  msjError(msj:string){
    Swal.fire({
      title: 'Ocurrio un error',
      text: msj,
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

  msjConfirm(username:string, id:number){
    Swal.fire({
      title: 'Desactivar al Usuario: ' + username,
      text: "¿Desea desactivar al usuario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.deshabilitarUsuario(id);
      }
    });
  }

}
