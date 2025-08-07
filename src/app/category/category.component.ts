// Importaciones necesarias para el funcionamiento del componente
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

/**
 * Interfaz que define la estructura de una categoría
 * @interface Category
 */
interface Category {
  id: string,
  name: string
}

/**
 * Componente de Gestión de Categorías
 * Permite crear, leer, actualizar y eliminar categorías de productos
 * Implementa operaciones CRUD completas para la gestión de categorías
 */
@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule], // Módulos para directivas comunes y manejo de formularios
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})

export class CategoryComponent implements OnInit {

  /**
   * Array que almacena todas las categorías obtenidas desde la API
   */
  categories: Category[] = [];

  /**
   * Nombre de la categoría para crear o editar
   */
  categoryName: string = '';

  /**
   * Variable para mostrar mensajes de éxito o error al usuario
   */
  message: string = '';

  /**
   * Bandera que indica si se está en modo edición
   */
  isEditing: boolean = false;

  /**
   * ID de la categoría que se está editando actualmente
   */
  editingCategoryId: string | null = null;

  /**
   * Constructor del componente
   * @param apiService - Servicio para realizar operaciones CRUD con la API
   */
  constructor(private apiService: ApiService) { }

  /**
   * Hook de ciclo de vida que se ejecuta después de la inicialización del componente
   * Carga automáticamente todas las categorías disponibles
   */
  ngOnInit(): void {
    this.getCategories();
  }

  /**
   * Método para obtener todas las categorías desde la API
   * Actualiza el array local de categorías con los datos del servidor
   * @returns void
   */
  getCategories(): void {
    this.apiService.getAllCategory().subscribe({
      // Manejo de respuesta exitosa
      next: (res: any) => {
        if (res.status === 200) {
          // Asignar las categorías obtenidas al array local
          this.categories = res.categories;
        }
      },
      // Manejo de errores en la obtención de categorías
      error: (error) => {
        this.showMessage(error?.error?.message || error?.message || "No se pudo obtener todas las categorías" + error)
      }
    })
  }


  /**
   * Método para agregar una nueva categoría
   * Valida que el nombre no esté vacío y envía los datos a la API
   * @returns void
   */
  addCategory(): void {
    // Validación: verificar que el nombre de la categoría no esté vacío
    if (!this.categoryName) {
      this.showMessage("El nombre de la categoría es obligatorio");
      return;
    }

    // Enviar petición para crear nueva categoría
    this.apiService.createCategory({ name: this.categoryName }).subscribe({
      // Manejo de respuesta exitosa
      next: (res: any) => {
        if (res.status === 200) {
          this.showMessage("Categoria creada correctamente")
          // Limpiar el campo de entrada
          this.categoryName = '';
          // Recargar la lista de categorías para mostrar la nueva
          this.getCategories();
        }
      },
      // Manejo de errores en la creación
      error: (error) => {
        this.showMessage(error?.error?.message || error?.message || "No se pudo guardar la categoría" + error)
      }
    })
  }

  /**
   * Método para actualizar una categoría existente
   * Requiere que esté en modo edición y que haya un ID y nombre válidos
   * @returns void
   */
  editCategory(): void {
    // Validación: verificar que hay una categoría seleccionada para editar y un nombre válido
    if (!this.editingCategoryId || !this.categoryName) {
      return;
    }

    // Enviar petición para actualizar la categoría
    this.apiService.updateCategory(this.editingCategoryId, { name: this.categoryName }).subscribe({
      // Manejo de respuesta exitosa
      next: (res: any) => {
        if (res.status === 200) {
          this.showMessage("Category updated successfully")
          // Limpiar el formulario y salir del modo edición
          this.categoryName = '';
          this.isEditing = false;
          // Recargar la lista para mostrar los cambios
          this.getCategories();
        }
      },
      // Manejo de errores en la actualización
      error: (error) => {
        this.showMessage(error?.error?.message || error?.message || "No se pudo editar la categoría" + error)
      }
    })
  }

  /**
   * Método para preparar la edición de una categoría
   * Activa el modo edición y precarga los datos en el formulario
   * @param category - La categoría que se va a editar
   * @returns void
   */
  handleEditCategory(category: Category): void {
    // Activar modo edición
    this.isEditing = true;
    // Guardar el ID de la categoría a editar
    this.editingCategoryId = category.id;
    // Precargar el nombre actual en el campo de entrada
    this.categoryName = category.name
  }

  /**
   * Método para eliminar una categoría
   * Solicita confirmación del usuario antes de proceder con la eliminación
   * @param caetgoryId - ID de la categoría a eliminar
   * @returns void
   */
  handleDeleteCategory(categoryId: string): void {
    // Mostrar diálogo de confirmación antes de eliminar
    if (window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      // Proceder con la eliminación si el usuario confirma
      this.apiService.deleteCategory(categoryId).subscribe({
        // Manejo de respuesta exitosa
        next: (res: any) => {
          if (res.status === 200) {
            this.showMessage("Categoría eliminada correctamente")
            // Recargar la lista de categorías para reflejar los cambios
            this.getCategories(); //reload the category
          }
        },
        // Manejo de errores en la eliminación
        error: (error) => {
          this.showMessage(error?.error?.message || error?.message || "No se pudo eliminar la categoría" + error)
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
      this.message = ''
    }, 4000)
  }
}
