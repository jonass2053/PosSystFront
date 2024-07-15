import { Component, OnInit } from '@angular/core';
import { importaciones } from '../../../utilities/material/material';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertServiceService } from '../../../utilities/alert-service.service';
import { MsjService } from '../../../utilities/msj.service';
import { ProductoService } from '../../../../services/producto.service';
import { iProducto, iContactoPos, iTermino, iVendedor, idNumeracion, idTipoContacto, iUnidades, iCuentas, iiMpuesto, iAlmacen, iCategoria, iMarca, iModelo, iImpuestoProductoCodigo, iMoneda } from '../../../../interfaces/iTermino';
import { ThemePalette, provideNativeDateAdapter } from '@angular/material/core';
import { ServiceResponse } from '../../../../interfaces/service-response-login';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { Observable, debounceTime, map, of, startWith, switchMap } from 'rxjs';
import { ImpuestosService } from '../../../../services/impuestos.service';
import { Console, log } from 'console';
import { AlmacenService } from '../../../../services/almacen.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { MarcasService } from '../../../../services/marcas.service';
import { ModelosService } from '../../../../services/modelos.service';
import { blob, json } from 'stream/consumers';
declare var $: any;
@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [
    importaciones,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private alertaService: AlertServiceService,
    private msjService: MsjService,
    private productoService: ProductoService,
    private impuestoService: ImpuestosService,
    private almacenService: AlmacenService,
    private usuarioService: UsuarioService,
    private marcaService: MarcasService,
    private modeloService: ModelosService

  ) {
   
    this.getAll();
    //  this.getAllCuentas();
    this.getAllUnidadesFilter('a');
    this.getAllImpuesto();
    this.getAllAlmacenes();
    this.getAllCategorias();
    this.moneda = this.usuarioService.usuarioLogueado.data.sucursal.empresa.moneda;
   


  }

  impuestos = new FormControl('');
  ngOnInit(): void {
  }


  miFormulario: FormGroup = this.fb.group(
    {
      idProducto: this.fb.control(null),
      isProduct: this.fb.control(false, Validators.required),
      idMarca: this.fb.control(null),
      idModelo: this.fb.control(null),
      nombre: this.fb.control("", Validators.required),
      idUnidad: this.fb.control("", Validators.required),
      costoInicial: this.fb.control(0, Validators.required),
      precioBase: this.fb.control(0, Validators.required),
      precioFinal: this.fb.control(0, Validators.required),
      descripcion: this.fb.control('', Validators.required),
      idAlmacen: this.fb.control('', Validators.required),
      cantInicial: this.fb.control(0, Validators.required),
      cantMinima: this.fb.control(0),
      cantMaxima: this.fb.control(0),
      // idCuentaContableParaVenta: this.fb.control(""),
      imagen: this.fb.control(''),
      venderSinUnidades: this.fb.control(false),
      idCategoria: this.fb.control(null),
      idEmpresa: this.fb.control(null),
      filterUnidades: this.fb.control(''),
      impuestos: this.fb.control('', Validators.required),
    });

  // formFilter : FormGroup = this.fb.group(
  //   {
  //     filterUnidades : this.fb.control(''),


  //   }
  // )


  tipoIdentificacion = [
    { nombre: "RNC" },
    { nombre: "Cedula" },
    { nombre: "Pasaporte" },
  ]
  impuestosCodigos: iImpuestoProductoCodigo[] = [];
  impuestosData: iiMpuesto[] = [];
  dataList: iProducto[] = [];
  dataListAlmacenes: iAlmacen[] = [];
  dataListUnidades: iUnidades[] = [];
  dataListCategoria: iCategoria[] = [];
  dataListCuentas: iCuentas[] = [];
  dataListImpuesto: iiMpuesto[] = [];
  dataListMarcas: iMarca[] = [];
  dataListModelos: iModelo[] = [];
  cargando: boolean = false;
  sinRegistros: boolean = false;
  sinRegistrosTxt: string = this.msjService.msjSinRegistros;
  checked = false;
  color: ThemePalette = 'primary';
  disabled = false;
  documentoSeleccionado: any = "";
  selectedFile: File | undefined;
  imageUrl: string | ArrayBuffer | null = null;
  formData = new FormData();
  isProduct: boolean = false;
  impuestoArray: Array<iiMpuesto> = [];
  moneda! : iMoneda;


  uploadFile(file: File) {
    this.formData.append('file', file);

  }

  closeModal() { $("#exampleModal").modal('hide'); }


  insert() {
    console.log(this.miFormulario.value)
    this.alertaService.ShowLoading();
    this.productoService.insert(this.formData).subscribe((data: ServiceResponse) => {

      this.miFormulario.value.impuestos.forEach((a: number) => {
        let imp = new iImpuestoProductoCodigo();
        imp.idProducto = data.data.idProducto;
        imp.idImpuesto = a;
        this.impuestosCodigos.push(imp);
      });

      if (this.impuestosCodigos.length > 0) {
        this.addImpuestos(this.impuestosCodigos);
      }

      setTimeout(() => {
        this.alertaService.successAlert(data.message);
        if (data.status) {
          this.resetForm();
          this.getAll();
          this.closeModal();
        }
      }, 1000);
    })
  }
  async delete(id: any) {
    if (await this.alertaService.questionDelete()) {
      this.alertaService.ShowLoading();
      this.productoService.delete(id).subscribe(((data: ServiceResponse) => {
        if (data.status) {
          this.alertaService.successAlert(data.message);
          this.getAll();
          this.resetForm();
        }
        else {
          this.alertaService.errorAlert(data.message)
        }
      }))
    }



  }
  editar(producto: iProducto) {
    this.miFormulario.reset(producto)
    this.isProduct = producto.isProduct;
    this.getMarcas(this.miFormulario.value.idCategoria)
    this.getModelos(this.miFormulario.value.idMarca)
    this.getAllUnidadesFilter('a');
    this.miFormulario.patchValue({ 'idUnidad': producto.idUnidad })
    this.imageUrl = producto.imagen;
    console.log(producto.impuestos)
    this.miFormulario.patchValue({ impuestos: producto.impuestos })
    console.log(this.miFormulario.value)




    this.productoService.getAllUnidadesFilter(producto.idUnidad.toString()).subscribe((data: any) => {
      this.miFormulario.patchValue({ 'filterUnidades': data.data.find((c: any) => c.idUnidad == producto.idUnidad) })
    })



  }

  update() {
    this.alertaService.ShowLoading();
    this.productoService.update(this.formData).subscribe((data: ServiceResponse) => {

      this.miFormulario.value.impuestos.forEach((a: number) => {
        let imp = new iImpuestoProductoCodigo();
        imp.idProducto = this.miFormulario.value.idProducto;
        imp.idImpuesto = a;
        this.impuestosCodigos.push(imp);
      });
      if (this.impuestosCodigos.length > 0) {
        this.addImpuestos(this.impuestosCodigos);
      }



      setTimeout(() => {
        this.alertaService.successAlert(data.message);
        data.status ? this.resetForm : '';
        this.getAll();
        this.closeModal();
      }, 1000);
    })
  }

  save() {

    console.log(this.miFormulario.value);
    this.formData.append('idEmpresa', this.usuarioService.usuarioLogueado.data.sucursal.idEmpresa)
    this.formData.append('nombre', this.miFormulario.get('nombre')?.value);
    this.formData.append('idProducto', this.miFormulario.get('idProducto')?.value)
    this.formData.append('isProduct', this.miFormulario.get('isProduct')?.value);
    this.formData.append('idUnidad', this.miFormulario.get('idUnidad')?.value);
    this.formData.append('costoInicial', this.miFormulario.get('costoInicial')?.value);
    this.formData.append('precioBase', this.miFormulario.get('precioBase')?.value);
    this.formData.append('precioFinal', this.miFormulario.get('precioFinal')?.value);
    this.formData.append('descripcion', this.miFormulario.get('descripcion')?.value);
    this.formData.append('idAlmacen', this.miFormulario.get('idAlmacen')?.value);
    this.formData.append('cantInicial', this.miFormulario.get('cantInicial')?.value);
    this.formData.append('cantMinima', this.miFormulario.get('cantMinima')?.value);
    this.formData.append('cantMaxima', this.miFormulario.get('cantMaxima')?.value);
    // this.formData.append('idCuentaContableParaVenta', this.miFormulario.get('idCuentaContableParaVenta')?.value);
    this.formData.append('venderSinUnidades', this.miFormulario.get('venderSinUnidades')?.value);
    this.formData.append('idCategoria', this.miFormulario.get('idCategoria')?.value);
    this.formData.append('idMarca', this.miFormulario.get('idMarca')?.value);
    this.formData.append('idModelo', this.miFormulario.get('idModelo')?.value);
    this.impuestoArray = this.miFormulario.value.impuestos;
    console.log(this.impuestoArray);
    if (this.miFormulario.valid) {
      this.miFormulario.get('idProducto')?.value === null ? this.insert() : this.update()

    }
  }

  getAll() {
    this.cargando = true;
    this.productoService.getAll().subscribe((data: any) => {
      this.dataList = data.data;
      this.impuestosCodigos = [];
      console.log(this.dataList)
      if (this.dataList.length > 0) {
        this.sinRegistros = false
        this.cargando = false;
      }
      else {
        this.sinRegistros = true;
        this.cargando = false;
      }
    })
  }
  getAllCuentas() {
    this.productoService.getAllCuentas().subscribe((data: any) => {
      this.dataListUnidades = data.data;
    })
  }

  getAllCategorias() {
    this.productoService.getAllCategorias().subscribe((data: ServiceResponse) => {
      this.dataListCategoria = data.data;
    })
  }

  getAllUnidadesFilter(filter: string) {
    if (filter != null && filter.length > 0) {
      this.productoService.getAllUnidadesFilter(filter).subscribe((data: any) => {
        this.dataListUnidades = data.data;
        console.log(this.miFormulario.value)
      })
    }

  }
  displayFn(producto?: iProducto): string | undefined | any {
    return producto ? producto.nombre : undefined;
  }
  displayFnImpuesto(impuesto?: iiMpuesto): string | undefined | any {
    return impuesto ? impuesto.nombre : undefined;
  }
  getAllFilter(event : any) {
    const filtro = (event.target as HTMLInputElement).value;
    if(filtro=="")
      {
        this.getAll();
      }
      else{
        this.cargando = true;
        this.productoService.getAllFilter(filtro).subscribe((data: any) => {
          this.dataList = data.data;
          if (this.dataList.length > 0) {
            this.sinRegistros = false
            this.cargando = false;
          }
          else {
            this.sinRegistros = true;
            this.cargando = false;
          }
        })
      }

  }

  // getAllFilterByTipo(idTipo : number) {
  //   this.cargando = true;
  //   this.productoService.getByIdTipo(idTipo).subscribe((data: any) => {
  //     this.dataList = data.data;
  //     if (this.dataList.length > 0) {
  //       this.sinRegistros = false
  //       this.cargando = false;
  //     }
  //     else {
  //       this.sinRegistros = true;
  //       this.cargando = false;
  //     }
  //   })
  // }




  resetForm() {
    this.miFormulario.reset();
    this.isProductView(0);
    this.closeModal();
  }


  onFileSelected(event: any) {
    this.formData.append('imagen', (event.target.files[0] as File))
    this.selectedFile = event.target.files[0] as File;
    this.previewImage();
  }
  previewImage() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
    }
  }
  getAllImpuesto() {
    this.impuestoService.getAll().subscribe((data: ServiceResponse) => {
      this.dataListImpuesto = data.data;
    })
  }
  addImpuestos(impuestos: iImpuestoProductoCodigo[]) {
    this.productoService.insertImpuestos(impuestos).subscribe((data: any) => {
      console.log(data)
    })
  }


  setUnidad(event: any) {
    console.log('editando')
    this.miFormulario.patchValue({ "idUnidad": event.option.value.idUnidad })
  }

  //Set precio total controla el impuesto
  contadorExecnto: number = 0;
  setPrecioTotal(accion: number) {
   
    if (accion == 1) {
    
      let Excento = this.dataListImpuesto.filter((c: any) => c.porcentaje == 0 && c.nombre == "Excento");
      if (this.miFormulario.value.impuestos.includes(Excento[0].idImpuesto) == true && this.contadorExecnto == 0) {

        this.miFormulario.patchValue({ 'impuestos': [Excento[0].idImpuesto] })
        this.contadorExecnto = 1;
      }
      else {

        console.log(this.miFormulario.value.impuestos.filter((c: number) => c != Excento[0].idImpuesto))
        this.miFormulario.patchValue({ 'impuestos': this.miFormulario.value.impuestos.filter((c: number) => c != Excento[0].idImpuesto) })
        this.contadorExecnto = 0;
      }

      if (this.miFormulario.value.impuestos.length > 0) {
        let exento = this.dataListImpuesto.find((c: any) => c.porcentaje == 0)
        let acumulador = 0;
        this.dataListImpuesto.forEach(im => {
          if (this.miFormulario.value.impuestos.includes(im.idImpuesto) == true) {
            acumulador += im.porcentaje;
            this.miFormulario.patchValue({'precioFinal': (this.miFormulario.value.precioBase * (acumulador / 100)) + this.miFormulario.value.precioBase })
          }
  
        }
        )
     }
     
    }

    else {
      console.log('else')
      
      this.miFormulario.patchValue({ 'precioFinal': this.miFormulario.value.precioBase })
    }
  
}


  getAllAlmacenes() {
    this.almacenService.getAll().subscribe((data: ServiceResponse) => {
      this.dataListAlmacenes = data.data;
    })
  }

  isProductView(value: number) {
    value == 1 ? this.isProduct = true : this.isProduct = false;
    value == 0 ? this.miFormulario.patchValue({ 'idCategoria': null, 'idMarca': null, 'idModelo': null }) : '';
  }

  getMarcas(idCategoria: number) {
    this.marcaService.getByIdCategoria(idCategoria).subscribe((data: ServiceResponse) => {
      this.dataListMarcas = data.data;
    })
  }

  getModelos(idMarca: number) {
    this.modeloService.getByIdMarca(idMarca).subscribe((data: ServiceResponse) => {
      console.log(data)
      this.dataListModelos = data.data;
    })
  }
}
