// Importaciones de Angular Core y módulos necesarios
import { CommonModule } from '@angular/common'; // Directivas comunes como *ngIf, *ngFor
import { Component, OnInit } from '@angular/core'; // Decorador Component e interfaz OnInit
import { FormsModule } from '@angular/forms'; // Para formularios y two-way binding
import { ApiService } from '../service/api.service'; // Servicio para comunicación con la API
import { ActivatedRoute, Router } from '@angular/router'; // Para navegación y parámetros de ruta

/**
 * Componente TransactionDetailsComponent
 * 
 * Este componente es responsable de mostrar los detalles completos de una transacción específica
 * y permitir la actualización del estado de la transacción.
 * 
 * Funcionalidades principales:
 * - Obtener detalles de una transacción por ID desde la URL
 * - Mostrar información completa de la transacción (productos, cantidades, precios, etc.)
 * - Permitir actualización del estado de la transacción
 * - Navegación de regreso a la lista de transacciones
 * - Manejo de errores y mensajes informativos
 */
@Component({
  selector: 'app-transaction-details', // Selector para usar el componente en templates
  standalone: true, // Componente independiente, no requiere módulo padre
  imports: [CommonModule, FormsModule], // Módulos necesarios para funcionalidad
  templateUrl: './transaction-details.component.html', // Template HTML del componente
  styleUrl: './transaction-details.component.css', // Estilos CSS del componente
})
export class TransactionDetailsComponent implements OnInit {

  /**
   * Constructor del componente
   * 
   * Inyecta las dependencias necesarias para el funcionamiento del componente:
   * - ApiService: Para realizar llamadas HTTP a la API del backend
   * - ActivatedRoute: Para acceder a los parámetros de la ruta actual
   * - Router: Para navegación programática entre componentes
   */
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  // ID de la transacción obtenido desde los parámetros de la URL
  transactionId: string | null = '';

  // Objeto que contiene todos los detalles de la transacción
  transaction: any = null;

  // Estado actual de la transacción (pending, completed, cancelled, etc.)
  status: string = '';

  // Mensaje para mostrar información o errores al usuario
  message: string = ''

  /**
   * Método del ciclo de vida OnInit
   * 
   * Se ejecuta después de la inicialización del componente.
   * Suscribe a los parámetros de la ruta para obtener el ID de la transacción
   * y cargar sus detalles automáticamente.
   */
  ngOnInit(): void {
    // Suscripción a los parámetros de la ruta para detectar cambios
    this.route.params.subscribe(params => {
      // Extrae el ID de la transacción desde los parámetros de la URL
      this.transactionId = params['transactionId'];
      // Carga los detalles de la transacción una vez obtenido el ID
      this.getTransactionDetails();
    })
  }

  /**
   * Obtiene los detalles completos de una transacción específica
   * 
   * Realiza una llamada HTTP al servicio API para obtener toda la información
   * de la transacción identificada por transactionId.
   * 
   * Funcionalidades:
   * - Valida que existe un ID de transacción válido
   * - Realiza llamada HTTP para obtener datos
   * - Actualiza el estado del componente con los datos recibidos
   * - Maneja errores de comunicación con el servidor
   */
  getTransactionDetails(): void {
    // Verifica que existe un ID de transacción antes de hacer la llamada
    if (this.transactionId) {
      // Llamada al servicio API para obtener detalles de la transacción
      this.apiService.getTransactionById(this.transactionId).subscribe({
        // Manejo de respuesta exitosa
        next: (transactionData: any) => {
          // Verifica que la respuesta del servidor sea exitosa (status 200)
          if (transactionData.status === 200) {
            // Asigna los datos de la transacción al objeto local
            this.transaction = transactionData.transaction;
            // Actualiza el estado actual de la transacción
            this.status = this.transaction.status;
          }
        },
        // Manejo de errores en la comunicación con el servidor
        error: (error) => {
          // Muestra mensaje de error con información detallada
          this.showMessage(
            error?.error?.message ||
            error?.message ||
            'Unable to Get Transaction by id ' + error
          );
        }
      })
    }
  }

  /**
   * Maneja la actualización del estado de una transacción
   * 
   * Permite cambiar el estado de una transacción (ej: de "pending" a "completed")
   * y persiste el cambio en el servidor a través de la API.
   * 
   * Flujo de trabajo:
   * - Valida que existen tanto ID como nuevo estado
   * - Envía petición de actualización al servidor
   * - Redirige a la lista de transacciones si es exitoso
   * - Muestra mensaje de error si falla la operación
   */
  handleUpdateStatus(): void {
    // Verifica que existen tanto el ID de transacción como el nuevo estado
    if (this.transactionId && this.status) {
      // Llamada al servicio API para actualizar el estado de la transacción
      this.apiService.updateTransactionStatus(this.transactionId, this.status).subscribe({
        // Manejo de actualización exitosa
        next: (result) => {
          // Redirige al usuario de vuelta a la lista de transacciones
          this.router.navigate(['/transaction'])
        },
        // Manejo de errores durante la actualización
        error: (error) => {
          // Muestra mensaje de error detallado al usuario
          this.showMessage(
            error?.error?.message ||
            error?.message ||
            'Unable to Update a Transaction ' + error
          );
        }
      })
    }
  }

  /**
   * Muestra un mensaje temporal al usuario
   * 
   * Utilidad para mostrar mensajes informativos o de error que se ocultan
   * automáticamente después de un período de tiempo determinado.
   * 
   * @param message - El mensaje de texto a mostrar al usuario
   * 
   * Características:
   * - Muestra el mensaje inmediatamente
   * - Se oculta automáticamente después de 4 segundos
   * - Útil para feedback de operaciones y manejo de errores
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
