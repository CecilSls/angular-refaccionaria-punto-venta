import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientesComponent } from './pages/clientes/clientes.component';
import { CreditosComponent } from './pages/creditos/creditos.component';
import { CobrarComponent } from './pages/cobrar/cobrar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListaVentasComponent } from './pages/lista-ventas/lista-ventas.component';
import { MarcasComponent } from './pages/marcas/marcas.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { VentasComponent } from './pages/ventas/ventas.component';

const routes: Routes = [
  { path: '', component:DashboardComponent,
    children:[
      { path: 'ventas', component: VentasComponent },
      { path: 'cobrar', component: CobrarComponent },
      { path: 'creditos', component: CreditosComponent },
      { path: 'lista-ventas', component: ListaVentasComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'marcas', component: MarcasComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: '**', redirectTo: 'ventas' },
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
