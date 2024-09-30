import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'


@Injectable({
  providedIn: 'root'
})
export class AlertServiceService {

 
ShowLoading()
  { 
    Swal.fire({
      didOpen : ()=>
      {
        Swal.showLoading();
      },
      width: '225px',
      html: "Cargando... <br> por favor espere",
      allowOutsideClick: false,
    }); 
  }
hideLoading = ()=>{
  setTimeout(() => {
    Swal.close();
  }, 0);

} 
  
  successAlert(msj : string)
  {
    Swal.fire({
      text: msj,
      icon: "success",
      showConfirmButton: false,
      timer: 1500
    });
  }
  errorAlert(msj : string)
  {
    Swal.fire({
      text: msj,
      icon: "error"
    });
  }
  warnigAlert(msj : string)
  {
    Swal.fire({
      text: msj,
      icon: "warning"
    });
  }

  async questionDelete()
  {
    let value;
   await Swal.fire({
      title: "Esta seguro que desea eliminar este registro?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si"
    }).then((result) => {
      if (result.isConfirmed) {
        value= true;
      }
      else
      {
        value=false;
      }
    });
    return value;
  }

  async questionLogout()
  {
    let value;
   await Swal.fire({
      title: "Esta seguro que desea salir del sistema?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si"
    }).then((result) => {
      if (result.isConfirmed) {
        value= true;
      }
      else
      {
        value=false;
      }
    });
    return value;
  }
}
