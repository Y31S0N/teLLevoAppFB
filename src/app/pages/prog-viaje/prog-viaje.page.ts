import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import * as mapboxgl from 'mapbox-gl';
import { Map, Marker } from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import { AlertController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';
import { nanoid } from 'nanoid';
import { Viaje } from '../../interfaces/viaje';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-prog-viaje',
  templateUrl: './prog-viaje.page.html',
  styleUrls: ['./prog-viaje.page.scss'],
})
export class ProgViajePage implements AfterViewInit {
  @ViewChild('mapa') mapaGG!: ElementRef;
  start = [-73.064083, -36.794719];

  viaje: Viaje = {
    ide: '',
    disponible: true,
    destino: '',
    costo: 500,
    comentario: '',
    pago: '',
    idConductor: '',
    fecha: '',
    hora: '',
    pasajeros: [],
    nAsientos: null,
    visible: true
  };
  rol: string; idViaje: string; user;
  fHoy; tHoy; fElec; tElec; msg;

  constructor(private alertCtrl: AlertController, private router: Router,
    private service: StorageService, private fs: FirestoreService) { }

  async ngAfterViewInit() {
    this.viaje.comentario = '';
    this.viaje.pago = null;
    this.viaje.costo = 500;
    //CREO EL MAPA
    const limites = [
      [-73.244978, -37.148823], [-72.251465, -36.523733]
    ];
    const mapa = new Map({
      container: this.mapaGG.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.start,
      zoom: 15,
      maxBounds: limites
    });
    //GEOCO ES LA BARRA DE BÚSQUEDA
    const geoco = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl,

      countries: 'cl',
      //esto limitaría la búsqueda de lugares externos
      bbox: [-73.244978, -37.148823, -72.251465, -36.523733]
    });
    // LE AÑADO EL GEOCODER AL MAPA
    mapa.addControl(geoco);

    geoco.on('result', ($event) => {
      this.viaje.destino = $event.result.place_name;
    });
    const pop = new mapboxgl.Popup().setHTML('<p style="color: black;">Inicio de viaje predeterminado</p>');
    this.crearMarcador(this.start[0], this.start[1], mapa, pop);

    geoco.clear();
  }
  async submit() {
    if (this.viaje.destino === '' || this.viaje.destino === ' ') {
      const alert = await this.alertCtrl.create({
        header: 'Alerta',
        subHeader: 'Introduzca un destino',
        buttons: ['OK']
      });
      await alert.present();
    } else {
      if (isNaN(this.viaje.costo) || !(this.viaje.costo >= 500 && this.viaje.costo <= 15000)) {
        const alert = await this.alertCtrl.create({
          header: 'Alto ahí!',
          subHeader: 'Costo inválido',
          message: 'Introduce un número válido (500 - 15000)',
          buttons: ['OK']
        });
        await alert.present();
      } else {
        if (this.validarFecha()) {
          this.user = await this.service.gett('usuario');
          this.viaje.idConductor = this.user.sesion;
          //ACÁ LA IDEA ES ALMACENAR LA CANTIDAD DE ASIENTOS QUE TIENE EL AUTO DEL CONDUCTOR ACTUAL
          this.viaje.nAsientos = this.user.auto.numAsientos;
          this.idViaje = nanoid(20);
          this.viaje.fecha = this.fElec;
          this.viaje.hora = this.tHoy;
          this.viaje.ide = this.idViaje;
          if(this.viaje.comentario===''){
            this.viaje.comentario='Sin comentarios';
          }
          await this.fs.createDoc('viajes/', this.idViaje, this.viaje);
          await this.service.guardar('viaje', this.viaje);
          const alert = await this.alertCtrl.create({
            header: 'Viaje programado!',
            message: 'Ahora... a esperar',
            buttons: ['ok'],
          }); await alert.present();
          this.router.navigate(['tabs/tab2']);
        }else{
          await this.alerta();
        }
      }
    }
    //acá va la validación del input del geocoder
  }
  crearMarcador(lon, lat, mapa, pop) {
    new Marker({
    }).setLngLat([lon, lat]).setPopup(pop).addTo(mapa);
  }
  async obtenFecha(event) {
    const hoy = new Date();
    this.fHoy = hoy.toLocaleDateString();
    this.tHoy = hoy.toLocaleTimeString();
    const elec = new Date(event.detail.value);
    this.fElec = elec.toLocaleDateString();
    this.tElec = elec.toLocaleTimeString();
  }
  async alerta(){
    const alert = await this.alertCtrl.create({
      header: 'Cuidado',
      subHeader: this.msg,
      buttons: ['OK']
    });
    await alert.present();
  }
  validarFecha(){
    this.msg='';
    if(this.fHoy.substr(6, 4) <= this.fElec.substr(6, 4)){//año
      if(this.fHoy.substr(6, 4) === this.fElec.substr(6, 4)){//mismo año
        if(this.fElec.substr(3,2) < this.fHoy.substr(3, 2)){//mes anterior
          this.msg='No puedes realizar viajes para meses pasados';
          return false;
        }else{
          if(this.fElec.substr(0, 2) >= this.fHoy.substr(0, 2)){//día mayor o igual al actual
            if(this.fElec.substr(0, 2) === this.fHoy.substr(0, 2)){//mismo día
              if(this.tElec.substr(0, 5) > this.tHoy.substr(0, 5)){//hora mayor a la actual
                //acá la idea es manejar
                return true;
              }else if(this.tElec.substr(0, 5) <= this.tHoy.substr(0, 5)){
                this.msg = 'Los viajes se deben realizar con mínimo 1 minuto de anticipación';
                return false;
              }
            }
          }else{
            this.msg='No se pueden realizar viajes para días pasados';
            return false;
          }
        }
      }else{
        console.log('Este es para año distinto');
        return false;
      }
    }else{
      this.msg = 'No se pueden hacer viajes para años anteriores';
      return false;
    }
  }
}
