import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = []; // Inicializa la propiedad clientes
  paginas: number[] = [];
  paginador: any;

  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      let pageParam = params.get('page');
      let page: number = pageParam !== null ? +pageParam : 0;
      this.clienteService
        .getClientes(page)
        .pipe(
          tap({
            next: (response) => {
              console.log('ClientesComponent: tap 3');
              (response.content as Cliente[]).forEach((cliente) => {
                console.log(cliente.nombre);
              });
            },
            error: (error) => {
              console.error('Error en la obtención de clientes:', error);
            },
          })
        )
        .subscribe(
          (response) => {
            this.clientes = response.content as Cliente[];
            this.paginador = response; // Asignar el objeto de paginación
            this.paginas = Array.from(
              { length: response.totalPages },
              (_, i) => i + 1
            );
          },
          (error) => {
            console.error(
              'Error en la suscripción al servicio de clientes:',
              error
            );
          }
        );
    });
  }

  edit(cliente: Cliente): void {
    sessionStorage.setItem('edit', JSON.stringify(cliente));

    this.router.navigate(['/clientes/form']);
  }

  delete(cliente: Cliente): void {
    Swal.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe(() => {
          this.clientes = this.clientes.filter((cli) => cli !== cliente);
          Swal.fire(
            'Cliente Eliminado!',
            `Cliente ${cliente.nombre} eliminado con éxito.`,
            'success'
          );
        });
      }
    });
  }
}