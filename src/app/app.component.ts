// Importaciones necesarias de Angular y servicios
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from './service/api.service';

/**
 * Componente raíz de la aplicación - AppComponent
 * 
 * Este es el componente principal que actúa como contenedor de toda la aplicación
 * del Sistema de Gestión de Inventario (IMS). Maneja el layout principal con sidebar,
 * la autenticación de usuarios, la navegación global y proporciona la estructura
 * base para todos los demás componentes de la aplicación.
 */
@Component({
  selector: 'app-root', // Selector del componente raíz
  standalone: true, // Componente standalone (no requiere NgModule)
  imports: [RouterOutlet, RouterLink, CommonModule], // Módulos importados necesarios
  templateUrl: './app.component.html', // Template HTML del componente
  styleUrl: './app.component.css', // Estilos CSS del componente
})


export class AppComponent {
  // Título de la aplicación - identificador del Sistema de Gestión de Inventario
  title = 'ims';

  /**
   * Constructor del componente principal
   * 
   * Inyecta las dependencias necesarias para el funcionamiento del componente:
   * - ApiService: Para manejo de autenticación y comunicación con el backend
   * - Router: Para navegación programática entre rutas
   * - ChangeDetectorRef: Para control manual de detección de cambios
   * 
   * @param apiService - Servicio para operaciones de API y autenticación
   * @param router - Servicio de enrutamiento de Angular
   * @param cdr - Referencia para detección manual de cambios
   */
  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }


  /**
   * Verifica si el usuario está autenticado
   * 
   * Este método delega la verificación de autenticación al ApiService,
   * que verifica la presencia y validez del token JWT en el localStorage.
   * Se utiliza en el template para mostrar/ocultar elementos según el
   * estado de autenticación del usuario.
   * 
   * @returns {boolean} true si el usuario está autenticado, false en caso contrario
   */
  isAuth(): boolean {
    return this.apiService.isAuthenticated();
  }

  /**
   * Verifica si el usuario autenticado tiene privilegios de administrador
   * 
   * Este método consulta al ApiService para determinar si el usuario
   * actual tiene rol de administrador. Se utiliza para controlar el
   * acceso a funcionalidades administrativas en la interfaz de usuario.
   * 
   * @returns {boolean} true si el usuario es administrador, false en caso contrario
   */
  isAdmin(): boolean {
    return this.apiService.isAdmin();
  }

  /**
   * Cierra la sesión del usuario actual
   * 
   * Este método realiza el proceso completo de logout:
   * 1. Llama al ApiService para limpiar datos de sesión (token, usuario)
   * 2. Navega al usuario de vuelta a la página de login
   * 3. Fuerza la detección de cambios para actualizar la UI inmediatamente
   * 
   * Se ejecuta cuando el usuario hace clic en el botón de cerrar sesión.
   */
  logOut(): void {
    this.apiService.logout(); // Limpiar datos de autenticación
    this.router.navigate(["/login"]); // Navegar a la página de login
    this.cdr.detectChanges(); // Forzar actualización de la UI
  }
}
