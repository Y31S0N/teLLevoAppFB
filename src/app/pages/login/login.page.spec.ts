import { Storage, IonicStorageModule } from '@ionic/storage-angular';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';
import { FormsModule } from '@angular/forms';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPage ],
      imports: [IonicStorageModule.forRoot(), IonicModule.forRoot(), FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('debe ser inválido', () =>{
    const fisura = TestBed.createComponent(LoginPage);
    const app = fisura.componentInstance;

    fisura.detectChanges();
    expect(app.form.invalid);
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
