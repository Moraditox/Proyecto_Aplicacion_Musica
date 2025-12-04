# 🎵 Music Player App

Aplicación de música estilo Apple Music desarrollada con React Native (Expo) para el frontend y Laravel para el backend. Permite reproducir música almacenada en un servidor local, gestionar canciones, crear favoritos y controlar la reproducción con una interfaz moderna y elegante.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Desarrollo](#-desarrollo)
- [Crear Build para iOS (.ipa)](#-crear-build-para-ios-ipa)
- [API Endpoints](#-api-endpoints)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Características

### Frontend (React Native)
- 🎨 **Interfaz estilo Apple Music** con gradientes y efectos blur
- 🎵 **Reproductor de audio completo** con controles de play/pause, siguiente, anterior
- 📊 **Barra de progreso interactiva** con seek
- 🔊 **Control de volumen inline** con slider y porcentaje
- ❤️ **Sistema de favoritos** persistente
- 📱 **Navegación por tabs** (Home, Library, Search)
- 🎼 **Visualización de álbumes** con carátulas
- 🔍 **Búsqueda de canciones** en tiempo real
- 🌙 **Diseño dark mode** con colores vibrantes
- 📲 **Reproducción en segundo plano** (iOS)

### Backend (Laravel)
- 🗄️ **API RESTful** para gestión de canciones
- 📁 **Almacenamiento local** de archivos de audio y carátulas
- 🖼️ **Gestión de metadatos** (título, artista, álbum, duración)
- 🌐 **CORS configurado** para acceso desde la red local
- 📤 **Interfaz web** para subir canciones

---

## 🛠️ Tecnologías

### Frontend
- **React Native** 0.81.5
- **Expo** ~54.0.25
- **React Navigation** 7.x
- **expo-av** ~16.0.7 (reproducción de audio)
- **expo-blur** ~15.0.7 (efectos visuales)
- **expo-linear-gradient** ~15.0.7
- **AsyncStorage** (persistencia de favoritos)

### Backend
- **Laravel** 10.x
- **PHP** 8.x
- **MySQL** / SQLite
- **Composer**

---

## 📁 Estructura del Proyecto

```
music-player-app/
├── Musica-frontend/          # Aplicación React Native
│   ├── screens/              # Pantallas de la app
│   │   ├── HomeScreen.js
│   │   ├── PlayerScreen.js
│   │   ├── LibraryScreen.js
│   │   └── SearchScreen.js
│   ├── components/           # Componentes reutilizables
│   │   ├── MiniPlayer.js
│   │   ├── SongCard.js
│   │   ├── AlbumCard.js
│   │   └── FavoriteButton.js
│   ├── context/              # Context API
│   │   └── MusicContext.js   # Estado global del reproductor
│   ├── assets/               # Imágenes y recursos
│   ├── app.json              # Configuración de Expo
│   ├── eas.json              # Configuración de EAS Build
│   └── package.json
│
├── Musica-backend/           # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   └── SongController.php
│   │   └── Models/
│   │       └── Song.php
│   ├── database/
│   │   └── migrations/
│   ├── public/
│   │   ├── songs/            # Archivos de audio
│   │   └── covers/           # Carátulas
│   ├── routes/
│   │   ├── api.php
│   │   └── web.php
│   └── storage/
│
└── README.md
```

---

## 🚀 Instalación

### Requisitos Previos

- **Node.js** 18.x o superior
- **npm** o **yarn**
- **PHP** 8.x
- **Composer**
- **MySQL** o **SQLite**
- **Expo Go** app (para desarrollo en móvil)

### 1. Clonar el Repositorio

```bash
git clone <tu-repositorio>
cd music-player-app
```

### 2. Configurar Backend (Laravel)

```bash
cd Musica-backend

# Instalar dependencias
composer install

# Copiar archivo de configuración
cp .env.example .env

# Generar key de aplicación
php artisan key:generate

# Configurar base de datos en .env
# Edita .env y configura tus credenciales de base de datos

# Ejecutar migraciones
php artisan migrate

# Crear enlace simbólico para storage
php artisan storage:link

# Iniciar servidor (accesible en red local)
php artisan serve --host=0.0.0.0 --port=8000
```

### 3. Configurar Frontend (React Native)

```bash
cd ../Musica-frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npx expo start
```

---

## ⚙️ Configuración

### 1. Configurar IP del Backend

Edita `Musica-frontend/context/MusicContext.js` y actualiza la URL del API:

```javascript
const API_URL = 'http://YOUR_LOCAL_IP:8000/api';
```

**Para encontrar tu IP local:**
- **Windows:** `ipconfig` en CMD
- **Mac/Linux:** `ifconfig` en Terminal
- Busca la dirección IPv4 de tu red WiFi (ejemplo: `192.168.1.100`)

### 2. Configurar Bundle Identifier (iOS)

Edita `Musica-frontend/app.json` y cambia el `bundleIdentifier`:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.musicapp"
    },
    "android": {
      "package": "com.yourcompany.musicapp"
    }
  }
}
```

> ⚠️ **Importante:** El Bundle Identifier debe ser único. Usa el formato inverso de tu dominio.

### 3. Configurar EAS (Opcional)

Si vas a usar EAS Build, ejecuta:

```bash
eas build:configure
```

Esto creará/actualizará `eas.json` con tu configuración.

---

## 💻 Desarrollo

### Desarrollo con Expo Go

1. **Instala Expo Go** en tu dispositivo móvil:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Inicia el servidor:**
   ```bash
   cd Musica-frontend
   npx expo start
   ```

3. **Escanea el QR code:**
   - **iOS:** Usa la app de Cámara
   - **Android:** Usa Expo Go directamente

4. La app se cargará automáticamente en tu dispositivo

### Hot Reload

Los cambios en el código se recargan automáticamente. Si necesitas reiniciar:

- Sacude el dispositivo
- Toca "Reload" en el menú de desarrollo
- O ejecuta `npx expo start -c` para limpiar caché

---

## 📱 Crear Build para iOS (.ipa)

### Opción 1: Build en la Nube con EAS (Recomendado)

#### Requisitos
- Cuenta de Expo (gratis en [expo.dev](https://expo.dev))
- **Cuenta de Apple Developer** ($99/año) - **REQUERIDA para builds de producción**

#### Pasos

1. **Instalar EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Iniciar sesión en Expo**
   ```bash
   eas login
   ```

3. **Configurar el proyecto (si no lo has hecho)**
   ```bash
   eas build:configure
   ```

4. **Crear build de producción para iOS**
   ```bash
   eas build --platform ios --profile production
   ```

5. **Esperar a que el build se complete** (10-20 minutos)
   - El proceso se ejecuta en los servidores de Expo
   - Puedes cerrar la terminal, el build continuará
   - Recibirás una notificación por email cuando termine

6. **Descargar el archivo .ipa**
   - Copia el enlace de descarga de la terminal
   - O visita [expo.dev](https://expo.dev) → Projects → Builds

7. **Distribuir el .ipa**
   - **TestFlight:** Usa `eas submit --platform ios` para subir a App Store Connect
   - **Instalación directa:** Usa herramientas como Apple Configurator 2

---

### Opción 2: Build Local en Mac

#### Requisitos
- **Mac** con macOS 12 o superior
- **Xcode** 14 o superior instalado desde App Store
- **Cuenta de Apple Developer** ($99/año)
- **CocoaPods** instalado: `sudo gem install cocoapods`

#### Pasos Detallados

1. **Preparar el proyecto**
   ```bash
   cd Musica-frontend
   npm install
   ```

2. **Generar archivos nativos de iOS**
   ```bash
   npx expo prebuild --platform ios
   ```

3. **Instalar dependencias de iOS**
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Abrir proyecto en Xcode**
   ```bash
   open ios/Musicafrontend.xcworkspace
   ```

5. **Configurar Signing en Xcode**
   - Selecciona el proyecto en el navegador izquierdo
   - Selecciona el target principal
   - Ve a la pestaña "Signing & Capabilities"
   - Marca "Automatically manage signing"
   - Selecciona tu Team (Apple Developer Account)
   - Xcode generará automáticamente los certificados necesarios

6. **Seleccionar dispositivo de destino**
   - En la barra superior de Xcode
   - Selecciona "Any iOS Device (arm64)"

7. **Crear Archive**
   - Menú: **Product** → **Archive**
   - Espera a que termine el proceso (puede tomar varios minutos)
   - Se abrirá automáticamente el "Organizer"

8. **Exportar .ipa**
   - En el Organizer, selecciona el archive recién creado
   - Click en **Distribute App**
   - Selecciona el método de distribución:
     - **App Store Connect:** Para subir a TestFlight/App Store
     - **Ad Hoc:** Para distribución interna (hasta 100 dispositivos)
     - **Development:** Para testing en dispositivos de desarrollo
   - Sigue el asistente y guarda el .ipa

9. **Instalar el .ipa en dispositivos**
   
   **Método 1: Apple Configurator 2 (Recomendado)**
   - Descarga Apple Configurator 2 desde App Store
   - Conecta el iPhone con cable USB
   - Arrastra el .ipa al dispositivo
   
   **Método 2: Xcode**
   - Conecta el iPhone
   - Menú: **Window** → **Devices and Simulators**
   - Arrastra el .ipa a la sección "Installed Apps"
   
   **Método 3: AirDrop**
   - Envía el .ipa por AirDrop
   - Abre el archivo en el iPhone
   - Sigue las instrucciones de instalación

---

### Opción 3: Build de Desarrollo (Sin Apple Developer Account)

> ⚠️ **Limitación:** Los builds expiran después de 7 días

```bash
eas build --profile development-ios --platform ios
```

Este tipo de build:
- ✅ No requiere cuenta de Apple Developer de pago
- ✅ Útil para testing rápido
- ❌ Expira en 7 días
- ❌ No se puede publicar en App Store
- ❌ Requiere reinstalación semanal

---

## 🔌 API Endpoints

### Base URL
```
http://YOUR_LOCAL_IP:8000/api
```

### Endpoints Disponibles

#### Obtener todas las canciones
```http
GET /songs
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "title": "Song Title",
    "artist": "Artist Name",
    "album": "Album Name",
    "duration": 240,
    "audio_url": "http://YOUR_IP:8000/storage/songs/song.mp3",
    "cover_url": "http://YOUR_IP:8000/storage/covers/cover.jpg"
  }
]
```

#### Obtener una canción específica
```http
GET /songs/{id}
```

#### Crear una nueva canción
```http
POST /songs
Content-Type: multipart/form-data

{
  "title": "string",
  "artist": "string",
  "album": "string",
  "audio_file": "file (mp3, wav, etc.)",
  "cover_image": "file (jpg, png, etc.)"
}
```

#### Actualizar una canción
```http
PUT /songs/{id}
```

#### Eliminar una canción
```http
DELETE /songs/{id}
```

---

## 🐛 Troubleshooting

### El servidor no es accesible desde el móvil

**Problema:** La app no puede conectarse al backend

**Soluciones:**
1. Verifica que ambos dispositivos estén en la **misma red WiFi**
2. Desactiva el firewall temporalmente para probar
3. Verifica tu IP local:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig`
4. Asegúrate de usar `--host=0.0.0.0` al iniciar Laravel
5. Prueba acceder a `http://YOUR_IP:8000/api/songs` desde el navegador del móvil

### La app no se conecta al backend

**Problema:** Error de conexión o timeout

**Soluciones:**
1. Verifica la URL en `context/MusicContext.js`
2. Prueba la API en el navegador: `http://YOUR_IP:8000/api/songs`
3. Revisa la configuración CORS en Laravel (`config/cors.php`)
4. Verifica que el servidor Laravel esté corriendo

### El audio no se reproduce

**Problema:** Las canciones no suenan

**Soluciones:**
1. Verifica que los archivos de audio estén en `public/storage/songs`
2. Ejecuta `php artisan storage:link` en el backend
3. Verifica que las URLs sean accesibles desde el navegador
4. Comprueba el formato de audio (mp3, wav, m4a son compatibles)
5. Revisa los permisos de los archivos

### Build de iOS falla

**Problema:** EAS Build o Xcode fallan al crear el .ipa

**Soluciones:**
1. Verifica que `bundleIdentifier` sea único y válido
2. Asegúrate de estar logueado en EAS: `eas whoami`
3. Revisa los logs del build en [expo.dev](https://expo.dev)
4. Para builds locales:
   - Verifica que los certificados estén configurados en Xcode
   - Limpia el build: **Product** → **Clean Build Folder**
   - Actualiza CocoaPods: `cd ios && pod update && cd ..`

### Expo Go no encuentra el servidor

**Problema:** El QR code no funciona

**Soluciones:**
1. Usa el modo túnel: `npx expo start --tunnel`
2. Verifica que el firewall no bloquee el puerto 8081
3. Reinicia el servidor con caché limpia: `npx expo start -c`
4. Intenta conectar manualmente ingresando la URL en Expo Go

### Errores de dependencias

**Problema:** Errores al instalar o ejecutar

**Soluciones:**
1. Limpia caché de npm: `npm cache clean --force`
2. Elimina `node_modules` y reinstala: `rm -rf node_modules && npm install`
3. Verifica la versión de Node.js: `node --version` (debe ser 18.x o superior)
4. Para iOS: `cd ios && pod deintegrate && pod install && cd ..`

---

## 📝 Notas Importantes

### Volumen de la App vs Sistema

El control de volumen en la app ajusta el volumen de la aplicación, no del sistema. El volumen final es:

```
Volumen Final = Volumen del Sistema × Volumen de la App
```

Ejemplo: Si el sistema está al 50% y la app al 80%, el volumen real será 40%.

### Reproducción en Segundo Plano

La app está configurada para reproducir audio en segundo plano en iOS gracias a:

```json
"UIBackgroundModes": ["audio"]
```

Esto permite que la música continúe sonando cuando la app está minimizada.

### Limitaciones de Expo Go

- ❌ No soporta módulos nativos personalizados
- ❌ Algunas funcionalidades avanzadas no están disponibles
- ✅ Para funcionalidades completas, usa EAS Build o builds locales

### Seguridad

> ⚠️ **Importante para Producción**

Antes de publicar en producción:
1. Cambia todas las credenciales por defecto
2. Configura variables de entorno para datos sensibles
3. Habilita HTTPS en el backend
4. Implementa autenticación y autorización
5. Valida y sanitiza todas las entradas de usuario

---

## � Licencia

Este proyecto es de uso personal y educativo.

---

## 🙏 Agradecimientos

- [Expo](https://expo.dev) - Framework de desarrollo
- [React Native](https://reactnative.dev) - Framework móvil
- [Laravel](https://laravel.com) - Framework backend
- Comunidad open source

---

## 📞 Soporte

Para problemas o preguntas:
1. Revisa la sección de [Troubleshooting](#-troubleshooting)
2. Consulta la [documentación de Expo](https://docs.expo.dev)
3. Consulta la [documentación de Laravel](https://laravel.com/docs)
4. Abre un issue en GitHub

---

**¡Disfruta de tu música! 🎵**
