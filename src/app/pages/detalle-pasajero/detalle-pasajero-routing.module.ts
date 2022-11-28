import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallePasajeroPage } from './detalle-pasajero.page';

const routes: Routes = [
  {
    path: '',
    component: DetallePasajeroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallePasajeroPageRoutingModule {}
