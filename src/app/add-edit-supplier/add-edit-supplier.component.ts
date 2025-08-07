// Importaciones de Angular Core y módulos necesarios
import { CommonModule } from '@angular/common'; // Directivas comunes como *ngIf, *ngFor
import { Component, OnInit } from '@angular/core'; // Decorador Component e interfaz OnInit
import { FormsModule } from '@angular/forms'; // Para formularios y two-way binding
import { Router, RouterLink } from '@angular/router'; // Para navegación programática y enlaces
import { ApiService } from '../service/api.service'; // Servicio para comunicación con la API

/**
 * Componente AddEditSupplierComponent
 * 
 * Este componente maneja tanto la creación de nuevos proveedores como la edición
 * de proveedores existentes en el sistema de gestión de inventario. Su funcionalidad
 * dual se determina por la presencia o ausencia de un ID en la URL.
 * 
 * Funcionalidades principales:
 * - Detección automática del modo (agregar/editar) basado en parámetros de URL
 * - Creación de nuevos proveedores con validación de campos
 * - Edición de proveedores existentes con carga previa de datos
 * - Validación de formularios antes del envío
 * - Navegación automática después de operaciones exitosas
 * - Manejo de errores específicos para operaciones de proveedores
 * - Interfaz unificada para ambos modos de operación
 * - Feedback visual al usuario mediante mensajes temporales
 */
@Component({
  selector: 'app-add-edit-supplier', // Selector para usar el componente en templates
  standalone: true, // Componente independiente, no requiere módulo padre
  imports: [FormsModule, CommonModule], // Módulos necesarios para funcionalidad
  templateUrl: './add-edit-supplier.component.html', // Template HTML del componente
  styleUrl: './add-edit-supplier.component.css', // Estilos CSS del componente
})
export class AddEditSupplierComponent implements OnInit {

  /**
   * Constructor del componente
   * 
   * Inyecta las dependencias necesarias:
   * - ApiService: Para realizar operaciones CRUD de proveedores
   * - Router: Para navegación programática y obtención de parámetros de URL
   */
  constructor(private apiService: ApiService, private router: Router) { }

  // Variable para mostrar mensajes temporales al usuario
  message: string = ''; // Mensajes de éxito, error o información

  // Bandera para determinar el modo de operación del componente
  isEditing: boolean = false; // true = modo edición, false = modo creación

  // ID del proveedor a editar (null en modo creación)
  supplierId: string | null = null; // Extraído de la URL cuando está presente

  // Objeto que contiene los datos del formulario de proveedor
  formData: any = {
    name: '', // Nombre del proveedor
    address: '', // Dirección del proveedor
  };

  /**
   * Método del ciclo de vida OnInit
   * 
   * Se ejecuta después de la inicialización del componente.
   * Determina el modo de operación (agregar/editar) analizando la URL
   * y carga los datos del proveedor si está en modo edición.
   * 
   * Lógica de detección de modo:
   * - Si la URL contiene un ID (tercer segmento), activa modo edición
   * - Si no hay ID, permanece en modo creación
   */
  ngOnInit(): void {
    // Extrae el ID del proveedor desde la URL (formato: /add-edit-supplier/:id)
    this.supplierId = this.router.url.split('/')[2];

    // Si existe un ID, activar modo edición y cargar datos del proveedor
    if (this.supplierId) {
      this.isEditing = true; // Cambiar a modo edición
      this.fetchSupplier(); // Cargar datos del proveedor existente
    }
    // Si no hay ID, el componente permanece en modo creación por defecto
  }

  /**
   * Obtiene los datos de un proveedor específico para edición
   * 
   * Realiza una llamada HTTP para cargar los datos completos del proveedor
   * identificado por supplierId y los asigna al formulario.
   * 
   * Este método solo se ejecuta en modo edición cuando existe un ID válido.
   * Los datos obtenidos se utilizan para pre-poblar el formulario.
   */
  fetchSupplier(): void {
    // Llamada al servicio API para obtener datos del proveedor
    this.apiService.getSupplierById(this.supplierId!).subscribe({
      // Manejo de respuesta exitosa
      next: (res: any) => {
        // Verificar que la respuesta del servidor sea exitosa
        if (res.status === 200) {
          // Asignar los datos del proveedor al formulario
          this.formData = {
            name: res.supplier.name, // Nombre del proveedor
            address: res.supplier.address, // Dirección del proveedor
          };
        }
      },
      // Manejo de errores al obtener datos del proveedor
      error: (error) => {
        // Mostrar mensaje de error detallado al usuario
        this.showMessage(
          error?.error?.message ||
          error?.message ||
          'Unable to get supplier by id' + error
        );
      },
    });
  }

  /**
   * Maneja el envío del formulario de proveedor
   * 
   * Procesa los datos del formulario y ejecuta la operación correspondiente
   * (crear o actualizar) según el modo actual del componente.
   * 
   * Flujo de trabajo:
   * 1. Validar que todos los campos requeridos estén completos
   * 2. Preparar objeto de datos para enviar al servidor
   * 3. Determinar operación a realizar (crear/actualizar)
   * 4. Ejecutar llamada HTTP correspondiente
   * 5. Manejar respuesta exitosa y redirigir
   * 6. Manejar errores y mostrar mensajes apropiados
   */
  handleSubmit() {
    // Validación de campos requeridos
    if (!this.formData.name || !this.formData.address) {
      this.showMessage('Todos los campos son necesarios');
      return;
    }

    // Preparación del objeto de datos para enviar al servidor
    const supplierData = {
      name: this.formData.name, // Nombre del proveedor
      address: this.formData.address, // Dirección del proveedor
    };

    // Determinar operación a realizar según el modo actual
    if (this.isEditing) {
      // *** MODO EDICIÓN: Actualizar proveedor existente ***
      this.apiService.updateSupplier(this.supplierId!, supplierData).subscribe({
        // Manejo de actualización exitosa
        next: (res: any) => {
          if (res.status === 200) {
            // Mostrar mensaje de confirmación
            this.showMessage("Supplier updated successfully");
            // Redirigir a la lista de proveedores
            this.router.navigate(['/supplier'])
          }
        },
        // Manejo de errores durante la actualización
        error: (error) => {
          this.showMessage(error?.error?.message || error?.message || "No se pudo editar el proveedor" + error)
        }
      })
    } else {
      // *** MODO CREACIÓN: Agregar nuevo proveedor ***
      this.apiService.addSupplier(supplierData).subscribe({
        // Manejo de creación exitosa
        next: (res: any) => {
          if (res.status === 200) {
            // Mostrar mensaje de confirmación
            this.showMessage("Proveedor agregado correctamente");
            // Redirigir a la lista de proveedores
            this.router.navigate(['/supplier'])
          }
        },
        // Manejo de errores durante la creación
        error: (error) => {
          this.showMessage(error?.error?.message || error?.message || "No se pudo agregar el proveedor" + error)
        }
      })
    }
  }

  /**
   * Muestra un mensaje temporal al usuario
   * 
   * Utilidad para mostrar mensajes informativos, de éxito o de error
   * relacionados con las operaciones de proveedores. Los mensajes se ocultan
   * automáticamente después de un período determinado.
   * 
   * @param message - El mensaje de texto a mostrar al usuario
   * 
   * Características:
   * - Muestra el mensaje inmediatamente en la interfaz
   * - Se oculta automáticamente después de 4 segundos
   * - Útil para feedback de operaciones CRUD de proveedores
   * - Proporciona retroalimentación visual sobre éxito/error
   * - Especialmente importante para confirmar operaciones exitosas
   *   y alertar sobre errores de validación o problemas del servidor
   */
  showMessage(message: string) {
    // Asigna el mensaje para mostrarlo en el template
    this.message = message;
    // Programa la limpieza del mensaje después de 4 segundos
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }
}
