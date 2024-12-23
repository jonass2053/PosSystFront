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
import { InicioComponent } from "./components/inicio/inicio.component";
import { FacturaComponent } from "./components/factura/factura.component";
import { FacturaConsultaComponent } from "./components/factura-consulta/factura-consulta.component";
import { ListFacturasComponent } from "./components/factura/list-facturas/list-facturas.component";
import { BancosComponent } from "./components/bancos/bancos.component";
import { PagoFacturaComponent } from "./components/factura/pago-factura/pago-factura.component";
import { DetalleFacturaComponent } from "./components/factura/detalle-factura/detalle-factura.component";
import { FacturaReportComponent } from "../../reports/factura-report/factura-report.component";



export const routes : Routes=[
    {path : "",
    children:[
        {path : "configuraciones", loadChildren : ()=>import("../configuraciones/configuraciones.routes").then((c)=>c.configuracionRoutes)},
        {path : "empresa", component : EmpresaComponent},
        {path : "inicio", component : InicioComponent},
        {path : "contactos", component : ClientesProveedoresComponent},
        {path : "categorias", component : CategoriaPComponent},
        {path : 'almacenes', component : AlmacenComponent},
        {path : 'productos', component : ProductoComponent},
        {path : 'marcas', component : MarcasComponent},
        {path : 'modelos', component : ModelosComponent},
        {path : 'factura', component : FacturaComponent},
        {path : 'facturas', component : ListFacturasComponent},
        {path : 'detalle_factura/:id', component : DetalleFacturaComponent},
        {path : 'factura_report/:id', component : FacturaReportComponent},
        {path : 'pago', component : PagoFacturaComponent},
        {path : 'bancos', component : BancosComponent},
        {path : '', component : InicioComponent},
      
       
    ],    
    component : LayoutComponent}
]