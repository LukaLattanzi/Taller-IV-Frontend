// Importaciones necesarias para el funcionamiento del componente
import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { ApiService } from "../service/api.service";
import { firstValueFrom } from "rxjs";

/**
 * Componente de Login
 * Maneja la autenticación de usuarios en el sistema de gestión de inventario
 * Permite a los usuarios iniciar sesión con email y contraseña
 */
@Component({
  selector: "app-login",
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink], // Módulos necesarios para formularios, directivas comunes y navegación
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  /**
   * Constructor del componente
   * @param apiService - Servicio para realizar llamadas a la API
   * @param router - Servicio de navegación entre rutas
   */
  constructor(private apiService: ApiService, private router: Router) { }

  /**
   * Objeto que almacena los datos del formulario de login
   * Contiene las credenciales del usuario (email y contraseña)
   */
  formData: any = {
    email: "",
    password: "",
  };

  /**
   * Variable para mostrar mensajes de error o éxito al usuario
   * Se muestra temporalmente durante 4 segundos
   */
  message: string | null = null;

  /**
   * Método principal para manejar el envío del formulario de login
   * Valida los datos, realiza la autenticación y redirige al dashboard
   * @returns Promise<void>
   */
  async handleSubmit() {
    // Validación: verificar que todos los campos requeridos estén completos
    if (!this.formData.email || !this.formData.password) {
      this.showMessage("Todos los campos son necesarios");
      return;
    }

    try {
      // Realizar llamada a la API para autenticar al usuario
      // firstValueFrom convierte el Observable en Promise para usar async/await
      const response: any = await firstValueFrom(
        this.apiService.loginUser(this.formData)
      );

      // Si la autenticación es exitosa (status 200)
      if (response.status === 200) {
        // Guardar el token de autenticación de forma segura (encriptado)
        this.apiService.encryptAndSaveToStorage("token", response.token);
        // Guardar el rol del usuario para gestión de permisos
        this.apiService.encryptAndSaveToStorage("role", response.role);
        // Redirigir al usuario al dashboard principal
        this.router.navigate(["/dashboard"]);
      }
    } catch (error: any) {
      // Manejo de errores: capturar y mostrar errores de autenticación
      console.log(error);
      // Mostrar mensaje de error específico o genérico
      this.showMessage(
        error?.error?.message ||
        error?.message ||
        "No se pudo iniciar sesión" + error
      );
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
      this.message = null;
    }, 4000);
  }
}
