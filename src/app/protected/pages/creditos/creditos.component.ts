import { Component, OnInit, ViewChild } from '@angular/core';
import { Abono, CreditoResponse, CreditoRequest } from '../../interfaces/ventas.interfaces';
import { CreditosService } from '../../services/creditos.service';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.component.html',
  styles: [],
  providers: [DatePipe]
})
export class CreditosComponent implements OnInit {
  
  @ViewChild('talaCreditos') tabla!:Table;

  historial: Abono[] = [];
  creditos:CreditoResponse[] = [];
  loading:boolean = false;
  verHistorial:boolean = false;
  verModal:boolean = false;
  formAbono:FormGroup = this.fb.group({
    deuda: [0, Validators.pattern("^[0-9]*$")],
    abono: [0, Validators.pattern("^[0-9]*$")],
    recibido: [0, Validators.pattern("^[0-9]*$")],
    cambio: [0, Validators.pattern("^[0-9]*$")],
    id_credito: [0, Validators.required],
  });


  constructor(
    private creditosService:CreditosService,   
    public messageService: MessageService,
    private fb: FormBuilder,
    private datePipe: DatePipe,    
    private authService:AuthService,
  ) {}

  ngOnInit(): void {
    this.creditosService.getCreditos().subscribe(
      (res) => {
        this.creditos = res.data! as CreditoResponse[];
      }
    );
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.tabla!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  showHistorial(id:number):void{
    this.historial = [];
    this.loading = true;
    this.creditosService.getAbonos(id).subscribe(
      (res) => {
        this.historial = res.data! as Abono[];
        this.loading = false;
        this.verHistorial = true;
      }
    );
  }

  showModal(credito:CreditoResponse):void{
    this.verModal = true;
    this.formAbono.patchValue({
      deuda: credito.saldo,
      abono: 0,
      recibido: 0,
      cambio: 0,
      id_credito: credito.id_credito
    });
  }

  calcularCambio(){
    const abono     = this.formAbono.controls['abono'].value;
    const recibido  = this.formAbono.controls['recibido'].value;
    const cambio    = recibido - abono;
    this.formAbono.controls['cambio'].setValue(cambio);
  }

  abonar(){
    const valid   = this.formAbono.valid;
    const cambio  = this.formAbono.controls['cambio'].value;
    if(valid && cambio >= 0){
      const credito = this.creditos.find(c => c.id_credito === this.formAbono.controls['id_credito'].value);
      const fecha = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
      const send:CreditoRequest = {
        id_usuario: this.authService.getUsuario().id,
        id_credito: credito?.id_credito!,
        id_venta: credito?.id_venta!,
        fecha_abono: fecha!,
        abono: this.formAbono.controls['abono'].value,
        saldo: credito?.saldo!,
      };
      this.creditosService.abonarCredito(send).subscribe(
        (res) => {
          if(res.ok){
            const index = this.creditos
                            .findIndex(x => x.id_credito === credito!.id_credito);
            credito!.saldo = send.saldo - send.abono;
            credito!.update_date = send.fecha_abono;
            this.creditos[index] = credito!;
            this.messageService.add({severity:'success', summary:'Abono', detail:'Abono realizado con exito'});
            this.verModal = false;
            this.tabla.reset();
          }else{
            this.messageService.add({severity:'error', summary:'Abono', detail:'Error al realizar el abono'});
          }
        }
      );

    }else if(cambio < 0){
      this.messageService.add({severity:'error', summary:'Error', detail:'El abono no puede ser mayor a lo recibido'});
    }else{
      this.messageService.add({severity:'error', summary:'Error', detail:'Complete todos los campos'});
    }
  }

}
