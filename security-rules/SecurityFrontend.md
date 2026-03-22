# PRD: Reglas de Seguridad para Desarrollo Frontend

**Versión:** 2.0  
**Fecha:** 2026-01-17  
**Estado:** Activo  
**Propósito:** Guía de referencia para desarrolladores frontend sobre prácticas de seguridad

## 1. Resumen Ejecutivo

Este documento establece las reglas y mejores prácticas de seguridad que deben seguirse al desarrollar el frontend de la aplicación. Estas reglas están basadas en vulnerabilidades reales identificadas y mitigaciones implementadas.

**Principios Fundamentales:**
- **Nunca confiar en el frontend**: El frontend es controlable por el usuario
- **Validación en backend**: Todas las validaciones críticas deben estar en el backend
- **Protección de datos sensibles**: Encriptar datos sensibles almacenados localmente
- **Seguridad real, no por oscuridad**: No intentar ocultar endpoints, confiar en el backend

## 2. Reglas de Seguridad por Categoría

### 2.1 Almacenamiento de Datos Sensibles

#### ✅ REGLA 1: Encriptar Datos Sensibles en localStorage

**¿Por qué?**
- `localStorage` es accesible por cualquier script en la página
- Un atacante con XSS puede acceder a tokens y datos sensibles
- Datos sin encriptar facilitan ataques de sesión

**Implementación:**
```typescript
// ✅ CORRECTO: Usar storage encriptado
import { encryptedStorage } from '../utils/encryptedStorage';
import { createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({ /* ... */ }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => encryptedStorage), // ✅ Encriptado
    }
  )
);

// ❌ INCORRECTO: Almacenar sin encriptar
localStorage.setItem('token', token); // ❌ Visible sin encriptar
```

**Datos que DEBEN encriptarse:**
- Tokens JWT
- Información de usuario (email, ID, roles)
- Datos del carrito (productos, precios)
- Cualquier dato que permita acceso a la cuenta

**Datos que NO requieren encriptación:**
- Preferencias de UI (tema, idioma)
- Filtros de búsqueda
- Estado de componentes (modales abiertos/cerrados)

#### ✅ REGLA 2: Limpiar Datos Antiguos Sin Encriptar

**¿Por qué?**
- Al migrar a encriptación, pueden quedar datos antiguos sin encriptar
- Estos datos son vulnerables y deben eliminarse

**Implementación:**
```typescript
// ✅ CORRECTO: Limpiar datos antiguos al iniciar sesión
import { cleanupUnencryptedData } from '../utils/encryptedStorage';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      setUser: (user: User, token: string) => {
        cleanupUnencryptedData(); // ✅ Limpiar datos antiguos
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        cleanupUnencryptedData(); // ✅ Limpiar al cerrar sesión
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { /* ... */ }
  )
);
```

### 2.2 Comunicación con el Backend

#### ✅ REGLA 3: Nunca Confiar en Validaciones del Frontend

**¿Por qué?**
- Un atacante puede modificar el código JavaScript
- Puede deshabilitar validaciones del frontend
- El backend es la única fuente de verdad

**Implementación:**
```typescript
// ✅ CORRECTO: Validar en frontend PERO el backend también valida
const handleSubmit = async (formData) => {
  // Validación en frontend (UX)
  if (formData.price <= 0) {
    toast.error('El precio debe ser mayor a cero');
    return;
  }
  
  // El backend VALIDA NUEVAMENTE y rechaza si no coincide
  await api.post('/orders', formData);
};

// ❌ INCORRECTO: Asumir que la validación del frontend es suficiente
const handleSubmit = async (formData) => {
  if (formData.price <= 0) return; // ❌ Atacante puede saltarse esto
  await api.post('/orders', formData); // ❌ Backend debe validar también
};
```

#### ✅ REGLA 4: NO Enviar X-Client-Secret desde el Frontend

**¿Por qué?**
- ⚠️ **VULNERABILIDAD CRÍTICA**: El X-Client-Secret NO debe estar en el código del frontend
- Cualquiera puede verlo en las DevTools del navegador (Network tab)
- Puede ser copiado y usado para hacer peticiones al backend
- El secret debe ser solo para validación de servicios internos/backends

**Flujo de Seguridad:**
1. **Endpoints Públicos**: No requieren autenticación ni X-Client-Secret
2. **Endpoints Protegidos del Frontend**: Requieren JWT token (no X-Client-Secret)
3. **Servicios Internos/Backends**: Pueden usar X-Client-Secret para validación

**Implementación:**
```typescript
// ✅ CORRECTO: NO enviar X-Client-Secret desde el frontend
api.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ Solo JWT
    }
    
    // ⚠️ NO enviar X-Client-Secret - es una vulnerabilidad
    // El secret no debe estar en el código del cliente
    return config;
  }
);

// ❌ INCORRECTO: Enviar X-Client-Secret desde el frontend
api.interceptors.request.use(
  async (config) => {
    config.headers['X-Client-Secret'] = envConfig.clientSecret; // ❌ VULNERABILIDAD
    return config;
  }
);
```

#### ✅ REGLA 5: Usar HTTPS y Confiar en la Seguridad del Backend

**¿Por qué?**
- La ofuscación de endpoints es "seguridad por oscuridad" y no previene ataques reales
- Un atacante determinado siempre puede descubrir los endpoints observando el tráfico
- La verdadera seguridad está en el backend: autenticación, autorización, y validación
- HTTPS protege el tráfico en tránsito

**Implementación:**
```typescript
// ✅ CORRECTO: Confiar en la seguridad del backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ Debe ser HTTPS en producción
});

// El backend maneja:
// - Autenticación con JWT
// - Autorización con roles
// - Validación de todos los datos
// - Rate limiting
// - Endpoints separados por contexto (public/, admin/)

// ❌ INCORRECTO: Intentar ofuscar endpoints
// La ofuscación NO previene ataques reales, solo dificulta el debugging
```

**Nota:** No intentes ocultar los endpoints en el Network tab. En su lugar:
- ✅ Asegura que todos los endpoints públicos estén correctamente identificados
- ✅ Protege endpoints sensibles con autenticación y autorización
- ✅ Implementa rate limiting en el backend
- ✅ Usa HTTPS en producción
- ✅ Valida todos los datos en el backend

#### ✅ REGLA 6: Consumir Endpoints Apropiados Según el Contexto

**¿Por qué?**
- El backend tiene endpoints separados para diferentes contextos (público, usuario, admin)
- Usar el endpoint correcto asegura que solo recibas los datos que necesitas
- Mejora el rendimiento al no traer datos innecesarios
- Facilita el mantenimiento y debugging

**Arquitectura de Endpoints del Backend:**

```
Endpoints Públicos (sin autenticación):
GET /public/products → Lista de productos con info básica
GET /public/products/:id → Detalle de producto público
GET /public/product-prices/product/:productId → Precios públicos sin costos

Endpoints de Usuario (JWT requerido):
GET /users/me → Perfil del usuario actual
GET /users/me/orders → Órdenes del usuario actual
GET /users/me/balance-transactions → Transacciones del usuario actual

Endpoints Administrativos (JWT + Role ADMIN/SUPERADMIN):
GET /admin/users → Lista completa con datos sensibles
GET /admin/product-prices → Precios con costos y márgenes
GET /admin/orders → Todas las órdenes del sistema
```

**Implementación:**

```typescript
// ===========================
// CONSUMIR ENDPOINTS PÚBLICOS
// ===========================

// ✅ CORRECTO: Usar endpoint público para catálogo
export const getPublicProducts = async (): Promise<PublicProductDto[]> => {
  const { data } = await api.get('/public/products');
  return data;
};

export const getPublicProductPrices = async (productId: string) => {
  const { data } = await api.get(`/public/product-prices/product/${productId}`);
  return data; // Solo incluye: id, name, finalPrice, stock, state
  // ❌ NO incluye: purchaseCost, margins, supplier IDs
};

// ===========================
// CONSUMIR ENDPOINTS DE USUARIO
// ===========================

// ✅ CORRECTO: Usar endpoint de usuario para perfil
export const getMyProfile = async (): Promise<UserProfileDto> => {
  const { data } = await api.get('/users/me');
  return data; // Solo datos del usuario autenticado
};

export const getMyOrders = async (page: number = 1) => {
  const { data } = await api.get(`/users/me/orders?page=${page}`);
  return data; // Solo órdenes del usuario autenticado
};

// ===========================
// CONSUMIR ENDPOINTS ADMINISTRATIVOS
// ===========================

// ✅ CORRECTO: Usar endpoint admin para gestión
export const getAllUsers = async (page: number = 1) => {
  // Requiere JWT + Role ADMIN/SUPERADMIN
  const { data } = await api.get(`/admin/users?page=${page}`);
  return data; // Datos completos incluyendo info sensible
};

export const getAllProductPrices = async () => {
  // Requiere JWT + Role ADMIN/SUPERADMIN
  const { data } = await api.get('/admin/product-prices');
  return data; // Incluye purchaseCost, margins, supplier IDs
};

// ❌ INCORRECTO: Intentar acceder a endpoint admin sin rol
export const getProducts = async () => {
  // ❌ Esto fallará con 403 si el usuario no es admin
  const { data } = await api.get('/admin/products');
  return data;
};
```

**Reglas de Consumo de Endpoints:**

1. **Para Páginas Públicas (sin login):**
   - Usar solo endpoints bajo `/public/*`
   - No requieren token JWT
   - Retornan solo datos públicos

2. **Para Usuarios Autenticados:**
   - Usar endpoints bajo `/users/me/*` para recursos propios
   - Requieren token JWT
   - Retornan solo datos del usuario actual

3. **Para Paneles Administrativos:**
   - Usar endpoints bajo `/admin/*`
   - Requieren token JWT + rol de administrador
   - Retornan datos completos incluyendo info sensible

**Ejemplos de Uso en Componentes:**

```typescript
// ===========================
// Componente Público: Catálogo
// ===========================
const ProductCatalog = () => {
  const { data: products } = useQuery(
    ['public-products'],
    () => getPublicProducts() // ✅ Endpoint público
  );
  
  return (
    <div>
      {products?.map(product => (
        <ProductCard 
          key={product.id}
          // Solo datos públicos disponibles
          name={product.name}
          description={product.description}
          image={product.image}
          // ❌ NO disponibles: internalNotes, supplierId
        />
      ))}
    </div>
  );
};

// ===========================
// Componente de Usuario: Mis Órdenes
// ===========================
const MyOrders = () => {
  const { data: orders } = useQuery(
    ['my-orders'],
    () => getMyOrders() // ✅ Endpoint de usuario
  );
  
  return (
    <div>
      {orders?.map(order => (
        <OrderCard 
          key={order.id}
          // Solo órdenes del usuario actual
          order={order}
        />
      ))}
    </div>
  );
};

// ===========================
// Componente Admin: Gestión de Productos
// ===========================
const AdminProductManagement = () => {
  const { data: prices } = useQuery(
    ['admin-product-prices'],
    () => getAllProductPrices(), // ✅ Endpoint admin
    {
      // Solo ejecutar si el usuario es admin
      enabled: user?.roles.includes('admin')
    }
  );
  
  return (
    <div>
      {prices?.map(price => (
        <AdminPriceRow
          key={price.id}
          // Datos completos disponibles
          name={price.name}
          price={price.price}
          purchaseCost={price.purchaseCost} // ✅ Disponible solo para admin
          margin={price.finalCustomerMargin} // ✅ Disponible solo para admin
        />
      ))}
    </div>
  );
};
```

**Validación de Acceso en el Frontend:**

```typescript
// ✅ CORRECTO: Validar rol antes de mostrar componentes admin
const AdminDashboard = () => {
  const { user } = useAuthStore();
  
  // Redirigir si no es admin
  if (!user || !['admin', 'superadmin'].includes(user.roles)) {
    return <Navigate to="/" />;
  }
  
  // Componente solo se renderiza para admins
  return (
    <div>
      <AdminProductManagement />
      <AdminUserManagement />
    </div>
  );
};

// ❌ INCORRECTO: No validar rol
const AdminDashboard = () => {
  // ❌ Cualquiera puede ver el componente
  // El backend rechazará las peticiones, pero es mala UX
  return <div>...</div>;
};
```

### 2.3 Manejo de Errores y Respuestas

#### ✅ REGLA 7: No Exponer Información Sensible en Errores

**¿Por qué?**
- Los errores pueden contener información sobre la estructura del sistema
- Pueden revelar endpoints, nombres de tablas, lógica de negocio
- Facilita ataques dirigidos

**Implementación:**
```typescript
// ✅ CORRECTO: Mostrar mensajes genéricos al usuario
try {
  await api.post('/orders', orderData);
} catch (error) {
  // Mostrar mensaje genérico
  toast.error('No se pudo procesar la orden. Por favor, intenta nuevamente.');
  
  // Log detallado solo en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.error('Error detallado:', error);
  }
}

// ❌ INCORRECTO: Exponer detalles del error
catch (error) {
  toast.error(`Error: ${error.response.data.message}`); // ❌ Puede exponer info sensible
  console.error(error.response.data.stack); // ❌ Stack trace visible
}
```

#### ✅ REGLA 8: Manejar Errores de Autenticación Correctamente

**¿Por qué?**
- Los errores 401/403 deben limpiar la sesión
- Previene uso de tokens expirados o inválidos
- Mejora la experiencia de usuario

**Implementación:**
```typescript
// ✅ CORRECTO: Interceptor maneja errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar autenticación
      useAuthStore.getState().clearAuth();
      
      // Disparar evento para que el hook lo capture
      window.dispatchEvent(new CustomEvent('auth-error', { 
        detail: { message: 'Tu sesión ha expirado' } 
      }));
    }
    return Promise.reject(error);
  }
);
```

### 2.4 Validación de Datos de Usuario

#### ✅ REGLA 9: Validar y Sanitizar Inputs del Usuario

**¿Por qué?**
- Previene XSS (Cross-Site Scripting)
- Previene inyección de código
- Mejora la experiencia de usuario

**Implementación:**
```typescript
// ✅ CORRECTO: Validar y sanitizar inputs
import { z } from 'zod';

const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })),
  total: z.number().positive(),
});

const handleSubmit = async (formData: unknown) => {
  // Validar con schema
  const validated = orderSchema.parse(formData);
  
  // Enviar datos validados
  await api.post('/orders', validated);
};

// ❌ INCORRECTO: Enviar datos sin validar
const handleSubmit = async (formData: any) => {
  await api.post('/orders', formData); // ❌ Sin validación
};
```

#### ✅ REGLA 10: No Manipular Precios en el Frontend

**¿Por qué?**
- Los precios deben calcularse en el backend
- El frontend solo muestra el precio calculado
- Cualquier manipulación será rechazada por el backend

**Implementación:**
```typescript
// ✅ CORRECTO: Usar precio calculado del backend
const ProductCard = ({ product }) => {
  const { data: priceData } = useQuery(['product-price', product.id], () =>
    api.get(`/public/product-prices/product/${product.id}`)
  );
  
  // Usar precio del backend
  const price = priceData?.finalPrice || 0;
  
  return <div>Precio: ${price}</div>;
};

// ❌ INCORRECTO: Calcular precio en frontend
const ProductCard = ({ product }) => {
  // ❌ El backend rechazará si no coincide
  const price = product.purchaseCost * 1.2; // ❌ Cálculo en frontend
  return <div>Precio: ${price}</div>;
};
```

### 2.5 Gestión de Tokens y Autenticación

#### ✅ REGLA 11: No Almacenar Tokens en Variables Globales

**¿Por qué?**
- Variables globales son accesibles desde cualquier script
- Facilita robo de tokens mediante XSS
- Mejor usar stores de estado con encriptación

**Implementación:**
```typescript
// ✅ CORRECTO: Usar store de estado encriptado
import { useAuthStore } from '../stores/authStore';

const MyComponent = () => {
  const { token, user } = useAuthStore(); // ✅ Del store encriptado
  
  // Usar token del store
  const response = await api.get('/profile', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// ❌ INCORRECTO: Variable global
window.token = response.data.token; // ❌ Accesible desde cualquier script
localStorage.setItem('token', token); // ❌ Sin encriptar
```

#### ✅ REGLA 12: Refrescar Tokens Antes de Expirar

**¿Por qué?**
- Previene interrupciones en la experiencia del usuario
- Mantiene la sesión activa
- Reduce errores 401

**Implementación:**
```typescript
// ✅ CORRECTO: Hook para refrescar token
import { useTokenExpiration } from '../hooks/useTokenExpiration';

const App = () => {
  useTokenExpiration(); // ✅ Maneja expiración automáticamente
  
  return <Router />;
};

// El hook verifica el token periódicamente y lo refresca si es necesario
```

### 2.6 Protección Contra XSS

#### ✅ REGLA 13: Sanitizar HTML Antes de Renderizar

**¿Por qué?**
- Previene inyección de scripts maliciosos
- Protege contra XSS
- Especialmente importante en contenido dinámico

**Implementación:**
```typescript
// ✅ CORRECTO: Sanitizar HTML
import DOMPurify from 'dompurify';

const ProductDescription = ({ description }) => {
  // Sanitizar antes de renderizar
  const sanitized = DOMPurify.sanitize(description);
  
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
};

// ❌ INCORRECTO: Renderizar HTML sin sanitizar
const ProductDescription = ({ description }) => {
  return <div dangerouslySetInnerHTML={{ __html: description }} />; // ❌ XSS risk
};
```

#### ✅ REGLA 14: Usar Content Security Policy (CSP)

**¿Por qué?**
- Previene ejecución de scripts no autorizados
- Bloquea inyección de código
- Mejora la seguridad general

**Implementación:**
```html
<!-- ✅ CORRECTO: CSP en index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://apis.google.com; 
               style-src 'self' 'unsafe-inline';">
```

### 2.7 Manejo de Variables de Entorno

#### ✅ REGLA 15: No Exponer Secretos en el Código

**¿Por qué?**
- El código frontend es visible para todos
- Los secretos en el código pueden ser extraídos
- Usar variables de entorno para configuración

**Implementación:**
```typescript
// ✅ CORRECTO: Usar variables de entorno
const envConfig = {
  apiUrl: import.meta.env.VITE_API_URL,
};

// ⚠️ IMPORTANTE: Las variables VITE_ son públicas
// NO uses secretos reales aquí - cualquiera puede verlos

// ❌ INCORRECTO: Hardcodear secretos
const clientSecret = 'my-secret-key-12345'; // ❌ Visible en el código
```

**Nota:** Las variables de entorno con prefijo `VITE_` son públicas y se incluyen en el bundle. No uses secretos reales que no puedan ser expuestos.

### 2.8 Validación de Cantidades y Precios

#### ✅ REGLA 16: Validar Cantidades y Precios en Múltiples Capas

**¿Por qué?**
- Un atacante puede manipular cantidades en el cliente (ej: cambiar 10 a -10)
- Puede modificar precios para pagar menos
- Las validaciones del frontend son solo para UX, no para seguridad
- El backend debe ser la fuente de verdad

**Implementación:**
```typescript
// ✅ CORRECTO: Validar en el cart store
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 999;

const validateQuantity = (quantity: number): number => {
    if (!Number.isInteger(quantity) || quantity < MIN_QUANTITY) {
        return MIN_QUANTITY;
    }
    if (quantity > MAX_QUANTITY) {
        return MAX_QUANTITY;
    }
    return quantity;
};

// Validar al agregar al carrito
addItem: (newItem) => {
    const validatedQuantity = validateQuantity(newItem.quantity);
    // ... agregar con cantidad validada
}

// ✅ CORRECTO: Validar antes de checkout
const invalidItems = items.filter(item => 
    !item.quantity || item.quantity <= 0 || 
    !Number.isInteger(item.quantity) ||
    !item.unitPrice || item.unitPrice <= 0
);

if (invalidItems.length > 0) {
    toast.error('Hay productos inválidos en el carrito');
    clearCart(); // Limpiar por seguridad
    return;
}

// ✅ CORRECTO: Validar en el servicio antes de enviar
const validateOrderData = (orderData: CreateOrderData): void => {
    orderData.items.forEach((item, index) => {
        if (!item.quantity || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
            throw new Error(`Cantidad inválida en el producto ${index + 1}`);
        }
        if (item.quantity < 1 || item.quantity > 999) {
            throw new Error('Cantidad fuera de rango permitido');
        }
        if (!item.price || item.price <= 0) {
            throw new Error(`Precio inválido en el producto ${index + 1}`);
        }
    });
};

// ❌ INCORRECTO: Solo validar en el UI
<input type="number" min="1" max="999" /> // ❌ Fácilmente salteable
```

**Flujo de Validación en Múltiples Capas:**

**Capa 1: UI/Componentes**
- Validar inputs en tiempo real (UX)
- Deshabilitar botones si datos inválidos
- Mostrar mensajes de error amigables
- NO es suficiente para seguridad, solo UX

**Capa 2: Store (Zustand)**
- Validar al agregar items al carrito
- Validar al actualizar cantidades
- Limpiar carrito si se detectan valores inválidos
- Prevenir agregar items con datos inválidos

**Capa 3: Checkout**
- Validar todos los items antes de proceder
- Verificar que no haya items con cantidades inválidas
- Verificar que todos los precios sean válidos
- Limpiar carrito completo si hay datos inválidos

**Capa 4: Service (orderService, paymentService)**
- Validar estructura de datos antes de enviar
- Validar cantidades y precios una vez más
- NO calcular totales (el backend lo hace)
- Enviar solo datos validados

**Capa 5: Backend (CRÍTICO)**
- Recalcula precios desde la base de datos
- Valida stock disponible con locks
- Calcula totales en el servidor
- Rechaza cualquier manipulación

**Reglas Específicas:**
- ✅ Cantidad debe ser entero positivo entre 1 y 999
- ✅ Precio debe ser número positivo mayor a 0
- ✅ NO confiar en totales calculados en el cliente
- ✅ El backend DEBE recalcular todo desde la base de datos
- ✅ Usar `Number.isInteger()` para validar enteros
- ✅ Limpiar carrito si se detectan valores inválidos

**Aplicación en Recargas de Saldo:**
Las mismas validaciones aplican para montos de recarga:
- ✅ Monto debe ser positivo entre $0.01 y $500.00
- ✅ Máximo 2 decimales permitidos
- ✅ Validar en el input, handler y servicio
- ✅ NO permitir valores negativos, cero, o extremos
- ✅ El backend DEBE verificar el pago real con el proveedor antes de acreditar
- ✅ El backend previene doble acreditación del mismo pago

**Flujo de Recarga:**
1. Usuario ingresa monto → Validación en UI (solo UX)
2. Handler valida monto → Rechaza si está fuera de rango
3. Service valida antes de enviar → Última validación en frontend
4. Backend recibe petición → Valida con AmountLimitGuard
5. Backend crea transacción PENDING → Usuario paga con proveedor
6. Backend verifica pago REAL → Con API del proveedor (Binance, PayPal, Veripagos)
7. Backend valida monto coincida → Compara monto pagado vs esperado
8. Backend previene doble acreditación → Verifica que no se haya procesado antes
9. Backend acredita saldo → Con locks atómicos para prevenir race conditions

### 2.9 Manejo de Sesiones

#### ✅ REGLA 17: Limpiar Datos al Cerrar Sesión

**¿Por qué?**
- Previene acceso a datos de sesión anterior
- Protege contra acceso no autorizado
- Cumple con mejores prácticas de seguridad

**Implementación:**
```typescript
// ✅ CORRECTO: Limpiar todo al cerrar sesión
const logout = () => {
  // Limpiar store
  useAuthStore.getState().clearAuth();
  useCartStore.getState().clearCart();
  
  // Limpiar datos encriptados
  cleanupUnencryptedData();
  
  // Redirigir a login
  navigate('/login');
};

// ❌ INCORRECTO: Solo limpiar token
const logout = () => {
  localStorage.removeItem('token'); // ❌ Datos encriptados quedan
};
```

## 3. Checklist de Seguridad Frontend

### Antes de Hacer Commit

- [ ] ¿Los datos sensibles están encriptados en localStorage?
- [ ] ¿NO se está enviando `X-Client-Secret` desde el frontend? (vulnerabilidad crítica)
- [ ] ¿Los errores no exponen información sensible?
- [ ] ¿Los inputs del usuario están validados y sanitizados?
- [ ] ¿Las cantidades se validan en múltiples capas (store, checkout, service)?
- [ ] ¿Los montos de recarga se validan en múltiples capas (UI, handler, service)?
- [ ] ¿Los precios se obtienen del backend, no se calculan en frontend?
- [ ] ¿Los totales se recalculan en el backend, no se envían del cliente?
- [ ] ¿Los tokens se almacenan en store encriptado, no en variables globales?
- [ ] ¿El HTML dinámico está sanitizado antes de renderizar?
- [ ] ¿No hay secretos hardcodeados en el código?
- [ ] ¿La limpieza de sesión elimina todos los datos sensibles?
- [ ] ¿Se están usando los endpoints correctos según el contexto (public/, users/me/, admin/)?

### Antes de Desplegar a Producción

- [ ] ¿HTTPS está habilitado?
- [ ] ¿Las variables de entorno están configuradas correctamente?
- [ ] ¿El CSP está configurado?
- [ ] ¿Los logs de desarrollo están deshabilitados?
- [ ] ¿Los source maps están deshabilitados en producción?
- [ ] ¿La encriptación está funcionando correctamente?
- [ ] ¿Los endpoints públicos usan `/public/*`?
- [ ] ¿Los componentes admin validan roles antes de renderizar?
- [ ] ¿NO se está intentando ofuscar endpoints? (es seguridad por oscuridad)

## 4. Errores Comunes a Evitar

### ❌ Error 1: Confiar en Validaciones del Frontend

```typescript
// ❌ MAL
if (price > 0) {
  await api.post('/orders', { price });
}

// ✅ BIEN
// Validar en frontend (UX) pero el backend también valida
if (price > 0) {
  await api.post('/orders', { price }); // Backend rechaza si no es válido
}
```

### ❌ Error 2: Exponer Información en Errores

```typescript
// ❌ MAL
catch (error) {
  toast.error(error.response.data.message); // Puede exponer info sensible
}

// ✅ BIEN
catch (error) {
  toast.error('Ocurrió un error. Por favor, intenta nuevamente.');
  if (process.env.NODE_ENV === 'development') {
    console.error(error);
  }
}
```

### ❌ Error 3: Almacenar Tokens Sin Encriptar

```typescript
// ❌ MAL
localStorage.setItem('token', token);

// ✅ BIEN
// Usar store con storage encriptado
useAuthStore.getState().setUser(user, token);
```

### ❌ Error 4: No Validar Cantidades y Precios

```typescript
// ❌ MAL
const handleAddToCart = () => {
  addItem({ quantity, price }); // Sin validación
};

// ✅ BIEN
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 999;

const handleAddToCart = () => {
  // Validar cantidad
  if (!Number.isInteger(quantity) || quantity < MIN_QUANTITY || quantity > MAX_QUANTITY) {
    toast.error('Cantidad inválida');
    return;
  }
  
  // Validar precio
  if (!price || price <= 0) {
    toast.error('Precio inválido');
    return;
  }
  
  addItem({ quantity, price });
};
```

### ❌ Error 5: Usar Endpoints Incorrectos

```typescript
// ❌ MAL: Intentar usar endpoint admin sin rol
const getProducts = async () => {
  // ❌ Fallará con 403 si no es admin
  const { data } = await api.get('/admin/products');
  return data;
};

// ✅ BIEN: Usar endpoint público para catálogo
const getProducts = async () => {
  const { data } = await api.get('/public/products');
  return data;
};

// ✅ BIEN: Usar endpoint admin solo si es admin
const getProductsForAdmin = async () => {
  if (!user?.roles.includes('admin')) {
    throw new Error('No autorizado');
  }
  const { data } = await api.get('/admin/products');
  return data;
};
```

### ❌ Error 6: Intentar Ofuscar Endpoints

```typescript
// ❌ MAL: Seguridad por oscuridad
const obfuscatedEndpoint = btoa('/api/products'); // ❌ No previene ataques
await api.get(obfuscatedEndpoint);

// ✅ BIEN: Confiar en la seguridad del backend
await api.get('/public/products'); // ✅ El backend valida todo
```

## 5. Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Zustand Persist Middleware](https://github.com/pmndrs/zustand#persist-middleware)
- [Security by Obscurity (Why it's Bad)](https://en.wikipedia.org/wiki/Security_through_obscurity)

## 6. Changelog

### Versión 2.0 (2026-01-17)
- **BREAKING CHANGE**: Eliminada práctica de ofuscación de endpoints
- **REGLA 5 REESCRITA**: Usar HTTPS y confiar en la seguridad del backend
- **REGLA 6 NUEVA**: Consumir endpoints apropiados según el contexto
- **Arquitectura Actualizada**: Documentado uso correcto de endpoints públicos, de usuario y admin
- **Ejemplos Mejorados**: Código más claro mostrando el consumo correcto de cada tipo de endpoint
- **Error 5 NUEVO**: Usar endpoints incorrectos
- **Error 6 NUEVO**: Intentar ofuscar endpoints (seguridad por oscuridad)
- **Checklist Actualizado**: Verificar uso correcto de endpoints y eliminada ofuscación
- Actualizada documentación para alinearse con arquitectura de backend de endpoints separados

### Versión 1.4 (2026-01-XX)
- **REGLA 16 ACTUALIZADA**: Flujo de validación en múltiples capas documentado en detalle
- **Flujo de Recarga**: Documentado proceso completo de validación y verificación de pagos
- Actualizado checklist: verificar validaciones en todas las capas
- Mitigación de vulnerabilidades:
  - Manipulación de cantidades negativas
  - Manipulación de precios
  - Envío de totales calculados en cliente

### Versión 1.3 (2026-01-14)
- **REGLA 4 IMPLEMENTADA**: Eliminado envío de X-Client-Secret desde el frontend (vulnerabilidad crítica)
- **Flujo de Seguridad**: Documentado flujo correcto de autenticación (JWT para frontend, X-Client-Secret solo para servicios internos)
- **Backend actualizado**: REGLA 20 del backend permite JWT sin requerir X-Client-Secret
- Actualizado checklist: verificar que NO se envíe X-Client-Secret
- Mitigación de vulnerabilidad crítica: exposición de X-Client-Secret en Network tab

### Versión 1.2 (2026-01-14)
- **Actualización REGLA 16**: Extendida para incluir validaciones de montos de recarga
- Actualizado checklist con validaciones de montos de recarga
- Actualizada documentación backend con validaciones de recargas
- Mitigación de vulnerabilidad crítica: manipulación de montos negativos en recargas

### Versión 1.1 (2026-01-14)
- **REGLA 16**: Agregada validación de cantidades y precios en múltiples capas
- Agregado Error 4: No validar cantidades y precios
- Actualizado checklist con validaciones de cantidades y totales

### Versión 1.0 (2026-01-11)
- Documento inicial con reglas de seguridad para frontend
- Basado en vulnerabilidades identificadas y mitigaciones implementadas

---

**Nota:** Este documento debe actualizarse cuando se identifiquen nuevas vulnerabilidades o se implementen nuevas medidas de seguridad.