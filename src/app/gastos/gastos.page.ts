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
  fechaDia: string = '';
  fechaMes: string = '';
  gastos: {
    nombre: string;
    valor: number;
    porcentaje: number;
    fecha: string;
    color: string;
    icono: string;
  }[] = [];
  totalGastos: number = 0;
  chart: any;
  paginaActual = 'gastos'; // Para marcar la pestaña activa
  formularioVisible: boolean = false;
  nuevoGasto = {
    nombre: '',
    valor: 0,
    icono: '🏠',
    color: ''
  };

  // Colores para los diferentes gastos
  colores = [
    '#000000', // Negro para Casa
    '#FF0000', // Rojo para gastos principales
    '#0000FF', // Azul para otros gastos
    '#FFA500', // Naranja
    '#800080', // Púrpura
    '#008000', // Verde
    '#FF00FF', // Magenta
  ];

  // Mapeo de iconos a colores
  iconoColores: { [key: string]: string } = {
    '🏠': '#000000',
    '🍔': '#0000FF',
    '👕': '#FF0000',
    '💊': '#008000',
    '🚗': '#FFA500',
    '📱': '#800080',
    '🎮': '#FF00FF'
  };

  constructor(private router: Router) {}

  ngOnInit() {
    // Inicializar la fecha
    this.configurarFecha();

    // Inicializar con algunos gastos de ejemplo
    this.inicializarGastosEjemplo();

    // Inicializar el gráfico después de que la vista se haya cargado
    setTimeout(() => {
      this.inicializarGrafico();
    }, 100);
  }

  configurarFecha() {
    const fecha = new Date();

    // Obtener el día del mes (número)
    this.fechaDia = fecha.getDate().toString();

    // Obtener el nombre del mes en español
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    this.fechaMes = meses[fecha.getMonth()];

    // Formatear la fecha completa para uso interno
    this.fechaActual = fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  inicializarGastosEjemplo() {
    // Datos de ejemplo que coinciden con la imagen
    this.gastos = [
      {
        nombre: 'Casa',
        valor: 40,
        porcentaje: 50,
        fecha: this.fechaActual,
        color: '#000000',
        icono: '🏠'
      },
      {
        nombre: 'Comida',
        valor: 250,
        porcentaje: 25,
        fecha: this.fechaActual,
        color: '#0000FF',
        icono: '🍔'
      },
      {
        nombre: 'Ropa',
        valor: 250,
        porcentaje: 25,
        fecha: this.fechaActual,
        color: '#FF0000',
        icono: '👕'
      }
    ];

    this.totalGastos = this.gastos.reduce((sum, gasto) => sum + gasto.valor, 0);
  }

  inicializarGrafico() {
    const ctx = document.getElementById('gastosChart') as HTMLCanvasElement;

    if (!ctx) {
      console.error('No se encontró el canvas para la gráfica de gastos.');
      return;
    }

    // Destruir el gráfico existente si hay uno
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.gastos.map(gasto => gasto.nombre),
        datasets: [{
          data: this.gastos.map(gasto => gasto.valor),
          backgroundColor: this.gastos.map(gasto => gasto.color),
          borderWidth: 0,
          hoverOffset: 5
        }]
      },
      options: {
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.formattedValue;
                return `${label}: ${value}$`;
              }
            }
          }
        }
      },
      plugins: [{
        id: 'centerTextPlugin',
        beforeDraw: (chart) => {
          const ctx = chart.ctx;
          const width = chart.width;
          const height = chart.height;

          ctx.restore();
          ctx.font = "bold 24px Arial";
          ctx.textBaseline = "middle";
          ctx.textAlign = "center";
          ctx.fillStyle = "#000";
          ctx.fillText(`${this.totalGastos}$`, width / 2, height / 2);
          ctx.save();
        }
      }]
    });
  }

  mostrarFormulario() {
    this.formularioVisible = true;
  }

  cerrarFormulario() {
    this.formularioVisible = false;
    this.nuevoGasto = { nombre: '', valor: 0, icono: '🏠', color: '' };
  }

  agregarGasto() {
    if (!this.nuevoGasto.nombre || this.nuevoGasto.valor <= 0) {
      alert("Por favor, ingrese un nombre y un valor válido.");
      return;
    }

    // Asignar color basado en el icono seleccionado
    const color = this.iconoColores[this.nuevoGasto.icono] || this.getRandomColor();

    const nuevo = {
      nombre: this.nuevoGasto.nombre,
      valor: this.nuevoGasto.valor,
      porcentaje: 0, // Será calculado
      fecha: this.fechaActual,
      color: color,
      icono: this.nuevoGasto.icono
    };

    this.gastos.push(nuevo);
    this.actualizarGrafico();
    this.cerrarFormulario();
  }

  actualizarGrafico() {
    // Recalcular el total
    this.totalGastos = this.gastos.reduce((sum, gasto) => sum + gasto.valor, 0);

    // Recalcular porcentajes
    this.gastos.forEach(gasto => {
      gasto.porcentaje = parseFloat(((gasto.valor / this.totalGastos) * 100).toFixed(1));
    });

    // Actualizar gráfico
    if (this.chart) {
      this.chart.data.labels = this.gastos.map(gasto => gasto.nombre);
      this.chart.data.datasets[0].data = this.gastos.map(gasto => gasto.valor);
      this.chart.data.datasets[0].backgroundColor = this.gastos.map(gasto => gasto.color);
      this.chart.update();
    }
  }

  getRandomColor() {
    // Seleccionar un color aleatorio de la lista de colores disponibles
    return this.colores[Math.floor(Math.random() * this.colores.length)];
  }
}
