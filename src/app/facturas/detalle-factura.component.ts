import { Component, OnInit } from '@angular/core';

import { Factura } from './models/factura';

import { FacturaService } from './services/factura.service';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html',
})
export class DetalleFacturaComponent implements OnInit {

  factura: Factura;
  titulo: string = 'Factura';

  constructor( private  facturaService: FacturaService,
              private activatedRoute: ActivatedRoute)
              {
                this.factura = new Factura();
              }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = +params.get('id')!;
      this.facturaService.getFacturas(id).subscribe(factura => this.factura = factura);
    });
  }

}
