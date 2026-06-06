# Obel Challenge API

API RESTful construida con NestJS, Prisma y SQLite para gestión de usuarios y roles.

## 🚀 Características

- Gestión de usuarios y roles
- Autenticación mediante Bearer Token
- Documentación automática con Swagger
- Base de datos SQLite con Prisma ORM
- Validación de datos con class-validator
- Arquitectura modular con NestJS

## 📋 Prerrequisitos

- Node.js (v18 o superior)
- pnpm (recomendado) o npm

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd obel-challenge
```

2. Instalar dependencias:
```bash
pnpm install
```

3. Configurar variables de entorno (ver sección Variables de Entorno)

4. Generar cliente de Prisma:
```bash
pnpm prisma:generate
```

5. Ejecutar migraciones de la base de datos:
```bash
pnpm prisma:migrate
```

## 🏃 Ejecución

### Modo Desarrollo
```bash
pnpm start:dev
```

### Modo Producción
```bash
pnpm build
pnpm start:prod
```

### Otros comandos útiles
```bash
# Formatear código
pnpm format

# Ejecutar linter
pnpm lint

# Ejecutar tests
pnpm test
pnpm test:cov

# Prisma Studio (interfaz visual para la base de datos)
pnpm prisma:studio
```

## 🔐 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Puerto del servidor (default: 3000)
PORT=3000

# Token de autenticación Bearer (default: hardcoded-token)
AUTH_TOKEN=hardcoded-token

NODE_ENV=development

DATABASE_URL="file:./dev.db"

```

## 📚 Documentación de la API

Una vez iniciada la aplicación, la documentación de Swagger estará disponible en:
- **Local**: http://localhost:3000/api/docs
- **Producción**: obel-challenge-production.up.railway.app/api/docs

Para autenticarte en la API, usa el token configurado en la variable `AUTH_TOKEN` en el header `Authorization`:
```
Authorization: Bearer tu-token-seguro-aqui
```

## 🌐 Link a Producción

https://obel-challenge-production.up.railway.app/

## 📁 Estructura del Proyecto

```
src/
├── auth/           # Módulo de autenticación
├── common/         # Utilidades comunes (filtros, decoradores, etc.)
├── roles/          # Módulo de gestión de roles
├── users/          # Módulo de gestión de usuarios
├── app.module.ts   # Módulo principal
└── main.ts         # Punto de entrada de la aplicación
```

## 🗄️ Base de Datos

El proyecto utiliza SQLite como base de datos con Prisma ORM. El esquema incluye:
- **Users**: Usuarios del sistema
- **Roles**: Roles disponibles
- **UserRole**: Relación muchos a muchos entre usuarios y roles

## 🛠️ Tecnologías

- **Framework**: NestJS
- **Servidor HTTP**: Fastify
- **ORM**: Prisma
- **Base de Datos**: SQLite
- **Validación**: class-validator, class-transformer
- **Documentación**: Swagger/OpenAPI
- **Lenguaje**: TypeScript

## 📝 Licencia

UNLICENSED