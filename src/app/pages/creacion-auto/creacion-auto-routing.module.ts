import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreacionAutoPage } from './creacion-auto.page';

const routes: Routes = [
  {
    path: '',
    component: CreacionAutoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreacionAutoPageRoutingModule {}
