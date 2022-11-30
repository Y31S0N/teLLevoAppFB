import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-detalle-pasajero',
  templateUrl: './detalle-pasajero.page.html',
  styleUrls: ['./detalle-pasajero.page.scss'],
})
export class DetallePasajeroPage implements OnInit {
  perId; usuario; rol;


  comentario: string;
  costo: string;
  destino: string;
  pago: number;

  auto; color;
  viajeActual;
  constructor(private actRoute: ActivatedRoute, private http: HttpClient,
    private router: Router, private service: StorageService) { }

  async ngOnInit() {
    this.perId = this.actRoute.snapshot.paramMap.get('id');

    //guarda el pasajero en la lista
    const res = await this.guardarPasajeroEnViaje();
    //PASAJERO DE LA SESIÓN ACTUAL
    const pasajero = await this.service.gett('usuario');
    this.rol = pasajero[0].rol;

    const viaje = await this.service.gett('viaje');

    this.comentario = viaje[0].comentario;
    this.costo = viaje[0].costo;
    this.destino = viaje[0].destino;
    this.pago = viaje[0].pago;
    console.log(this.comentario);

    //ELIMINO EL VIAJE ACTUAL


    // const usr = JSON.parse(localStorage.getItem('usr'));
    //acá debo recuperar los datos del viaje que pasa por el id


    //OBJETO LISTA USUARIO DE LA SESIÓN ACTUAL
    // console.log(viaje[0]);

  }
  async guardarPasajeroEnViaje(){
    //PASAJERO DE LA SESIÓN ACTUAL
    const pasajero = await this.service.gett('usuario');
    //VIAJE EN CUESTIÓN
    const viaje = await this.service.gett('viaje');
    this.viajeActual = await viaje;
    (this.viajeActual[0].pasajeros).push(pasajero[0]);
    return this.viajeActual;
  };
}
