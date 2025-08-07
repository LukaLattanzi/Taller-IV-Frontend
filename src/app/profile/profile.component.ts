// Importaciones necesarias para el funcionamiento del componente
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';

/**
 * Componente de Perfil
 * Muestra la información personal del usuario autenticado
 * Implementa OnInit para cargar los datos al inicializar el componente
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule], // Módulo necesario para directivas comunes de Angular
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  /**
   * Constructor del componente
   * @param apiService - Servicio para realizar llamadas a la API
   */
  constructor(private apiService: ApiService) { }
  /**
   * Objeto que almacena la información del usuario autenticado
   * Se inicializa como null hasta que se carguen los datos desde la API
   */
  user: any = null

  /**
   * Variable para mostrar mensajes de error al usuario
   * Se muestra temporalmente durante 4 segundos
   */
  message: string = "";

  /**
   * Hook de ciclo de vida que se ejecuta después de la inicialización del componente
   * Automáticamente carga la información del usuario
   */
  ngOnInit(): void {
    this.fetchUserInfo();
  }

  /**
   * Método para obtener la información del usuario autenticado
   * Realiza una llamada a la API y maneja tanto éxito como errores
   * @returns void
   */
  fetchUserInfo(): void {
    // Suscribirse al observable del servicio API para obtener info del usuario
    this.apiService.getLoggedInUserInfo().subscribe({
      // Manejo de respuesta exitosa
      next: (res) => {
        // Asignar los datos del usuario a la variable local
        this.user = res;
      },
      // Manejo de errores en la llamada a la API
      error: (error) => {
        // Mostrar mensaje de error específico o genérico
        this.showMessage(
          error?.error?.message ||
          error?.message ||
          'No se pudo obtener la información del perfil' + error
        );
      }
    })
  }


  /**
   * Método utilitario para mostrar mensajes de error temporales al usuario
   * Los mensajes se ocultan automáticamente después de 4 segundos
   * @param message - El mensaje de error a mostrar al usuario
   */
  //SHOW ERROR
  showMessage(message: string) {
    // Asignar el mensaje a la variable para mostrarlo en el template
    this.message = message;
    // Configurar timeout para limpiar el mensaje después de 4 segundos
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }
}
