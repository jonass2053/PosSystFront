import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaPComponent } from './categoria-p.component';

describe('CategoriaPComponent', () => {
  let component: CategoriaPComponent;
  let fixture: ComponentFixture<CategoriaPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaPComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoriaPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
