import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionFacturaComponent } from './configuracion-factura.component';

describe('ConfiguracionFacturaComponent', () => {
  let component: ConfiguracionFacturaComponent;
  let fixture: ComponentFixture<ConfiguracionFacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracionFacturaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfiguracionFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
