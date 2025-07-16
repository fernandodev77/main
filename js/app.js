/**
 * Aplicación principal - Coordina todas las funcionalidades
 */

class DisonanciaApp {
    constructor() {
        this.currentScreen = 'home';
        this.isInitialized = false;
        
        this.screens = {
            home: document.getElementById('home-screen'),
            player: document.getElementById('player-screen')
        };
        
        this.init();
    }
    
    async init() {
        try {
            this.setupEventListeners();
            this.showScreen('home');
            
            // Esperar a que todos los componentes estén listos
            await this.waitForComponents();
            
            this.isInitialized = true;
            console.log('Disonancia App inicializada correctamente');
        } catch (error) {
            console.error('Error inicializando la aplicación:', error);
        }
    }
    
    async waitForComponents() {
        // Esperar a que los componentes principales estén disponibles
        return new Promise((resolve) => {
            const checkComponents = () => {
                if (window.galaxyBackground && 
                    window.countdownTimer && 
                    window.musicPlayer) {
                    resolve();
                } else {
                    setTimeout(checkComponents, 100);
                }
            };
            checkComponents();
        });
    }
    
    setupEventListeners() {
        // Botón principal de reproducir
        const playButton = document.getElementById('play-button');
        if (playButton) {
            playButton.addEventListener('click', () => {
                this.goToPlayer();
            });
        }
        
        // Botón de regreso
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.goToHome();
            });
        }
        
        // Teclas de navegación
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
        
        // Eventos de visibilidad de la página
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
        
        // Prevenir comportamientos por defecto
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault(); // Deshabilitar menú contextual
        });
        
        // Manejar errores globales
        window.addEventListener('error', (e) => {
            console.error('Error global:', e.error);
        });
    }
    
    handleKeyPress(e) {
        switch (e.code) {
            case 'Escape':
                if (this.currentScreen === 'player') {
                    this.goToHome();
                }
                break;
            case 'Enter':
                if (this.currentScreen === 'home') {
                    this.goToPlayer();
                }
                break;
            case 'Space':
                if (this.currentScreen === 'player') {
                    e.preventDefault();
                    if (window.musicPlayer) {
                        window.musicPlayer.togglePlayPause();
                    }
                }
                break;
        }
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            // Página oculta - pausar animaciones pesadas si es necesario
            this.onPageHidden();
        } else {
            // Página visible - reanudar animaciones
            this.onPageVisible();
        }
    }
    
    onPageHidden() {
        // Opcional: pausar animaciones para ahorrar recursos
        console.log('Página oculta - optimizando recursos');
    }
    
    onPageVisible() {
        // Reanudar animaciones
        console.log('Página visible - reanudando animaciones');
    }
    
    showScreen(screenName) {
        // Ocultar todas las pantallas
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Mostrar la pantalla solicitada
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
            this.currentScreen = screenName;
            
            // Ejecutar acciones específicas de la pantalla
            this.onScreenChange(screenName);
        }
    }
    
    onScreenChange(screenName) {
        switch (screenName) {
            case 'home':
                this.onHomeScreenActive();
                break;
            case 'player':
                this.onPlayerScreenActive();
                break;
        }
    }
    
    onHomeScreenActive() {
        // Asegurar que el contador esté funcionando
        if (window.countdownTimer && !window.countdownTimer.intervalId) {
            window.countdownTimer.startTimer();
        }
        
        // Pausar música si está reproduciéndose
        if (window.musicPlayer && window.musicPlayer.isCurrentlyPlaying()) {
            window.musicPlayer.pause();
        }
        
        // Desactivar visualizador
        if (window.audioVisualizer && window.audioVisualizer.isActive) {
            window.audioVisualizer.toggle();
        }
    }
    
    onPlayerScreenActive() {
        // Preparar el reproductor
        if (window.musicPlayer) {
            // El reproductor ya está inicializado, listo para usar
            console.log('Pantalla del reproductor activa');
        }
    }
    
    goToPlayer() {
        this.showScreen('player');
        
        // Añadir efecto de transición suave
        this.addTransitionEffect();
    }
    
    goToHome() {
        this.showScreen('home');
        
        // Añadir efecto de transición suave
        this.addTransitionEffect();
    }
    
    addTransitionEffect() {
        // Efecto visual de transición
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0.8';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 150);
        
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
    
    // Métodos públicos para interacción externa
    getCurrentScreen() {
        return this.currentScreen;
    }
    
    isReady() {
        return this.isInitialized;
    }
    
    // Método para obtener información del estado actual
    getAppState() {
        return {
            currentScreen: this.currentScreen,
            isInitialized: this.isInitialized,
            musicPlaying: window.musicPlayer ? window.musicPlayer.isCurrentlyPlaying() : false,
            visualizerActive: window.audioVisualizer ? window.audioVisualizer.isActive : false
        };
    }
    
    // Método para debugging
    debug() {
        console.log('=== DISONANCIA APP DEBUG ===');
        console.log('Estado actual:', this.getAppState());
        console.log('Componentes disponibles:', {
            galaxyBackground: !!window.galaxyBackground,
            countdownTimer: !!window.countdownTimer,
            musicPlayer: !!window.musicPlayer,
            audioVisualizer: !!window.audioVisualizer
        });
        console.log('Configuración:', CONFIG);
    }
    
    // Método de limpieza
    destroy() {
        // Limpiar todos los componentes
        if (window.galaxyBackground) {
            window.galaxyBackground.destroy();
        }
        
        if (window.countdownTimer) {
            window.countdownTimer.destroy();
        }
        
        if (window.musicPlayer) {
            window.musicPlayer.destroy();
        }
        
        if (window.audioVisualizer) {
            window.audioVisualizer.destroy();
        }
        
        console.log('Aplicación destruida');
    }
}

// Función de inicialización global
function initializeApp() {
    // Verificar que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.disonanciaApp = new DisonanciaApp();
        });
    } else {
        window.disonanciaApp = new DisonanciaApp();
    }
}

// Función para mostrar información de carga
function showLoadingInfo() {
    console.log('%c🎵 Disonancia Player v3.0', 'color: #4a90e2; font-size: 16px; font-weight: bold;');
    console.log('%cCargando componentes...', 'color: #7b68ee;');
}

// Función de utilidad para verificar soporte del navegador
function checkBrowserSupport() {
    const features = {
        webAudio: !!(window.AudioContext || window.webkitAudioContext),
        webGL: !!window.WebGLRenderingContext,
        canvas: !!document.createElement('canvas').getContext,
        webShare: !!navigator.share
    };
    
    console.log('Soporte del navegador:', features);
    
    if (!features.webAudio) {
        console.warn('Web Audio API no soportada - algunas funciones pueden no funcionar');
    }
    
    if (!features.webGL) {
        console.warn('WebGL no soportado - visualizaciones 3D no disponibles');
    }
    
    return features;
}

// Inicializar la aplicación
showLoadingInfo();
checkBrowserSupport();
initializeApp();

// Hacer disponibles funciones globales para debugging
window.debugApp = () => {
    if (window.disonanciaApp) {
        window.disonanciaApp.debug();
    }
};

// Exportar para uso en consola
window.DisonanciaApp = DisonanciaApp;