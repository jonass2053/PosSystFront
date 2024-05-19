import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { RouterLink, RouterModule } from '@angular/router';
import { configuracionRoutes } from './configuraciones.routes';


@Component({
  selector: 'app-configuraciones',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink,
    
  ],
  templateUrl: './configuraciones.component.html',
  styleUrl: './configuraciones.component.css'
})
export class ConfiguracionesComponent {

  tet()
  {
    alert("test")
  }
}
