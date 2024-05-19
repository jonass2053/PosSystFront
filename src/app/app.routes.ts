
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { EmpresaComponent } from './components/configuraciones/components/empresa/empresa.component';
import { NotFoundComponent } from './components/utilities/not-found/not-found.component';

export const routes: Routes = [
    {path : "",  component : LoginComponent},
    {path : "login", component : LoginComponent},
    {path : "layout", loadChildren: ()=>import("./components/layout/layout.routes").then((c)=>c.routes)},
    {path : "**", component : NotFoundComponent}
   
];
