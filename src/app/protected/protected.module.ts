import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProtectedRoutingModule } from './protected-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { VentasComponent } from './pages/ventas/ventas.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CobrarComponent } from './pages/cobrar/cobrar.component';
import { CreditosComponent } from './pages/creditos/creditos.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ListaVentasComponent } from './pages/lista-ventas/lista-ventas.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { MarcasComponent } from './pages/marcas/marcas.component';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ReportesComponent } from './pages/reportes/reportes.component';



@NgModule({
  declarations: [
    CreditosComponent,
    ClientesComponent,
    CobrarComponent,
    DashboardComponent,
    ListaVentasComponent,
    ProductosComponent,
    MarcasComponent,
    ProveedoresComponent,
    ReportesComponent,
    UsuariosComponent,
    VentasComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PrimeNgModule,    
    ProtectedRoutingModule,
    ReactiveFormsModule,
  ]
})
export class ProtectedModule { }
