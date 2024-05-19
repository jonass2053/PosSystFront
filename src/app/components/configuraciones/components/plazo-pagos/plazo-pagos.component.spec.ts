import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlazoPagosComponent } from './plazo-pagos.component';

describe('PlazoPagosComponent', () => {
  let component: PlazoPagosComponent;
  let fixture: ComponentFixture<PlazoPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlazoPagosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlazoPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
