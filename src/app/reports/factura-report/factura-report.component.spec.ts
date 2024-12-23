import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaReportComponent } from './factura-report.component';

describe('FacturaReportComponent', () => {
  let component: FacturaReportComponent;
  let fixture: ComponentFixture<FacturaReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturaReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacturaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
