import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgViajePage } from './prog-viaje.page';

const routes: Routes = [
  {
    path: '',
    component: ProgViajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgViajePageRoutingModule {}
