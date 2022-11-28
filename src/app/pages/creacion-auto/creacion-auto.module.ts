import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreacionAutoPageRoutingModule } from './creacion-auto-routing.module';

import { CreacionAutoPage } from './creacion-auto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreacionAutoPageRoutingModule
  ],
  declarations: [CreacionAutoPage]
})
export class CreacionAutoPageModule {}
