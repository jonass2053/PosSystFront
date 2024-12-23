export interface ServiceResponse {
    message: string,
    token: string,
    status: string,
    statusCode : number,
    currentPage: number,
    cantPage: number,
    totalPage: number,
    data: any
}

export interface ServiceResponseLogin {
    message: string,
    token: string,
    status: boolean,
    data: any
}

export interface iRol {
    idRol?: number,
    nombre: string
}