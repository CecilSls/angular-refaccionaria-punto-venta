import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../auth/services/auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit{

  items: MenuItem[] = [];

  ngOnInit() {
  }

  get userName(){
    return this.authService.getUsuario().username;
  }

  get usuario(){
    return this.authService.getUsuario();
  }

  constructor( private router:Router,
                private authService:AuthService
  ) {
    const ventas = [
      {label: 'Nueva Venta', icon: 'pi pi-fw pi-plus', routerLink: 'venta'},
      {label: 'Lista de ventas', icon: 'pi pi-fw pi-list', routerLink: 'lista-ventas'},
      {label: 'Productos', icon: 'pi pi-fw pi-box', routerLink: 'productos'},
      {label: 'Reportes', icon: 'pi pi-fw pi-file-pdf', routerLink: 'reportes'}
    ];

    const cobrar = [
      {label: 'Cobrar', icon: 'pi pi-fw pi-credit-card', routerLink: 'cobrar'},
      {label: 'Creditos', icon: 'pi pi-fw pi-users', routerLink: 'creditos'},
      {label: 'Productos', icon: 'pi pi-fw pi-box', routerLink: 'productos'},
      {label: 'Reportes', icon: 'pi pi-fw pi-file-pdf', routerLink: 'reportes'}
    ];

    const admin = [
      {label: 'Nueva Venta', icon: 'pi pi-fw pi-plus', routerLink: 'venta'},
      {label: 'Lista de ventas', icon: 'pi pi-fw pi-list', routerLink: 'lista-ventas'},
      {label: 'Cobrar', icon: 'pi pi-fw pi-credit-card', routerLink: 'cobrar'},
      {label: 'Creditos', icon: 'pi pi-fw pi-users', routerLink: 'creditos'},
      {label: 'Productos', icon: 'pi pi-fw pi-box', routerLink: 'productos'},
      {label: 'Reportes', icon: 'pi pi-fw pi-file-pdf', routerLink: 'reportes'},
      {label: 'Clientes', icon: 'pi pi-fw pi-users', routerLink: 'clientes'},
      {label: 'Marcas', icon: 'pi pi-fw pi-book', routerLink: 'marcas'},
      {label: 'Proveedores', icon: 'pi pi-fw pi-users', routerLink: 'proveedores'},
      {label: 'Usuarios', icon: 'pi pi-fw pi-user', routerLink: 'usuarios'},
    ]
    if(this.usuario.roles === 1){
      this.items = admin;
    }else if( this.usuario.roles === 2 ){
      this.items = ventas;
    }else{
      this.items = cobrar;
    }
  }
  
  logout(){
    this.router.navigateByUrl('/auth');
    this.authService.logout();
  }

}