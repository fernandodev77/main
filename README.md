# 🎵 Disonancia Player v3.0

Reproductor musical avanzado con contador regresivo para promocionar releases, visualizaciones 3D interactivas y funciones de compartir en redes sociales.

## ✨ Características

### 🏠 Pantalla de Inicio
- **Contador regresivo** dinámico hasta la fecha de lanzamiento
- **Animación de fondo tipo galaxia** con partículas interactivas
- **Diseño responsivo** con colores fríos y efectos de brillo
- **Botón de reproducir** con efectos visuales

### 🎧 Reproductor Musical
- **Visualización de onda de audio** con WaveSurfer.js
- **Controles completos** de reproducción (play/pausa, volumen)
- **Información de la canción** (título, artista, cover)
- **Contador de tiempo** transcurrido y restante

### 🎨 Visualizador 3D
- **Tres estilos de visualización** diferentes:
  - **Galaxia**: Partículas en espiral con rotación
  - **Nebulosa**: Efecto de nube cósmica con transparencias
  - **Cosmos**: Múltiples capas esféricas con brillo
- **Sincronización con audio** usando Web Audio API
- **Animaciones fluidas** con Three.js
- **Selector de estilos** en tiempo real

### 📱 Funciones Sociales
- **Botón de pre-save** para Spotify
- **Compartir en redes sociales** con Web Share API
- **Generación automática** de imágenes para Instagram Stories
- **Canvas de exportación** con animación de 5 segundos
- **Formato optimizado** para móviles (9:16)

### 🎛️ Controles Avanzados
- **Teclas de acceso rápido** (Espacio, Enter, Escape)
- **Interfaz intuitiva** con efectos hover y transiciones
- **Botón discreto** de visualización 3D
- **Optimización de recursos** cuando la página está oculta

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (versión 16 o superior)
- Navegador moderno con soporte para Web Audio API y WebGL

### Instalación

1. **Clonar o descargar** el proyecto
2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar tu música**:
   - Coloca tu archivo de audio en `./Audio/song.mp3`
   - Coloca la imagen de portada en `./albumcover/cover.jpg`
   - Edita `./js/config.js` con la información de tu canción

4. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

5. **Construir para producción**:
   ```bash
   npm run build
   ```

## ⚙️ Configuración

Edita el archivo `js/config.js` para personalizar:

```javascript
const CONFIG = {
    songInfo: {
        title: "Tu Canción",
        artist: "Tu Nombre",
        audioFile: "./Audio/song.mp3",
        coverImage: "./albumcover/cover.jpg",
        presaveLink: "https://tu-enlace-spotify.com"
    },
    releaseDate: new Date(2025, 11, 31, 0, 0), // Año, mes-1, día, hora, minuto
    visualizer: {
        colors: {
            primary: "#4a90e2",
            secondary: "#7b68ee",
            accent: "#00d4ff",
            background: "#0a0a0a"
        }
    },
    sharing: {
        text: "¡Escucha mi nuevo lanzamiento!",
        hashtags: ["#NuevoLanzamiento", "#Música"],
        url: "@tu_usuario"
    }
};
```

## 🎯 Tecnologías Utilizadas

- **Vanilla JavaScript** - Sin frameworks, máximo rendimiento
- **WaveSurfer.js** - Visualización de ondas de audio
- **Three.js** - Gráficos 3D y animaciones
- **Web Audio API** - Análisis de audio en tiempo real
- **Web Share API** - Compartir nativo en dispositivos móviles
- **Canvas API** - Generación de imágenes para compartir
- **CSS3** - Animaciones y efectos visuales
- **Vite** - Herramienta de desarrollo y construcción

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 14+
- ✅ Edge 80+

### Características por Navegador
- **Web Audio API**: Requerida para visualizaciones
- **WebGL**: Necesario para efectos 3D
- **Web Share API**: Disponible principalmente en móviles
- **Canvas**: Soporte universal

## 🎮 Controles

### Teclado
- **Espacio**: Play/Pausa (en el reproductor)
- **Enter**: Ir al reproductor (desde inicio)
- **Escape**: Volver al inicio (desde reproductor)

### Ratón/Touch
- **Click en waveform**: Buscar posición en la canción
- **Arrastrar volumen**: Ajustar nivel de audio
- **Hover en partículas**: Efecto de repulsión en el fondo

## 🔧 Personalización

### Colores y Temas
Modifica los colores en `CONFIG.visualizer.colors` para cambiar la paleta:

```javascript
colors: {
    primary: "#tu-color-primario",
    secondary: "#tu-color-secundario",
    accent: "#tu-color-acento",
    background: "#tu-color-fondo"
}
```

### Estilos de Visualización
Añade nuevos estilos en `CONFIG.visualizer.styles`:

```javascript
{
    name: "Tu Estilo",
    type: "tu-tipo",
    particleCount: 1000,
    colors: ["#color1", "#color2", "#color3"]
}
```

### Fecha de Lanzamiento
Cambia la fecha objetivo en `CONFIG.releaseDate`:

```javascript
// Formato: new Date(año, mes-1, día, hora, minuto)
releaseDate: new Date(2025, 0, 15, 12, 0) // 15 de Enero 2025, 12:00
```

## 📊 Rendimiento

- **Optimización automática** cuando la página está oculta
- **Gestión eficiente** de partículas y animaciones
- **Carga diferida** de componentes pesados
- **Limpieza automática** de recursos al cambiar pantallas

## 🐛 Debugging

Usa la consola del navegador:

```javascript
// Información del estado actual
debugApp();

// Estado detallado de la aplicación
disonanciaApp.getAppState();

// Verificar componentes
console.log(window.musicPlayer, window.audioVisualizer);
```

## 📄 Licencia

ISC License - Libre para uso personal y comercial.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Si encuentras algún problema:

1. Verifica la consola del navegador
2. Asegúrate de que los archivos de audio/imagen existen
3. Confirma que tu navegador soporta las APIs necesarias
4. Revisa la configuración en `config.js`

---

**¡Disfruta creando experiencias musicales increíbles! 🎵✨**