# Guía para Generar APK de FOODLINK

## Requisitos Previos

Asegúrate de tener instalados:
- **Node.js** (v16+)
- **Java JDK** (v11 o superior)
- **Android SDK** (descargable desde Android Studio)
- **Gradle**

Si no tienes Android Studio, descárgalo desde: https://developer.android.com/studio

## Pasos para Generar el APK

### 1. Instalar Capacitor
```powershell
cd c:\Users\mario\OneDrive\Escritorio\FOODLINK

# Instalar Capacitor globalmente y en el proyecto
npm install -g @capacitor/cli
npm install @capacitor/core @capacitor/android
```

### 2. Inicializar Capacitor
```powershell
# Inicializar Capacitor (será interactivo)
npx cap init

# En el prompt, ingresa:
# - App name: FOODLINK
# - App Package: com.foodlink.app
# - Keep existing capacitor.config.json: (press enter or y)
```

### 3. Build de Producción
```powershell
# Crear build de producción optimizado
npm run build
```

Esto generará la carpeta `dist/` con los archivos optimizados.

### 4. Agregar Plataforma Android
```powershell
# Agregar Android como plataforma
npx cap add android
```

Esto crea la carpeta `android/` con el proyecto Android Studio.

### 5. Sincronizar Archivos
```powershell
# Copiar los archivos de la app al proyecto Android
npx cap sync android
```

### 6. Abrir en Android Studio
```powershell
# Abrir el proyecto en Android Studio (si está instalado)
npx cap open android
```

Alternativamente, puedes abrir manualmente:
- Ve a la carpeta `android/` creada
- Abre `android/` como proyecto en Android Studio

### 7. Compilar a APK en Android Studio

**Opción A: Desde Android Studio (interfaz gráfica)**
1. En Android Studio, ve a: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
2. Espera a que compile
3. El APK se guardará en: `android/app/build/outputs/apk/debug/`

**Opción B: Desde línea de comandos**
```powershell
cd android
./gradlew assembleDebug
```

El APK se creará en: `android/app/build/outputs/apk/debug/app-debug.apk`

### 8. APK Release (para producción)

Para crear un APK de release (optimizado y sin debugging):

```powershell
cd android
./gradlew assembleRelease
```

El APK estará en: `android/app/build/outputs/apk/release/app-release.apk`

**Nota:** Necesitarás generar un keystore para firmar el APK de release.

## Resumen de Comandos Rápido

```powershell
cd c:\Users\mario\OneDrive\Escritorio\FOODLINK

# Instalar dependencias
npm install @capacitor/core @capacitor/android

# Inicializar Capacitor
npx cap init

# Build de producción
npm run build

# Agregar Android
npx cap add android

# Sincronizar
npx cap sync android

# Compilar
cd android
./gradlew assembleDebug

# APK resultante
# android/app/build/outputs/apk/debug/app-debug.apk
```

## Problemas Comunes

### "Java not found"
- Instala JDK desde: https://www.oracle.com/java/technologies/downloads/
- Agrega Java a las variables de entorno (JAVA_HOME)

### "Android SDK not found"
- Descarga Android Studio
- Durante la instalación, instala Android SDK
- Agrega ANDROID_HOME a las variables de entorno

### Gradle no compila
```powershell
# Limpia la caché
cd android
./gradlew clean

# Intenta compilar de nuevo
./gradlew assembleDebug
```

## Distribución

Una vez tengas el APK:
- **Para testing**: Comparte `app-debug.apk` directamente
- **Para producción**: Usa `app-release.apk` firmado
- Sube a Google Play Store o distribúyelo a través de un servidor

---

¿Necesitas ayuda con algún paso específico?
