import { Factura } from './../facturas/models/factura';
import { Region } from './region';
export class Cliente {
  id: number = 0;
  nombre: string = '';
  apellido: string = '';
  createAt: Date = new Date();
  email: string = '';
  foto: string = '';
  region: Region = new Region();
  facturas: Array<Factura> = [];

}
