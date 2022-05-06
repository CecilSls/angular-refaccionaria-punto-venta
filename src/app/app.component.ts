import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ MessageService ]
})
export class AppComponent implements OnInit {
  title = 'sinve';

  constructor( private primeNgConfig:PrimeNGConfig){}
  
  ngOnInit(){
    this.primeNgConfig.ripple = true;
  }
}
