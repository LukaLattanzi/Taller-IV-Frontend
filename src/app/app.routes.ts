// Importaciones de Angular Router y servicios de seguridad
import { Routes } from '@angular/router';
import { GuardService } from './service/guard.service';

// Importaciones de componentes de autenticación
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

// Importaciones de componentes de gestión (solo administradores)
import { CategoryComponent } from './category/category.component';
import { SupplierComponent } from './supplier/supplier.component';
import { AddEditSupplierComponent } from './add-edit-supplier/add-edit-supplier.component';
import { ProductComponent } from './product/product.component';
import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';

// Importaciones de componentes de transacciones (usuarios autenticados)
import { PurchaseComponent } from './purchase/purchase.component';
import { SellComponent } from './sell/sell.component';
import { TransactionComponent } from './transaction/transaction.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';

// Importaciones de componentes de usuario y análisis
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';

/**
 * Configuración de rutas del Sistema de Gestión de Inventario (IMS)
 * 
 * Este archivo define todas las rutas de la aplicación organizadas por niveles de acceso:
 * - Rutas públicas: Login y registro (sin autenticación)
 * - Rutas de administrador: Gestión de categorías, proveedores y productos
 * - Rutas de usuario autenticado: Transacciones, perfil y dashboard
 * 
 * Utiliza GuardService para proteger rutas y controlar acceso basado en roles.
 */
export const routes: Routes = [

  // ========== RUTAS PÚBLICAS (Sin autenticación requerida) ==========
  { path: 'login', component: LoginComponent }, // Página de inicio de sesión
  { path: 'register', component: RegisterComponent }, // Página de registro de nuevos usuarios

  // ========== RUTAS DE ADMINISTRADOR (Requieren autenticación + rol admin) ==========

  // Gestión de categorías - Solo administradores
  { path: 'category', component: CategoryComponent, canActivate: [GuardService], data: { requiresAdmin: true } },

  // Gestión de proveedores - Solo administradores
  { path: 'supplier', component: SupplierComponent, canActivate: [GuardService], data: { requiresAdmin: true } },
  { path: 'edit-supplier/:supplierId', component: AddEditSupplierComponent, canActivate: [GuardService], data: { requiresAdmin: true } },
  { path: 'add-supplier', component: AddEditSupplierComponent, canActivate: [GuardService], data: { requiresAdmin: true } },

  // Gestión de productos - Solo administradores
  { path: 'product', component: ProductComponent, canActivate: [GuardService], data: { requiresAdmin: true } },
  { path: 'edit-product/:productId', component: AddEditProductComponent, canActivate: [GuardService], data: { requiresAdmin: true } },
  { path: 'add-product', component: AddEditProductComponent, canActivate: [GuardService], data: { requiresAdmin: true } },

  // ========== RUTAS DE USUARIOS AUTENTICADOS (Requieren solo autenticación) ==========

  // Operaciones de transacciones - Todos los usuarios autenticados
  { path: 'purchase', component: PurchaseComponent, canActivate: [GuardService] }, // Registrar compras de inventario
  { path: 'sell', component: SellComponent, canActivate: [GuardService] }, // Registrar ventas de productos

  // Historial y detalles de transacciones - Todos los usuarios autenticados
  { path: 'transaction', component: TransactionComponent, canActivate: [GuardService] }, // Lista de todas las transacciones
  { path: 'transaction/:transactionId', component: TransactionDetailsComponent, canActivate: [GuardService] }, // Detalles específicos de una transacción

  // ========== RUTAS DE PERFIL Y ANÁLISIS ==========

  // Gestión de perfil personal - Todos los usuarios autenticados
  { path: 'profile', component: ProfileComponent, canActivate: [GuardService] },

  // Dashboard con estadísticas y gráficos - Todos los usuarios autenticados
  { path: 'dashboard', component: DashboardComponent, canActivate: [GuardService] },

  // ========== RUTAS DE NAVEGACIÓN Y FALLBACK ==========

  // Ruta por defecto - Redirige al login cuando no hay ruta específica
  { path: "", redirectTo: "/login", pathMatch: 'full' },

  // Ruta wildcard para páginas no encontradas (comentada - redirige a dashboard)
  // {path: "**", redirectTo: "/dashboard"}
];
