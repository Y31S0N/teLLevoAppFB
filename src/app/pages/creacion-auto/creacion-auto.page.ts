import { Component } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { ToastController, ViewWillEnter, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Auto } from 'src/app/interfaces/auto';
import { FirestoreService } from '../../services/firestore.service';
@Component({
  selector: 'app-creacion-auto',
  templateUrl: './creacion-auto.page.html',
  styleUrls: ['./creacion-auto.page.scss'],
})
export class CreacionAutoPage implements ViewWillEnter {

  auto: Auto = {
    marca: '',
    modelo: '',
    patente: '',
    color: '',
    numAsientos: null,
  };
  user;
  usuarios;
  userApi;
  constructor(private service: StorageService, private toastCtrl: ToastController,
    private router: Router, private fs: FirestoreService,
    private alertCtrl: AlertController) {
    this.fs.readCollection('usuarios/').subscribe(res => this.usuarios = res);
  }
  ionViewWillEnter() {
    setTimeout(() => {
      this.cargarDatos();
    }, 1300);
  }
  async cargarDatos() {
    this.user = await this.service.gett();
    this.userApi = await this.getUser();
    console.log(this.user);
    console.log(this.userApi);
  }
  async onSubmit() {
    this.user = await this.service.gett();
    this.user.auto = this.auto;
    if (this.validarPatente()) {
      if (this.auto.numAsientos <= 0 || this.auto.numAsientos >= 8) {
        const toast = await this.toastCtrl.create({
          message: 'N° de asientos inválidos(1 - 7)',
          duration: 2000
        }); toast.present();
      } else {
        this.service.eliminar(this.user.sesion);
        this.user.rol = 'conductor';
        await this.service.guardar(this.user.sesion, this.user);
        this.fs.updateDoc('usuarios/', this.userApi.sesion, this.user);
        this.router.navigate(['tabs/']);
        console.log('Tudo bem');
      }
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Formato inválido',
        message: 'Respeta el formato de patentes (ABCD12 ó abcd12)',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
  async getUser() {
    for await (const i of this.usuarios) {
      if (i.sesion === this.user.sesion) {
        return i;
      }
    }
  }
  validarPatente() {
    const exp = /^[a-z-A-Z]{4}[0-9]{2}$/;
    if (exp.test(this.auto.patente)) {
      return true;
    } else {
      return false;
    }
  }
}
