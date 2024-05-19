import { Routes } from "@angular/router";
import { EmpresaComponent } from "./components/empresa/empresa.component";
import { ConfiguracionesComponent } from "./configuraciones.component";
import { UsuariosComponent } from "./components/usuarios/usuarios.component";
import { PlazoPagosComponent } from "./components/plazo-pagos/plazo-pagos.component";
import { NumeracionesComponent } from "./components/numeraciones/numeraciones.component";
import { ConfiguracionFacturaComponent } from "./components/configuracion-factura/configuracion-factura.component";
import { VendedoresComponent } from "./components/vendedores/vendedores.component";
import { ImpuestosComponent } from "./components/impuestos/impuestos.component";
import { RolesComponent } from "./components/roles/roles.component";



export const configuracionRoutes : Routes=[
    {path : "", component : ConfiguracionesComponent },
    {path : "empresa", component : EmpresaComponent},
    {path : "usuarios", component : UsuariosComponent},
    {path : "configuraciones", component : ConfiguracionesComponent},
    {path : "terminos", component : PlazoPagosComponent},
    {path : "numeraciones", component : NumeracionesComponent},
    {path : "configuracionfat", component : ConfiguracionFacturaComponent},
    {path : "vendedores", component : VendedoresComponent},
    {path : "impuestos", component : ImpuestosComponent},
    {path : "roles", component : RolesComponent},

]