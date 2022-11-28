import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallePasajeroPageRoutingModule } from './detalle-pasajero-routing.module';

import { DetallePasajeroPage } from './detalle-pasajero.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    DetallePasajeroPageRoutingModule
  ],
  declarations: [DetallePasajeroPage]
})
export class DetallePasajeroPageModule {}
