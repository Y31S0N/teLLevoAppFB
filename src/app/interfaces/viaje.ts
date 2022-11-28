export interface Viaje{
    ide: string;
    disponible: boolean;
    destino: string;
    costo: number;
    comentario: string;
    pago: string;
    idConductor: string;
    fecha: string;
    hora: string;
    pasajeros: [];
    nAsientos: number;
    visible: boolean;
}
