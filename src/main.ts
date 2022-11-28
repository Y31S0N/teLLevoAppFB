import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import Mapboxgl from 'mapbox-gl';
Mapboxgl.accessToken = 'pk.eyJ1IjoidGhlZzNudGwzbTRuIiwiYSI6ImNsOTRpaGVzcDIzajgzb3A4NzdveTFqbGMifQ.RcQEXjCRPp6zO8thX3ctlw';
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
