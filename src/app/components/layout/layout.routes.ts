import { Routes } from "@angular/router";


import { EmpresaComponent } from "../configuraciones/components/empresa/empresa.component";
import { LayoutComponent } from "./layout.component";
import { ClientesProveedoresComponent } from "./components/clientes-proveedores/clientes-proveedores.component";
import { CategoriaPComponent } from "./components/categoria-p/categoria-p.component";
import { AlmacenService } from "../../services/almacen.service";
import { AlmacenComponent } from "./components/almacen/almacen.component";
import { ProductoComponent } from "./components/producto/producto.component";
import { ModelosComponent } from "./components/modelos/modelos.component";
import { MarcasComponent } from "./components/marcas/marcas.component";



export const routes : Routes=[
    {path : "",
    children:[
        {path : "configuraciones", loadChildren : ()=>import("../configuraciones/configuraciones.routes").then((c)=>c.configuracionRoutes)},
        {path : "empresa", component : EmpresaComponent},
        {path : "clientesproveedores", component : ClientesProveedoresComponent},
        {path : "categoria", component : CategoriaPComponent},
        {path : 'almacen', component : AlmacenComponent},
        {path : 'productos', component : ProductoComponent},
        {path : 'marcas', component : MarcasComponent},
        {path : 'modelos', component : ModelosComponent}
      
       
    ],    
    component : LayoutComponent}
]