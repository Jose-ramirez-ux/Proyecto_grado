import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gastos',
  templateUrl: 'gastos.page.html',
  styleUrls: ['gastos.page.scss'],
  standalone: false,
})
export class GastosPage implements OnInit {
  fechaActual: string = '';
  gastos: { nombre: string; valor: number; porcentaje: number; fecha: string }[] = [];
  totalGastos: number = 0;
  chart: any;
  mostrarModal = false;
  nuevoGasto = { nombre: '', valor: 0 };
  paginaActual = 'gastos'; // Para marcar la pestaña activa
  formularioVisible: boolean = false;


  constructor(private router: Router) {}

  ngOnInit() {
    this.fechaActual = new Date().toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    this.inicializarGrafico();
  }

  inicializarGrafico() {
    const ctx = document.getElementById('gastosChart') as HTMLCanvasElement;
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: [],
          datasets: [{
            data: [],
            backgroundColor: ['green', 'orange', 'purple'],
          }]
        },
        options: {
          plugins: {
            tooltip: {
              enabled: true
            }
          }
        },
        plugins: [{
          id: 'centerTextPlugin',
          afterDraw: (chart) => {
            const ctx = chart.ctx;
            const width = chart.width;
            const height = chart.height;
            ctx.restore();
            ctx.font = "bold 20px Arial";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillStyle = "#000";
            ctx.fillText(`$${this.totalGastos}`, width / 2, height / 2);
            ctx.save();
          }
        }]
      });
    } else {
      console.error('No se encontró el canvas para la gráfica de gastos.');
    }
  }

  agregarGasto() {
    if (!this.nuevoGasto.nombre || this.nuevoGasto.valor <= 0) {
      alert("Por favor, ingrese un nombre y un valor válido.");
      return;
    }

    const fechaGasto = new Date().toLocaleDateString();
    const nuevo = {
      nombre: this.nuevoGasto.nombre,
      valor: this.nuevoGasto.valor,
      porcentaje: 0,
      fecha: fechaGasto
    };

    this.gastos.push(nuevo);
    this.actualizarGrafico();
    this.nuevoGasto = { nombre: '', valor: 0 };
    this.mostrarModal = false;
  }

  actualizarGrafico() {
    this.totalGastos = this.gastos.reduce((sum, gasto) => sum + gasto.valor, 0);
    
    this.gastos.forEach(gasto => {
      gasto.porcentaje = parseFloat(((gasto.valor / this.totalGastos) * 100).toFixed(1));
    });

    if (this.chart) {
      this.chart.data.labels = this.gastos.map(gasto => gasto.nombre);
      this.chart.data.datasets[0].data = this.gastos.map(gasto => gasto.valor);
      this.chart.update();
    }
  }

  irA(pagina: string) {
    this.paginaActual = pagina;
    this.router.navigate([`/${pagina}`]);
  }

  mostrarFormulario() {
    this.formularioVisible = true;
  }

  cerrarFormulario() {
    this.formularioVisible = false;
  }
}
