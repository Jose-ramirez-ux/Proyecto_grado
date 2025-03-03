import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, AfterViewInit {
  ingresos: { nombre: string; valor: number; porcentaje: number; fecha: string }[] = [];
  totalIngresos: number = 0;
  chart: any;
  mostrarModal = false;
  nuevoIngreso = { nombre: '', valor: 0 };
  fechaActual: string = '';
  rutaActual: string = ''; 

  constructor(private router: Router) {}

  ngOnInit() {
    this.fechaActual = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    this.rutaActual = this.router.url;

    this.router.events.subscribe(() => {
      this.rutaActual = this.router.url;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.inicializarGrafico(), 500);
  }

  inicializarGrafico() {
    const ctx = document.getElementById('incomeChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: ['red', 'blue', 'black'],
        }]
      },
      options: {
        plugins: {
          tooltip: { enabled: true }
        }
      },
      plugins: [{
        id: 'centerTextPlugin',
        afterDraw: (chart) => {
          const ctx = chart.ctx;
          ctx.restore();
          ctx.font = "bold 20px Arial";
          ctx.textBaseline = "middle";
          ctx.textAlign = "center";
          ctx.fillStyle = "#000";
          ctx.fillText(`$${this.totalIngresos}`, chart.width / 2, chart.height / 2);
          ctx.save();
        }
      }]
    });
  }

  mostrarFormulario() { this.mostrarModal = true; }
  cerrarFormulario() { this.mostrarModal = false; }

  agregarIngreso() {
    if (!this.nuevoIngreso.nombre || this.nuevoIngreso.valor <= 0) {
      alert("Por favor, ingrese un nombre y un valor válido.");
      return;
    }

    const fechaIngreso = new Date().toLocaleDateString();
    const nuevo = {
      nombre: this.nuevoIngreso.nombre,
      valor: this.nuevoIngreso.valor,
      porcentaje: 0,
      fecha: fechaIngreso
    };

    this.ingresos.push(nuevo);
    this.actualizarGrafico();
    this.nuevoIngreso = { nombre: '', valor: 0 };
    this.mostrarModal = false;
  }

  actualizarGrafico() {
    this.totalIngresos = this.ingresos.reduce((sum, ingreso) => sum + ingreso.valor, 0);
    
    this.ingresos.forEach(ingreso => {
      ingreso.porcentaje = parseFloat(((ingreso.valor / this.totalIngresos) * 100).toFixed(1));
    });

    this.chart.data.labels = this.ingresos.map(ingreso => ingreso.nombre);
    this.chart.data.datasets[0].data = this.ingresos.map(ingreso => ingreso.valor);
    this.chart.update();
  }

  irA(pagina: string) {
    this.router.navigate([`/${pagina}`]);
  }
}
