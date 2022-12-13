import { Storage, IonicStorageModule } from '@ionic/storage-angular';
import { TestBed } from '@angular/core/testing';

import { AutorizarGuard } from './autorizar.guard';
import { StorageService } from '../services/storage.service';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

xdescribe('AutorizarGuard', () => {
  let guard: AutorizarGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), IonicStorageModule.forRoot()],
    });
    guard = TestBed.inject(AutorizarGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
