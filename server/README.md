# Squirrels Census API

Backend API para el censo de ardillas de Central Park 2018.

## Requisitos Previos

- Node.js 18+
- PostgreSQL 12+

## Configuración de Base de Datos

### 1. Instalar PostgreSQL

Descarga e instala PostgreSQL desde [postgresql.org](https://www.postgresql.org/download/)

### 2. Crear Base de Datos

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE squirrels_census;

# Salir
\q
```

### 3. Configurar Variables de Entorno

Copia `.env.example` a `.env` y actualiza las credenciales:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de PostgreSQL.

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar migraciones (crear tablas)
npm run migrate

# Cargar datos desde NYC Open Data
npm run seed
```

## Scripts Disponibles

- `npm run dev` - Inicia servidor en modo desarrollo con hot reload
- `npm run build` - Compila TypeScript a JavaScript
- `npm run start` - Inicia servidor en producción
- `npm run migrate` - Ejecuta migraciones de base de datos
- `npm run seed` - Carga datos del censo desde la API

## Endpoints

### Health Check
```
GET /api/health
```

### Squirrels

- `GET /api/squirrels` - Obtener todas las ardillas
- `GET /api/squirrels/:id` - Obtener una ardilla específica
- `POST /api/squirrels` - Crear nueva ardilla
- `PUT /api/squirrels/:id` - Actualizar ardilla
- `DELETE /api/squirrels/:id` - Eliminar ardilla

## Arquitectura

### Estructura de Directorios

```
src/
├── config/          # Configuración (database pool)
├── controllers/     # Controladores HTTP
├── database/        # Schemas y migraciones
├── repositories/    # Capa de acceso a datos
├── routes/          # Definición de rutas
├── scripts/         # Scripts de utilidad (seed, migrate)
├── services/        # Lógica de negocio
├── types/           # Tipos TypeScript
└── utils/           # Utilidades
```

### Mejores Prácticas Implementadas

#### 1. Connection Pooling
- Pool de conexiones configurado para máximo rendimiento
- Timeout y configuración optimizada
- Monitoreo de errores en conexiones idle

#### 2. Prepared Statements
- Todas las queries usan parámetros preparados
- Prevención de SQL injection
- Mejor performance en queries repetitivas

#### 3. Transacciones
- Bulk inserts usan transacciones
- Rollback automático en caso de error
- Integridad de datos garantizada

#### 4. Separación de Responsabilidades
- **Controllers**: Manejo de HTTP requests/responses
- **Services**: Lógica de negocio
- **Repositories**: Acceso a datos
- **Migrations**: Schema management

#### 5. Error Handling
- Try-catch en todas las operaciones async
- Liberación de recursos garantizada (finally)
- Códigos de estado HTTP apropiados

#### 6. Logging
- Log de queries con duración
- Monitoreo de clients checked out
- Logs estructurados

## Modelo de Datos

### Tabla: squirrels

Campos principales:
- `id` (PK) - Identificador único generado
- `latitude`, `longitude` - Coordenadas GPS
- `unique_squirrel_id` - ID del censo
- `hectare` - Cuadrante de Central Park
- `shift` - AM/PM
- `date` - Fecha de avistamiento
- `primary_fur_color` - Color principal del pelaje
- `age` - Edad (Adult/Juvenile)
- Comportamientos: `running`, `chasing`, `climbing`, `eating`, `foraging`
- Sonidos: `kuks`, `quaas`, `moans`
- Interacciones: `approaches`, `indifferent`, `runs_from`
- `created_at`, `updated_at` - Timestamps automáticos

### Índices

Índices creados para optimizar queries comunes:
- Coordenadas (latitude, longitude)
- unique_squirrel_id
- hectare
- date
- primary_fur_color

## Desarrollo

El servidor usa `tsx watch` para hot reload durante desarrollo. Los cambios se recargan automáticamente.

```bash
npm run dev
```

## Producción

```bash
# Compilar
npm run build

# Iniciar
npm start
```

