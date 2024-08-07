import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaConsultaComponent } from './factura-consulta.component';

describe('FacturaConsultaComponent', () => {
  let component: FacturaConsultaComponent;
  let fixture: ComponentFixture<FacturaConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturaConsultaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacturaConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
