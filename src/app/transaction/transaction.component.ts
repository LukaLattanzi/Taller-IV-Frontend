// Importaciones necesarias para el funcionamiento del componente
import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

/**
 * Componente de Gestión de Transacciones
 * Maneja la visualización, búsqueda y paginación de transacciones del sistema
 * Permite consultar detalles específicos de cada transacción
 */
@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [PaginationComponent, FormsModule, CommonModule], // Módulos para paginación, formularios y directivas comunes
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent implements OnInit {

  /**
   * Constructor del componente
   * @param apiService - Servicio para realizar operaciones con la API
   * @param router - Servicio de navegación entre rutas
   */
  constructor(private apiService: ApiService, private router: Router) { }

  /**
   * Array que almacena las transacciones para la página actual
   */
  transactions: any[] = [];

  /**
   * Variable para mostrar mensajes de éxito o error al usuario
   */
  message: string = '';

  /**
   * Valor del campo de entrada para búsqueda (binding con el input)
   */
  searchInput: string = '';

  /**
   * Valor actual utilizado para filtrar las transacciones
   */
  valueToSearch: string = '';

  /**
   * Número de página actual para la paginación
   */
  currentPage: number = 1;

  /**
   * Total de páginas calculado basado en el número de transacciones
   */
  totalPages: number = 0;

  /**
   * Número de transacciones a mostrar por página
   */
  itemsPerPage: number = 10;

  /**
   * Hook de ciclo de vida que se ejecuta después de la inicialización del componente
   * Carga automáticamente la lista de transacciones
   */
  ngOnInit(): void {
    this.loadTransactions();
  }

  /**
   * Método para cargar y paginar las transacciones desde la API
   * Aplica filtros de búsqueda y calcula la paginación del lado del cliente
   * @returns void
   */
  loadTransactions(): void {
    this.apiService.getAllTransactions(this.valueToSearch).subscribe({
      // Manejo de respuesta exitosa
      next: (res: any) => {
        // Obtener array de transacciones o array vacío si no existen
        const transactions = res.transactions || [];

        // Calcular total de páginas basado en transacciones totales e items por página
        this.totalPages = Math.ceil(transactions.length / this.itemsPerPage);

        // Aplicar paginación: obtener transacciones para la página actual
        this.transactions = transactions.slice(
          (this.currentPage - 1) * this.itemsPerPage,
          this.currentPage * this.itemsPerPage
        );

      },
      // Manejo de errores en la obtención de transacciones
      error: (error) => {
        this.showMessage(
          error?.error?.message ||
          error?.message ||
          'Unable to Get all Transactions ' + error
        );
      },
    });
  }

  /**
   * Método para manejar la búsqueda de transacciones
   * Reinicia la paginación y aplica el nuevo filtro de búsqueda
   * @returns void
   */
  handleSearch(): void {
    // Reiniciar a la primera página cuando se realiza una nueva búsqueda
    this.currentPage = 1;
    // Asignar el valor del input al filtro de búsqueda
    this.valueToSearch = this.searchInput;
    // Recargar las transacciones con el nuevo filtro
    this.loadTransactions()
  }

  /**
   * Método para navegar a la página de detalles de una transacción específica
   * Utiliza el router para redireccionar con el ID de la transacción
   * @param transactionId - ID de la transacción cuyos detalles se van a consultar
   * @returns void
   */
  navigateTOTransactionsDetailsPage(transactionId: string): void {
    this.router.navigate([`/transaction/${transactionId}`])
  }

  /**
   * Método para manejar el cambio de página en la paginación
   * Actualiza la página actual y recarga las transacciones correspondientes
   * @param page - Número de página a la que se va a navegar
   * @returns void
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTransactions();
  }

  /**
   * Método utilitario para mostrar mensajes temporales al usuario
   * Los mensajes se ocultan automáticamente después de 4 segundos
   * @param message - El mensaje a mostrar al usuario
   */
  showMessage(message: string) {
    // Asignar el mensaje a la variable para mostrarlo en el template
    this.message = message;
    // Configurar timeout para limpiar el mensaje después de 4 segundos
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }
}
