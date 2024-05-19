export interface iTermino
{
    idTermino : number,
    nombre : string,
    dias : number
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
    nuemracionSiguiente : string, 
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
    logo : string

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