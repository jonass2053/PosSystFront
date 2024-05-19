import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesProveedoresComponent } from './clientes-proveedores.component';

describe('ClientesProveedoresComponent', () => {
  let component: ClientesProveedoresComponent;
  let fixture: ComponentFixture<ClientesProveedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientesProveedoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientesProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
