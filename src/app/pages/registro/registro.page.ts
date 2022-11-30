import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';
import { nanoid } from 'nanoid';
import { Auto } from 'src/app/interfaces/auto';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  auto: Auto = {
    marca: '',
    modelo: '',
    patente: '',
    color: '',
    numAsientos: null,
  };

  usuario = {
    ide: '', nombre: '',
    apaterno: '', amaterno: '',
    username: '', password: '',
    pass: '', correo: '',
    rol: '', auto: this.auto,
  };
  constructor(private router: Router, private toastCtrl: ToastController,
    private alertCtrl: AlertController, private service: StorageService,
    private fs: FirestoreService) { }

  ngOnInit() {
  }
  async onSubmit() {
    if (this.usuario.password === this.usuario.pass) {
      if (this.usuario.rol === '') {
        const toast = await this.toastCtrl.create({
          message: 'Selecciona un rol',
          duration: 2000
        });
        toast.present();
      }
      const exp = /[a-z]+\.[a-z]+@duocuc\.cl/;
      //validación del correo
      if (exp.test(this.usuario.correo)) {
        if (this.usuario.rol === 'conductor') {
          if(this.validarPatente()){
            if (this.auto.numAsientos <= 0 || this.auto.numAsientos >= 8) {
              const toast = await this.toastCtrl.create({
                message: 'N° de asientos inválidos(1 - 7)',
                duration: 2000
              });
              toast.present();
            } else {
              await this.guardar();
              this.service.guardar('sesion', this.usuario.ide);
              const navi: NavigationExtras = {
                state: {
                  usr: this.usuario,
                  ses: this.usuario.ide
                }
              };
              const toast = await this.toastCtrl.create({
                message: 'Bienvenido ' + this.usuario.username + '!',
                duration: 3000,
                position: 'bottom',
              });
              await toast.present();
              this.router.navigate(['tabs'], navi);
            }
          }else{
            const alert = await this.alertCtrl.create({
              header: 'Formato inválido',
              message: 'Respeta el formato de patentes (ABCD12 ó abcd12)',
              buttons: ['OK']
            });
            await alert.present();
          }
        }
        else if (this.usuario.rol === 'pasajero') {
          await this.guardar();
          await this.service.guardar('sesion', this.usuario.ide);

          const toast = await this.toastCtrl.create({
            message: 'Bienvenido ' + this.usuario.username + '!',
            duration: 3000,
            position: 'bottom',
          });
          const navi: NavigationExtras = {
            state: {
              usr: this.usuario,
              ses: this.usuario.ide
            }
          };
          await toast.present();
          this.router.navigate(['tabs'], navi);
        }
      } else {
        const toast = await this.toastCtrl.create({
          message: 'Correo inválido (nom.apellido@duocuc.cl)',
          duration: 3000,
          position: 'bottom',
        });
        await toast.present();
      }
    } else if (this.usuario.password !== this.usuario.pass) {
      const alerta = await this.alertCtrl.create({
        header: 'Alerta',
        message: 'Ambas contraseñas deben coincidir',
      }); await alerta.present();
    }
  }
  async guardar() {
    if (this.usuario.rol === 'pasajero') {
      this.usuario.ide = nanoid(17);
    } else if (this.usuario.rol === 'conductor') {
      this.usuario.ide = nanoid(15);
    }
    const datos = {
      username: this.usuario.username,
      password: this.usuario.password,
      nombre: this.usuario.nombre,
      apaterno: this.usuario.apaterno,
      amaterno: this.usuario.amaterno,
      correo: this.usuario.correo,
      rol: this.usuario.rol,
      auto: this.auto,
      sesion: this.usuario.ide
    };
    await this.service.guardar(this.usuario.ide, datos);
    this.fs.createDoc('usuarios', this.usuario.ide, datos);
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
