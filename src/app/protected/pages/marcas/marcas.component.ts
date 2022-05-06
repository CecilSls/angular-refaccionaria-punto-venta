import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Marca } from '../../interfaces/productos.interface';
import { MarcasService } from '../../services/marcas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html',
  styles: [
  ]
})
export class MarcasComponent implements OnInit {

  @ViewChild('tablaM') dt2!:Table;
  formMarca: FormGroup = this.fb.group({
    description: ['', [Validators.required]],
    id_marca: [0],
    id_status: [1],
  });

  marcas:Marca[] = [];
  loading:boolean = false;
  verModal:boolean = false;
  esEditar:boolean = false;

  constructor(
    private fb: FormBuilder,
    private marcasService:MarcasService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.marcasService.getAllMarcas().subscribe(
      data => {
        this.loading = false;
        if(data.ok){
          this.marcas = data.data! as Marca[];
        }
      }
    );
  }

  applyFilterGlobal($event: any, stringVal: any) {    
    this.dt2!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  abrirModalEditar(marca:Marca){
    this.esEditar = true;
    this.formMarca.patchValue(marca);
    this.verModal = true;
  }

  agregarMarca(){
    const procede = this.formMarca.valid;
    if(procede){
      let marca:Marca = this.formMarca.value;
      this.marcasService.addMarca(marca).subscribe(
        data => {
          this.verModal = false;
          if(data.ok){
            marca['id_marca'] = data.data! as number;
            this.marcas.push(marca);
            this.formMarca.reset();
            this.verModal = false;
            this.dt2.reset();
            Swal.fire('Agregado', 'Cliente agregado correctamente', 'success');
          }else{
            Swal.fire('Error', data.message, 'error');
          }
        }
      );
    }
  }

  editarMarca(){
    const procede = this.formMarca.valid;
    if(procede){
      const editar = this.formMarca.value;
      this.marcasService.editMarca(editar).subscribe(
        data => {
          this.verModal = false;
          if(data.ok){
            const index = this.marcas.findIndex(x => x.id_marca === editar.id_marca);
            this.marcas[index] = editar;
            this.formMarca.reset();
            this.dt2.reset();
            Swal.fire('Editado', 'Marca editada correctamente', 'success');
          }else{
            Swal.fire('Error', data.message, 'error');
          }
        }
      );
    }
  }

  eliminarMarca(id:number){
    this.marcasService.removeMarca(id).subscribe(
      data => {
        if(data.ok){
          const index = this.marcas.findIndex(x => x.id_marca === id);
          this.marcas.splice(index, 1);
          this.dt2.reset();
          Swal.fire('Eliminado', 'Marca eliminada correctamente', 'success');
        }else{
          Swal.fire('Error', data.message, 'error');
        }
      }
    );
  }

  msjConfirm(username:string, id:number){
    Swal.fire({
      title: 'Marca: ' + username,
      text: "¿Desea eliminarlo?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.eliminarMarca(id);
      }
    });
  }

}
