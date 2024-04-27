import swal  from 'sweetalert2';
import { ClienteService } from './../clientes/cliente.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Factura } from './models/factura';
import { Producto } from './models/producto';
import { FacturaService } from './services/factura.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
})
export class FacturasComponent implements OnInit {
  productos: Producto[] = [];
  listProducts: Producto[] = [];
  pro: any[] = [];
  productosDisponibles: Producto[] = [];


  ItemFactura: Producto = new Producto();

  arrFactura: any[] = [];
  objeto: any;
  idProd: any;
  clienteId: any;

  total: number = 0;

  public titulo: string = 'Nueva Factura';
  public factura: Factura = new Factura();

  formulario = new FormGroup({
    producto: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    observacion: new FormControl('', Validators.required),
  });




  constructor(
    private activatedRoute: ActivatedRoute,
    private clienteService: ClienteService,
    private router: Router,
    private facturaService: FacturaService
  ) {

  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.clienteId = +params.get('cliente')!;
      this.clienteService
        .getCliente(this.clienteId)
        .subscribe((cliente) => (this.factura.cliente = cliente));
    });

    this.filtrarProductos();
  }

  Volver(): void {
    this.router.navigate([`/clientes`]);
  }

  filtrarProductos(){
    this.facturaService.filtrarProductos().subscribe((productos: any) => {
      this.productos = productos;
      this.listProducts = productos;
    });
  }

  getProduct() {
    this.objeto = this.formulario.get('producto')!.value;
    this.idProd = JSON.parse(this.objeto).id;
    let objAux = this.productos.find((prod: Producto) => prod.id === this.idProd);
    if (!objAux) {
      return;
    }
    let importe = this.calcularImporte(1, objAux.precio);
    let obj = {
      producto : {
        nombre: objAux.nombre,
        precio: objAux.precio,
      },
      cantidad: 1,
      importe: importe,
      id : this.idProd
    }
    if (this.existeItem(this.idProd)) {
      this.incrementaCantidad(this.idProd);
    }else {
      this.arrFactura.push(obj);
      this.productosDisponibles.push(objAux);
      this.productos = this.productos.filter((prod: Producto) => prod.id !== this.idProd);
    }


    setTimeout(() => {
      this.productos = this.productos.concat(this.productosDisponibles);
      this.productos.sort((a, b) => a.id - b.id);
      this.productosDisponibles = [];
      this.resetSelect();
    });

  }


  //Reinicia el Select de los productos
  resetSelect() {
    this.formulario.get('producto')!.setValue('');
  }


  calcularImporte(cant: number, precio: number): number {
    let importe = cant * precio;
    return importe;
  }

  existeItem(id: number): boolean {
    let existe = false;
    this.arrFactura.forEach((item) => {
      if (id === item.id) {
        existe = true;
      }
    });
    return existe;
  }

  incrementaCantidad(id: number) {
    this.arrFactura.map((item) => {
      if (id === item.id) {
        ++item.cantidad;
        item.importe = item.precio * item.cantidad;
      }
      return item;
    });
  }

  eliminarItemFactura(id: number) {
    if (this.arrFactura.filter((item) => item.id == id)) {
      this.arrFactura = this.arrFactura.filter((item) => item.id !== id);
    }
  }

  calcularGrantotal(): number {
    this.total = 0;
    this.arrFactura.forEach((item: any) => {
      this.total += this.calcularImporte(item.cantidad, item.precio);
    });
    return this.total;
  }

  create(): void {
    let obj = {
      cliente: {
        id: this.factura.cliente.id,
        nombre: this.factura.cliente.nombre,
        apellido: this.factura.cliente.apellido,
        createAt: new Date(),
        email: this.factura.cliente.email,
        region: this.factura.cliente.region
      },
      descripcion: this.formulario.get('descripcion')?.value,
      createAt: new Date(),
      items: this.arrFactura,
      observacion: this.formulario.get('observacion')?.value,
    };
    console.log(obj);

    let jsonString = JSON.stringify(obj);
    let json = JSON.parse(jsonString);
    this.facturaService.create(json).subscribe((factura) => {
      swal.fire(this.titulo, `Factura ${factura.descripcion} creada con éxito`, 'success');
      this.router.navigate(['/clientes']);
    });
  }



}
