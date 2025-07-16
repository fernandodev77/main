/**
 * Gestiona la funcionalidad de compartir en redes sociales
 */

/**
 * Muestra el modal inicial con opciones de compartir
 */
function showShareOptionsModal() {
    // Crear modal de opciones
    const modal = document.createElement('div');
    modal.className = 'share-options-modal';
    modal.innerHTML = `
        <div class="share-options-content">
            <h3>¿Qué quieres compartir?</h3>
            <p>Elige el tipo de contenido que deseas generar</p>
            <div class="share-options-buttons">
                <button id="share-image-btn" class="option-btn image-btn">
                    🖼️ Compartir Imagen
                    <span class="btn-description">Imagen estática instantánea</span>
                </button>
                <button id="share-animation-btn" class="option-btn animation-btn">
                    🎬 Animación
                    <span class="btn-description">GIF animado de 5 segundos</span>
                </button>
                <button id="close-options-btn" class="option-btn close-btn">
                    ✖️ Cancelar
                </button>
            </div>
        </div>
    `;
    
    // Agregar estilos al modal
    const style = document.createElement('style');
    style.textContent = `
        .share-options-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        .share-options-content {
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            max-width: 450px;
            border: 2px solid #7c3aed;
            box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
        }
        .share-options-content h3 {
            color: #7c3aed;
            margin-bottom: 15px;
            font-size: 1.6em;
        }
        .share-options-content p {
            color: #ffffff;
            margin-bottom: 25px;
            opacity: 0.9;
        }
        .share-options-buttons {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .option-btn {
            padding: 15px 20px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
            text-align: left;
            position: relative;
        }
        .btn-description {
            display: block;
            font-size: 12px;
            opacity: 0.8;
            margin-top: 5px;
        }
        .image-btn {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
        }
        .image-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4);
        }
        .animation-btn {
            background: linear-gradient(135deg, #7c3aed, #6d28d9);
            color: white;
        }
        .animation-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(124, 58, 237, 0.4);
        }
        .close-btn {
            background: #6b7280;
            color: white;
        }
        .close-btn:hover {
            background: #4b5563;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Event listeners
    const shareImageBtn = modal.querySelector('#share-image-btn');
    const shareAnimationBtn = modal.querySelector('#share-animation-btn');
    const closeBtn = modal.querySelector('#close-options-btn');
    
    shareImageBtn.addEventListener('click', () => {
        closeOptionsModal();
        generateStaticShareImage();
    });
    
    shareAnimationBtn.addEventListener('click', () => {
        closeOptionsModal();
        showNotification('🎬 Generando animación...', 'La animación de 5 segundos está siendo creada. Por favor espera.', 'info');
        generateAnimatedShare();
    });
    
    closeBtn.addEventListener('click', closeOptionsModal);
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeOptionsModal();
        }
    });
    
    function closeOptionsModal() {
        document.body.removeChild(modal);
        document.head.removeChild(style);
    }
}

/**
 * Muestra una notificación push al usuario
 */
function showNotification(title, message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
            <div class="notification-progress"></div>
        </div>
    `;
    
    // Agregar estilos de notificación
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border: 2px solid #7c3aed;
            border-radius: 10px;
            padding: 15px 20px;
            max-width: 350px;
            z-index: 10001;
            box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
            animation: slideInRight 0.3s ease-out;
        }
        .notification-content {
            color: white;
        }
        .notification-title {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 5px;
            color: #7c3aed;
        }
        .notification-message {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 10px;
        }
        .notification-progress {
            height: 3px;
            background: linear-gradient(90deg, #7c3aed, #a855f7);
            border-radius: 2px;
            animation: progressBar 5s linear;
        }
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes progressBar {
            from {
                width: 100%;
            }
            to {
                width: 0%;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Auto-remover notificación después de 5 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
                if (document.head.contains(style)) {
                    document.head.removeChild(style);
                }
            }, 300);
        }
    }, 5000);
}

/**
 * Genera una imagen estática para compartir directamente
 */
function generateStaticShareImage() {
    const shareCanvas = document.getElementById('share-canvas');
    const shareCtx = shareCanvas.getContext('2d');
    const width = shareCanvas.width;
    const height = shareCanvas.height;
    
    // Limpiar canvas
    shareCtx.clearRect(0, 0, width, height);
    
    // Dibujar fondo estático
    drawStaticBackground(shareCtx, width, height);
    
    // Cargar y dibujar imagen de portada
    const coverImage = new Image();
    coverImage.crossOrigin = 'anonymous';
    coverImage.src = CONFIG.songInfo.coverImage;
    
    coverImage.onload = function() {
        // Dibujar imagen de portada con bordes redondeados
        const coverSize = Math.min(width, height) * 0.4;
        const coverX = (width - coverSize) / 2;
        const coverY = height * 0.15;
        
        roundedImage(shareCtx, coverX, coverY, coverSize, coverSize, 20);
        shareCtx.clip();
        shareCtx.drawImage(coverImage, coverX, coverY, coverSize, coverSize);
        shareCtx.restore();
        
        // Título de la canción
        shareCtx.font = 'bold 60px Arial';
        shareCtx.fillStyle = '#ffffff';
        shareCtx.textAlign = 'center';
        shareCtx.fillText(CONFIG.songInfo.title, width / 2, height * 0.55);
        
        // Nombre del artista
        shareCtx.font = '50px Arial';
        shareCtx.fillStyle = CONFIG.visualizer.colors.secondary;
        shareCtx.fillText(CONFIG.songInfo.artist, width / 2, height * 0.55 + 80);
        
        // Finalizar imagen estática
        finishStaticShareImage();
    };
    
    coverImage.onerror = function() {
        console.error('Error al cargar la imagen de portada');
        finishStaticShareImage();
    };
}

/**
 * Dibuja un fondo estático para la imagen
 */
function drawStaticBackground(ctx, width, height) {
    // Gradiente de fondo
    const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height)
    );
    
    gradient.addColorStop(0, 'rgba(10, 10, 30, 0.9)');
    gradient.addColorStop(0.5, 'rgba(5, 5, 15, 0.95)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Partículas estáticas decorativas
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 2 + 1;
        const opacity = Math.random() * 0.5 + 0.3;
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = CONFIG.visualizer.colors.accent;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

/**
 * Finaliza la imagen estática y la comparte directamente
 */
function finishStaticShareImage() {
    const shareCanvas = document.getElementById('share-canvas');
    const shareCtx = shareCanvas.getContext('2d');
    const width = shareCanvas.width;
    const height = shareCanvas.height;
    
    // Añadir texto promocional
    shareCtx.font = 'bold 40px Arial';
    shareCtx.fillStyle = '#ffffff';
    shareCtx.textAlign = 'center';
    shareCtx.fillText(CONFIG.sharing.text, width / 2, height * 0.75);
    
    // Añadir hashtags
    if (CONFIG.sharing.hashtags && CONFIG.sharing.hashtags.length > 0) {
        shareCtx.font = '30px Arial';
        shareCtx.fillStyle = CONFIG.visualizer.colors.secondary;
        shareCtx.fillText(CONFIG.sharing.hashtags.join(' '), width / 2, height * 0.75 + 50);
    }
    
    // Añadir URL
    if (CONFIG.sharing.url) {
        shareCtx.font = '35px Arial';
        shareCtx.fillStyle = '#ffffff';
        shareCtx.fillText(CONFIG.sharing.url, width / 2, height * 0.85);
    }
    
    // Mostrar días restantes para el lanzamiento
    const daysUntilRelease = getDaysUntilRelease();
    if (daysUntilRelease > 0) {
        const bannerY = height * 0.9;
        const bannerHeight = 80;
        
        shareCtx.fillStyle = CONFIG.visualizer.colors.primary;
        shareCtx.fillRect(0, bannerY, width, bannerHeight);
        
        shareCtx.font = 'bold 40px Arial';
        shareCtx.fillStyle = '#ffffff';
        shareCtx.textAlign = 'center';
        shareCtx.fillText(`¡${daysUntilRelease} días para el lanzamiento!`, width / 2, bannerY + 55);
    }
    
    // Compartir imagen directamente
    shareImageToSocial();
}

/**
 * Genera una imagen para compartir en redes sociales (función original mantenida para compatibilidad)
 */
function generateShareImage() {
    // Obtener el canvas para compartir
    const shareCanvas = document.getElementById('share-canvas');
    const shareCtx = shareCanvas.getContext('2d');
    
    // Configurar tamaño para Instagram Stories (9:16)
    const width = 1080;
    const height = 1920;
    shareCanvas.width = width;
    shareCanvas.height = height;
    
    // Dibujar fondo
    shareCtx.fillStyle = CONFIG.visualizer.colors.background;
    shareCtx.fillRect(0, 0, width, height);
    
    // Cargar imagen de portada
    const coverImage = new Image();
    coverImage.crossOrigin = 'anonymous';
    coverImage.src = CONFIG.songInfo.coverImage;
    
    coverImage.onload = function() {
        // Dibujar portada del álbum (centrada y grande)
        const coverSize = width * 0.8;
        const coverX = (width - coverSize) / 2;
        const coverY = height * 0.25 - coverSize / 2;
        
        // Dibujar sombra
        shareCtx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        shareCtx.shadowBlur = 30;
        shareCtx.shadowOffsetX = 0;
        shareCtx.shadowOffsetY = 10;
        
        // Dibujar portada con bordes redondeados
        roundedImage(shareCtx, coverX, coverY, coverSize, coverSize, 20);
        shareCtx.clip();
        shareCtx.drawImage(coverImage, coverX, coverY, coverSize, coverSize);
        shareCtx.restore();
        
        // Resetear sombra
        shareCtx.shadowColor = 'transparent';
        shareCtx.shadowBlur = 0;
        shareCtx.shadowOffsetX = 0;
        shareCtx.shadowOffsetY = 0;
        
        // Dibujar información de la canción
        shareCtx.textAlign = 'center';
        
        // Título de la canción
        shareCtx.font = 'bold 70px Arial';
        shareCtx.fillStyle = '#ffffff';
        shareCtx.fillText(CONFIG.songInfo.title, width / 2, height * 0.55);
        
        // Nombre del artista
        shareCtx.font = '50px Arial';
        shareCtx.fillStyle = CONFIG.visualizer.colors.secondary;
        shareCtx.fillText(CONFIG.songInfo.artist, width / 2, height * 0.55 + 80);
        
        // Iniciar generación de GIF animado
        generateAnimatedShare();
    };
    
    coverImage.onerror = function() {
        console.error('Error al cargar la imagen de portada');
        // Continuar sin la imagen de portada
        finishShareImage();
    };
}

/**
 * Genera un GIF animado de 5 segundos con la animación de fondo
 */
function generateAnimatedShare() {
    // Intentar crear GIF primero, si falla usar WebM
    if (typeof GIF !== 'undefined') {
        generateAnimatedGif();
    } else {
        generateAnimatedWebM();
    }
}

/**
 * Función para generar GIF usando gif.js
 */
function generateAnimatedGif() {
    const shareCanvas = document.getElementById('share-canvas');
    
    // Configurar formato vertical para Instagram Stories (9:16)
    const width = 1080;
    const height = 1920;
    shareCanvas.width = width;
    shareCanvas.height = height;
    
    const gif = new GIF({
        workers: 2,
        quality: 10,
        width: width,
        height: height,
        workerScript: 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js'
    });
    
    const fps = 15; // 15 frames por segundo
    const duration = 5; // 5 segundos
    const totalFrames = fps * duration;
    const delay = 1000 / fps; // Delay entre frames en ms
    
    let frameCount = 0;
    
    console.log('Iniciando generación de GIF animado...');
    
    function captureFrame() {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Limpiar canvas
        tempCtx.clearRect(0, 0, width, height);
        
        // Dibujar fondo animado
        drawAnimatedBackground(tempCtx, width, height, frameCount);
        
        // Dibujar overlay con información de la canción
        drawSongOverlay(tempCtx, width, height, frameCount);
        
        // Agregar frame al GIF
        gif.addFrame(tempCanvas, {delay: delay});
        
        frameCount++;
        
        if (frameCount < totalFrames) {
            setTimeout(captureFrame, 50); // Pequeño delay para no bloquear UI
        } else {
            // Renderizar GIF
            gif.on('finished', function(blob) {
                shareGifToSocial(blob);
            });
            
            console.log('Frames capturados, generando GIF...');
            gif.render();
        }
    }
    
    // Iniciar captura
    captureFrame();
}

/**
 * Función alternativa para generar WebM
 */
function generateAnimatedWebM() {
    const shareCanvas = document.getElementById('share-canvas');
    const shareCtx = shareCanvas.getContext('2d');
    
    // Configurar formato vertical para Instagram Stories (9:16)
    const width = 1080;
    const height = 1920;
    shareCanvas.width = width;
    shareCanvas.height = height;
    
    // Configuración para el WebM
    const duration = 5000; // 5 segundos
    const fps = 15; // 15 frames por segundo
    const totalFrames = Math.floor(duration / 1000 * fps);
    const frames = [];
    let currentFrame = 0;
    
    console.log('Iniciando generación de WebM animado...');
    
    // Función para capturar un frame
    function captureFrame() {
        // Limpiar canvas
        shareCtx.clearRect(0, 0, width, height);
        
        // Dibujar fondo animado (similar al background.js pero adaptado)
        drawAnimatedBackground(shareCtx, width, height, currentFrame);
        
        // Dibujar overlay con información de la canción
        drawSongOverlay(shareCtx, width, height, currentFrame);
        
        // Capturar frame como ImageData
        const imageData = shareCtx.getImageData(0, 0, width, height);
        frames.push(imageData);
        
        currentFrame++;
        
        if (currentFrame < totalFrames) {
            // Continuar capturando frames
            setTimeout(captureFrame, 1000 / fps);
        } else {
            // Todos los frames capturados, generar WebM
            console.log('Frames capturados, generando WebM...');
            createWebMFromFrames(frames, fps);
        }
    }
    
    // Iniciar captura
    captureFrame();
}

/**
 * Dibuja el fondo animado para el frame actual optimizado para formato vertical
 */
function drawAnimatedBackground(ctx, width, height, frameIndex) {
    const progress = frameIndex / 75; // 75 frames total (5 segundos * 15 fps)
    
    // Gradiente animado de fondo vertical
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    
    // Colores que cambian con el tiempo
    const hue1 = (progress * 360) % 360;
    const hue2 = (progress * 360 + 120) % 360;
    const hue3 = (progress * 360 + 240) % 360;
    
    gradient.addColorStop(0, `hsl(${hue1}, 80%, 15%)`);
    gradient.addColorStop(0.3, `hsl(${hue2}, 70%, 10%)`);
    gradient.addColorStop(0.7, `hsl(${hue3}, 60%, 8%)`);
    gradient.addColorStop(1, `hsl(${hue1 + 180}, 50%, 5%)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Ondas de audio verticales para formato Stories
    const waveCount = 12;
    for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        ctx.strokeStyle = `hsla(${(hue1 + w * 30) % 360}, 80%, 60%, ${0.2 + Math.sin(progress * Math.PI * 4 + w) * 0.1})`;
        ctx.lineWidth = 3 + Math.sin(progress * Math.PI * 6 + w) * 1;
        
        const waveOffset = w * 80;
        const waveSpeed = progress * Math.PI * 6 + w * 0.8;
        const baseX = (width / waveCount) * w + width / (waveCount * 2);
        
        for (let y = 0; y < height; y += 8) {
            const x = baseX + 
                Math.sin((y + waveOffset) * 0.008 + waveSpeed) * 40 +
                Math.sin((y + waveOffset) * 0.015 + waveSpeed * 1.3) * 20;
            
            if (y === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }
    
    // Partículas flotantes distribuidas verticalmente
    const particleCount = 60;
    for (let i = 0; i < particleCount; i++) {
        // Distribución más vertical para Stories
        const verticalProgress = (i / particleCount);
        const horizontalVariation = Math.sin(progress * Math.PI * 2 + i * 0.3) * 0.4;
        
        const x = width * (0.3 + horizontalVariation * 0.4) + Math.cos(progress * Math.PI * 3 + i) * 100;
        const y = height * verticalProgress + Math.sin(progress * Math.PI * 4 + i * 0.5) * 80;
        
        // Partícula principal con efecto de profundidad
        ctx.save();
        const depth = Math.sin(progress * Math.PI * 2 + i) * 0.5 + 0.5;
        const size = (2 + depth * 3) * (1 + Math.sin(progress * Math.PI * 8 + i) * 0.3);
        
        ctx.globalAlpha = 0.6 + depth * 0.4;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        
        // Gradiente para cada partícula
        const particleGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        particleGradient.addColorStop(0, `hsla(${(hue1 + i * 12) % 360}, 90%, 70%, 1)`);
        particleGradient.addColorStop(1, `hsla(${(hue1 + i * 12) % 360}, 90%, 70%, 0)`);
        
        ctx.fillStyle = particleGradient;
        ctx.fill();
        ctx.restore();
        
        // Partículas secundarias para mayor densidad
        if (i % 4 === 0) {
            const secondaryX = x + Math.cos(progress * Math.PI * 5 + i) * 60;
            const secondaryY = y + Math.sin(progress * Math.PI * 5 + i) * 60;
            
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(secondaryX, secondaryY, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${(hue2 + i * 18) % 360}, 100%, 80%, 0.6)`;
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Efectos de brillo múltiples para mayor dinamismo
    for (let g = 0; g < 3; g++) {
        const glowY = height * (0.2 + g * 0.3) + Math.sin(progress * Math.PI * 3 + g) * 200;
        const glowX = width / 2 + Math.cos(progress * Math.PI * 2 + g * 0.7) * 150;
        
        const glowGradient = ctx.createRadialGradient(
            glowX, glowY, 0,
            glowX, glowY, 120 + g * 40
        );
        
        const glowIntensity = (0.08 + Math.sin(progress * Math.PI * 6 + g * 2) * 0.04) * (1 - g * 0.3);
        glowGradient.addColorStop(0, `hsla(${(hue1 + g * 60) % 360}, 100%, 80%, ${glowIntensity})`);
        glowGradient.addColorStop(0.5, `hsla(${(hue2 + g * 60) % 360}, 100%, 60%, ${glowIntensity * 0.5})`);
        glowGradient.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.fillRect(0, 0, width, height);
    }
    
    // Líneas de energía verticales
    const energyLineCount = 6;
    for (let e = 0; e < energyLineCount; e++) {
        const lineX = (width / energyLineCount) * e + width / (energyLineCount * 2);
        const lineOpacity = Math.sin(progress * Math.PI * 4 + e * 1.2) * 0.3 + 0.1;
        
        if (lineOpacity > 0) {
            ctx.save();
            ctx.globalAlpha = lineOpacity;
            ctx.strokeStyle = `hsla(${(hue3 + e * 40) % 360}, 100%, 70%, 1)`;
            ctx.lineWidth = 2;
            ctx.setLineDash([10, 20]);
            ctx.lineDashOffset = -progress * 100;
            
            ctx.beginPath();
            ctx.moveTo(lineX, 0);
            ctx.lineTo(lineX, height);
            ctx.stroke();
            ctx.restore();
        }
    }
}

/**
 * Dibuja la información de la canción sobre la animación
 */
function drawSongOverlay(ctx, width, height, frameIndex = 0) {
    const progress = frameIndex / 75; // 75 frames total (5 segundos * 15 fps)
    
    // Portada del álbum en la parte superior
    const coverImage = new Image();
    coverImage.src = CONFIG.songInfo.coverImage;
    
    // Tamaño y posición de la portada para formato vertical
    const coverSize = width * 0.6; // Más grande para formato vertical
    const coverX = (width - coverSize) / 2;
    const coverY = height * 0.15;
    
    // Efecto de pulsación en la portada
    const pulseScale = 1 + Math.sin(progress * Math.PI * 8) * 0.05;
    const scaledSize = coverSize * pulseScale;
    const scaledX = coverX - (scaledSize - coverSize) / 2;
    const scaledY = coverY - (scaledSize - coverSize) / 2;
    
    // Dibujar sombra animada de la portada
    ctx.save();
    ctx.shadowColor = `rgba(124, 58, 237, ${0.3 + Math.sin(progress * Math.PI * 4) * 0.2})`;
    ctx.shadowBlur = 40 + Math.sin(progress * Math.PI * 6) * 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 15;
    
    // Dibujar portada con bordes redondeados
    ctx.save();
    roundedImage(ctx, scaledX, scaledY, scaledSize, scaledSize, 30);
    ctx.clip();
    if (coverImage.complete) {
        ctx.drawImage(coverImage, scaledX, scaledY, scaledSize, scaledSize);
    }
    ctx.restore();
    ctx.restore();
    
    // Área de información con gradiente animado
    const infoY = height * 0.55;
    const infoHeight = height * 0.35;
    
    const gradient = ctx.createLinearGradient(0, infoY, 0, infoY + infoHeight);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
    gradient.addColorStop(0.5, 'rgba(26, 26, 46, 0.9)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, infoY, width, infoHeight);
    
    // Información de la canción con animaciones
    ctx.textAlign = 'center';
    
    // Título de la canción con efecto de brillo
    const titleY = height * 0.65;
    const titleGlow = Math.sin(progress * Math.PI * 3) * 0.5 + 0.5;
    
    ctx.save();
    ctx.shadowColor = `rgba(255, 255, 255, ${titleGlow})`;
    ctx.shadowBlur = 20;
    ctx.font = 'bold 72px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = 'rgba(124, 58, 237, 0.8)';
    ctx.lineWidth = 3;
    
    // Efecto de escritura animada
    const titleText = CONFIG.songInfo.title;
    const titleProgress = Math.min(1, progress * 2);
    const visibleTitle = titleText.substring(0, Math.floor(titleText.length * titleProgress));
    
    ctx.strokeText(visibleTitle, width / 2, titleY);
    ctx.fillText(visibleTitle, width / 2, titleY);
    ctx.restore();
    
    // Nombre del artista con efecto de desvanecimiento
    const artistY = titleY + 90;
    const artistOpacity = Math.max(0, Math.min(1, (progress - 0.3) * 2));
    
    ctx.save();
    ctx.globalAlpha = artistOpacity;
    ctx.font = '48px Arial';
    ctx.fillStyle = CONFIG.visualizer.colors.secondary;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.lineWidth = 2;
    
    const artistText = CONFIG.songInfo.artist;
    const artistProgress = Math.max(0, Math.min(1, (progress - 0.3) * 2));
    const visibleArtist = artistText.substring(0, Math.floor(artistText.length * artistProgress));
    
    ctx.strokeText(visibleArtist, width / 2, artistY);
    ctx.fillText(visibleArtist, width / 2, artistY);
    ctx.restore();
    
    // Texto promocional con animación de entrada
    const promoY = height * 0.8;
    const promoOpacity = Math.max(0, Math.min(1, (progress - 0.5) * 2));
    
    ctx.save();
    ctx.globalAlpha = promoOpacity;
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(124, 58, 237, 0.5)';
    ctx.shadowBlur = 10;
    ctx.fillText(CONFIG.sharing.text, width / 2, promoY);
    ctx.restore();
    
    // Hashtags con efecto de parpadeo
    if (CONFIG.sharing.hashtags && CONFIG.sharing.hashtags.length > 0) {
        const hashtagY = promoY + 50;
        const hashtagOpacity = Math.max(0, Math.min(1, (progress - 0.6) * 2)) * (0.7 + Math.sin(progress * Math.PI * 6) * 0.3);
        
        ctx.save();
        ctx.globalAlpha = hashtagOpacity;
        ctx.font = '30px Arial';
        ctx.fillStyle = CONFIG.visualizer.colors.secondary;
        ctx.fillText(CONFIG.sharing.hashtags.join(' '), width / 2, hashtagY);
        ctx.restore();
    }
    
    // URL con entrada deslizante
    if (CONFIG.sharing.url) {
        const urlY = height * 0.88;
        const urlProgress = Math.max(0, Math.min(1, (progress - 0.7) * 3));
        const urlX = width / 2 + (1 - urlProgress) * width;
        
        ctx.save();
        ctx.globalAlpha = urlProgress;
        ctx.font = '32px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 5;
        ctx.fillText(CONFIG.sharing.url, urlX, urlY);
        ctx.restore();
    }
    
    // Días restantes con efecto pulsante
    const daysUntilRelease = getDaysUntilRelease();
    if (daysUntilRelease > 0) {
        const daysY = height * 0.95;
        const daysPulse = 1 + Math.sin(progress * Math.PI * 4) * 0.1;
        const daysOpacity = Math.max(0, Math.min(1, (progress - 0.8) * 2));
        
        ctx.save();
        ctx.globalAlpha = daysOpacity;
        ctx.scale(daysPulse, daysPulse);
        ctx.font = 'bold 40px Arial';
        ctx.fillStyle = CONFIG.visualizer.colors.primary;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 8;
        ctx.fillText(`¡${daysUntilRelease} días para el lanzamiento!`, width / 2 / daysPulse, daysY / daysPulse);
        ctx.restore();
    }
}

/**
 * Comparte el GIF generado
 */
async function shareGifToSocial(gifBlob) {
    try {
        const file = new File([gifBlob], 'disonancia-animated.gif', { type: 'image/gif' });
        
        // Mostrar modal de descarga/compartir en lugar de usar Web Share API directamente
        showShareModal(file, 'GIF');
        
    } catch (error) {
        console.error('Error al procesar GIF:', error);
        // Fallback a imagen estática
        finishShareImage();
    }
}

/**
 * Crea un WebM a partir de los frames capturados (función de respaldo)
 */
function createWebMFromFrames(frames, fps) {
    try {
        // Para esta implementación, vamos a crear un WebM
        // ya que es más eficiente y soportado nativamente
        createWebMFromFrames_Internal(frames, fps);
    } catch (error) {
        console.error('Error creando animación:', error);
        // Fallback a imagen estática
        finishShareImage();
    }
}

/**
 * Crea un video WebM a partir de los frames (implementación interna)
 */
function createWebMFromFrames_Internal(frames, fps) {
    const shareCanvas = document.getElementById('share-canvas');
    const width = shareCanvas.width;
    const height = shareCanvas.height;
    
    // Crear un canvas temporal para el video
    const videoCanvas = document.createElement('canvas');
    videoCanvas.width = width;
    videoCanvas.height = height;
    const videoCtx = videoCanvas.getContext('2d');
    
    // Configurar MediaRecorder para capturar el canvas
    const stream = videoCanvas.captureStream(fps);
    const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
    });
    
    const chunks = [];
    
    mediaRecorder.ondataavailable = function(event) {
        if (event.data.size > 0) {
            chunks.push(event.data);
        }
    };
    
    mediaRecorder.onstop = function() {
        const blob = new Blob(chunks, { type: 'video/webm' });
        shareVideoToSocial(blob);
    };
    
    // Iniciar grabación
    mediaRecorder.start();
    
    // Reproducir frames
    let frameIndex = 0;
    const playFrame = () => {
        if (frameIndex < frames.length) {
            videoCtx.putImageData(frames[frameIndex], 0, 0);
            frameIndex++;
            setTimeout(playFrame, 1000 / fps);
        } else {
            // Detener grabación
            mediaRecorder.stop();
        }
    };
    
    playFrame();
}

/**
 * Comparte el video generado
 */
async function shareVideoToSocial(videoBlob) {
    try {
        const file = new File([videoBlob], 'disonancia-animated.webm', { type: 'video/webm' });
        
        // Mostrar modal de descarga/compartir en lugar de usar Web Share API directamente
        showShareModal(file, 'WebM');
        
    } catch (error) {
        console.error('Error al procesar video:', error);
        // Fallback a imagen estática
        finishShareImage();
    }
}

/**
 * Finaliza la generación de la imagen para compartir (fallback)
 */
function finishShareImage() {
    const shareCanvas = document.getElementById('share-canvas');
    const shareCtx = shareCanvas.getContext('2d');
    const width = shareCanvas.width;
    const height = shareCanvas.height;
    
    // Añadir texto promocional
    shareCtx.font = 'bold 40px Arial';
    shareCtx.fillStyle = '#ffffff';
    shareCtx.textAlign = 'center';
    shareCtx.fillText(CONFIG.sharing.text, width / 2, height * 0.75);
    
    // Añadir hashtags
    if (CONFIG.sharing.hashtags && CONFIG.sharing.hashtags.length > 0) {
        shareCtx.font = '30px Arial';
        shareCtx.fillStyle = CONFIG.visualizer.colors.secondary;
        shareCtx.fillText(CONFIG.sharing.hashtags.join(' '), width / 2, height * 0.75 + 50);
    }
    
    // Añadir URL
    if (CONFIG.sharing.url) {
        shareCtx.font = '35px Arial';
        shareCtx.fillStyle = '#ffffff';
        shareCtx.fillText(CONFIG.sharing.url, width / 2, height * 0.85);
    }
    
    // Mostrar días restantes para el lanzamiento
    const daysUntilRelease = getDaysUntilRelease();
    if (daysUntilRelease > 0) {
        // Crear un banner para los días restantes
        const bannerY = height * 0.9;
        const bannerHeight = 80;
        
        // Dibujar fondo del banner
        shareCtx.fillStyle = CONFIG.visualizer.colors.primary;
        shareCtx.fillRect(0, bannerY, width, bannerHeight);
        
        // Texto de días restantes
        shareCtx.font = 'bold 40px Arial';
        shareCtx.fillStyle = '#ffffff';
        shareCtx.textAlign = 'center';
        shareCtx.fillText(`¡${daysUntilRelease} días para el lanzamiento!`, width / 2, bannerY + 55);
    }
    
    // Compartir la imagen
    shareImageToSocial();
}

/**
 * Comparte la imagen generada usando Web Share API
 */
async function shareImageToSocial() {
    const shareCanvas = document.getElementById('share-canvas');
    
    try {
        // Convertir canvas a blob
        const blob = await new Promise(resolve => {
            shareCanvas.toBlob(resolve, 'image/png');
        });
        
        // Crear archivo para compartir
        const file = new File([blob], 'disonancia-preview.png', { type: 'image/png' });
        
        // Verificar si Web Share API está disponible
        if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: `${CONFIG.songInfo.artist} - ${CONFIG.songInfo.title}`,
                text: CONFIG.sharing.text,
                files: [file]
            });
            console.log('Imagen compartida exitosamente');
        } else {
            // Fallback: descargar la imagen
            const link = document.createElement('a');
            link.download = 'disonancia-preview.png';
            link.href = shareCanvas.toDataURL('image/png');
            link.click();
            console.log('Web Share API no disponible, imagen descargada');
        }
    } catch (error) {
        console.error('Error al compartir:', error);
        alert('No se pudo compartir la imagen. Intenta de nuevo.');
    }
}

/**
 * Dibuja una imagen con bordes redondeados
 */
function roundedImage(ctx, x, y, width, height, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

/**
 * Muestra un modal para compartir o descargar el archivo generado
 */
function showShareModal(file, fileType) {
    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="share-modal-content">
            <h3>¡${fileType} Generado Exitosamente!</h3>
            <p>Tu ${fileType} animado de 5 segundos está listo.</p>
            <div class="share-modal-buttons">
                <button id="download-btn" class="modal-btn download-btn">
                    📥 Descargar ${fileType}
                </button>
                <button id="share-native-btn" class="modal-btn share-btn">
                    📤 Compartir
                </button>
                <button id="close-modal-btn" class="modal-btn close-btn">
                    ✖️ Cerrar
                </button>
            </div>
        </div>
    `;
    
    // Agregar estilos al modal
    const style = document.createElement('style');
    style.textContent = `
        .share-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        .share-modal-content {
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            max-width: 400px;
            border: 2px solid #7c3aed;
            box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
        }
        .share-modal-content h3 {
            color: #7c3aed;
            margin-bottom: 15px;
            font-size: 1.5em;
        }
        .share-modal-content p {
            color: #ffffff;
            margin-bottom: 25px;
        }
        .share-modal-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .modal-btn {
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        .download-btn {
            background: #10b981;
            color: white;
        }
        .download-btn:hover {
            background: #059669;
        }
        .share-btn {
            background: #7c3aed;
            color: white;
        }
        .share-btn:hover {
            background: #6d28d9;
        }
        .close-btn {
            background: #6b7280;
            color: white;
        }
        .close-btn:hover {
            background: #4b5563;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Event listeners
    const downloadBtn = modal.querySelector('#download-btn');
    const shareBtn = modal.querySelector('#share-native-btn');
    const closeBtn = modal.querySelector('#close-modal-btn');
    
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = file.name;
        link.href = URL.createObjectURL(file);
        link.click();
        console.log(`${fileType} descargado exitosamente`);
        closeModal();
    });
    
    shareBtn.addEventListener('click', async () => {
        try {
            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: `${CONFIG.songInfo.artist} - ${CONFIG.songInfo.title}`,
                    text: CONFIG.sharing.text,
                    files: [file]
                });
                console.log(`${fileType} compartido exitosamente`);
                closeModal();
            } else {
                // Si no se puede compartir, descargar automáticamente
                downloadBtn.click();
            }
        } catch (error) {
            console.error('Error al compartir:', error);
            // Fallback a descarga
            downloadBtn.click();
        }
    });
    
    closeBtn.addEventListener('click', closeModal);
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    function closeModal() {
        document.body.removeChild(modal);
        document.head.removeChild(style);
    }
}

/**
 * Calcula los días restantes hasta la fecha de lanzamiento
 */
function getDaysUntilRelease() {
    const now = new Date();
    const releaseDate = CONFIG.releaseDate;
    
    // Si la fecha de lanzamiento ya pasó, retornar 0
    if (now >= releaseDate) {
        return 0;
    }
    
    // Calcular diferencia en días
    const diffTime = Math.abs(releaseDate - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}