// Importaciones de Angular Core y módulos necesarios
import { CommonModule } from '@angular/common'; // Directivas comunes como *ngIf, *ngFor
import { Component, OnInit } from '@angular/core'; // Decorador Component e interfaz OnInit
import { FormsModule } from '@angular/forms'; // Para formularios y two-way binding
import { ApiService } from '../service/api.service'; // Servicio para comunicación con la API

/**
 * Componente SellComponent
 * 
 * Este componente maneja el proceso completo de ventas de productos en el sistema
 * de gestión de inventario. Permite a los usuarios registrar ventas seleccionando
 * productos disponibles y especificando cantidades.
 * 
 * Funcionalidades principales:
 * - Cargar y mostrar lista de productos disponibles para venta
 * - Gestionar formulario de venta con validaciones básicas
 * - Procesar transacciones de venta a través de la API
 * - Actualizar automáticamente el inventario tras ventas exitosas
 * - Validar disponibilidad de stock antes de procesar venta
 * - Manejar errores y proporcionar feedback al usuario
 * - Limpiar formulario después de operaciones exitosas
 * - Generar registros de transacciones para auditoría
 */
@Component({
  selector: 'app-sell', // Selector para usar el componente en templates
  standalone: true, // Componente independiente, no requiere módulo padre
  imports: [CommonModule, FormsModule], // Módulos necesarios para funcionalidad
  templateUrl: './sell.component.html', // Template HTML del componente
  styleUrl: './sell.component.css' // Estilos CSS del componente
})
export class SellComponent implements OnInit {

  /**
   * Constructor del componente
   * 
   * Inyecta las dependencias necesarias:
   * - ApiService: Para realizar operaciones CRUD relacionadas con ventas
   *   y gestión de productos a través de llamadas HTTP al backend
   */
  constructor(private apiService: ApiService) { }

  // Array para almacenar la lista de productos disponibles para venta
  products: any[] = [] // Lista de productos obtenidos del servidor con stock disponible

  // Campos del formulario de venta
  productId: string = '' // ID del producto seleccionado para la venta
  description: string = '' // Descripción opcional adicional para la transacción de venta
  quantity: string = '' // Cantidad de productos a vender (como string para validación)

  // Variable para mostrar mensajes al usuario
  message: string = '' // Mensajes de éxito, error o información sobre la venta

  /**
   * Método del ciclo de vida OnInit
   * 
   * Se ejecuta después de la inicialización del componente.
   * Carga automáticamente la lista de productos disponibles para venta.
   */
  ngOnInit(): void {
    // Carga la lista de productos al inicializar el componente
    this.fetchProducts();
  }

  /**
   * Obtiene la lista de productos disponibles para venta del servidor
   * 
   * Realiza una llamada HTTP para cargar todos los productos registrados
   * en el sistema que están disponibles para venta. Esta lista es esencial
   * para poblar el selector del formulario de venta.
   * 
   * Funcionalidades:
   * - Obtiene productos con información de stock disponible
   * - Actualiza el array local de productos
   * - Maneja errores de comunicación con el servidor
   */
  fetchProducts(): void {
    // Llamada al servicio API para obtener lista de productos
    this.apiService.getAllProducts().subscribe({
      // Manejo de respuesta exitosa
      next: (res: any) => {
        // Verificar que la respuesta del servidor sea exitosa
        if (res.status === 200) {
          // Asignar la lista de productos al array local
          this.products = res.products;
        }
      },
      // Manejo de errores en la comunicación con el servidor
      error: (error) => {
        // Mostrar mensaje de error detallado al usuario
        this.showMessage(
          error?.error?.message ||
          error?.message ||
          'Unable to get Products' + error
        );
      },
    });

  }

  /**
   * Maneja el envío del formulario de venta
   * 
   * Procesa la información del formulario, realiza validaciones básicas
   * y envía la solicitud de venta al servidor. Esta función es crítica
   * ya que maneja la transacción de venta y actualización de inventario.
   * 
   * Flujo de trabajo:
   * 1. Validar que todos los campos requeridos estén completos
   * 2. Preparar el objeto de datos para enviar al servidor
   * 3. Realizar la llamada HTTP para procesar la venta
   * 4. Manejar respuesta exitosa (venta confirmada)
   * 5. Actualizar inventario automáticamente en el backend
   * 6. Limpiar formulario si la operación es exitosa
   * 7. Manejar errores (stock insuficiente, producto no disponible, etc.)
   */
  handleSubmit(): void {
    // Validación de campos requeridos (producto y cantidad son obligatorios)
    if (!this.productId || !this.quantity) {
      this.showMessage("Please fill all fields")
      return;
    }

    // Preparación del objeto de datos para enviar al servidor
    const body = {
      productId: this.productId, // ID del producto seleccionado para venta
      quantity: parseInt(this.quantity, 10), // Conversión de string a número entero
      description: this.description // Descripción opcional de la venta
    }

    // Realizar llamada HTTP para procesar la venta
    this.apiService.sellProduct(body).subscribe({
      // Manejo de respuesta exitosa (venta procesada correctamente)
      next: (res: any) => {
        // Verificar que la venta se procesó correctamente
        if (res.status === 200) {
          // Mostrar mensaje de confirmación de venta exitosa
          this.showMessage(res.message)
          // Limpiar formulario después de venta exitosa
          this.resetForm();
        }
      },
      // Manejo de errores durante el proceso de venta
      error: (error) => {
        // Posibles errores: stock insuficiente, producto no encontrado,
        // problemas de red, errores del servidor, etc.
        this.showMessage(
          error?.error?.message ||
          error?.message ||
          'Unable to sell a product' + error
        );
      },
    })

  }

  /**
   * Limpia todos los campos del formulario de venta
   * 
   * Restablece el formulario a su estado inicial después de una venta exitosa
   * o cuando el usuario desea comenzar una nueva transacción de venta.
   * 
   * Campos que se limpian:
   * - ID del producto seleccionado
   * - Descripción de la venta
   * - Cantidad de productos
   * 
   * Nota: La lista de productos se mantiene cargada para facilitar
   * múltiples ventas consecutivas sin necesidad de recargar datos.
   */
  resetForm(): void {
    // Limpiar selección de producto
    this.productId = '';
    // Limpiar descripción opcional
    this.description = '';
    // Limpiar cantidad ingresada
    this.quantity = '';
  }

  /**
   * Muestra un mensaje temporal al usuario
   * 
   * Utilidad para mostrar mensajes informativos, de éxito o de error
   * relacionados con las operaciones de venta. Los mensajes se ocultan
   * automáticamente después de un período determinado.
   * 
   * @param message - El mensaje de texto a mostrar al usuario
   * 
   * Características:
   * - Muestra el mensaje inmediatamente en la interfaz
   * - Se oculta automáticamente después de 4 segundos
   * - Útil para feedback de operaciones de venta
   * - Proporciona retroalimentación visual sobre éxito/error de ventas
   * - Especialmente importante para confirmar ventas exitosas
   *   y alertar sobre problemas de stock o errores de validación
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

