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

## 🚀 Inicio Rápido

1. **Instalar dependencias**
   ```bash
   cd src
   npm install
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus valores
   ```

3. **Ejecutar la aplicación**
   ```bash
   npm start
   ```

## 📝 Notas de Desarrollo

- El proyecto sigue una **arquitectura limpia** con separación de responsabilidades
- Usa **CommonJS** como módulo (ver `package.json`)
- Las conexiones a PostgreSQL están centralizadas en `infraestructure/db/pool.js`
- Los archivos `node_modules/` están ignorados en Git
