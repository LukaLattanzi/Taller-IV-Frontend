// Importaciones de Angular Core y módulos necesarios
import { CommonModule } from '@angular/common'; // Directivas comunes como *ngIf, *ngFor
import { Component, OnInit } from '@angular/core'; // Decorador Component e interfaz OnInit
import { FormsModule } from '@angular/forms'; // Para formularios y two-way binding
import { ApiService } from '../service/api.service'; // Servicio para comunicación con la API

/**
 * Componente PurchaseComponent
 * 
 * Este componente maneja el proceso completo de compra de productos en el sistema
 * de gestión de inventario. Permite a los usuarios registrar nuevas compras
 * seleccionando productos y proveedores existentes.
 * 
 * Funcionalidades principales:
 * - Cargar listas de productos y proveedores disponibles
 * - Gestionar formulario de compra con validaciones
 * - Procesar transacciones de compra a través de la API
 * - Actualizar automáticamente el inventario tras compras exitosas
 * - Manejar errores y proporcionar feedback al usuario
 * - Limpiar formulario después de operaciones exitosas
 */
@Component({
  selector: 'app-purchase', // Selector para usar el componente en templates
  standalone: true, // Componente independiente, no requiere módulo padre
  imports: [CommonModule, FormsModule], // Módulos necesarios para funcionalidad
  templateUrl: './purchase.component.html', // Template HTML del componente
  styleUrl: './purchase.component.css' // Estilos CSS del componente
})
export class PurchaseComponent implements OnInit {

  /**
   * Constructor del componente
   * 
   * Inyecta las dependencias necesarias:
   * - ApiService: Para realizar operaciones CRUD relacionadas con compras,
   *   productos y proveedores a través de llamadas HTTP al backend
   */
  constructor(private apiService: ApiService) { }

  // Arrays para almacenar datos obtenidos del servidor
  products: any[] = [] // Lista de todos los productos disponibles para compra
  suppliers: any[] = [] // Lista de todos los proveedores registrados en el sistema

  // Campos del formulario de compra
  productId: string = '' // ID del producto seleccionado para la compra
  supplierId: string = '' // ID del proveedor seleccionado para la transacción
  description: string = '' // Descripción opcional adicional para la compra
  quantity: string = '' // Cantidad de productos a comprar (como string para validación)

  // Variable para mostrar mensajes al usuario
  message: string = '' // Mensajes de éxito, error o información general


  /**
   * Método del ciclo de vida OnInit
   * 
   * Se ejecuta después de la inicialización del componente.
   * Carga automáticamente los datos necesarios para el formulario de compra.
   */
  ngOnInit(): void {
    // Carga las listas de productos y proveedores al inicializar el componente
    this.fetchProductsAndSuppliers();
  }

  /**
   * Obtiene las listas de productos y proveedores del servidor
   * 
   * Realiza dos llamadas HTTP simultáneas para cargar:
   * 1. Todos los productos disponibles en el sistema
   * 2. Todos los proveedores registrados
   * 
   * Estas listas son necesarias para poblar los selectores del formulario
   * y permitir al usuario elegir productos y proveedores para la compra.
   */
  fetchProductsAndSuppliers(): void {
    // Obtener lista de productos disponibles
    this.apiService.getAllProducts().subscribe({
      // Manejo de respuesta exitosa para productos
      next: (res: any) => {
        // Verificar que la respuesta del servidor sea exitosa
        if (res.status === 200) {
          // Asignar la lista de productos al array local
          this.products = res.products;
        }
      },
      // Manejo de errores al obtener productos
      error: (error) => {
        // Mostrar mensaje de error detallado al usuario
        this.showMessage(
          error?.error?.message ||
          error?.message ||
          'No se pudo obtener la lista de productos' + error
        );
      },
    });

    // Obtener lista de proveedores disponibles
    this.apiService.getAllSuppliers().subscribe({
      // Manejo de respuesta exitosa para proveedores
      next: (res: any) => {
        // Verificar que la respuesta del servidor sea exitosa
        if (res.status === 200) {
          // Asignar la lista de proveedores al array local
          this.suppliers = res.suppliers;
        }
      },
      // Manejo de errores al obtener proveedores
      error: (error) => {
        // Mostrar mensaje de error detallado al usuario
        this.showMessage(
          error?.error?.message ||
          error?.message ||
          'No se pudo obtener la lista de proveedores' + error
        );
      },
    })
  }

  /**
   * Maneja el envío del formulario de compra
   * 
   * Procesa la información del formulario, realiza validaciones básicas
   * y envía la solicitud de compra al servidor.
   * 
   * Flujo de trabajo:
   * 1. Validar que todos los campos requeridos estén completos
   * 2. Preparar el objeto de datos para enviar al servidor
   * 3. Realizar la llamada HTTP para procesar la compra
   * 4. Manejar respuesta exitosa o errores
   * 5. Limpiar formulario si la operación es exitosa
   */
  handleSubmit(): void {
    // Validación de campos requeridos
    if (!this.productId || !this.supplierId || !this.quantity) {
      this.showMessage("Por favor, completa todos los campos");
      return;
    }

    // Preparación del objeto de datos para enviar al servidor
    const body = {
      productId: this.productId, // ID del producto seleccionado
      supplierId: this.supplierId, // ID del proveedor seleccionado
      quantity: parseInt(this.quantity, 10), // Conversión de string a número entero
      description: this.description // Descripción opcional (puede estar vacía)
    }

    // Realizar llamada HTTP para procesar la compra
    this.apiService.purchaseProduct(body).subscribe({
      // Manejo de respuesta exitosa
      next: (res: any) => {
        // Verificar que la compra se procesó correctamente
        if (res.status === 200) {
          // Mostrar mensaje de éxito al usuario
          this.showMessage(res.message)
          // Limpiar formulario después de compra exitosa
          this.resetForm();
        }
      },
      // Manejo de errores durante el proceso de compra
      error: (error) => {
        // Mostrar mensaje de error detallado al usuario
        this.showMessage(
          error?.error?.message ||
          error?.message ||
          'No se pudo procesar la compra del producto' + error
        );
      },
    })

  }

  /**
   * Limpia todos los campos del formulario de compra
   * 
   * Restablece el formulario a su estado inicial después de una compra exitosa
   * o cuando el usuario desea comenzar una nueva transacción.
   * 
   * Campos que se limpian:
   * - ID del producto seleccionado
   * - ID del proveedor seleccionado
   * - Descripción de la compra
   * - Cantidad de productos
   */
  resetForm(): void {
    // Limpiar selección de producto
    this.productId = '';
    // Limpiar selección de proveedor
    this.supplierId = '';
    // Limpiar descripción opcional
    this.description = '';
    // Limpiar cantidad ingresada
    this.quantity = '';
  }

  /**
   * Muestra un mensaje temporal al usuario
   * 
   * Utilidad para mostrar mensajes informativos, de éxito o de error
   * que se ocultan automáticamente después de un período determinado.
   * 
   * @param message - El mensaje de texto a mostrar al usuario
   * 
   * Características:
   * - Muestra el mensaje inmediatamente en la interfaz
   * - Se oculta automáticamente después de 4 segundos
   * - Útil para feedback de operaciones de compra
   * - Proporciona retroalimentación visual al usuario
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
