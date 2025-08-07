// Importaciones necesarias para las pruebas unitarias
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

/**
 * Suite de pruebas para AppComponent
 * 
 * Este archivo contiene las pruebas unitarias para el componente principal
 * de la aplicación (AppComponent), que actúa como el componente raíz del
 * sistema de gestión de inventario. El AppComponent maneja el layout principal,
 * la navegación sidebar y el contenido dinámico de la aplicación.
 */
describe('AppComponent', () => {

  /**
   * Configuración inicial antes de cada prueba
   * 
   * Se ejecuta antes de cada test individual para:
   * - Configurar el módulo de pruebas con el componente standalone
   * - Compilar los componentes y sus dependencias
   * - Preparar el entorno de testing aislado
   */
  beforeEach(async () => {
    // Configuración del TestBed con el componente standalone AppComponent
    await TestBed.configureTestingModule({
      imports: [AppComponent], // Import directo del componente standalone
    }).compileComponents(); // Compilación asíncrona de componentes
  });

  /**
   * Prueba de creación básica del componente
   * 
   * Verifica que el AppComponent se instancie correctamente sin errores.
   * Esta es la prueba fundamental que garantiza que el componente principal
   * de la aplicación puede ser creado y que su configuración es válida.
   */
  it('should create the app', () => {
    // Crear fixture del componente para testing
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // Assertion: El componente debe existir y ser truthy
    expect(app).toBeTruthy();
  });

  /**
   * Prueba de verificación del título de la aplicación
   * 
   * Valida que el componente tenga la propiedad 'title' configurada
   * correctamente con el valor esperado 'ims-angular'. Esta propiedad
   * identifica la aplicación del Sistema de Gestión de Inventario.
   */
  it(`should have the 'ims-angular' title`, () => {
    // Crear fixture y obtener instancia del componente
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // Assertion: El título debe ser exactamente 'ims-angular'
    expect(app.title).toEqual('ims-angular');
  });

  /**
   * Prueba de renderizado del título en el DOM
   * 
   * Verifica que el título de la aplicación se renderice correctamente
   * en el template HTML. Busca un elemento h1 que contenga el texto
   * esperado, validando la integración entre el componente y su template.
   */
  it('should render title', () => {
    // Crear fixture del componente
    const fixture = TestBed.createComponent(AppComponent);

    // Trigger detección de cambios para renderizar el template
    fixture.detectChanges();

    // Obtener el elemento DOM compilado
    const compiled = fixture.nativeElement as HTMLElement;

    // Assertion: El h1 debe contener el texto con el título de la app
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, ims-angular');
  });
});
