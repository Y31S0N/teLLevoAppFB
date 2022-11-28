import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { AlertController, ToastController, ViewWillEnter } from '@ionic/angular';
import { PostService } from '../services/post.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements ViewWillEnter {

  rol: string; destino: string; costo: number; comentario: string;
  pago: string; hora: string; fecha: string; pasaj = [];
  msg: string; viaje2;

  usrnm: string;

  nom: string; apat: string; amat: string;
  disponible: boolean;
  visible: boolean;
  realizar: boolean;

  user;
  ses;
  usuarios;
  viajes;
  idCond;
  pasajeros=[];
  username;
  constructor(private service: StorageService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private fs: FirestoreService){
      this.fs.readCollection('usuarios/').subscribe(res=>this.usuarios=res);
      this.fs.readCollection('viajes/').subscribe(res=>this.viajes=res);
    }

  ionViewWillEnter() {
    setTimeout(() => {
      this.cargarDatos();
    }, 1400);
  }
  async cargarDatos(){
    this.user = await this.service.gett();
    this.ses = await this.service.getSinSes('sesion');
    this.rol = this.user.rol;
    if (this.rol === 'conductor') {
      const viaje = await this.getViajeConductor();
      if (viaje !== undefined) {
        this.viaje2=viaje;
        //necesito la info de estos pasajeros, podría dejarlos dentro de un nuevo array, que tenga a todos los datos de cada pasajero
        for await (const i of this.usuarios) {
          for await (const j of this.viaje2.pasajeros) {
            if(j === i.sesion){
              this.pasajeros.push(i);
            }
          }
        }
        //ahora que tengo los pasajeros, puedo recorrerlos
        this.disponible = viaje.disponible;
        this.visible = viaje.visible;

        this.destino = viaje.destino;
        this.costo = viaje.costo;
        this.comentario = viaje.comentario;
        this.pago = viaje.pago;
        this.hora = viaje.hora;
        this.fecha = viaje.fecha;
      }
    } else if (this.rol === 'pasajero') {
      const viaje = await this.getViajePasajero();
      this.viaje2 = await viaje;

      if (this.viaje2 === undefined) {
        this.msg = 'No estás en ningún viaje actualmente';
      } else {
        console.log('Acá va el viaje para el pasajero');
        this.destino = viaje.destino;
        this.costo = viaje.costo;
        this.comentario = viaje.comentario;
        this.pago = viaje.pago;
        this.hora = viaje.hora;
        this.fecha = viaje.fecha;
        this.idCond = viaje.idConductor;
        const cond = await this.getConductor();
        this.nom = cond.nombre;
        this.amat = cond.amaterno;
        this.apat = cond.apaterno;
        this.username = cond.username;
      }
    }
  }
  getViajeConductor() {
    for (const i of this.viajes) {
      if (i.idConductor !== undefined && i.visible === true) {
        if(i.idConductor === this.user.sesion){
          return i;
        }
      }
    }
  }
  async getViajePasajero() {
    //Y LUEGO REVISAR SI ESTÁ VISIBLE, OSEA, SI EL PASAJERO ACTUAL ESTÁ TOMANDO EL VIAJE
    for await(const i of this.viajes) {
      //SI UNA PROPIEDAD AL AZAR DEL VIAJE EXISTE, EL VIAJE EXISTE
      if (i.idConductor !== undefined) {
        //REVISA LOS PASAJEROS DE CADA VIAJE
        if(i.pasajeros === null || i.pasajeros === undefined){
          continue;
        }
        for (const j of i.pasajeros) {
          //SI EL SESION DEL PASAJERO, ES EL MISMO DEL USUARIO ACTUAL Y, EL VIAJE ESTÁ VISIBLE
          if (j === this.user.sesion && i.visible === true) {
            return i;
          }
        }
      }
    }
  }
  async progViaje() {
    if (await this.verifRealizar()) {
      this.router.navigate(['prog-viaje']);
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Alerta...',
        subHeader: 'Ya estás realizando un viaje',
        message: 'No es posible realizar 2 viajes al mismo tiempo',
        mode: 'ios',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
  async getConductor(){
    for await (const i of this.usuarios) {
      if(i.sesion === this.idCond){
        return i;
      }
    }
  }
  async verifRealizar() {
    for await (const i of this.viajes) {
      if (i.idConductor !== undefined && i.idConductor === this.ses.sesion) {
        if (i.disponible === true) {
          return false;
        }
      }
    } return true;
  }
  async iniciarViaje() {
    for await (const i of this.viajes) {
      if (i.idConductor !== undefined) {
        if (this.ses === i.idConductor) {
          const vLimbo = i;
          vLimbo.disponible = false;
          //ELIMINAR VIAJE
          this.service.eliminar(i.ide);
          this.fs.updateDoc('viajes/', i.ide, i);
          const toast = await this.toastCtrl.create({
            message: 'Viaje iniciado',
            duration: 2000
          });
          toast.present();
          setTimeout(() => {
            this.cargarDatos();
          }, 1300);
        }
      }
    }
  }
  async finalizarViaje() {
    for await (const i of this.viajes) {
      if (i.idConductor !== undefined) {
        if (this.ses === i.idConductor) {
          const vLimbo = i;
          vLimbo.visible = false;
          this.fs.updateDoc('viajes/', i.ide, i);
          const toast = await this.toastCtrl.create({
            message: 'Viaje finalizado',
            duration: 2000
          });
          toast.present();
          setTimeout(() => {
            this.cargarDatos();
          }, 1300);
        }
      }
    }
  }
}