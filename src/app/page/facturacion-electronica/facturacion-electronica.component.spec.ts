import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturacionElectronicaComponent } from './facturacion-electronica.component';

describe('FacturacionElectronicaComponent', () => {
  let component: FacturacionElectronicaComponent;
  let fixture: ComponentFixture<FacturacionElectronicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturacionElectronicaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacturacionElectronicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
