import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { AlertController, ToastController, ViewWillEnter } from '@ionic/angular';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-detalle-viaje',
  templateUrl: './detalle-viaje.page.html',
  styleUrls: ['./detalle-viaje.page.scss'],
})
export class DetalleViajePage implements ViewWillEnter {
  viajeId; usuario; rol;

  comentario: string;
  costo: number;
  destino: string;
  pago: string;
  nombre: string;
  apaterno: string;
  amaterno: string;
  username: string;

  auto; color;
  viajeActual;
  fecha: string;
  hora: string;
  pasajero;
  viajes;
  usuarios;
  idCond;
  pasaj;
  constructor(private actRoute: ActivatedRoute,
    private service: StorageService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private ps: PostService,
    private router: Router) {
      this.viajes = this.ps.getPosts('viajes').subscribe(res=>this.viajes=res);
      this.usuarios=this.ps.getPosts('usuarios').subscribe(res=>this.usuarios=res);
  }

  async ionViewWillEnter() {
    setTimeout(()=>{
      this.cargarDatos();
    }, 800);
  }
  async cargarDatos(){
    //ID DEL VIAJE ACTUAL
    this.viajeId = this.actRoute.snapshot.paramMap.get('id');
    //PASAJERO DE LA SESIÓN ACTUAL
    this.pasajero = await this.service.gett();
    //guarda el pasajero en la lista
    this.rol = this.pasajero.rol;
    //ESTA LÍNEA ES UN ERROR, los viajes ahora los tengo en la API, NECESITO UN MÉTODO
    const viaje = this.getViaje();

    this.comentario = viaje.attributes.comentario;
    this.costo = viaje.attributes.costo;
    this.destino = viaje.attributes.destino;
    this.pago = viaje.attributes.pago;
    this.fecha = viaje.attributes.fecha;
    this.hora = viaje.attributes.hora;

    this.idCond = viaje.attributes.idConductor;
    const cond = this.getConductor();

    this.nombre = cond.nombre;
    this.apaterno = cond.apaterno;
    this.amaterno = cond.amaterno;
    this.username = cond.username;

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
    //VIAJE EN CUESTIÓN
    const viaje = this.getViaje();
    console.log(viaje);
    //LO PASO AL ARRAY LOCAL
    this.viajeActual = await viaje;
    //AGREGO EL PASAJERO ACTUAL AL VIAJE ACTUAL
    this.pasaj = this.viajeActual.attributes.pasajeros += this.pasajero.sesion + ' ';

    this.ps.updatePost('viajes', this.viajeActual.id, {data: this.viajeActual.attributes}).subscribe();
  }
  async verifViaje() {
    //toma el usuario de la sesión actual, en este caso pasajero
    const usr = await this.service.gett();
    let doTrip = true;
    for await (const i of this.viajes) {
      //si tiene pasajeros, osea, es un viaje
      if(i.attributes.pasajeros === null){
        continue;
      }
      const pas = i.attributes.pasajeros.split(' ');
      //si el usuario actual está dentro de alguno de los viajes Y ...
      for await (const j of pas) {
        if (usr.sesion === j && i.attributes.disponible === true) {
          doTrip = false;
        }
      }
    } return doTrip;
  }
  getViaje() {
    for (const i of this.viajes) {
      console.log(i.attributes.pasajeros);
      if (i.id.toString() === this.viajeId.toString()) {
        return i;
      }
    }
  }
  getConductor() {
    for (const i of this.usuarios) {
      if (i.attributes.sesion === this.idCond) {
        return i.attributes;
      }
    }
  }
}
