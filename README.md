# App de Rentas - Guía de Configuración e Inicio

Este proyecto consta de dos partes principales:
1. **Backend**: API construida con PHP (Laravel 11) y base de datos MySQL (administrada con Docker).
2. **Frontend**: Aplicación móvil/web desarrollada con Ionic + React + Vite.

---

## 🛠️ Prerrequisitos

Asegúrate de tener instalado lo siguiente en tu sistema:
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (para levantar la base de datos MySQL).
- **[PHP 8.2+](https://www.php.net/)** junto con **[Composer](https://getcomposer.org/)**.
- **[Node.js v18+](https://nodejs.org/)** junto con **npm**.

---

## 🚀 Pasos para Iniciar el Proyecto

### 1. Iniciar la Base de Datos (Docker)

En la raíz del proyecto, ejecuta el siguiente comando para levantar el contenedor de MySQL:

```bash
docker compose up -d
```

> [!NOTE]
> Esto iniciará un contenedor de MySQL en el puerto `3306` con la base de datos llamada `rent_control` y contraseña de root `root`.

---

### 2. Configurar e Iniciar el Backend (Laravel)

1. Dirígete a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias de PHP:
   ```bash
   composer install
   ```
3. Copia el archivo de configuración del entorno:
   ```bash
   copy .env.example .env
   ```
4. Genera la clave de la aplicación Laravel:
   ```bash
   php artisan key:generate
   ```
5. En tu archivo `.env`, asegúrate de configurar las credenciales de la base de datos para que coincidan con Docker:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=rent_control
   DB_USERNAME=root
   DB_PASSWORD=root
   ```
6. Ejecuta las migraciones para crear las tablas de la base de datos:
   ```bash
   php artisan migrate
   ```
7. Inicia el servidor de desarrollo de Laravel:
   ```bash
   php artisan serve
   ```
   *El backend estará disponible en: **`http://127.0.0.1:8000`***.

---

### 3. Configurar e Iniciar el Frontend (Ionic + React)

1. Dirígete a la carpeta del frontend (desde la raíz del proyecto):
   ```bash
   cd app
   ```
2. Instala las dependencias de Node:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```
   *El frontend estará disponible en: **`http://localhost:5173`***.

---

## 🛑 Detener los Servidores

- Para detener los servidores de desarrollo (Backend / Frontend), pulsa `Ctrl + C` en sus respectivas terminales.
- Para detener el contenedor de la base de datos Docker:
  ```bash
  docker compose down
  ```
