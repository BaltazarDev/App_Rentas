# Estado del Proyecto: App de Control de Rentas

**Fecha de Actualización**: 15 de Febrero de 2026
**Estado**: Pausado - Listo para continuar con Integración de API y Formularios.

## 🚀 Progreso Realizado

### 1. Backend (Laravel)
- **Configuración**: Proyecto creado, conectado a MySQL (XAMPP).
- **Base de Datos**: Migraciones ejecutadas para todas las tablas principales:
  - `houses` (Casas)
  - `units` (Departamentos/Locales)
  - `tenants` (Inquilinos)
  - `payments` (Pagos)
  - `expenses` (Gastos)
- **Modelos**: Relaciones Eloquent definidas (Use `hasMany`, `belongsTo`, etc.).
- **API REST**: Controladores implementados con métodos CRUD completos (`index`, `store`, `show`, `update`, `destroy`).
- **Rutas**: Archivo `routes/api.php` configurado y registrado en el bootstrap de la aplicación.

### 2. Frontend (Ionic + React)
- **Estructura**: Directorios organizados (`pages`, `components`, `services`).
- **Navegación**: Sistema de Tabs (Pestañas) implementado en `App.tsx` (Dashboard vs Propiedades).
- **Páginas Creadas**:
  - **Dashboard**: Muestra carrusel de bienvenida (Swiper) y tarjetas de resumen.
  - **Houses (Lista)**: Grid de tarjetas modernas (`HouseCard`) con foto y dirección.
  - **HouseDetail**: Detalle de casa con cabecera tipo Airbnb.
    - **Pestañas Internas**: Unidades (lista de deptos), Gastos (historial) y Mapa (iframe).
  - **UnitDetail**: Detalle de departamento. Muestra estado (Ocupado/Vacío), tarjeta de inquilino y semáforo de pagos.
- **Servicios**: Cliente HTTP (`axios`) configurado apuntando a `localhost:8000`.

---

## 🛑 Tareas Pendientes para Retomar

### Prioridad Alta (Funcionalidad Core)
1.  **Conexión Real con API**:
    - Actualmente los componentes (`Houses.tsx`, `HouseDetail.tsx`, `UnitDetail.tsx`) usan **datos de prueba (mock data)**.
    - **Acción**: Descomentar las llamadas a `api.get()` en los `useEffect` y eliminar los objetos estáticos.

2.  **Formularios de Creación (CRUD)**:
    - Faltan las pantallas para **Crear/Editar** datos.
    - **Crear Casa**: Formulario para Nombre, Dirección, URL de Mapa, URL de Foto.
    - **Crear Unidad**: Formulario para asignar a una casa, definir renta base y tipo.
    - **Asignar Inquilino**: Formulario para registrar inquilino en una unidad vacía.
    - **Registrar Pago**: Botón en `UnitDetail` para marcar una mensualidad como pagada.
    - **Registrar Gasto**: Botón en `HouseDetail` para agregar gastos de luz/agua.

### Prioridad Media (Avanzado)
3.  **Sincronización Offline (SQLite)**:
    - Implementar persistencia local con Capacitor SQLite para que la app funcione sin internet y sincronice al volver.
4.  **Autenticación**:
    - Implementar Login en Frontend contra Laravel Sanctum (si el usuario lo requiere, actualmente es abierta).

### Notas Técnicas
- **Comando Backend**: Correr `php artisan serve` en `backend/`.
- **Comando Frontend**: Correr `npm run dev` o `ionic serve` en `app/`.
- **Base de Datos**: Asegurarse que XAMPP (MySQL) esté corriendo.

---

## 📂 Ubicación de Archivos Clave
- **Controladores API**: `backend/app/Http/Controllers/`
- **Modelos BD**: `backend/app/Models/`
- **Vistas Frontend**: `app/src/pages/`
- **Estilos Globales**: `app/src/theme/variables.css`
