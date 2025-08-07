// Importaciones necesarias para el funcionamiento del componente
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../service/api.service';
import { firstValueFrom } from 'rxjs';

/**
 * Componente de Registro
 * Maneja el registro de nuevos usuarios en el sistema de gestión de inventario
 * Permite crear cuentas con email, nombre, teléfono y contraseña
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink], // Módulos necesarios para formularios, directivas comunes y navegación
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {

  /**
   * Constructor del componente
   * @param apiService - Servicio para realizar llamadas a la API
   * @param router - Servicio de navegación entre rutas
   */
  constructor(private apiService: ApiService, private router: Router) { }

  /**
   * Objeto que almacena los datos del formulario de registro
   * Contiene toda la información necesaria para crear una nueva cuenta de usuario
   */
  formData: any = {
    email: '',
    name: '',
    phoneNumber: '',
    password: ''
  };

  /**
   * Variable para mostrar mensajes de error o éxito al usuario
   * Se muestra temporalmente durante 4 segundos
   */
  message: string | null = null;

  /**
   * Método principal para manejar el envío del formulario de registro
   * Valida los datos, registra el nuevo usuario y redirige al login
   * @returns Promise<void>
   */
  async handleSubmit() {
    // Validación: verificar que todos los campos requeridos estén completos
    if (
      !this.formData.email ||
      !this.formData.name ||
      !this.formData.phoneNumber ||
      !this.formData.password
    ) {
      this.showMessage("Todos los campos son necesarios");
      return;
    }

    try {
      // Realizar llamada a la API para registrar al nuevo usuario
      // firstValueFrom convierte el Observable en Promise para usar async/await
      const response: any = await firstValueFrom(
        this.apiService.registerUser(this.formData)
      );

      // Si el registro es exitoso (status 200)
      if (response.status === 200) {
        // Mostrar mensaje de éxito al usuario
        this.showMessage(response.message)
        // Redirigir al usuario a la página de login para iniciar sesión
        this.router.navigate(["/login"]);
      }
    } catch (error: any) {
      // Manejo de errores: capturar y mostrar errores de registro
      console.log(error)
      // Mostrar mensaje de error específico o genérico
      this.showMessage(error?.error?.message || error?.message || "No se pudo registrar al usuario" + error)

    }
  }

  /**
   * Método utilitario para mostrar mensajes temporales al usuario
   * Los mensajes se ocultan automáticamente después de 4 segundos
   * @param message - El mensaje a mostrar al usuario
   */
  showMessage(message: string) {
    // Asignar el mensaje a la variable para mostrarlo en el template
    this.message = message;
    // Configurar timeout para ocultar el mensaje después de 4 segundos
    setTimeout(() => {
      this.message = null
    }, 4000)
  }

}
