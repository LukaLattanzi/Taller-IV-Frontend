// Importaciones necesarias para las pruebas unitarias
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Componente bajo prueba - Dashboard para visualización de datos e informes
import { DashboardComponent } from './dashboard.component';

/**
 * Suite de pruebas para DashboardComponent
 * 
 * Este archivo contiene las pruebas unitarias para el componente Dashboard,
 * que es responsable de mostrar gráficos y estadísticas del sistema de inventario.
 * Incluye visualizaciones como gráficos de barras y circulares con datos de productos,
 * categorías, proveedores y transacciones.
 */
describe('DashboardComponent', () => {
  // Variables de prueba para el componente y su fixture
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  /**
   * Configuración inicial antes de cada prueba
   * 
   * Se ejecuta antes de cada test individual para:
   * - Configurar el módulo de pruebas con imports standalone
   * - Crear una instancia del componente
   * - Inicializar la detección de cambios
   */
  beforeEach(async () => {
    // Configuración del TestBed con el componente standalone
    await TestBed.configureTestingModule({
      imports: [DashboardComponent] // Import directo del componente standalone
    })
      .compileComponents(); // Compilación de los componentes

    // Creación del fixture y la instancia del componente
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    // Trigger inicial de detección de cambios para inicializar el componente
    fixture.detectChanges();
  });

  /**
   * Prueba básica de creación del componente
   * 
   * Verifica que el componente se cree correctamente sin errores.
   * Esta es la prueba fundamental que garantiza que la configuración
   * del componente, sus dependencias y su inicialización funcionen correctamente.
   */
  it('should create', () => {
    // Assertion: El componente debe existir y ser truthy
    expect(component).toBeTruthy();
  });
});