import { Component, ElementRef, ViewChild } from '@angular/core';
import { FacturaService } from '../../../../services/factura.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { ServiceResponse } from '../../../../interfaces/service-response-login';
import { iResumenFacturas } from '../../../../interfaces/iTermino';
import { importaciones } from '../../../utilities/material/material';
import * as echarts from 'echarts';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    importaciones
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  myChart :  any;
  @ViewChild('graficauno') graficauno!: ElementRef;
  constructor(
    private facturaService: FacturaService,
    private usuarioService: UsuarioService
  ) {

      console.log(this.graficauno);
      this.moneda = usuarioService.usuarioLogueado.data.sucursal.empresa.moneda.simbolo;
      this.getResumenVentas();
  
  };
  ngAfterViewInit() {
    console.log(this.graficauno.nativeElement)
    this.showGraphy();
  }
  dataResumen!: iResumenFacturas;
  moneda : string ="";

  getResumenVentas() {
    this.facturaService.getResumenFacturas(this.usuarioService.usuarioLogueado.data.sucursal.idSucursal).subscribe((data: ServiceResponse) => {
      this.dataResumen = data.data;
    })
  }
  showGraphy(){
    this.myChart=echarts.init(this.graficauno.nativeElement);
    this.myChart.setOption({
      title: {
        text: 'Total de las ventas',

      },
      tooltip: {},
      xAxis: {
        data: ['shirt', 'cardigan', 'chiffon', 'pants', 'heels', 'socks']
      },
      yAxis: {},
      series: [
        {
          name: 'sales',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    });
  }
  




}
