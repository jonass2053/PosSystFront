export interface ServiceResponse {
    message : string,
    token : string,
    status : string,
    data : any
}

export interface ServiceResponseLogin {
    message : string,
    token : string,
    status : boolean,
    data : any
}   

export interface iRol{
    idRol? : number,
    nombre :string
}