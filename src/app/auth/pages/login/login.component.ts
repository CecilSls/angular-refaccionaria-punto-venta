import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent{

  miFormulario: FormGroup = this.fb.group({
    username: ['admin', [Validators.required]],
    password: ['admin', [Validators.required, Validators.minLength(4)]]
  });

  loading:boolean = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService) { }

  login(){
    this.loading = true;
    const { username, password } = this.miFormulario.value;

    this.authService.login( username, password).subscribe(
      data => {
        this.loading = false;
        if(data.ok){
          this.router.navigateByUrl('app/');
        }else{
          this.msgError(data.message);
        }
      }
    );
  }

  msgError(msg: string){   
    Swal.fire({
      title: 'Error!',
      text: msg,
      icon: 'error',
      confirmButtonText: 'ok'
    })
  }

}
