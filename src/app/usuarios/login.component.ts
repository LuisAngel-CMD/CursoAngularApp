import swal from 'sweetalert2';
import { Usuario } from './usuario';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  titulo: string = 'Iniciar Sesion';
  Usuario: Usuario;


  constructor() {
    this.Usuario = new Usuario();
  }

  ngOnInit(): void {
  }

  login(): void {

    console.log(this.Usuario);

    if (this.Usuario.username === null && this.Usuario.password === null) {

      swal.fire('Error Login', 'Username o password vacias', 'error');
      return;
    }

  }



}
