import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleViajePageRoutingModule } from './detalle-viaje-routing.module';

import { DetalleViajePage } from './detalle-viaje.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    DetalleViajePageRoutingModule
  ],
  declarations: [DetalleViajePage]
})
export class DetalleViajePageModule {}
