import { Producto } from "./producto";

export class ItemFactura {

  producto: Producto = new Producto();
  cantidad: number = 1;
  importe: number = 0;

 public calcularImporte(): number {
   this.importe = this.cantidad * this.producto.precio;
   return this.importe;
 }



}
