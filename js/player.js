/**
 * Reproductor de música principal
 */

class MusicPlayer {
    constructor() {
        this.wavesurfer = null;
        this.audioContext = null;
        this.analyser = null;
        this.audioData = null;
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        
        this.elements = {
            playPauseBtn: document.getElementById('play-pause-btn'),
            playIcon: document.querySelector('.play-icon'),
            pauseIcon: document.querySelector('.pause-icon'),
            currentTimeDisplay: document.getElementById('current-time'),
            totalTimeDisplay: document.getElementById('total-time'),
            volumeSlider: document.getElementById('volume-slider'),
            albumCover: document.getElementById('album-cover'),
            songTitle: document.getElementById('song-title'),
            songArtist: document.getElementById('song-artist'),
            presaveBtn: document.getElementById('presave-btn'),
            shareBtn: document.getElementById('share-btn')
        };
        
        this.init();
    }
    
    async init() {
        try {
            await this.initWaveSurfer();
            this.setupEventListeners();
            this.loadSongInfo();
            // Configurar handlers de Media Session (acciones del sistema)
            this.setupMediaSessionActionHandlers();
        } catch (error) {
            console.error('Error inicializando el reproductor:', error);
        }
    }
    
    // Utilidad para obtener un valor localizado desde config (string u objeto por idioma)
    getLocalizedValue(value) {
        if (typeof value === 'string') return value;
        if (value && typeof value === 'object') {
            const lang = (navigator.language || 'es').toLowerCase();
            const base = lang.split('-')[0];
            return value[lang] || value[base] || value.es || value.en || Object.values(value)[0] || '';
        }
        return '';
    }
    
    // Inferir mime-type de la imagen de portada
    getArtworkMimeType(src) {
        if (!src || typeof src !== 'string') return 'image/jpeg';
        const ext = src.split('.').pop().toLowerCase();
        switch (ext) {
            case 'png': return 'image/png';
            case 'webp': return 'image/webp';
            case 'gif': return 'image/gif';
            case 'jpg':
            case 'jpeg':
            default: return 'image/jpeg';
        }
    }
    
    // Detección de iOS Safari para ajustar backend
    isIosSafari() {
        const ua = navigator.userAgent;
        const isIOS = /iPad|iPhone|iPod/.test(ua);
        const isSafari = /Safari/i.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/i.test(ua);
        return isIOS && isSafari;
    }
    async initWaveSurfer() {
        // Crear instancia de WaveSurfer
        this.wavesurfer = WaveSurfer.create({
            container: '#waveform-container',
            waveColor: CONFIG.visualizer.colors.secondary,
            progressColor: CONFIG.visualizer.colors.primary,
            cursorColor: CONFIG.visualizer.colors.accent,
            barWidth: 3,
            barRadius: 3,
            responsive: true,
            height: 80,
            normalize: true,
            backend: this.isIosSafari() ? 'MediaElement' : 'WebAudio',
            mediaControls: false
        });
        
        // Cargar archivo de audio
        await this.wavesurfer.load(CONFIG.songInfo.audioFile);
        
        // Configurar eventos de WaveSurfer
        this.wavesurfer.on('ready', () => {
            this.duration = this.wavesurfer.getDuration();
            this.updateTimeDisplay();
            // En iOS Safari, asegurar atributos del elemento media
            if (this.isIosSafari() && typeof this.wavesurfer.getMediaElement === 'function') {
                const mediaEl = this.wavesurfer.getMediaElement();
                if (mediaEl) {
                    mediaEl.setAttribute('preload', 'auto');
                    mediaEl.setAttribute('playsinline', 'true');
                    mediaEl.crossOrigin = 'anonymous';
                    mediaEl.controls = false;
                }
            }
             // Configurar analizador de audio después de que esté listo
             setTimeout(() => {
                 this.setupAudioAnalyser();
                 // Inicializar metadata y estado para Media Session cuando el audio esté listo
                 this.setupMediaSession();
                 this.updatePlaybackState();
                 this.updatePositionState();
             }, 100);
        });
        
        this.wavesurfer.on('audioprocess', () => {
            this.currentTime = this.wavesurfer.getCurrentTime();
            this.updateTimeDisplay();
            this.updateAudioData();
            // Actualizar posición para controles del sistema (Media Session)
            this.updatePositionState();
        });
        
        // En algunos backends, usar timeupdate para asegurar actualización de tiempo
        this.wavesurfer.on('timeupdate', (currentTime) => {
            this.currentTime = typeof currentTime === 'number' ? currentTime : this.wavesurfer.getCurrentTime();
            this.updateTimeDisplay();
            this.updatePositionState();
        });
         
        this.wavesurfer.on('play', () => {
            this.isPlaying = true;
            this.updatePlayButton();
            this.updatePlaybackState();
        });
        
        this.wavesurfer.on('pause', () => {
            this.isPlaying = false;
            this.updatePlayButton();
            this.updatePlaybackState();
        });
        
        this.wavesurfer.on('finish', () => {
            this.isPlaying = false;
            this.updatePlayButton();
            this.wavesurfer.seekTo(0);
            this.currentTime = 0;
            this.updatePlaybackState();
            this.updatePositionState();
        });
        
        // Configurar volumen inicial
        this.wavesurfer.setVolume(0.7);
    }
    
    setupAudioAnalyser() {
        // En iOS Safari, evitar crear AudioContext para no interferir con reproducción en segundo plano
        if (this.isIosSafari()) {
            this.analyser = null;
            this.audioData = null;
            return;
        }
        // Esperar a que WaveSurfer esté completamente inicializado
        if (this.wavesurfer && this.wavesurfer.backend) {
            // Para WaveSurfer v7, el contexto de audio está en backend.ac
            const backend = this.wavesurfer.backend;
            
            if (backend.ac || backend.audioContext) {
                this.audioContext = backend.ac || backend.audioContext;
                this.analyser = this.audioContext.createAnalyser();
                this.analyser.fftSize = 256;
                
                // Conectar el analizador cuando el audio esté listo
                this.wavesurfer.on('ready', () => {
                    if (backend.source || backend.gainNode) {
                        const sourceNode = backend.source || backend.gainNode;
                        if (sourceNode && sourceNode.connect) {
                            sourceNode.connect(this.analyser);
                        }
                    }
                });
                
                this.audioData = new Uint8Array(this.analyser.frequencyBinCount);
            }
        } else {
            // Reintentar después de un breve delay
            setTimeout(() => {
                this.setupAudioAnalyser();
            }, 100);
        }
    }
    
    updateAudioData() {
        if (this.analyser && this.audioData) {
            this.analyser.getByteFrequencyData(this.audioData);
            
            // Enviar datos de audio al fondo y visualizador
            if (window.galaxyBackground) {
                window.galaxyBackground.setAudioData(this.audioData);
            }
            
            if (window.audioVisualizer) {
                window.audioVisualizer.setAudioData(this.audioData);
            }
        }
    }
    
    setupEventListeners() {
        // Botón play/pausa
        this.elements.playPauseBtn.addEventListener('click', () => {
            this.togglePlayPause();
        });
        
        // Control de volumen
        this.elements.volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.setVolume(volume);
        });
        
        // Botón de pre-save
        this.elements.presaveBtn.addEventListener('click', () => {
            this.openPresave();
        });
        
        // Botón de compartir
        this.elements.shareBtn.addEventListener('click', () => {
            this.shareTrack();
        });
        
        // Teclas de acceso rápido
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && document.getElementById('player-screen').classList.contains('active')) {
                e.preventDefault();
                this.togglePlayPause();
            }
        });
    }
    
    loadSongInfo() {
        // Cargar información de la canción
        const localizedTitle = this.getLocalizedValue(CONFIG.songInfo.title);
        const localizedArtist = this.getLocalizedValue(CONFIG.songInfo.artist);
        this.elements.albumCover.src = CONFIG.songInfo.coverImage;
        this.elements.albumCover.alt = `${localizedTitle} - ${localizedArtist}`;
        this.elements.songTitle.textContent = localizedTitle;
        this.elements.songArtist.textContent = localizedArtist;
        // Preparar metadata para Media Session usando la información de CONFIG
        this.setupMediaSession();
    }
    togglePlayPause() {
        if (this.wavesurfer) {
            this.wavesurfer.playPause();
        }
    }
    
    play() {
        if (this.wavesurfer) {
            this.wavesurfer.play();
        }
    }
    
    pause() {
        if (this.wavesurfer) {
            this.wavesurfer.pause();
        }
    }
    
    setVolume(volume) {
        if (this.wavesurfer) {
            this.wavesurfer.setVolume(volume);
        }
    }
    
    seekTo(position) {
        if (this.wavesurfer) {
            this.wavesurfer.seekTo(position);
        }
    }
    
    updatePlayButton() {
        if (this.isPlaying) {
            this.elements.playIcon.classList.add('hidden');
            this.elements.pauseIcon.classList.remove('hidden');
            this.elements.playPauseBtn.classList.add('playing');
        } else {
            this.elements.playIcon.classList.remove('hidden');
            this.elements.pauseIcon.classList.add('hidden');
            this.elements.playPauseBtn.classList.remove('playing');
        }
    }
    
    updateTimeDisplay() {
        this.elements.currentTimeDisplay.textContent = this.formatTime(this.currentTime);
        const remainingTime = Math.max(0, this.duration - this.currentTime);
        this.elements.totalTimeDisplay.textContent = '-' + this.formatTime(remainingTime);
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    openPresave() {
        if (CONFIG.songInfo.presaveLink) {
            window.open(CONFIG.songInfo.presaveLink, '_blank');
        } else {
            alert('Enlace de pre-save no disponible');
        }
    }
    
    shareTrack() {
        if (typeof showShareOptionsModal === 'function') {
            showShareOptionsModal();
        } else {
            console.error('Función de compartir no disponible');
        }
    }

    // === Integración con Media Session API ===
    setupMediaSession() {
        if (!('mediaSession' in navigator)) return;
        const title = this.getLocalizedValue(CONFIG.songInfo.title);
        const artist = this.getLocalizedValue(CONFIG.songInfo.artist);
        const album = this.getLocalizedValue(CONFIG.songInfo.album);
        const coverImage = CONFIG.songInfo.coverImage;
        const artwork = coverImage ? [
            { src: coverImage, sizes: '512x512', type: this.getArtworkMimeType(coverImage) }
        ] : [];
        try {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: title || '',
                artist: artist || '',
                album: album || '',
                artwork
            });
        } catch (e) {
            console.warn('No se pudo establecer la metadata de Media Session:', e);
        }
    }

    setupMediaSessionActionHandlers() {
        if (!('mediaSession' in navigator)) return;
        try {
            navigator.mediaSession.setActionHandler('play', () => this.play());
            navigator.mediaSession.setActionHandler('pause', () => this.pause());
            navigator.mediaSession.setActionHandler('seekforward', (details) => {
                const offset = details.seekOffset || 10;
                const newTime = Math.min(this.getDuration(), this.getCurrentTime() + offset);
                if (this.getDuration() > 0) this.seekTo(newTime / this.getDuration());
                this.updatePositionState();
            });
            navigator.mediaSession.setActionHandler('seekbackward', (details) => {
                const offset = details.seekOffset || 10;
                const newTime = Math.max(0, this.getCurrentTime() - offset);
                if (this.getDuration() > 0) this.seekTo(newTime / this.getDuration());
                this.updatePositionState();
            });
            navigator.mediaSession.setActionHandler('seekto', (details) => {
                if (typeof details.position === 'number' && this.getDuration() > 0) {
                    const ratio = Math.min(1, Math.max(0, details.position / this.getDuration()));
                    this.seekTo(ratio);
                    this.updatePositionState();
                }
            });
            // En un solo track, podemos reiniciar al inicio
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                if (this.getDuration() > 0) this.seekTo(0);
            });
            // No hay siguiente pista en este reproductor
            navigator.mediaSession.setActionHandler('nexttrack', () => {});
        } catch (e) {
            console.warn('No se pudieron configurar los handlers de Media Session:', e);
        }
    }

    updatePlaybackState() {
        if (!('mediaSession' in navigator)) return;
        try {
            navigator.mediaSession.playbackState = this.isPlaying ? 'playing' : 'paused';
        } catch (e) {}
    }

    updatePositionState() {
        if (!('mediaSession' in navigator)) return;
        if (!isFinite(this.getDuration())) return;
        try {
            navigator.mediaSession.setPositionState({
                duration: this.getDuration() || 0,
                position: this.getCurrentTime() || 0,
                playbackRate: 1.0
            });
        } catch (e) {
            // Algunos navegadores no soportan setPositionState
        }
    }
    getAudioData() {
        return this.audioData;
    }
    
    getAnalyser() {
        return this.analyser;
    }
    
    getCurrentTime() {
        return this.currentTime;
    }
    
    getDuration() {
        return this.duration;
    }
    
    isCurrentlyPlaying() {
        return this.isPlaying;
    }
    
    destroy() {
        if (this.wavesurfer) {
            this.wavesurfer.destroy();
        }
    }
}

// Variable global para el reproductor
let musicPlayer;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para asegurar que WaveSurfer esté cargado
    setTimeout(() => {
        musicPlayer = new MusicPlayer();
        window.musicPlayer = musicPlayer; // Hacer disponible globalmente
    }, 100);
});