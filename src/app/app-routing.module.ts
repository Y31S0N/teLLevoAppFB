import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AutorizarGuard } from './guards/autorizar.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'detalle-pasajero/:id',
    loadChildren: () => import('./pages/detalle-pasajero/detalle-pasajero.module').then( m => m.DetallePasajeroPageModule),
    canActivate: [AutorizarGuard]
  },
  {
    path: 'prog-viaje',
    loadChildren: () => import('./pages/prog-viaje/prog-viaje.module').then( m => m.ProgViajePageModule),
    canActivate: [AutorizarGuard]
  },
  {
    path: 'forgot',
    loadChildren: () => import('./pages/forgot/forgot.module').then( m => m.ForgotPageModule),
    canActivate: [AutorizarGuard]
  },
  {
    path: 'detalle-viaje/:id',
    loadChildren: () => import('./pages/detalle-viaje/detalle-viaje.module').then( m => m.DetalleViajePageModule),
    canActivate: [AutorizarGuard]
  },
  {
    path: 'creacion-auto',
    loadChildren: () => import('./pages/creacion-auto/creacion-auto.module').then( m => m.CreacionAutoPageModule),
    canActivate: [AutorizarGuard]
  },



];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
