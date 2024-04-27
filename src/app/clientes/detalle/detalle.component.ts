import { Component, OnInit, Input } from '@angular/core';

import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';

import { ModalService } from './modal.service';

import { HttpEventType } from '@angular/common/http';

import { FacturaService } from '../../facturas/services/factura.service';

import { Factura } from '../../facturas/models/factura';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'], // Corregido de 'styleUrl' a 'styleUrls'
})
export class DetalleComponent implements OnInit {
  @Input() cliente!: Cliente; // Use @Input() with capital "I"

  titulo: string = 'Detalle del cliente';
  fotoSeleccionada: File | null = null;
  progreso: number = 0;



  constructor(
    private clienteService: ClienteService,
    public modalService: ModalService,
    private facturaService: FacturaService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  selectFile(event: any) {
    this.fotoSeleccionada = event.target.files[0];
    if (this.fotoSeleccionada?.size! > 0) {
      for(let i =0; i <= 100; i++) {
        setTimeout(() => {
          this.progreso = i;
          if (this.progreso ===100) {
            setTimeout(() => {
              this.progreso = 0;
            }, 1100);
          }
        }, 1000);
      }

    }

    if (this.fotoSeleccionada!.type.indexOf('image') < 0) {
      this.fotoSeleccionada = null;
      Swal.fire('Error', 'El archivo debe ser una imagen.', 'error');
    }
  }

  subirFoto() {
    if (!this.fotoSeleccionada) {
      Swal.fire(
        'Error',
        'Debe seleccionar una foto antes de subirla.',
        'error'
      );
      return;
    }

    this.clienteService
      .subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe(
        (event) => {
          if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;

            this.modalService.notificarUpload.emit(this.cliente);

            Swal.fire(
              'La foto se ha subido completamente!',
              response.mensaje,
              'success'
            );
          }
        },
        (error) => {
          console.error('Error al subir la foto:', error);
          Swal.fire(
            'Error',
            'Hubo un error al subir la foto del cliente.',
            'error'
          );
        }
      );
  }

  cerrarModal() {
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  delete(factura: Factura): void {
    Swal.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar la factura ${factura.descripcion}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.facturaService.delete(factura.id).subscribe(() => {
          this.cliente.facturas = this.cliente.facturas.filter((cli) => cli !== factura);
          Swal.fire(
            'Factura Eliminado!',
            `Factura ${factura.descripcion} eliminado con éxito.`,
            'success'
          );
        });
      }
    });
  }

  factura(cliente: any) {
    console.log('factura', cliente);

    this.router.navigate([`facturas/form/${cliente.id}`]);

  }

  verFactura( factura: Factura ){
    this.router.navigate([`factura/${factura.id}`]);
  }

}
