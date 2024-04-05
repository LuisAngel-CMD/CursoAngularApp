export class Cliente {
  id: number;
  nombre: string;
  apellido: string;
  createAt: Date;
  email: string;

  constructor() {
    this.id = 0; // o cualquier valor por defecto que prefieras
    this.nombre = '';
    this.apellido = '';
    this.createAt = new Date();
    this.email = '';
  }
}
