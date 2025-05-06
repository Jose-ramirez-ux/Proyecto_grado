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
  ingresos: { 
    nombre: string; 
    valor: number; 
    porcentaje: number; 
    fecha: string;
    tipo: string;
  }[] = [];
  totalIngresos: number = 0;
  chart: any;
  mostrarModal = false;
  nuevoIngreso = { nombre: '', valor: 0, tipo: 'salario' };
  fechaActual: string = '';
  rutaActual: string = ''; 

  constructor(private router: Router) {}

  ngOnInit() {
    this.fechaActual = new Date().toLocaleDateString('es-ES', {
      weekday: 'long', // opcional: "lunes"
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    this.rutaActual = this.router.url;

    this.router.events.subscribe(() => {
      this.rutaActual = this.router.url;
    });

    // Agregar datos de ejemplo como se muestra en la imagen
    this.cargarDatosEjemplo();
  }

  ngAfterViewInit() {
    setTimeout(() => this.inicializarGrafico(), 500);
  }

  cargarDatosEjemplo() {
    const datosEjemplo = [
      { nombre: 'Salario', valor: 1000, tipo: 'salario' },
      { nombre: 'Regalo', valor: 500, tipo: 'regalo' },
      { nombre: 'Venta de dulces', valor: 500, tipo: 'venta' }
    ];

    const fechaIngreso = new Date().toLocaleDateString();
    
    datosEjemplo.forEach(dato => {
      this.ingresos.push({
        nombre: dato.nombre,
        valor: dato.valor,
        porcentaje: 0,  // Se calculará después
        fecha: fechaIngreso,
        tipo: dato.tipo
      });
    });

    // Actualizar porcentajes y gráfico después de cargar datos
    setTimeout(() => this.actualizarGrafico(), 600);
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
          backgroundColor: ['#ff0000', '#000000', '#0000ff'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: { 
            enabled: true 
          }
        }
      },
      plugins: [{
        id: 'centerTextPlugin',
        afterDraw: (chart) => {
          const ctx = chart.ctx;
          ctx.restore();
          ctx.font = "bold 24px Arial";
          ctx.textBaseline = "middle";
          ctx.textAlign = "center";
          ctx.fillStyle = "#000";
          ctx.fillText(`${this.totalIngresos}$`, chart.width / 2, chart.height / 2);
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
      fecha: fechaIngreso,
      tipo: this.nuevoIngreso.tipo
    };

    this.ingresos.push(nuevo);
    this.actualizarGrafico();
    this.nuevoIngreso = { nombre: '', valor: 0, tipo: 'salario' };
    this.mostrarModal = false;
  }

  actualizarGrafico() {
    this.totalIngresos = this.ingresos.reduce((sum, ingreso) => sum + ingreso.valor, 0);
    
    this.ingresos.forEach(ingreso => {
      ingreso.porcentaje = Math.round((ingreso.valor / this.totalIngresos) * 100);
    });

    if (this.chart) {
      this.chart.data.labels = this.ingresos.map(ingreso => ingreso.nombre);
      this.chart.data.datasets[0].data = this.ingresos.map(ingreso => ingreso.valor);
      this.chart.update();
    }
  }

  obtenerIcono(nombre: string): string {
    if (nombre.toLowerCase().includes('salario')) return '💰';
    if (nombre.toLowerCase().includes('regalo')) return '🎁';
    if (nombre.toLowerCase().includes('venta')) return '🛍️';
    return '💸'; // Icono predeterminado
  }

  obtenerColorIcono(nombre: string): string {
    if (nombre.toLowerCase().includes('salario')) return 'red';
    if (nombre.toLowerCase().includes('regalo')) return 'black';
    if (nombre.toLowerCase().includes('venta')) return 'blue';
    return 'black';  // Color predeterminado
  }
}