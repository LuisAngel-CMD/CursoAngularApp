import { Component, OnDestroy, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { Region } from './region';
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

  selectedOption: any = undefined;
  regiones: Region[] = [];
  errors: string[] = [];
  formulario = new FormGroup({
    nombre: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    apellido: new FormControl(''),
    createAt: new FormControl('', Validators.required),
    region: new FormControl('', Validators.required),
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
        region: JSON.parse(this.editClient).region
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
    this.clienteService.getRegiones().subscribe((regiones) => {
      this.regiones = regiones
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
        region: this.formulario.get('region')?.value
      };
      console.log(obj);
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
        region: this.formulario.get('region')?.value
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

  compararRegion(o1: Region, o2: Region){
    if( o1 === undefined && o2 === undefined){
      return true;
    }
    return o1 == null || o2 == null || o1 === undefined || o2 === undefined? false : o1.id === o2.id;

  }
}
