/**
 * Animación de fondo tipo galaxia
 */

class GalaxyBackground {
    constructor() {
        this.canvas = document.getElementById('background-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.audioData = null;
        this.animationId = null;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const particleCount = 200;
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                color: this.getRandomColor(),
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    getRandomColor() {
        const colors = CONFIG.visualizer.colors;
        const colorArray = [colors.primary, colors.secondary, colors.accent, '#9370db'];
        return colorArray[Math.floor(Math.random() * colorArray.length)];
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }
    
    updateParticles() {
        this.particles.forEach((particle, index) => {
            // Movimiento básico
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Efecto de mouse
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.x -= dx * force * 0.01;
                particle.y -= dy * force * 0.01;
            }
            
            // Efecto de audio
            if (this.audioData) {
                const audioIndex = Math.floor((index / this.particles.length) * this.audioData.length);
                const audioValue = this.audioData[audioIndex] || 0;
                const audioForce = audioValue / 255;
                
                particle.size = particle.size * 0.95 + (audioForce * 5 + 1) * 0.05;
                particle.opacity = particle.opacity * 0.95 + (audioForce * 0.8 + 0.2) * 0.05;
            }
            
            // Pulsación
            particle.pulsePhase += particle.pulseSpeed;
            const pulse = Math.sin(particle.pulsePhase) * 0.3 + 0.7;
            
            // Reposicionar si sale de pantalla
            if (particle.x < -10) particle.x = this.canvas.width + 10;
            if (particle.x > this.canvas.width + 10) particle.x = -10;
            if (particle.y < -10) particle.y = this.canvas.height + 10;
            if (particle.y > this.canvas.height + 10) particle.y = -10;
            
            // Aplicar pulsación al tamaño
            particle.currentSize = particle.size * pulse;
            particle.currentOpacity = particle.opacity * pulse;
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            
            // Configurar estilo
            this.ctx.globalAlpha = particle.currentOpacity;
            this.ctx.fillStyle = particle.color;
            
            // Crear gradiente radial para efecto de brillo
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.currentSize * 2
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            
            // Dibujar partícula
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.currentSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    drawConnections() {
        this.particles.forEach((particle, i) => {
            this.particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.save();
                    
                    const opacity = (150 - distance) / 150 * 0.1;
                    this.ctx.globalAlpha = opacity;
                    this.ctx.strokeStyle = CONFIG.visualizer.colors.accent;
                    this.ctx.lineWidth = 1;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                    
                    this.ctx.restore();
                }
            });
        });
    }
    
    drawBackground() {
        // Gradiente de fondo
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height)
        );
        
        gradient.addColorStop(0, 'rgba(10, 10, 30, 0.9)');
        gradient.addColorStop(0.5, 'rgba(5, 5, 15, 0.95)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    setAudioData(audioData) {
        this.audioData = audioData;
    }
    
    animate() {
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar fondo
        this.drawBackground();
        
        // Actualizar y dibujar partículas
        this.updateParticles();
        this.drawConnections();
        this.drawParticles();
        
        // Continuar animación
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Inicializar animación de fondo
let galaxyBackground;

document.addEventListener('DOMContentLoaded', () => {
    galaxyBackground = new GalaxyBackground();
});