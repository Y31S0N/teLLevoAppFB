import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { ToastController, ViewWillEnter } from '@ionic/angular';
import { Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { AppComponent } from 'src/app/app.component';
import { Auto } from 'src/app/interfaces/auto';
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
    private router: Router, private ps: PostService) {
    this.ps.getPosts('usuarios').subscribe(res=>this.usuarios=res);
  }
// EN ESTA PÁGINA SOLO ENTRARÁN PASAJEROS QUE NO TIENEN AUTO
  ionViewWillEnter() {
    setTimeout(() => {
      this.cargarDatos();
    }, 900);
  }
    async cargarDatos(){
    this.user = await this.service.gett();
    this.userApi = await this.getUser();
  }
  async onSubmit() {
    this.user = await this.service.gett();
    this.user.auto = this.auto;
    this.service.eliminar(this.user.sesion);
    //haré un if por cada atributo, así es más fácil mostrar los mensajes de cada error
    //marca, modelo y color no son necesarios
    if (this.auto.numAsientos <= 0 || this.auto.numAsientos >= 8) {
      const toast = await this.toastCtrl.create({
        message: 'N° de asientos inválidos(1 - 7)',
        duration: 2000
      }); toast.present();
    } else {
      this.user.rol = 'conductor';
      // acá debo guardar la variable como usuario
      await this.service.guardar(this.user.sesion, this.user);
      this.ps.updatePost('usuarios', this.userApi.id, {data:this.user});
      this.router.navigate(['tabs/']);
    }
  }
  async getUser() {
    for await (const i of this.usuarios) {
      if (i.attributes.sesion === this.user.sesion) {
        return i;
      }
    }
  }
}
