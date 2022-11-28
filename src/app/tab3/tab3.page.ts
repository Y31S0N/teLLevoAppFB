import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, ViewWillEnter, AlertController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements ViewWillEnter{
  usuario = {
    nombre: '',
    apaterno:'',
    amaterno:'',
    username:'',
    correo: '',
    rol: '',
    auto: {
      marca: '',
      modelo: '',
      patente: '',
      color: '',
      numAsientos:'',
    }
  };
  user;
  ses: string;
  rol: string;
  usuarios;
  userApi;
  viajes;
  constructor(private router: Router, private toastCtrl: ToastController,
    private service: StorageService, private fs: FirestoreService,
    private alertCtrl: AlertController){
      this.fs.readCollection('usuarios/').subscribe(res=>this.usuarios=res);
      this.fs.readCollection('viajes/').subscribe(res=>this.viajes=res);
    }

  ionViewWillEnter() {
    setTimeout(() => {
      this.cargarDatos();
    }, 1000);
  }
  async cargarDatos(){
    this.user = await this.service.gett();
    this.userApi = await this.getUsuario();
    this.rol = this.user.rol;
    this.usuario.username = this.user.username;
    this.usuario.nombre = this.user.nombre;
    this.usuario.apaterno = this.user.apaterno;
    this.usuario.amaterno = this.user.amaterno;
    this.usuario.correo = this.user.correo;
    this.usuario.rol = this.user.rol;

    this.usuario.auto.marca = this.user.auto.marca;
    this.usuario.auto.modelo = this.user.auto.modelo;
    this.usuario.auto.numAsientos = this.user.auto.numAsientos;
    this.usuario.auto.color = this.user.auto.color;
    this.usuario.auto.patente = this.user.auto.patente;
  }
irHistorial(){
  this.router.navigate(['/historial']);
}
  //acá debo tomar la info del usuario
  async cerrarSesion(){
    const toast = await this.toastCtrl.create({
      message: 'Sesión cerrarda con éxito.',
      duration: 2000
    });
    toast.present();
    this.service.eliminar('sesion');
    this.router.navigate(['/login']);
  }
  async cambiarRol(){
    // acá tomo al usuario de esta sesión en una variable
    if(await this.verifSiViaje()){
      if(this.user.rol === 'pasajero'){
        if(this.user.auto.marca === ''){
          this.router.navigate(['creacion-auto']);
        }else if(this.user.auto.marca !== ''){
          this.service.eliminar(this.user.sesion);
          this.user.rol = 'conductor';
          await this.service.guardar(this.user.sesion, this.user);
          // this.ps.updatePost('usuarios', this.userApi.id, {data: this.user});
          await this.fs.updateDoc('usuarios/', this.user.sesion, this.user);
          const toast1 = await this.toastCtrl.create({
            message: 'Cambio de rol exitoso',
            duration: 2000
          });
          toast1.present();
        }
      }else if(this.user.rol === 'conductor'){
        //ACÁ HAY QUE CAMBIAR EL ROL SOLAMENTE, EL CONDUCTOR YA TIENE AUTO
        this.service.eliminar(this.user.sesion);
        this.user.rol = 'pasajero';
        await this.service.guardar(this.user.sesion, this.user);
        // this.ps.updatePost('usuarios', this.userApi.id, {data:this.user});
        await this.fs.updateDoc('usuarios/', this.user.sesion, this.user);
      }
    }else{
      let msg: string;
      if(this.user.rol === 'pasajero'){
        msg='Actualemente estás en un viaje';
      }else if(this.user.rol === 'conductor'){
        msg='Tienes un viaje programado';
      }
      const alert = await this.alertCtrl.create({
        header: 'Acción denegada',
        subHeader: 'No puedes cambiar de rol',
        message: msg,
        mode: 'ios',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
  getUsuario(){
    for (const i of this.usuarios) {
      if(i.sesion === this.user.sesion){
        return i;
      }
    }
  }
  async verifSiViaje(){
    let doTrip = true;
    if(this.user.rol === 'pasajero'){
      //verifica que su id no esté en ninguna lista de pasajeros(de viajes)
      for await (const i of this.viajes) {
        if(i.pasajeros === null || i.pasajeros === undefined){
          continue;
        }
        const pas = i.pasajeros.split(' ');
        for (const j of pas) {
          if(j === this.user.sesion){
            doTrip = false;
          }
        }
      }
    }else if(this.user.rol === 'conductor'){
      for await (const i of this.viajes){
        if(this.user.sesion === i.idConductor){//el usuario ha hecho viajes
          if(i.disponible === true){//el usuario tiene un viaje en curso
            doTrip = false;
          }
        }
      }
    }
    return doTrip;
  }
}
