// Importaciones necesarias para las pruebas unitarias de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importación del componente que vamos a probar
import { RegisterComponent } from './register.component';

/**
 * Suite de pruebas para el RegisterComponent
 * Contiene las pruebas unitarias para verificar el correcto funcionamiento
 * del componente de registro de nuevos usuarios en el sistema
 */
describe('RegisterComponent', () => {
  // Variables para manejar la instancia del componente y el fixture de prueba
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  /**
   * Configuración que se ejecuta antes de cada prueba
   * Prepara el entorno de testing y crea una instancia del componente
   */
  beforeEach(async () => {
    // Configuración del módulo de testing
    await TestBed.configureTestingModule({
      imports: [RegisterComponent] // Importar el componente standalone
    })
      .compileComponents(); // Compilar los componentes

    // Crear una instancia del componente para testing
    fixture = TestBed.createComponent(RegisterComponent);
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
