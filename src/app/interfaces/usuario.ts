import { Auto } from './auto';

export interface Usuario {
    nombre: string;
    apaterno: string;
    amaterno: string;
    username: string;
    password: string;
    pass: string;
    correo: string;
    rol: string;
    auto?: Auto;
}
