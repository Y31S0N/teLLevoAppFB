import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { AlertController, ToastController, ViewWillEnter } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-detalle-viaje',
  templateUrl: './detalle-viaje.page.html',
  styleUrls: ['./detalle-viaje.page.scss'],
})
export class DetalleViajePage implements ViewWillEnter {
  viajeId: string; rol: string; comentario: string; costo: number; destino: string; pago: string;
  nombre: string; apaterno: string; amaterno: string; username: string; fecha: string; hora: string;
  pasajero: any; viajes: any; usuarios: any; idCond: string; pasajeros = [];

  constructor(private actRoute: ActivatedRoute, private service: StorageService,
    private alertCtrl: AlertController, private toastCtrl: ToastController,
    private fs: FirestoreService, private router: Router) {
    this.viajes = this.fs.readCollection('viajes/').subscribe(res => this.viajes = res);
    this.usuarios = this.fs.readCollection('usuarios/').subscribe(res => this.usuarios = res);
  }

  async ionViewWillEnter() {
    setTimeout(() => {
      this.cargarDatos();
    }, 1300);
  }
  async cargarDatos() {
    this.viajeId = this.actRoute.snapshot.paramMap.get('id');
    this.pasajero = await this.service.gett('usuario');
    this.rol = this.pasajero.rol;
    const viaje = this.getViaje();
    this.comentario = viaje.comentario;
    this.costo = viaje.costo;
    this.destino = viaje.destino;
    this.pago = viaje.pago;
    this.fecha = viaje.fecha;
    this.hora = viaje.hora;

    this.idCond = viaje.idConductor;
    const cond = this.getConductor();

    this.nombre = cond.nombre;
    this.apaterno = cond.apaterno;
    this.amaterno = cond.amaterno;
    this.username = cond.username;
    this.getPasajeros();
  }
  async intentartomarViaje() {
    const alert = await this.alertCtrl.create({
      header: 'Alerta',
      message: '¿Está seguro que desea subirse a este viaje?',
      buttons: [{
        text: 'Si',
        handler: async () => {
          if (await this.verifViaje()) {
            await this.tomarViaje();
            const toast = await this.toastCtrl.create({
              message: 'Viaje tomado!',
              duration: 1000
            });
            toast.present();
            this.router.navigate(['tabs/tab2']);
          } else {
            const alerta = await this.alertCtrl.create({
              header: 'Precaución!',
              subHeader: 'Ya estás en otro viaje',
              message: 'No puedes tomar 2 viajes a la vez',
              buttons: ['OK']
            });
            await alerta.present();
          }
        },
      }, {
        text: 'No',
        role: 'cancel'
      }]
    });
    await alert.present();
  };
  async tomarViaje() {
    const viaje = this.getViaje();
    viaje.pasajeros.push(this.pasajero.sesion);
    this.fs.updateDoc('viajes/', viaje.ide, viaje);
    this.service.guardar('viaje', viaje);
  }
  async verifViaje() {
    //toma el usuario de la sesión actual, en este caso pasajero
    const usr = await this.service.gett('usuario');
    let doTrip = true;
    for await (const i of this.viajes) {
      //si tiene pasajeros, osea, es un viaje
      if (i.pasajeros === null) {
        continue;
      }//si el usuario actual está dentro de alguno de los viajes Y ...
      for await (const j of i.pasajeros) {
        if (usr.sesion === j && i.disponible === true) {
          doTrip = false;
        }
      }
    } return doTrip;
  }
  getViaje() {
    for (const i of this.viajes) {
      if (i.ide === this.viajeId) {
        return i;
      }
    }
  }
  getConductor() {
    for (const i of this.usuarios) {
      if (i.sesion === this.idCond) {
        return i;
      }
    }
  }
  getPasajeros() {
    this.pasajeros=[];
    const viaje = this.getViaje();
    for (const i of this.usuarios) {
      for (const j of viaje.pasajeros) {
        if(j === i.sesion){
          this.pasajeros.push(i);
        }
      }
    }
  }
}
