// Importaciones necesarias de Angular y librerías externas
import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import CryptoJS from "crypto-js"; // Librería para encriptación AES

/**
 * Servicio API del Sistema de Gestión de Inventario (IMS)
 * 
 * Este servicio centraliza todas las comunicaciones con el backend,
 * incluyendo autenticación, gestión de datos (categorías, proveedores, productos),
 * transacciones y funcionalidades de seguridad como encriptación de datos
 * sensibles en localStorage.
 */
@Injectable({
  providedIn: 'root', // Singleton a nivel de aplicación
})


export class ApiService {

  // EventEmitter para notificar cambios en el estado de autenticación
  authStatuschanged = new EventEmitter<void>();

  // URL base del backend API (servidor local en puerto 5050)
  private static BASE_URL = 'http://localhost:5050/api';

  // Clave de encriptación para datos sensibles en localStorage
  private static ENCRYPTION_KEY = "luka-dev-inventory";

  /**
   * Constructor del servicio API
   * @param http - Cliente HTTP de Angular para realizar peticiones
   */
  constructor(private http: HttpClient) { }

  // ========== MÉTODOS DE SEGURIDAD Y ENCRIPTACIÓN ==========

  /**
   * Encripta y guarda datos en localStorage
   * 
   * Utiliza AES de CryptoJS para encriptar datos sensibles como tokens
   * antes de almacenarlos en localStorage, proporcionando una capa
   * adicional de seguridad.
   * 
   * @param key - Clave para identificar el dato en localStorage
   * @param value - Valor a encriptar y almacenar
   */
  encryptAndSaveToStorage(key: string, value: string): void {
    const encryptedValue = CryptoJS.AES.encrypt(value, ApiService.ENCRYPTION_KEY).toString();
    localStorage.setItem(key, encryptedValue);
  }

  /**
   * Recupera y desencripta datos de localStorage
   * 
   * Obtiene datos encriptados del localStorage y los desencripta
   * utilizando la clave de encriptación del servicio.
   * 
   * @param key - Clave del dato a recuperar
   * @returns Datos desencriptados o null si no existen o hay error
   */
  private getFromStorageAndDecrypt(key: string): any {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;
      return CryptoJS.AES.decrypt(encryptedValue, ApiService.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return null;
    }
  }

  /**
   * Limpia datos de autenticación del localStorage
   * 
   * Elimina tokens y información de rol del usuario al cerrar sesión
   * o cuando la autenticación expire.
   */
  private clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  /**
   * Genera headers HTTP con token de autorización
   * 
   * Crea los headers necesarios para peticiones autenticadas,
   * incluyendo el token JWT en el header Authorization.
   * 
   * @returns HttpHeaders con token de autorización
   */
  private getHeader(): HttpHeaders {
    const token = this.getFromStorageAndDecrypt("token");
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }







  // ========== MÉTODOS DE AUTENTICACIÓN Y USUARIOS ==========

  /**
   * Registra un nuevo usuario en el sistema
   * 
   * Envía los datos del usuario al endpoint de registro del backend
   * para crear una nueva cuenta en el sistema IMS.
   * 
   * @param body - Datos del usuario (nombre, email, password, etc.)
   * @returns Observable con la respuesta del servidor
   */
  registerUser(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/auth/register`, body);
  }

  /**
   * Autentica un usuario en el sistema
   * 
   * Envía credenciales al backend para validar el usuario y obtener
   * token JWT y información de rol para sesiones autenticadas.
   * 
   * @param body - Credenciales del usuario (email y password)
   * @returns Observable con token y datos del usuario
   */
  loginUser(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/auth/login`, body);
  }

  /**
   * Obtiene información del usuario autenticado actual
   * 
   * Recupera los datos completos del usuario que está actualmente
   * autenticado en el sistema usando el token JWT.
   * 
   * @returns Observable con información del usuario actual
   */
  getLoggedInUserInfo(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/users/current`, {
      headers: this.getHeader(),
    });
  }









  // ========== MÉTODOS DE GESTIÓN DE CATEGORÍAS ==========

  /**
   * Crea una nueva categoría de productos
   * 
   * Envía datos al backend para crear una nueva categoría que será
   * utilizada para clasificar productos en el inventario.
   * 
   * @param body - Datos de la categoría (nombre, descripción, etc.)
   * @returns Observable con la respuesta del servidor
   */
  createCategory(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/categories/add`, body, {
      headers: this.getHeader(),
    });
  }

  /**
   * Obtiene todas las categorías disponibles
   * 
   * Recupera la lista completa de categorías de productos
   * registradas en el sistema.
   * 
   * @returns Observable con array de todas las categorías
   */
  getAllCategory(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/categories/all`, {
      headers: this.getHeader(),
    });
  }

  /**
   * Obtiene una categoría específica por ID
   * 
   * Recupera los datos completos de una categoría específica
   * utilizando su identificador único.
   * 
   * @param id - ID único de la categoría
   * @returns Observable con datos de la categoría
   */
  getCategoryById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/categories/${id}`, {
      headers: this.getHeader(),
    });
  }

  /**
   * Actualiza una categoría existente
   * 
   * Modifica los datos de una categoría específica en el sistema.
   * 
   * @param id - ID de la categoría a actualizar
   * @param body - Nuevos datos de la categoría
   * @returns Observable con la respuesta del servidor
   */
  updateCategory(id: string, body: any): Observable<any> {
    return this.http.put(
      `${ApiService.BASE_URL}/categories/update/${id}`,
      body,
      {
        headers: this.getHeader(),
      }
    );
  }

  /**
   * Elimina una categoría del sistema
   * 
   * Borra permanentemente una categoría específica del sistema.
   * Nota: Solo se puede eliminar si no tiene productos asociados.
   * 
   * @param id - ID de la categoría a eliminar
   * @returns Observable con la respuesta del servidor
   */
  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/categories/delete/${id}`, {
      headers: this.getHeader(),
    });
  }






  // ========== MÉTODOS DE GESTIÓN DE PROVEEDORES ==========

  /**
   * Agrega un nuevo proveedor al sistema
   * 
   * Registra un nuevo proveedor que suministrará productos
   * para el inventario de la empresa.
   * 
   * @param body - Datos del proveedor (nombre, contacto, dirección, etc.)
   * @returns Observable con la respuesta del servidor
   */
  addSupplier(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/suppliers/add`, body, {
      headers: this.getHeader(),
    });
  }

  /**
   * Obtiene todos los proveedores registrados
   * 
   * Recupera la lista completa de proveedores disponibles
   * en el sistema para gestión de inventario.
   * 
   * @returns Observable con array de todos los proveedores
   */
  getAllSuppliers(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/suppliers/all`, {
      headers: this.getHeader(),
    });
  }

  /**
   * Obtiene un proveedor específico por ID
   * 
   * Recupera los datos completos de un proveedor específico
   * utilizando su identificador único.
   * 
   * @param id - ID único del proveedor
   * @returns Observable con datos del proveedor
   */
  getSupplierById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/suppliers/${id}`, {
      headers: this.getHeader(),
    });
  }

  /**
   * Actualiza información de un proveedor existente
   * 
   * Modifica los datos de contacto, dirección u otra información
   * de un proveedor específico en el sistema.
   * 
   * @param id - ID del proveedor a actualizar
   * @param body - Nuevos datos del proveedor
   * @returns Observable con la respuesta del servidor
   */
  updateSupplier(id: string, body: any): Observable<any> {
    return this.http.put(
      `${ApiService.BASE_URL}/suppliers/update/${id}`,
      body,
      {
        headers: this.getHeader(),
      }
    );
  }

  /**
   * Elimina un proveedor del sistema
   * 
   * Borra permanentemente un proveedor específico del sistema.
   * Nota: Solo se puede eliminar si no tiene productos asociados.
   * 
   * @param id - ID del proveedor a eliminar
   * @returns Observable con la respuesta del servidor
   */
  deleteSupplier(id: string): Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/suppliers/delete/${id}`, {
      headers: this.getHeader(),
    });
  }







  // ========== MÉTODOS DE GESTIÓN DE PRODUCTOS ==========

  /**
   * Agrega un nuevo producto al inventario
   * 
   * Registra un nuevo producto en el sistema, incluyendo imágenes
   * y toda la información necesaria para el inventario.
   * 
   * @param formData - FormData con datos del producto e imágenes
   * @returns Observable con la respuesta del servidor
   */
  addProduct(formData: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/products/add`, formData, {
      headers: this.getHeader(),
    });
  }

  /**
   * Actualiza información de un producto existente
   * 
   * Modifica los datos de un producto específico, incluyendo
   * la posibilidad de cambiar imágenes asociadas.
   * 
   * @param formData - FormData con datos actualizados del producto
   * @returns Observable con la respuesta del servidor
   */
  updateProduct(formData: any): Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/products/update`, formData, {
      headers: this.getHeader(),
    });
  }

  /**
   * Obtiene todos los productos del inventario
   * 
   * Recupera la lista completa de productos disponibles
   * en el sistema de inventario.
   * 
   * @returns Observable con array de todos los productos
   */
  getAllProducts(): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/products/all`, {
      headers: this.getHeader(),
    });
  }

  /**
   * Obtiene un producto específico por ID
   * 
   * Recupera los datos completos de un producto específico
   * incluyendo imágenes y detalles del inventario.
   * 
   * @param id - ID único del producto
   * @returns Observable con datos completos del producto
   */
  getProductById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/products/${id}`, {
      headers: this.getHeader(),
    });
  }

  /**
   * Elimina un producto del inventario
   * 
   * Borra permanentemente un producto específico del sistema,
   * incluyendo sus imágenes asociadas.
   * 
   * @param id - ID del producto a eliminar
   * @returns Observable con la respuesta del servidor
   */
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/products/delete/${id}`, {
      headers: this.getHeader(),
    });
  }








  // ========== MÉTODOS DE GESTIÓN DE TRANSACCIONES ==========

  /**
   * Registra una transacción de compra de productos
   * 
   * Procesa la compra de productos de un proveedor, actualizando
   * el inventario y registrando la transacción en el historial.
   * 
   * @param body - Datos de la compra (productos, cantidades, proveedor, etc.)
   * @returns Observable con la respuesta del servidor
   */
  purchaseProduct(body: any): Observable<any> {
    return this.http.post(
      `${ApiService.BASE_URL}/transactions/purchase`,
      body,
      {
        headers: this.getHeader(),
      }
    );
  }

  /**
   * Registra una transacción de venta de productos
   * 
   * Procesa la venta de productos a clientes, actualizando el inventario
   * disponible y registrando la transacción en el historial.
   * 
   * @param body - Datos de la venta (productos, cantidades, cliente, etc.)
   * @returns Observable con la respuesta del servidor
   */
  sellProduct(body: any): Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/transactions/sell`, body, {
      headers: this.getHeader(),
    });
  }

  /**
   * Obtiene todas las transacciones con filtro opcional
   * 
   * Recupera el historial completo de transacciones (compras y ventas)
   * con posibilidad de filtrar por texto de búsqueda.
   * 
   * @param searchText - Texto para filtrar transacciones
   * @returns Observable con array de transacciones filtradas
   */
  getAllTransactions(searchText: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/transactions/all`, {
      params: { searchText: searchText },
      headers: this.getHeader(),
    });
  }

  /**
   * Obtiene una transacción específica por ID
   * 
   * Recupera los detalles completos de una transacción específica
   * incluyendo productos involucrados y información del cliente/proveedor.
   * 
   * @param id - ID único de la transacción
   * @returns Observable con detalles completos de la transacción
   */
  getTransactionById(id: string): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/transactions/${id}`, {
      headers: this.getHeader(),
    });
  }

  /**
   * Actualiza el estado de una transacción
   * 
   * Modifica el estado de una transacción específica
   * (ej: pendiente, completada, cancelada).
   * 
   * @param id - ID de la transacción
   * @param status - Nuevo estado de la transacción
   * @returns Observable con la respuesta del servidor
   */
  updateTransactionStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/transactions/update/${id}`, JSON.stringify(status), {
      headers: this.getHeader().set("Content-Type", "application/json")
    });
  }

  /**
   * Obtiene transacciones filtradas por mes y año
   * 
   * Recupera transacciones de un período específico para
   * análisis estadístico y generación de reportes.
   * 
   * @param month - Mes (1-12)
   * @param year - Año (formato completo, ej: 2024)
   * @returns Observable con transacciones del período especificado
   */
  getTransactionsByMonthAndYear(month: number, year: number): Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/transactions/by-month-year`, {
      headers: this.getHeader(),
      params: {
        month: month,
        year: year,
      },
    });
  }












  // ========== MÉTODOS DE VERIFICACIÓN DE AUTENTICACIÓN ==========

  /**
   * Cierra la sesión del usuario actual
   * 
   * Elimina todos los datos de autenticación del localStorage,
   * efectivamente desconectando al usuario del sistema.
   */
  logout(): void {
    this.clearAuth()
  }

  /**
   * Verifica si el usuario está autenticado
   * 
   * Comprueba la existencia de un token válido en el almacenamiento
   * local para determinar si el usuario tiene una sesión activa.
   * 
   * @returns true si el usuario está autenticado, false en caso contrario
   */
  isAuthenticated(): boolean {
    const token = this.getFromStorageAndDecrypt("token");
    return !!token; // Convierte a boolean: true si existe token, false si es null/undefined
  }

  /**
   * Verifica si el usuario autenticado tiene privilegios de administrador
   * 
   * Comprueba el rol del usuario almacenado en localStorage para
   * determinar si tiene permisos administrativos en el sistema.
   * 
   * @returns true si el usuario es administrador, false en caso contrario
   */
  isAdmin(): boolean {
    const role = this.getFromStorageAndDecrypt("role");
    return role === "ADMIN";
  }
}
