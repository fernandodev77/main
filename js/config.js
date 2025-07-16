/**
 * Configuración del reproductor Disonancia
 */

const CONFIG = {
    // Información de la canción
    songInfo: {
        title: "Magia de Curación",
        artist: "Sonido Galaxy",
        audioFile: "./Audio/song.mp3",
        coverImage: "./albumcover/cover.jpg",
        presaveLink: "https://open.spotify.com", // Enlace de pre-save (cambiar por el real)
    },
    
    // Fecha de lanzamiento (formato: año, mes-1, día, hora, minuto)
    // Nota: en JavaScript los meses van de 0 a 11, por eso se resta 1 al mes
    releaseDate: new Date(2025, 11, 31, 0, 0), // 31 de Diciembre de 2023
    
    // Configuración del visualizador
    visualizer: {
        colors: {
            primary: "#4a90e2",
            secondary: "#7b68ee",
            accent: "#00d4ff",
            background: "#0a0a0a"
        },
        styles: [
            {
                name: "Galaxia",
                type: "galaxy",
                particleCount: 1000,
                colors: ["#4a90e2", "#7b68ee", "#00d4ff", "#9370db"]
            },
            {
                name: "Nebulosa",
                type: "nebula",
                particleCount: 800,
                colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"]
            },
            {
                name: "Cosmos",
                type: "cosmos",
                particleCount: 1200,
                colors: ["#667eea", "#764ba2", "#f093fb", "#f5576c"]
            }
        ]
    },
    
    // Configuración para compartir
    sharing: {
        // Texto para la imagen compartida
        text: "¡Escucha mi nuevo lanzamiento!",
        // Hashtags para redes sociales
        hashtags: ["#NuevoLanzamiento", "#Música"],
        // URL para incluir en la imagen compartida (opcional)
        url: "@sonidogxlaxy"
    }
};