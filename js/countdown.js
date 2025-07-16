/**
 * Gestiona el contador regresivo para el lanzamiento
 */

class CountdownTimer {
    constructor() {
        this.releaseDate = CONFIG.releaseDate;
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
        this.intervalId = null;
        
        this.init();
    }
    
    init() {
        this.updateCountdown();
        this.startTimer();
    }
    
    startTimer() {
        this.intervalId = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }
    
    updateCountdown() {
        const now = new Date().getTime();
        const releaseTime = this.releaseDate.getTime();
        const difference = releaseTime - now;
        
        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            this.updateDisplay(days, hours, minutes, seconds);
        } else {
            // El lanzamiento ya ocurrió
            this.updateDisplay(0, 0, 0, 0);
            this.onCountdownComplete();
        }
    }
    
    updateDisplay(days, hours, minutes, seconds) {
        this.elements.days.textContent = this.formatNumber(days);
        this.elements.hours.textContent = this.formatNumber(hours);
        this.elements.minutes.textContent = this.formatNumber(minutes);
        this.elements.seconds.textContent = this.formatNumber(seconds);
        
        // Añadir efecto de parpadeo en los últimos segundos
        if (days === 0 && hours === 0 && minutes === 0 && seconds <= 10) {
            this.addBlinkEffect();
        } else {
            this.removeBlinkEffect();
        }
    }
    
    formatNumber(num) {
        return num.toString().padStart(2, '0');
    }
    
    addBlinkEffect() {
        Object.values(this.elements).forEach(element => {
            element.style.animation = 'blink 1s infinite';
        });
    }
    
    removeBlinkEffect() {
        Object.values(this.elements).forEach(element => {
            element.style.animation = '';
        });
    }
    
    onCountdownComplete() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        // Mostrar mensaje de lanzamiento
        this.showLaunchMessage();
    }
    
    showLaunchMessage() {
        const countdownContainer = document.querySelector('.countdown-container');
        if (countdownContainer) {
            countdownContainer.innerHTML = `
                <div class="launch-message">
                    <h2>🎉 ¡Ya Disponible! 🎉</h2>
                    <p>El nuevo lanzamiento está aquí</p>
                </div>
            `;
            
            // Añadir estilos para el mensaje de lanzamiento
            const style = document.createElement('style');
            style.textContent = `
                .launch-message {
                    animation: celebration 2s infinite;
                }
                
                .launch-message h2 {
                    font-size: 2rem;
                    color: #00d4ff;
                    margin-bottom: 1rem;
                    text-shadow: 0 0 20px rgba(0, 212, 255, 0.8);
                }
                
                .launch-message p {
                    font-size: 1.2rem;
                    color: #7b68ee;
                }
                
                @keyframes celebration {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0.3; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    getTimeRemaining() {
        const now = new Date().getTime();
        const releaseTime = this.releaseDate.getTime();
        const difference = releaseTime - now;
        
        if (difference <= 0) {
            return {
                total: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            };
        }
        
        return {
            total: difference,
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
    }
    
    destroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// Función auxiliar para obtener días hasta el lanzamiento (usada en share.js)
function getDaysUntilRelease() {
    const now = new Date();
    const releaseDate = CONFIG.releaseDate;
    
    if (now >= releaseDate) {
        return 0;
    }
    
    const diffTime = Math.abs(releaseDate - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

// Inicializar contador
let countdownTimer;

document.addEventListener('DOMContentLoaded', () => {
    countdownTimer = new CountdownTimer();
});