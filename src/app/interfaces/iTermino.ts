import { IUsuario } from "./i-usuario"

export interface iTermino
{
    idTermino : number,
    nombre : string,
    dias : number,
    predeterminado : boolean
}

export interface idNumeracion
{
    idNumeracion : number,
    idTipoDocumento : Number,
    idTipoNumeracion: Number,
    nombre : string,
    predeterminada : boolean,
    vigencia : Date,
    prefijo : string,
    numeracionInicial : string,
    contador : string, 
    numeracionFinal : string,
    estado : boolean
}

export interface iTipoDocumento
{
    idTipoDocumento : number,
    nombre : string

}
export interface iTipoNumeracion
{
    idTipoNumeracion : number,
    idTipoDocumento : number,
    nombre : string,
    prefijo : string,

}

export interface iVendedor
{
    idVendedor?: number,
    nombre : string,
    rnc : string,
    observaciones : string
}


export interface iConfiguracionFac
{
    idConfiguracion?: number,
    terminos : string,
    notas : string
}


export interface iEmpresa
{
    idEmpresa?: number,
    razonSocial : string,
    nombreComercial : string,
    rnc : string,
    telefono : string,
    direccion : string,
    correo : string,
    web : string,
    idRegimen : number,
    idSector : number,
    facturacionElectronica : boolean,
    numEmpleados : string,
    logo : string,
    idMoneda : number

}
export interface iRegimen
{
    idRegimen?: number,
    nombre : string
}

export interface iSector
{
    idSector?: number,
    nombre : string
}
export interface iNumEmpleados
{
    value: string,
    name : string
}

export interface iContactoPos {
    idContacto?: number
    idTipoContacto: number
    tipoIdentificacion: string
    rnc: string
    nombreRazonSocial: string
    direccion: string
    correo: string
    celular: string
    telefono1: string
    telefono2: string
    idTipoNumeracion: number
    limiteCredito: number
    idTermino: number
    idVendedor: number
    incluirEstadoCuenta: boolean
  }
  
  export interface idTipoContacto{
    idTipoContacto : number,
    nombre : string
  }
  export interface iEstado{
    id : number,
    estado : string
  }

  export interface iCategoria
  {
    idCategoria? : number,
    nombre : string 
  }

  export interface iAlmacen{
    idAlmacen? : number,
    nombre : string,
    observaciones : string
  }

export interface iProducto
{
    idProducto?  :  number,
    isProduct : boolean,
    nombre : string,
    idUnidad : number,
    costoInicial : number,
    precioBase : number,
    precioFinal : number,
    descripcion : string,
    idAlmacen : number,
    cantInicial : number,
    cantMinima : number,
    cantMaxima : number,
    idCuentaContableParaVenta : number,
    imagen : string,
    venderSinUnidades? : boolean,
    idCategoria : number,
    idEmpresa : number
    impuestos : iiMpuesto[]
    ImpuestosObj : iiMpuesto[]

}

export interface iCuentas
{
    idCuentaContableParaVenta : number,
    nombre : string
}
export interface iUnidades
{
    idUnidad : number,
    nombre : string
}

export interface iiMpuesto
{
    idImpuesto?:number,
    idProducto : number,
    nombre : string,
    porcentaje : number,
    impuestoAcreditable : boolean,
    descripcion : string,
    porcentajeCalculado : number,
    monto : number,
    idCuentaContableParaCompra : number,
    idCuentaContableParaVenta : number

}

export interface iCategoria
{
    idCategoria? : number,
    nombre : string
}
export interface iMarca
{
    idMarca? : number,
    idCategoria : number,
    nombre : string
}
export interface iMarcaget
{
    idMarca? : number,
    categoria : iCategoria
    nombre : string
}
export interface iModelo
{
    idModelo? : number,
    idMarca : number,
    nombre : string
}
export interface iModeloGet
{
    idModelo? : number,
    marca : iMarcaget
    nombre : string
}
export class iImpuestoProductoCodigo
{
    // id ?: number;
    idProducto? :  number;
    idImpuesto? : number;
}

export interface iMoneda
{
    idMoneda : number,
    nombre : string,
    abreviatura : string,
    simbolo : string
    
}

 export interface iFactura {
    idFactura?: number,
    idTermino : number,
    terminoObj : iTermino,
    idNumeracion: number,
    numeracionObj : idNumeracion,
    numeracion : string,
    idContacto: number,
    contacto : iContactoPos,
    idTipoDocumento: number,
    idSucursal: number,
    sucursalObj : 
        {
            idSucursal: number,
            idEmpresa: number,
            empresa?: iEmpresa,
            nombre?: string,
            direccion?: string,
            telefono1?: string,
            telefono2?: string,
          },
    idUsuario: number,
    usuario : IUsuario,
    idVendedor : number,
    subTotal: number,
    descuento: number,
    itbis : number
    totalGeneral: number,
    totalRecibido : number,
    cambio : number,
    idEmpresa: number,
    empresaObj : iEmpresa
    vencimiento: string,
    comentario : string,
    fechaCreacion? : Date,
    montoPagado :  number,
    montoPorPagar : number,
    estadoFactura : {idDetalleFactura : number, nombre : string, color : string},
    tipoDocumentoObj : iTipoDocumento
    detalle: iDetalleFactura[];
  }
  
 export interface iDetalleFactura {
    idDetalleFactura?: number,
    idFactura?: number,
    idProducto: number,
    nombre : string,
    cantidad: number,
    precio: number,
    descuento: number,
    descuentoProcentual: number,
    impuestos: number,
    subTotal : number,
    total: number,
    productoObj : any,
    producto : any,
    IdImpuesto? : number
    impuestoObj? : iiMpuesto
  }

  export interface iTiopCuentaBanck {
    idTipoCuenta: number;
    nombre: string;
    descripcion: string;

  }

  export interface iBanco{
    idBanco?: number;
    idTipoCuenta: number;
    tipoCuenta : iTiopCuentaBanck,
    nombreCuenta: string;
    numerCuenta: string;
    saldoInicial: number;
    fechaSaldoInicial: Date;
    descripcion: string;
    estado: boolean;
  }

  export interface iMetodoPago{
     idMetodoPago : number;
     nombre : string;
  }
  export interface iPago {
    idPago?: number;
    idContacto: number;
    idBanco: number;
    bancoObj : iBanco,
    idMetodoPago: number;
    metodoPagoObj  : iMetodoPago,
    monto: number;
    notaPago: string;
    idFactura: number;
    facturaObj : iFactura
    noTicket: string;
    fecha : string;
    MultiPayment : {
        IdPago : number,
        IdFactura : number,
        Monto : number
    }
    
  }
  
  export interface iResumenFacturas{
    totalVentas: number,
    totalVentasCobradas : number,
    cantTotalVentasCobradas: number,
    totalVentasPorCobrar : number,
    cantTotalVentasPorCobrar : number
  }