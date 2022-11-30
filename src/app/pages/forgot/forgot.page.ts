import { Component, OnInit } from '@angular/core';
import { ToastController, ViewWillEnter } from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { PostService } from '../../services/post.service';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {
  newCon;
  confirma;
  usuarios;
  user;
  constructor(private toastCtrl: ToastController,
    private router: Router,
    private actRoute: ActivatedRoute,
    private service: StorageService,
    private fs: FirestoreService) {
    this.fs.readCollection('usuarios/').subscribe(res=>this.usuarios=res);

    this.actRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.user = this.router.getCurrentNavigation().extras.state.user;
      }
    });
  }
  ngOnInit() {
  }
  async recuperar() {
    if (this.newCon === this.confirma) {
      //cambiar la contraseña
      this.user.password = this.newCon;

      //lo elimino del storage
      this.service.eliminar(this.newCon);
      this.fs.updateDoc('usuarios/', this.user.sesion, this.user);

      await this.service.guardar(this.user.sesion, this.user);

      const toast = await this.toastCtrl.create({
        message: 'Contraseñas reestablecida',
        duration: 2000
      });
      toast.present();
      this.router.navigate(['/login']);
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Las contraseñas no coinciden',
        duration: 2000
      }); toast.present();
    }
  }
}
