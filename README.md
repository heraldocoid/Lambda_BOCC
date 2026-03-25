# Lambda BOCC

Proyecto Node.js con arquitectura limpia para aplicaciones con Node.js y PostgreSQL.

## 📁 Estructura de Carpetas

```
lambda_BOCC/
├── src/
│   ├── application/        # Casos de uso y lógica de aplicación
│   ├── domain/             # Entidades y lógica de dominio
│   ├── infraestructure/    # Implementación de servicios externos
│   │   └── db/
│   │       └── pool.js     # Configuración del pool de conexiones PostgreSQL
│   ├── interfaces/         # Controladores y puertos (API endpoints, CLI, etc.)
│   ├── share/              # Utilidades y recursos compartidos
│   │   └── httpResponse.js # Helpers para respuestas HTTP
│   ├── package.json        # Dependencias y configuración del proyecto
│   └── package-lock.json
├── .env                    # Variables de entorno
├── .git/                   # Control de versiones
├── .gitignore             # Archivos ignorados por Git
└── node_modules/          # Dependencias instaladas
```

## 🏗️ Descripción de Carpetas

### `application/`
Contiene la lógica de negocio y casos de uso de la aplicación. Aquí se encuentran los servicios que coordinan las operaciones entre el dominio y la infraestructura.

### `domain/`
Define las entidades, valores y reglas del negocio. Esta es la capa más independiente y no tiene dependencias externas.

### `infraestructure/`
Implementa los detalles técnicos como:
- **`db/pool.js`**: Gestión de conexiones a PostgreSQL usando el cliente `pg`

### `interfaces/`
Define los puertos de entrada (controladores, APIs, etc.) que exponen la funcionalidad de la aplicación.

### `share/`
Recursos compartidos y utilidades:
- **`httpResponse.js`**: Funciones auxiliares para construir respuestas HTTP estandarizadas

## 📦 Dependencias

- **pg** (^8.20.0): Cliente de PostgreSQL para Node.js

## 🚀 Comandos de Compilación y Empaquetado

El proyecto está configurado para que puedas ejecutar todos los comandos desde la **carpeta raíz** del proyecto (gracias a los scripts en el `package.json`).

### 1. Instalar dependencias
Para instalar las dependencias necesarias de desarrollo y producción:
```bash
npm install --prefix src
```
*(Nota: Esto instalará las dependencias de la carpeta `src`)*

### 2. Compilar el proyecto (Build)
Para compilar el código TypeScript (`.ts`) a JavaScript (`.js`) en la carpeta `dist/`:
```bash
npm run build
```

### 3. Empaquetar para AWS Lambda (Package)
Para compilar, excluir las dependencias de desarrollo local y generar el archivo `.zip` listo para producción:
```bash
npm run package
```
Esto generará automáticamente un archivo llamado `lambda-release.zip` dentro de la carpeta `src/`.

---

## ☁️ Cómo Subir a AWS Lambda

Para desplegar el archivo `lambda-release.zip` generado a tu consola de AWS Lambda de forma manual, sigue estos pasos:

2. **Subir a la Consola de AWS**
   - Ingresa a la Consola de Amazon Web Services y busca **"Lambda"**.
   - Haz clic en **Crear Función** (o abre tu función existente si ya la creaste).
   - Dale un nombre y selecciona **Node.js** (ej: Node.js 18.x o 20.x) como el Runtime o Tiempo de Ejecución.
   - Ya en tu Función, en la pestaña de **"Código"**, haz clic en el botón **"Cargar desde" > "Archivo .zip"** y selecciona tu archivo `lambda-release.zip`.

5. **Configurar el Handler de Inicio**
   - Para que AWS sepa en qué archivo exacto entrar, debes ir un poco más abajo a la sección **"Configuración de tiempo de ejecución"** (Runtime Settings) y hacer clic en Editar.
   - Cambia el valor del campo **Controlador (Handler)** por:
     `dist/handler.handler`

6. **Variables de Entorno**
   - Ve a **Configuración > Variables de Entorno** dentro de la consola de tu Lambda.
   - Agrega ahí, una por una, cada variable del archivo `.env` que tengas localmente (por ejemplo, los datos del RDS de Postgres o las Regiones). NUNCA adjuntes el archivo `.env` dentro del propio `.zip` por motivos de seguridad.
