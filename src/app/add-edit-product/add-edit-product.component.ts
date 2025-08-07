// Importaciones de Angular Core y módulos necesarios
import { CommonModule } from '@angular/common'; // Directivas comunes como *ngIf, *ngFor
import { Component, OnInit } from '@angular/core'; // Decorador Component e interfaz OnInit
import { FormsModule } from '@angular/forms'; // Para formularios y two-way binding
import { ApiService } from '../service/api.service'; // Servicio para comunicación con la API
import { ActivatedRoute, Router } from '@angular/router'; // Para navegación y parámetros de ruta

/**
 * Componente AddEditProductComponent
 * 
 * Este componente maneja tanto la creación de nuevos productos como la edición
 * de productos existentes en el sistema de gestión de inventario. Es uno de los
 * componentes más complejos del sistema debido a su manejo de archivos de imagen,
 * relaciones con categorías, y validaciones específicas de productos.
 * 
 * Funcionalidades principales:
 * - Detección automática del modo (agregar/editar) basado en parámetros de URL
 * - Creación de nuevos productos con datos completos e imágenes
 * - Edición de productos existentes con carga previa de datos
 * - Manejo de upload y preview de imágenes de productos
 * - Gestión de relaciones con categorías del sistema
 * - Validación compleja de formularios con múltiples campos
 * - Navegación automática después de operaciones exitosas
 * - Manejo de errores específicos para operaciones de productos
 * - Interfaz unificada para ambos modos de operación
 * - Feedback visual al usuario mediante mensajes temporales
 * - Gestión de FormData para envío de archivos al servidor
 */
@Component({
  selector: 'app-add-edit-product', // Selector para usar el componente en templates
  standalone: true, // Componente independiente, no requiere módulo padre
  imports: [FormsModule, CommonModule], // Módulos necesarios para funcionalidad
  templateUrl: './add-edit-product.component.html', // Template HTML del componente
  styleUrl: './add-edit-product.component.css', // Estilos CSS del componente
})
export class AddEditProductComponent implements OnInit {

  /**
   * Constructor del componente
   * 
   * Inyecta las dependencias necesarias:
   * - ApiService: Para realizar operaciones CRUD de productos y categorías
   * - ActivatedRoute: Para acceder a parámetros de ruta (productId)
   * - Router: Para navegación programática post-operaciones
   */
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  // ID del producto a editar (null en modo creación)
  productId: string | null = null // Extraído de parámetros de ruta

  // Campos del formulario de producto
  name: string = '' // Nombre del producto
  sku: string = '' // Código SKU único del producto
  price: string = '' // Precio del producto (como string para validación)
  stockQuantity: string = '' // Cantidad en stock (como string para validación)
  categoryId: string = '' // ID de la categoría a la que pertenece el producto
  description: string = '' // Descripción detallada del producto

  // Manejo de archivos de imagen
  imageFile: File | null = null // Archivo de imagen seleccionado por el usuario
  imageUrl: string = '' // URL de la imagen para preview (puede ser data URL o URL del servidor)

  // Control de estado del componente
  isEditing: boolean = false // true = modo edición, false = modo creación

  // Datos relacionados
  categories: any[] = [] // Lista de categorías disponibles para asignar al producto

  // Variable para mostrar mensajes temporales al usuario
  message: string = '' // Mensajes de éxito, error o información

  /**
   * Método del ciclo de vida OnInit
   * 
   * Se ejecuta después de la inicialización del componente.
   * Determina el modo de operación (agregar/editar) analizando los parámetros
   * de ruta, carga las categorías disponibles y, si está en modo edición,
   * carga los datos del producto existente.
   * 
   * Secuencia de inicialización:
   * 1. Extrae productId de los parámetros de ruta
   * 2. Carga lista de categorías disponibles
   * 3. Si existe productId, activa modo edición y carga datos del producto
   */
  ngOnInit(): void {
    // Extrae el ID del producto desde los parámetros de ruta
    this.productId = this.route.snapshot.paramMap.get('productId');

    // Carga las categorías disponibles para el formulario
    this.fetchCategories();

    // Si existe un ID, activar modo edición y cargar datos del producto
    if (this.productId) {
      this.isEditing = true; // Cambiar a modo edición
      this.fetchProductById(this.productId) // Cargar datos del producto existente
    }
    // Si no hay ID, el componente permanece en modo creación por defecto
  }

  /**
   * Obtiene la lista de categorías disponibles del servidor
   * 
   * Realiza una llamada HTTP para cargar todas las categorías registradas
   * en el sistema. Estas categorías son necesarias para poblar el selector
   * de categorías en el formulario de producto.
   * 
   * Las categorías son esenciales para la clasificación y organización
   * de productos en el sistema de inventario.
   */
  fetchCategories(): void {
    // Llamada al servicio API para obtener todas las categorías
    this.apiService.getAllCategory().subscribe({
      // Manejo de respuesta exitosa
      next: (res: any) => {
        // Verificar que la respuesta del servidor sea exitosa
        if (res.status === 200) {
          // Asignar la lista de categorías al array local
          this.categories = res.categories
        }
      },
      // Manejo de errores al obtener categorías
      error: (error) => {
        // Mostrar mensaje de error detallado al usuario
        this.showMessage(error?.error?.message || error?.message || "No se pudieron obtener las categorías" + error)
      }
    })
  }

  /**
   * Obtiene los datos de un producto específico para edición
   * 
   * Realiza una llamada HTTP para cargar los datos completos del producto
   * identificado por productId y los asigna a los campos del formulario.
   * 
   * Este método solo se ejecuta en modo edición cuando existe un ID válido.
   * Los datos obtenidos incluyen información básica del producto y la URL
   * de la imagen asociada para mostrar el preview actual.
   * 
   * @param productId - ID del producto a cargar para edición
   */
  fetchProductById(productId: string): void {
    // Llamada al servicio API para obtener datos del producto específico
    this.apiService.getProductById(productId).subscribe({
      // Manejo de respuesta exitosa
      next: (res: any) => {
        // Verificar que la respuesta del servidor sea exitosa
        if (res.status === 200) {
          // Extraer datos del producto de la respuesta
          const product = res.product;

          // Asignar datos del producto a los campos del formulario
          this.name = product.name; // Nombre del producto
          this.sku = product.sku; // Código SKU
          this.price = product.price; // Precio
          this.stockQuantity = product.stockQuantity; // Cantidad en stock
          this.categoryId = product.caetgoryId; // ID de categoría (nota: posible typo en API)
          this.description = product.description; // Descripción
          this.imageUrl = product.imageUrl; // URL de imagen existente
        } else {
          // Manejar respuesta con status diferente a 200
          this.showMessage(res.message);
        }
      },
      // Manejo de errores al obtener datos del producto
      error: (error) => {
        // Mostrar mensaje de error detallado al usuario
        this.showMessage(error?.error?.message || error?.message || "No se pudo obtener el producto por ID" + error)
      }
    })
  }

  /**
   * Maneja el cambio de archivo de imagen seleccionado
   * 
   * Se ejecuta cuando el usuario selecciona un archivo de imagen a través
   * del input file. Procesa el archivo seleccionado y genera un preview
   * inmediato usando FileReader para mostrar la imagen antes del envío.
   * 
   * Funcionalidades:
   * - Valida que se haya seleccionado un archivo
   * - Almacena el archivo para envío posterior
   * - Genera preview inmediato de la imagen
   * - Actualiza imageUrl con data URL para visualización
   * 
   * @param event - Evento del input file que contiene el archivo seleccionado
   */
  handleImageChange(event: Event): void {
    // Obtener referencia al elemento input file
    const input = event.target as HTMLInputElement;

    // Verificar que existe un archivo seleccionado
    if (input?.files?.[0]) {
      // Almacenar archivo para envío posterior al servidor
      this.imageFile = input.files[0]

      // Crear FileReader para generar preview de la imagen
      const reader = new FileReader();

      // Configurar callback que se ejecuta cuando la lectura del archivo termina
      reader.onloadend = () => {
        // Asignar data URL resultante para mostrar preview inmediato
        this.imageUrl = reader.result as string
      }

      // Iniciar lectura del archivo como data URL (base64)
      reader.readAsDataURL(this.imageFile);
    }
  }

  /**
   * Maneja el envío del formulario de producto
   * 
   * Procesa los datos del formulario y ejecuta la operación correspondiente
   * (crear o actualizar) según el modo actual del componente. Utiliza FormData
   * para manejar el envío de archivos de imagen junto con los datos del producto.
   * 
   * Flujo de trabajo:
   * 1. Prevenir comportamiento por defecto del formulario
   * 2. Crear FormData con todos los campos del producto
   * 3. Agregar archivo de imagen si se seleccionó uno
   * 4. Determinar operación a realizar (crear/actualizar)
   * 5. Ejecutar llamada HTTP correspondiente
   * 6. Manejar respuesta exitosa y redirigir
   * 7. Manejar errores y mostrar mensajes apropiados
   * 
   * @param event - Evento del formulario para prevenir comportamiento por defecto
   */
  handleSubmit(event: Event): void {
    // Prevenir comportamiento por defecto del formulario (recarga de página)
    event.preventDefault()

    // Crear FormData para envío de datos con archivos
    const formData = new FormData();

    // Agregar todos los campos del producto al FormData
    formData.append("name", this.name); // Nombre del producto
    formData.append("sku", this.sku); // Código SKU único
    formData.append("price", this.price); // Precio del producto
    formData.append("stockQuantity", this.stockQuantity); // Cantidad en inventario
    formData.append("categoryId", this.categoryId); // ID de categoría asignada
    formData.append("description", this.description); // Descripción detallada

    // Agregar archivo de imagen si el usuario seleccionó uno
    if (this.imageFile) {
      formData.append("imageFile", this.imageFile);
    }

    // Determinar operación a realizar según el modo actual
    if (this.isEditing) {
      // *** MODO EDICIÓN: Actualizar producto existente ***

      // Agregar ID del producto para identificar cuál actualizar
      formData.append("productId", this.productId!);

      // Llamada al servicio API para actualizar producto
      this.apiService.updateProduct(formData).subscribe({
        // Manejo de actualización exitosa
        next: (res: any) => {
          if (res.status === 200) {
            // Mostrar mensaje de confirmación
            this.showMessage("producto actualizado correctamente")
            // Redirigir a la lista de productos
            this.router.navigate(['/product'])
          }
        },
        // Manejo de errores durante la actualización
        error: (error) => {
          this.showMessage(error?.error?.message || error?.message || "No se pudo actualizar el producto" + error)
        }
      })
    } else {
      // *** MODO CREACIÓN: Agregar nuevo producto ***

      // Llamada al servicio API para crear nuevo producto
      this.apiService.addProduct(formData).subscribe({
        // Manejo de creación exitosa
        next: (res: any) => {
          if (res.status === 200) {
            // Mostrar mensaje de confirmación
            this.showMessage("Producto guardado correctamente")
            // Redirigir a la lista de productos
            this.router.navigate(['/product'])
          }
        },
        // Manejo de errores durante la creación
        error: (error) => {
          this.showMessage(error?.error?.message || error?.message || "No se pudo guardar el producto" + error)
        }
      })
    }
  }

  /**
   * Muestra un mensaje temporal al usuario
   * 
   * Utilidad para mostrar mensajes informativos, de éxito o de error
   * relacionados con las operaciones de productos. Los mensajes se ocultan
   * automáticamente después de un período determinado.
   * 
   * @param message - El mensaje de texto a mostrar al usuario
   * 
   * Características:
   * - Muestra el mensaje inmediatamente en la interfaz
   * - Se oculta automáticamente después de 4 segundos
   * - Útil para feedback de operaciones CRUD de productos
   * - Proporciona retroalimentación visual sobre éxito/error
   * - Especialmente importante para confirmar operaciones exitosas
   *   con archivos y alertar sobre errores de validación o problemas del servidor
   * - Maneja tanto mensajes simples como errores complejos de upload de archivos
   */
  showMessage(message: string) {
    // Asigna el mensaje para mostrarlo en el template
    this.message = message;
    // Programa la limpieza del mensaje después de 4 segundos
    setTimeout(() => {
      this.message = ''
    }, 4000)
  }
}
