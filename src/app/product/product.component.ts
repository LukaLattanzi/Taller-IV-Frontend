// Importaciones necesarias para el funcionamiento del componente
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

/**
 * Componente de Gestión de Productos
 * Maneja la visualización, paginación y operaciones CRUD de productos
 * Incluye navegación a páginas de creación y edición de productos
 */
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, PaginationComponent], // Módulos para directivas comunes y componente de paginación
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {

  /**
   * Constructor del componente
   * @param apiService - Servicio para realizar operaciones con la API
   * @param router - Servicio de navegación entre rutas
   */
  constructor(private apiService: ApiService, private router: Router) { }
  /**
   * Array que almacena todos los productos para la página actual
   */
  products: any[] = [];

  /**
   * Variable para mostrar mensajes de éxito o error al usuario
   */
  message: string = '';

  /**
   * Número de página actual para la paginación
   */
  currentPage: number = 1;

  /**
   * Total de páginas calculado basado en el número de productos
   */
  totalPages: number = 0;

  /**
   * Número de productos a mostrar por página
   */
  itemsPerPage: number = 10;

  /**
   * Hook de ciclo de vida que se ejecuta después de la inicialización del componente
   * Carga automáticamente la lista de productos
   */
  ngOnInit(): void {
    this.fetchProducts();
  }

  /**
   * Método para obtener y paginar los productos desde la API
   * Calcula el total de páginas y aplica paginación del lado del cliente
   * @returns void
   */
  fetchProducts(): void {
    this.apiService.getAllProducts().subscribe({
      // Manejo de respuesta exitosa
      next: (res: any) => {
        // Obtener array de productos o array vacío si no existen
        const products = res.products || [];
        console.log(products[0].imageUrl)

        // Calcular total de páginas basado en productos totales e items por página
        this.totalPages = Math.ceil(products.length / this.itemsPerPage);

        // Aplicar paginación: obtener productos para la página actual
        this.products = products.slice(
          (this.currentPage - 1) * this.itemsPerPage,
          this.currentPage * this.itemsPerPage
        );

      },
      // Manejo de errores en la obtención de productos
      error: (error) => {
        this.showMessage(
          error?.error?.message ||
          error?.message ||
          'Unable to edit category' + error
        );
      },
    });
  }

  /**
   * Método para eliminar un producto
   * Solicita confirmación del usuario antes de proceder con la eliminación
   * @param productId - ID del producto a eliminar
   * @returns void
   */
  handleProductDelete(productId: string): void {
    // Mostrar diálogo de confirmación antes de eliminar
    if (window.confirm('Are you sure you want to delete this product?')) {
      // Proceder con la eliminación si el usuario confirma
      this.apiService.deleteProduct(productId).subscribe({
        // Manejo de respuesta exitosa
        next: (res: any) => {
          if (res.status === 200) {
            this.showMessage('Product deleted successfully');
            // Recargar la lista de productos para reflejar los cambios
            this.fetchProducts(); //reload the products
          }
        },
        // Manejo de errores en la eliminación
        error: (error) => {
          this.showMessage(
            error?.error?.message ||
            error?.message ||
            'Unable to Delete product' + error
          );
        },
      });
    }
  }

  /**
   * Método para manejar el cambio de página en la paginación
   * Actualiza la página actual y recarga los productos correspondientes
   * @param page - Número de página a la que se va a navegar
   * @returns void
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchProducts();
  }

  /**
   * Método para navegar a la página de agregar nuevo producto
   * Utiliza el router para redireccionar a la ruta de creación
   * @returns void
   */
  navigateToAddProductPage(): void {
    this.router.navigate(['/add-product']);
  }

  /**
   * Método para navegar a la página de edición de producto
   * Utiliza el router para redireccionar a la ruta de edición con el ID del producto
   * @param productId - ID del producto que se va a editar
   * @returns void
   */
  navigateToEditProductPage(productId: string): void {
    this.router.navigate([`/edit-product/${productId}`]);
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