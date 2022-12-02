import { StorageService } from 'src/app/services/storage.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('miform') form: any;
  usuario = {
    username: '',
    password: '',
  };users;usuarios;owos;
  constructor(private router: Router, private toastCtrl: ToastController,
    private alertCtrl: AlertController, private service: StorageService,
    private fs: FirestoreService) {
    this.fs.readCollection('usuarios/').subscribe(r => { this.usuarios = r;});
  }
  ngOnInit(){}
  ionViewWillLeave() {
    this.usuario.username = '';
    this.usuario.password = '';
  }

  async onSubmit() {
    const usr = await this.verificar();
    if (await usr !== undefined) {
      await this.service.guardar('sesion', usr.sesion);
      await this.service.guardar('usuario', usr);
      const toast = await this.toastCtrl.create({
        message: 'Bievenid@ de vuelta ' + this.usuario.username,
        duration: 2000
      });
      this.router.navigate(['/tabs']);
      toast.present();
    } else {
      const alerta = await this.alertCtrl.create({
        header: 'Campos incorrectos',
        message: 'No encontramos usuario con estos datos',
        buttons: ['OK'],
      });
      await alerta.present();
    }
  }
  async alerta() {
    if (this.usuario.username === undefined || this.usuario.username === '') {
      const toast = await this.toastCtrl.create({
        message: 'Primero introduce tu nombre de usuario.',
        duration: 3000
      });
      toast.present();
    } else {
      const usr = await this.buscarUser();
      if (usr !== undefined) {
        if (this.usuario.username === usr.username) {
          const toast = await this.toastCtrl.create({
            message: 'Hola ' + this.usuario.username,
            duration: 3000
          });
          toast.present();
          const navi: NavigationExtras = {
            state: {
              user: usr,
            }
          };
          this.router.navigate(['forgot'], navi);
        }
      } else {
        const toast = await this.toastCtrl.create({
          message: 'No se encontraron datos',
          duration: 3000
        });toast.present();
      }
    }
  }
  verificar() {
    for (const u of this.usuarios) {
      if (this.usuario.password === u.password && this.usuario.username === u.username) {
        return u;
      }
    }
  }
  async buscarUser() {
    for await (const i of this.usuarios) {
      if (i.username !== undefined) {
        if (this.usuario.username === i.username) {
          return i;
        }
      }
    }
  }
  goToRegistrar() {
    this.router.navigate(['registro']);
  }
}

