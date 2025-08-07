// Importaciones necesarias de Angular Router y servicios
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';

/**
 * Servicio de Guardia de Rutas (GuardService)
 * 
 * Este servicio implementa la interfaz CanActivate para proteger rutas específicas
 * del Sistema de Gestión de Inventario. Controla el acceso basado en dos niveles:
 * 1. Autenticación básica: Usuario debe estar logueado
 * 2. Autorización por roles: Ciertas rutas requieren privilegios de administrador
 * 
 * Si el acceso es denegado, redirige al login preservando la URL de destino
 * para poder navegar automáticamente después de autenticarse.
 */
@Injectable({
  providedIn: 'root' // Singleton a nivel de aplicación
})

export class GuardService implements CanActivate {

  /**
   * Constructor del servicio de guardia
   * 
   * Inyecta las dependencias necesarias para verificar autenticación,
   * autorización y realizar navegación programática.
   * 
   * @param apiService - Servicio para verificar estado de autenticación y roles
   * @param router - Servicio de enrutamiento para redirecciones
   */
  constructor(private apiService: ApiService, private router: Router) { }

  /**
   * Método principal de verificación de acceso a rutas
   * 
   * Este método implementa la lógica de protección de rutas del sistema:
   * 
   * 1. Verifica si la ruta requiere privilegios de administrador
   * 2. Si requiere admin: valida que el usuario sea administrador
   * 3. Si no requiere admin: valida que el usuario esté autenticado
   * 4. En caso de acceso denegado: redirige al login con URL de retorno
   * 
   * @param route - Snapshot de la ruta que se intenta activar
   * @param state - Estado actual del router con información de la URL
   * @returns true si se permite el acceso, false si se debe denegar
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    // Obtener configuración de la ruta: ¿requiere privilegios de administrador?
    const requiresAdmin = route.data['requiresAdmin'] || false;

    // VERIFICACIÓN PARA RUTAS QUE REQUIEREN PRIVILEGIOS DE ADMINISTRADOR
    if (requiresAdmin) {
      if (this.apiService.isAdmin()) {
        return true; // Usuario es admin: acceso permitido
      } else {
        // Usuario no es admin: redirigir al login con URL de retorno
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: state.url }
        });
        return false; // Acceso denegado
      }
    } else {
      // VERIFICACIÓN PARA RUTAS QUE SOLO REQUIEREN AUTENTICACIÓN
      if (this.apiService.isAuthenticated()) {
        return true; // Usuario autenticado: acceso permitido
      } else {
        // Usuario no autenticado: redirigir al login con URL de retorno
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: state.url }
        });
        return false; // Acceso denegado
      }
    }
  }
}
