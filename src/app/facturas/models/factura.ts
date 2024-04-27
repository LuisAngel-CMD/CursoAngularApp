import { Cliente } from './../../clientes/cliente';
import { ItemFactura } from './item-factura';
export class Factura {
   id: number = 0;
   descripcion: string = '';
   observacion: string = '';
   items: Array<ItemFactura> = [];
   cliente: Cliente = new Cliente();
   total: number = 0;
   createAt: Date = new Date();

  calcularGrantotal(): number {
    this.total = 0;
    this.items.forEach((item: ItemFactura) => {
      this.total += item.calcularImporte();
    });
    return this.total;
  }

}
