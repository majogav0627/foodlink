# 🎨 Logos de FOODLINK

## Cómo Instalar los Logos

1. Guarda tus logos aquí en esta carpeta:

   - **Logo Horizontal**: `logo-horizontal.png`
     - Versión con el texto "FOODLINK"
     - Se mostrará en la pantalla de login

   - **Logo Cuadrado/Icon**: `logo-icon.png`
     - Versión cuadrada del logo
     - Se mostrará en:
       - Pestaña del navegador (favicon)
       - Dashboard (arriba a la izquierda)
       - Mapa (en header)
       - Cualquier pantalla con logo pequeño

## Formatos Recomendados

- **Formato**: PNG (con fondo transparente preferible)
- **Logo Horizontal**: 1200px × 400px aprox
- **Logo Icon**: 256px × 256px o cuadrado

## Ubicaciones en la App

| Ubicación | Logo | Tamaño |
|-----------|------|--------|
| Login | logo-horizontal.png | 280px ancho |
| Dashboard | logo-icon.png | 36px |
| Mapa | logo-icon.png | 32px |
| Favicon (pestaña) | logo-icon.png | 32px |

## Pasos

1. Copia tus imágenes de logo a esta carpeta (`public/images/`)
2. Renómbralas como se indica arriba
3. Ejecuta `npm run dev` o `npm run build`
4. ¡Listo! Los logos aparecerán en la app

## Verificar

Después de copiar los logos:
- Abre la app en http://localhost:5173 (dev) o http://localhost:4173 (preview)
- El logo debe aparecer en login, dashboard y mapa
- La pestaña del navegador debe mostrar el icon

---

**Nota**: Si los logos no aparecen, asegúrate de que:
- El nombre del archivo sea exacto (`logo-horizontal.png`, `logo-icon.png`)
- Esté en la carpeta `public/images/`
- Hayas reiniciado el servidor
