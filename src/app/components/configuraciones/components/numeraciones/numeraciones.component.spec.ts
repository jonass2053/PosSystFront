import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumeracionesComponent } from './numeraciones.component';

describe('NumeracionesComponent', () => {
  let component: NumeracionesComponent;
  let fixture: ComponentFixture<NumeracionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumeracionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NumeracionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
