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
        } catch (error) {
            console.error('Error inicializando el reproductor:', error);
        }
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
            backend: 'WebAudio',
            mediaControls: false
        });
        
        // Cargar archivo de audio
        await this.wavesurfer.load(CONFIG.songInfo.audioFile);
        
        // Configurar eventos de WaveSurfer
        this.wavesurfer.on('ready', () => {
            this.duration = this.wavesurfer.getDuration();
            this.updateTimeDisplay();
            // Configurar analizador de audio después de que esté listo
            setTimeout(() => {
                this.setupAudioAnalyser();
            }, 100);
        });
        
        this.wavesurfer.on('audioprocess', () => {
            this.currentTime = this.wavesurfer.getCurrentTime();
            this.updateTimeDisplay();
            this.updateAudioData();
        });
        
        this.wavesurfer.on('play', () => {
            this.isPlaying = true;
            this.updatePlayButton();
        });
        
        this.wavesurfer.on('pause', () => {
            this.isPlaying = false;
            this.updatePlayButton();
        });
        
        this.wavesurfer.on('finish', () => {
            this.isPlaying = false;
            this.updatePlayButton();
            this.wavesurfer.seekTo(0);
        });
        
        // Configurar volumen inicial
        this.wavesurfer.setVolume(0.7);
    }
    
    setupAudioAnalyser() {
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
        this.elements.albumCover.src = CONFIG.songInfo.coverImage;
        this.elements.albumCover.alt = `${CONFIG.songInfo.title} - ${CONFIG.songInfo.artist}`;
        this.elements.songTitle.textContent = CONFIG.songInfo.title;
        this.elements.songArtist.textContent = CONFIG.songInfo.artist;
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
        this.elements.totalTimeDisplay.textContent = this.formatTime(this.duration);
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