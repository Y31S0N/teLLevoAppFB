import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProgViajePageRoutingModule } from './prog-viaje-routing.module';

import { ProgViajePage } from './prog-viaje.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    ProgViajePageRoutingModule
  ],
  declarations: [ProgViajePage]
})
export class ProgViajePageModule {}
