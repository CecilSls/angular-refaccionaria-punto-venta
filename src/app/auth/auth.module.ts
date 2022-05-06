import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from '../prime-ng/prime-ng.module'; 


@NgModule({
  declarations: [
    LoginComponent,
    MainComponent
  ],
  imports: [
    AuthRoutingModule,
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule,
  ]
})
export class AuthModule { }
