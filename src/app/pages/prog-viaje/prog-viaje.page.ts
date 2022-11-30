import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import * as mapboxgl from 'mapbox-gl';
import { Map, Marker } from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import { AlertController, ToastController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';
import { nanoid } from 'nanoid';
import { PostService } from '../../services/post.service';
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
  rol: string;
  idViaje: string;
  user;
  valorFecha;
  constructor(private alertCtrl: AlertController, private router: Router,
    private service: StorageService, private fs: FirestoreService){}

  async ngAfterViewInit() {
    this.viaje.comentario = '';
    this.viaje.pago = null;
    this.viaje.costo = 500;
    //CREO EL MAPA
    const limites=[
      [-73.244978, -37.148823],[-72.251465, -36.523733]
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
      //acá solo se limita a Chile
      countries: 'cl',
      //esto limitaría la búsqueda de lugares externos
      bbox: [-73.244978, -37.148823,-72.251465, -36.523733]
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
    if(this.viaje.destino === '' || this.viaje.destino === ' '){
        const alert = await this.alertCtrl.create({
          header: 'Alerta',
          subHeader: 'Introduzca un destino',
          buttons: ['OK']
        });
        await alert.present();
    }else{
      if(isNaN(this.viaje.costo) || !(this.viaje.costo >= 500 && this.viaje.costo <= 15000)){
        const alert = await this.alertCtrl.create({
          header: 'Alto ahí!',
          subHeader: 'Costo inválido',
          message: 'Introduce un número válido (500 - 15000)',
          buttons: ['OK']
        });
        await alert.present();
      }else{
        this.user = await this.service.gett();
        this.viaje.idConductor = this.user.sesion;
        //ACÁ LA IDEA ES ALMACENAR LA CANTIDAD DE ASIENTOS QUE TIENE EL AUTO DEL CONDUCTOR ACTUAL
        this.viaje.nAsientos = this.user.auto.numAsientos;
        this.idViaje = nanoid(20);
        this.viaje.ide = this.idViaje;
        //guardar viaje
        await this.fs.createDoc('viajes/', this.idViaje, this.viaje);
        await this.service.guardar('viaje', this.viaje);
        const alert = await this.alertCtrl.create({
          header: 'Viaje programado!',
          message: 'Ahora... a esperar',
          buttons: [{
            text: 'Ok',
            role: 'confirm'
          }],
        }); await alert.present();
        this.router.navigate(['tabs/tab2']);
      }
    }
    //acá va la validación del input del geocoder
  }
  crearMarcador(lon, lat, mapa, pop) {
    new Marker({
    }).setLngLat([lon, lat]).setPopup(pop).addTo(mapa);
  }
  async obtenFecha(event){
    const hoy = new Date();
    const fHoy = hoy.toLocaleDateString();
    const tHoy = hoy.toLocaleTimeString();
    const fecha = new Date(event.detail.value);

    if(fecha.toLocaleDateString() < fHoy){
      const alert = await this.alertCtrl.create({
        header: 'Cuidado!',
        subHeader: 'Los viajes en el tiempo no son posibles... aún',
        message: 'No puedes programar viajes para días anteriores',
        buttons: ['OK']
      });
      await alert.present();
      this.valorFecha = hoy.toISOString();
      return;
    }else{//si llegó acá, es porque el día, es HOY, ó días después
      if(fecha.toLocaleDateString() === fHoy && fecha.toLocaleTimeString() < tHoy){
        const alerta = await this.alertCtrl.create({
          header: 'Cuidado!',
          subHeader: 'Si el viaje es para hoy...',
          message: 'Intenta programarlo para una hora posterior a la actual',
          buttons: ['OK']
        });
        await alerta.present();
        setTimeout(()=>{
          this.valorFecha = hoy.toISOString();
        },200);
        return;
      }else{
        this.viaje.fecha = fecha.toLocaleDateString();
        this.viaje.hora = fecha.toLocaleTimeString();
      }
    }
  }
}
