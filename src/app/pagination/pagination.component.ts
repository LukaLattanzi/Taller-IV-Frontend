// Importaciones necesarias para el funcionamiento del componente
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Componente de Paginación Reutilizable
 * Proporciona funcionalidad de paginación para listados de datos
 * Recibe parámetros de entrada y emite eventos para comunicación con componentes padre
 */
@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule], // Módulo necesario para directivas comunes de Angular
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  /**
   * Propiedad de entrada: número de página actual
   * Recibida desde el componente padre para mostrar la página activa
   */
  @Input() currentPage: number = 1;

  /**
   * Propiedad de entrada: total de páginas disponibles
   * Utilizada para calcular el rango de páginas a mostrar
   */
  @Input() totalPages: number = 1;

  /**
   * Evento de salida: emite el número de página seleccionada
   * Permite comunicación hacia el componente padre cuando cambia la página
   */
  @Output() pageChange = new EventEmitter<number>;

  /**
   * Getter que genera un array de números de página
   * Crea dinámicamente los números de página basado en el total de páginas
   * @returns Array de números de página del 1 al totalPages
   */
  //method to generate page numbers
  get pageNumbers() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /**
   * Método para manejar el cambio de página
   * Valida que la página esté dentro del rango válido antes de emitir el evento
   * @param page - Número de página seleccionada por el usuario
   * @returns void
   */
  //method to handle page change
  onPageChange(page: number): void {
    // Validar que la página esté dentro del rango permitido (1 a totalPages)
    if (page >= 1 && page <= this.totalPages) {
      // Emitir evento con el número de página para que el componente padre lo maneje
      this.pageChange.emit(page)
    }
  }

}
