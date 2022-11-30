import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { PostService } from '../services/post.service';
import { ViewWillEnter } from '@ionic/angular';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements ViewWillEnter {
  username: string;
  rol: string;

  historialCon = [];
  listaViajes = [];
  user;
  ses;
  viajes;
  constructor(private service: StorageService, private fs: FirestoreService) {
    this.fs.readCollection('viajes/').subscribe(r=>{this.viajes=r;});
  }
  ionViewWillEnter() {
    setTimeout(() => {
      this.cargarDatos();
    }, 1200);
  }
  async cargarDatos(){
    this.user = await this.service.gett('usuario');
    console.log(this.user);
    this.username = this.user.username;
    this.rol = this.user.rol;
    this.listarViajes();
  }
  listarViajes() {
    this.listaViajes = [];
    this.historialCon = [];
    for (const i of this.viajes) {
      if (i.ide === undefined) {
        continue;
      }
      else if (i.disponible === true && i.pasajeros.length-1 < i.nAsientos) {
        this.listaViajes.push(i);
      } else if (!i.visible && this.user.sesion === i.idConductor) {
        this.historialCon.push(i);
      }
    }
  }
}
