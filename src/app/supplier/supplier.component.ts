// Importaciones necesarias para el funcionamiento del componente
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

/**
 * Componente de Gestión de Proveedores
 * Maneja la visualización y operaciones CRUD de proveedores
 * Incluye navegación a páginas de creación y edición de proveedores
 */
@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [CommonModule], // Módulo necesario para directivas comunes de Angular
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css',
})
export class SupplierComponent implements OnInit {

  /**
   * Constructor del componente
   * @param apiService - Servicio para realizar operaciones con la API
   * @param router - Servicio de navegación entre rutas
   */
  constructor(private apiService: ApiService, private router: Router) { }

  /**
   * Array que almacena todos los proveedores obtenidos desde la API
   */
  suppliers: any[] = [];

  /**
   * Variable para mostrar mensajes de éxito o error al usuario
   */
  message: string = '';

  /**
   * Hook de ciclo de vida que se ejecuta después de la inicialización del componente
   * Carga automáticamente la lista de proveedores
   */
  ngOnInit(): void {
    this.getSuppliers();
  }

  /**
   * Método para obtener todos los proveedores desde la API
   * Actualiza el array local de proveedores con los datos del servidor
   * @returns void
   */
  getSuppliers(): void {
    this.apiService.getAllSuppliers().subscribe({
      // Manejo de respuesta exitosa
      next: (res: any) => {
        if (res.status === 200) {
          // Asignar los proveedores obtenidos al array local
          this.suppliers = res.suppliers;
        } else {
          // Mostrar mensaje si la respuesta no es exitosa
          this.showMessage(res.message);
        }
      },
      // Manejo de errores en la obtención de proveedores
      error: (error) => {
        this.showMessage(
          error?.error?.message ||
          error?.message ||
          'No se pudo obtener la lista de proveedores' + error
        );
      },
    });
  }

  /**
   * Método para navegar a la página de agregar nuevo proveedor
   * Utiliza el router para redireccionar a la ruta de creación
   * @returns void
   */
  //Navigate to ass supplier Page
  navigateToAddSupplierPage(): void {
    this.router.navigate([`/add-supplier`]);
  }

  /**
   * Método para navegar a la página de edición de proveedor
   * Utiliza el router para redireccionar a la ruta de edición con el ID del proveedor
   * @param supplierId - ID del proveedor que se va a editar
   * @returns void
   */
  //Navigate to edit supplier Page
  navigateToEditSupplierPage(supplierId: string): void {
    this.router.navigate([`/edit-supplier/${supplierId}`]);
  }

  /**
   * Método para eliminar un proveedor
   * Solicita confirmación del usuario antes de proceder con la eliminación
   * @param supplierId - ID del proveedor a eliminar
   * @returns void
   */
  //Delete a caetgory
  handleDeleteSupplier(supplierId: string): void {
    // Mostrar diálogo de confirmación antes de eliminar
    if (window.confirm("¿Estás seguro de que deseas eliminar este proveedor?")) {
      // Proceder con la eliminación si el usuario confirma
      this.apiService.deleteSupplier(supplierId).subscribe({
        // Manejo de respuesta exitosa
        next: (res: any) => {
          if (res.status === 200) {
            this.showMessage("Proveedor eliminado con éxito");
            // Recargar la lista de proveedores para reflejar los cambios
            this.getSuppliers(); //reload the category
          }
        },
        // Manejo de errores en la eliminación
        error: (error) => {
          this.showMessage(error?.error?.message || error?.message || "No se pudo eliminar el proveedor" + error)
        }
      })
    }
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
