# 🍽️ FOODLINK - Guía de Ejecución

## Instalación Inicial (Solo una vez)

1. Asegúrate de tener **Node.js** instalado en tu sistema
   - Descárgalo desde: https://nodejs.org/

2. En la carpeta del proyecto, ejecuta:
   ```
   SETUP.bat
   ```
   
   O en terminal PowerShell/CMD:
   ```
   npm install
   npm run build
   ```

## Ejecutar la Aplicación (Sin VS Code)

### Opción 1: Doble clic en el archivo batch (Recomendado)
- Ejecuta el archivo `RUN_APP.bat` haciendo doble clic
- Se abrirá automáticamente en tu navegador en `http://localhost:4173/`

### Opción 2: Desde terminal
```
npm run preview
```

Luego abre tu navegador en: `http://localhost:4173/`

## Características Principales

✅ **Autenticación**: Login seguro con email y contraseña  
✅ **Dashboard**: Listado de donaciones con búsqueda y filtros  
✅ **Publicar Donaciones**: Formulario multi-paso para donar alimentos  
✅ **Mapa**: Visualizar donaciones cercanas en tiempo real  
✅ **Perfil**: Gestionar tu cuenta y ver estadísticas  
✅ **Favoritos**: Guardar donaciones que te interesan  
✅ **Notificaciones**: Toast alerts para acciones importantes  

## Datos de Prueba

Puedes usar cualquier email y contraseña (mínimo 4 caracteres) para crear una cuenta.

Ejemplos:
- Email: `usuario@email.com`
- Contraseña: `1234`
- Email: `donante@test.com`
- Contraseña: `test123`

## Requisitos del Sistema

- **Node.js**: v16 o superior
- **Navegador**: Chrome, Firefox, Safari o Edge (moderno)
- **RAM**: Mínimo 512MB
- **Espacio**: ~300MB (incluye node_modules)

## Solución de Problemas

**Puerto 4173 ya está en uso:**
```
npm run preview -- --port 5174
```

**No se puede ejecutar .bat en Windows:**
1. Click derecho en `RUN_APP.bat`
2. Selecciona "Ejecutar como administrador"

**Verificar que Node está instalado:**
```
node --version
npm --version
```

## Desarrollo

Para modo desarrollo con hot reload:
```
npm run dev
```

Para verificar errores de código:
```
npm run lint
```

---

**Última actualización:** 2024  
**Versión:** 1.0.0
