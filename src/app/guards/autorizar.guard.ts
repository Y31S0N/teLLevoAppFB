import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router,RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AutorizarGuard implements CanActivate {

  constructor(private service: StorageService, private router: Router) {}

  async auth(){
    const usr = await this.service.getSinSes('sesion');
    if(usr != null){
        return true;
    }else{
      this.router.navigate(['/login']);
    }
    return false;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.auth();
  }
}
