// Importación de módulos y servicios necesarios de Angular
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';  // Módulo para gráficos y visualizaciones
import { ApiService } from '../service/api.service'; // Servicio para interactuar con la API
import { FormsModule } from '@angular/forms'; // Módulo de formularios para two-way binding

/**
 * Componente Dashboard
 * 
 * Este componente es responsable de mostrar el panel de control principal
 * del sistema de inventario, incluyendo gráficos estadísticos y análisis
 * de transacciones. Proporciona visualizaciones interactivas de datos
 * como gráficos de barras y circulares para análisis de tendencias.
 */
@Component({
  selector: 'app-dashboard', // Selector del componente
  standalone: true, // Marca este componente como standalone (no necesita NgModule)
  imports: [CommonModule, NgxChartsModule, FormsModule], // Importa otros módulos requeridos
  templateUrl: './dashboard.component.html', // Template HTML del componente
  styleUrl: './dashboard.component.css', // Estilos CSS del componente
})

export class DashboardComponent {
  // Propiedades para almacenar datos de transacciones y datos de gráficos
  transactions: any[] = []; // Array que contiene todas las transacciones
  transactionTypeData: any[] = []; // Datos para gráfico que muestra conteo de transacciones por tipo
  transactionAmountData: any[] = []; // Datos para gráfico que muestra monto total por tipo de transacción
  monthlyTransactionData: any[] = []; // Datos para gráfico que muestra totales diarios del mes seleccionado

  /**
   * Lista de meses del año
   * Utilizada para el selector de mes en el filtro de datos mensuales
   */
  months = [
    { name: 'Enero', value: '01' },
    { name: 'Febrero', value: '02' },
    { name: 'Marzo', value: '03' },
    { name: 'Abril', value: '04' },
    { name: 'Mayo', value: '05' },
    { name: 'Junio', value: '06' },
    { name: 'Julio', value: '07' },
    { name: 'Agosto', value: '08' },
    { name: 'Septiembre', value: '09' },
    { name: 'Octubre', value: '10' },
    { name: 'Noviembre', value: '11' },
    { name: 'Diciembre', value: '12' },
  ];

  // Array que almacena los años (últimos 10 años desde el año actual)
  years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  // Mes y año seleccionados para filtrar datos mensuales
  selectedMonth = '';
  selectedYear = '';

  // Configuración de dimensiones, leyenda y animaciones de los gráficos
  view: [number, number] = [700, 400];  // Tamaño del gráfico: ancho x alto
  showLegend = true;  // Mostrar leyenda del gráfico
  showLabels = true;  // Mostrar etiquetas en el gráfico
  animations = true;  // Habilitar animaciones del gráfico

  /**
   * Constructor del componente
   * @param apiService - Servicio inyectado para realizar llamadas a la API
   */
  constructor(private apiService: ApiService) { }

  /**
   * Hook del ciclo de vida ngOnInit
   * Se ejecuta cuando el componente se inicializa.
   * Carga las transacciones iniciales para mostrar en el dashboard.
   */
  ngOnInit(): void {
    this.loadTransactions(); // Cargar transacciones cuando el componente se inicializa
  }

  /**
   * Método para obtener todas las transacciones desde la API
   * Realiza una llamada al servicio API para cargar los datos
   * y procesa la información para generar los gráficos.
   */
  loadTransactions(): void {
    this.apiService.getAllTransactions('').subscribe((data) => {
      this.transactions = data.transactions; // Almacenar datos de transacciones
      this.processChartData(); // Procesar datos para generar gráficos
    });
  }

  /**
   * Método para procesar datos de transacciones para gráficos por tipo y por monto
   * 
   * Este método analiza todas las transacciones y genera dos conjuntos de datos:
   * 1. Conteo de transacciones por tipo (Venta, Compra, etc.)
   * 2. Suma de montos totales por tipo de transacción
   * 
   * Los datos procesados se utilizan para renderizar gráficos circulares y de barras.
   */
  processChartData(): void {
    // Objeto para contar el número de transacciones por tipo
    const typeCounts: { [key: string]: number } = {};

    // Objeto para sumar los montos de transacciones por tipo
    const amountByType: { [key: string]: number } = {};

    // Iterar a través de cada transacción para calcular totales por tipo
    this.transactions.forEach((transaction) => {
      const type = transaction.transactionType; // Obtener el tipo de transacción
      typeCounts[type] = (typeCounts[type] || 0) + 1; // Contar transacciones por tipo
      amountByType[type] = (amountByType[type] || 0) + transaction.totalPrice; // Sumar montos por tipo
    });

    // Preparar datos para gráfico que muestra número de transacciones por tipo
    this.transactionTypeData = Object.keys(typeCounts).map((type) => ({
      name: type,
      value: typeCounts[type],
    }));

    // Preparar datos para gráfico que muestra monto total de transacciones por tipo
    this.transactionAmountData = Object.keys(amountByType).map((type) => ({
      name: type,
      value: amountByType[type],
    }));
  }

  /**
   * Método para cargar datos de transacciones de un mes y año específicos
   * 
   * Este método filtra las transacciones por el mes y año seleccionados
   * por el usuario. Actualiza tanto los gráficos generales como el gráfico
   * de análisis diario para el período seleccionado.
   */
  loadMonthlyData(): void {
    // Si no se ha seleccionado mes o año, salir de la función
    if (!this.selectedMonth || !this.selectedYear) {
      return;
    }

    // Llamar a la API para obtener transacciones del mes y año seleccionados
    this.apiService
      .getTransactionsByMonthAndYear(
        Number.parseInt(this.selectedMonth), // Convertir string de mes a número
        Number.parseInt(this.selectedYear) // Convertir string de año a número
      )
      .subscribe((data) => {
        this.transactions = data.transactions; // Almacenar transacciones del mes seleccionado
        this.processChartData(); // Procesar datos generales para gráficos
        this.processMonthlyData(data.transactions); // Procesar datos para gráfico diario
      });
  }

  /**
   * Método para procesar datos de transacciones diarias del mes seleccionado
   * 
   * Este método analiza las transacciones del mes filtrado y genera
   * un conjunto de datos que muestra los totales por día, útil para
   * identificar patrones y tendencias de ventas/compras diarias.
   * 
   * @param transactions - Array de transacciones del mes seleccionado
   */
  processMonthlyData(transactions: any[]): void {
    // Objeto para almacenar totales diarios (clave = día, valor = monto total)
    const dailyTotals: { [key: string]: number } = {};

    // Iterar a través de cada transacción y acumular totales para cada día
    transactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt).getDate().toString(); // Obtener el día de la fecha de transacción
      dailyTotals[date] = (dailyTotals[date] || 0) + transaction.totalPrice; // Sumar totales diarios
    });

    // Preparar datos para gráfico que muestra totales diarios del mes seleccionado
    this.monthlyTransactionData = Object.keys(dailyTotals).map((day) => ({
      name: `Día ${day}`,
      value: dailyTotals[day],
    }));
  }
}
