// Importaciones necesarias para las pruebas unitarias de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importación del componente a probar
import { TransactionDetailsComponent } from './transaction-details.component';

/**
 * Suite de pruebas para TransactionDetailsComponent
 * 
 * Este archivo contiene las pruebas unitarias para el componente TransactionDetailsComponent,
 * que es responsable de mostrar los detalles completos de una transacción específica.
 * 
 * Funcionalidades principales a probar:
 * - Creación e inicialización del componente
 * - Visualización de información detallada de transacciones
 * - Funcionalidad de actualización de estado de transacciones
 * - Navegación y manejo de parámetros de ruta
 * - Interacción con el servicio API para obtener y actualizar datos
 */
describe('TransactionDetailsComponent', () => {
  // Variables para manejar la instancia del componente y su fixture de prueba
  let component: TransactionDetailsComponent;
  let fixture: ComponentFixture<TransactionDetailsComponent>;

  /**
   * Configuración inicial que se ejecuta antes de cada prueba
   * 
   * Este bloque configura el entorno de pruebas usando TestBed:
   * - Configura el módulo de pruebas con las dependencias necesarias
   * - Crea una instancia del componente para pruebas
   * - Ejecuta la detección de cambios inicial
   */
  beforeEach(async () => {
    // Configuración del módulo de pruebas con el componente standalone
    await TestBed.configureTestingModule({
      imports: [TransactionDetailsComponent] // Importa el componente standalone
    })
      .compileComponents(); // Compila los componentes y sus templates

    // Creación de la instancia del componente para pruebas
    fixture = TestBed.createComponent(TransactionDetailsComponent);
    component = fixture.componentInstance;

    // Ejecuta el primer ciclo de detección de cambios
    // Esto simula la inicialización del componente en el DOM
    fixture.detectChanges();
  });

  /**
   * Prueba básica de creación del componente
   * 
   * Verifica que:
   * - El componente se puede instanciar correctamente
   * - No hay errores durante la inicialización
   * - La instancia del componente es válida (truthy)
   * 
   * Esta es una prueba fundamental que debe pasar para confirmar
   * que la configuración básica del componente es correcta.
   */
  it('should create', () => {
    // Verifica que la instancia del componente existe y es válida
    expect(component).toBeTruthy();
  });
});
