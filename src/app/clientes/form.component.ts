import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit, OnDestroy {
  public cliente: Cliente = new Cliente();
  public titulo: string = 'Crear Cliente';
  errors: string[] = [];
  formulario = new FormGroup({
    nombre: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    apellido: new FormControl(''),
    createAt: new FormControl('', Validators.required),
  });

  editClient = sessionStorage.getItem('edit');
  idEdit: number = 0;

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    if (this.editClient !== null) {
      this.titulo = 'Editar Cliente';
      this.formulario.patchValue({
        nombre: JSON.parse(this.editClient).nombre,
        apellido: JSON.parse(this.editClient).apellido,
        email: JSON.parse(this.editClient).email,
        createAt: JSON.parse(this.editClient).createAt,
      });

      this.idEdit = JSON.parse(this.editClient).id;
    }
  }

  ngOnInit() {
    this.cargarCliente();
    console.log(this.idEdit);
  }

  ngOnDestroy() {
    sessionStorage.removeItem('edit');
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params['id'];
      if (id) {
        this.clienteService
          .getCliente(id)
          .subscribe((cliente) => (this.cliente = cliente));
      }
    });
  }

  create(): void {
    if (this.formulario.valid && this.editClient == null) {
      let obj = {
        nombre: this.formulario.get('nombre')?.value,
        email: this.formulario.get('email')?.value,
        apellido: this.formulario.get('apellido')?.value,
        createAt: new Date(
          new Date(
            this.formulario.get('createAt')?.value ?? new Date()
          ).getTime() +
            new Date().getTimezoneOffset() * 60000
        ),
      };
      this.clienteService.create(obj).subscribe(
        (cliente) => {
          this.router.navigate(['/clientes']);
          swal.fire(
            'Nuevo cliente',
            `Cliente ${cliente.nombre} se ha creado con éxito`!,
            'success'
          );
        },
        (err) => {
          this.errors = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        }
      );
    }
  }

  update(): void {
    if (this.formulario.valid) {
      let obj = {
        nombre: this.formulario.get('nombre')?.value,
        email: this.formulario.get('email')?.value,
        apellido: this.formulario.get('apellido')?.value,
        createAt: new Date(
          new Date(
            this.formulario.get('createAt')?.value ?? new Date()
          ).getTime() +
            new Date().getTimezoneOffset() * 60000
        ),
      };
      this.clienteService.update(obj, this.idEdit).subscribe(
        (cliente) => {
          this.router.navigate(['/clientes']);
          swal.fire(
            'Cliente Actualizado',
            `Cliente ${cliente.nombre} actualizado con éxito!`,
            'success'
          );
        },
        (err) => {
          this.errors = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        }
      );
    }
  }
}
