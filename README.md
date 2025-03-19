# InstaPost

Una aplicación móvil para compartir y gestionar posts con imágenes, similar a Instagram, desarrollada con React Native.

## Características principales

- Publicación de posts con imágenes
- Sistema de likes con actualización en tiempo real
- Navegación por pestañas
- Mapa con ubicación de posts
- Filtrado y búsqueda de posts
- Ordenación de posts por fecha (más recientes primero)
- Visualización de posts con más likes
- Notificaciones toast personalizadas
- Soporte para temas claro/oscuro

## Arquitectura del proyecto

La aplicación está construida siguiendo una arquitectura de capas que separa claramente las responsabilidades:

### Estructura de carpetas

```
src/
|-- app/
|   |-- config/           # Configuración global, temas, helpers
|   |-- domain/           # Lógica de negocio y modelos
|   |-- infrastructure/   # Implementaciones concretas (API, almacenamiento)
|   |-- presentation/     # Componentes UI y lógica de presentación
|       |-- components/   # Componentes reutilizables
|       |-- context/      # Contextos de React (tema, usuario, etc.)
|       |-- hooks/        # Hooks personalizados
|       |-- layouts/      # Componentes de layout
|       |-- routes/       # Configuración de navegación
|       |-- screens/      # Pantallas de la aplicación
|-- server/               # Servidor mock para desarrollo
```

### Patrones de diseño implementados

1. **Clean Architecture**: Separación clara entre dominio, infraestructura y presentación.
2. **Hooks Pattern**: Uso extensivo de hooks personalizados para encapsular lógica reutilizable.
3. **Context API**: Para gestionar el estado global de la aplicación.
4. **Repository Pattern**: Para abstraer el acceso a datos.
5. **Presentational and Container Components**: Separación entre componentes de presentación y contenedores.

## Sostenibilidad y escalabilidad

### Sostenibilidad

El proyecto es altamente sostenible debido a:

- **Separación de responsabilidades**: Cada capa tiene una responsabilidad clara.
- **Código modular**: Componentes y lógica reutilizables.
- **Pruebas**: Estructura preparada para implementar pruebas unitarias y de integración.
- **Documentación**: Código autodocumentado con tipos TypeScript.

### Escalabilidad

La arquitectura permite escalar fácilmente:

- **Nuevas características**: Se pueden añadir nuevos módulos sin afectar a los existentes.
- **Cambios en la API**: La capa de infraestructura aísla los cambios en el backend.
- **Múltiples plataformas**: La lógica de negocio es independiente de la UI.
- **Equipo de desarrollo**: Varios desarrolladores pueden trabajar en paralelo en diferentes módulos.

## Tecnologías utilizadas

### Core

- **React Native**: Framework para desarrollo móvil multiplataforma.
- **TypeScript**: Tipado estático para mejorar la calidad del código y la experiencia de desarrollo.

### Estado y gestión de datos

- **React Query**: Para gestionar el estado del servidor, caché y sincronización.
- **Context API**: Para el estado global de la aplicación.
- **Zustand**: Gestor de estado minimalista para estados específicos.

### UI y navegación

- **React Navigation**: Para la navegación entre pantallas.
- **React Native Vector Icons**: Iconos vectoriales.
- **React Native Maps**: Integración de mapas.
- **React Native Toast Message**: Notificaciones toast personalizadas.

### Backend simulado

- **JSON Server**: API REST mock para desarrollo.

## Configuración del entorno

### Variables de entorno

La aplicación utiliza `react-native-dotenv` para gestionar variables de entorno. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
API_URL=http://'IP_ADDRESS':3000
API_URL_IOS=http://localhost:3000
API_URL_ANDROID=http://'IP_ADDRESS':3000
```

## Funcionalidades destacadas

### Sistema de likes en tiempo real

La aplicación implementa un sistema de likes que se actualiza en tiempo real en todas las vistas:

- Invalidación completa de consultas relacionadas con posts
- Invalidación específica de consultas por ID y autor
- Refetch forzado para garantizar la actualización de la UI
- Manejo de estado local para una UI responsiva

### Ordenación de posts

Los posts se ordenan por fecha (más recientes primero) en todas las vistas principales:

- Función `getPosts`: Obtiene todos los posts ordenados por fecha descendente
- Función `getPostByUser`: Obtiene los posts de un usuario específico ordenados por fecha descendente
- Función `getRecentPosts`: Obtiene explícitamente los posts más recientes

### Posts con más likes

La aplicación muestra los posts con más likes de un usuario:

- Función `getPostsMostLikes`: Obtiene y ordena los posts por número de likes

## Justificación de las herramientas

- **React Native**: Permite desarrollo multiplataforma con una única base de código, reduciendo tiempo y costos de desarrollo.
- **TypeScript**: Mejora la calidad del código, facilita el mantenimiento y proporciona autocompletado e información de tipos.
- **React Query**: Simplifica la gestión de datos del servidor con caché integrada, revalidación y actualizaciones optimistas.
- **Zustand**: Alternativa ligera a Redux, con una API simple y sin boilerplate.
- **React Navigation**: Solución de navegación completa y bien mantenida para React Native.
- **JSON Server**: Permite simular una API REST completa sin necesidad de un backend real durante el desarrollo.
