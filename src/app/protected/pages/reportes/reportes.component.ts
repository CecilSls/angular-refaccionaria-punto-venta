import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styles: [],
  providers: [DatePipe]
})
export class ReportesComponent implements OnInit {

  rangeDates: Date[] = [];
  reportesUrl = environment.reportesUrl;

  constructor(
    private datepipe: DatePipe,
    public messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  abrirCorteDeCaja() {
    if(this.rangeDates.length == 2 && this.rangeDates[0] < this.rangeDates[1]) {
      const fecha_inicial = this.datepipe.transform(this.rangeDates[0], 'yyyy-MM-dd');
      const fecha_final   = this.datepipe.transform(this.rangeDates[1], 'yyyy-MM-dd');
      window.open(`${this.reportesUrl}rpt_cortecaja.php?fecha_inicial=${fecha_inicial}&fecha_final=${fecha_final}`, '_blank');
    }else{
      this.messageService.add({severity:'warn', summary:'Error', detail:'Seleccione un rango de fechas (2)'});
    }
  }

  abrirReporte(){
    window.open(`${this.reportesUrl}rpt_productos.php`, '_blank');
  }

}
