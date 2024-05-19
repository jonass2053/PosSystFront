import { Component } from '@angular/core';
import { importaciones } from '../material/material';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    RouterLink,
    RouterModule,
    importaciones
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

}
