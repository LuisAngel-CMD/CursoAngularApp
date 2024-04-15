import { Component, OnInit, Input } from '@angular/core';

import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';

import { HttpEventType } from '@angular/common/http';

import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

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
    private clienteService: ClienteService, // Assuming you have imported ClienteService
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  selectFile(event: any) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;

    console.log(this.fotoSeleccionada);
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
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((100 * event.loaded) / event.total!);
            console.log(this.progreso);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;
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
}
