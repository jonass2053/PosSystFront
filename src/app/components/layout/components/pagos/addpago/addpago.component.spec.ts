import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpagoComponent } from './addpago.component';

describe('AddpagoComponent', () => {
  let component: AddpagoComponent;
  let fixture: ComponentFixture<AddpagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddpagoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddpagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
