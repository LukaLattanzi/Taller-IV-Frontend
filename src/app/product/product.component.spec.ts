// Importaciones necesarias para las pruebas unitarias de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importación del componente que vamos a probar
import { ProductComponent } from './product.component';

/**
 * Suite de pruebas para el ProductComponent
 * Contiene las pruebas unitarias para verificar el correcto funcionamiento
 * del componente de gestión de productos del sistema de inventario
 */
describe('ProductComponent', () => {
  // Variables para manejar la instancia del componente y el fixture de prueba
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  /**
   * Configuración que se ejecuta antes de cada prueba
   * Prepara el entorno de testing y crea una instancia del componente
   */
  beforeEach(async () => {
    // Configuración del módulo de testing
    await TestBed.configureTestingModule({
      imports: [ProductComponent] // Importar el componente standalone
    })
      .compileComponents(); // Compilar los componentes

    // Crear una instancia del componente para testing
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    // Detectar cambios para inicializar el componente
    fixture.detectChanges();
  });

  /**
   * Prueba básica: verificar que el componente se crea correctamente
   * Esta es una prueba fundamental que asegura que el componente
   * puede ser instanciado sin errores
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
