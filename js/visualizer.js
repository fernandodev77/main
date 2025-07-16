/**
 * Visualizador 3D con Three.js
 */

class AudioVisualizer {
    constructor() {
        this.canvas = document.getElementById('visualizer-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.audioData = null;
        this.animationId = null;
        this.isActive = false;
        this.currentStyle = 0;
        this.styles = CONFIG.visualizer.styles;
        
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        this.setupThreeJS();
        this.createVisualization();
    }
    
    setupThreeJS() {
        if (!this.canvas) {
            console.error('Canvas del visualizador no encontrado');
            return;
        }
        
        // Crear escena
        this.scene = new THREE.Scene();
        
        // Obtener dimensiones del canvas
        const width = this.canvas.offsetWidth || 250;
        const height = this.canvas.offsetHeight || 250;
        
        // Crear cámara
        this.camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        );
        this.camera.position.z = 50;
        
        // Crear renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x000000, 0);
        
        console.log('Visualizador inicializado:', { width, height });
    }
    
    createVisualization() {
        this.clearScene();
        
        const style = this.styles[this.currentStyle];
        
        switch (style.type) {
            case 'galaxy':
                this.createGalaxyVisualization(style);
                break;
            case 'nebula':
                this.createNebulaVisualization(style);
                break;
            case 'cosmos':
                this.createCosmosVisualization(style);
                break;
            default:
                this.createGalaxyVisualization(style);
        }
    }
    
    createGalaxyVisualization(style) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(style.particleCount * 3);
        const colors = new Float32Array(style.particleCount * 3);
        const sizes = new Float32Array(style.particleCount);
        
        for (let i = 0; i < style.particleCount; i++) {
            // Posiciones en espiral de galaxia
            const radius = Math.random() * 25;
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * 10;
            
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = height;
            positions[i * 3 + 2] = Math.sin(angle) * radius;
            
            // Colores
            const color = new THREE.Color(style.colors[Math.floor(Math.random() * style.colors.length)]);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            // Tamaños
            sizes[i] = Math.random() * 2 + 1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                audioData: { value: 0 }
            },
            vertexShader: this.getVertexShader(),
            fragmentShader: this.getFragmentShader(),
            transparent: true,
            vertexColors: true
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    createNebulaVisualization(style) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(style.particleCount * 3);
        const colors = new Float32Array(style.particleCount * 3);
        const sizes = new Float32Array(style.particleCount);
        
        for (let i = 0; i < style.particleCount; i++) {
            // Posiciones en forma de nebulosa
            const x = (Math.random() - 0.5) * 40;
            const y = (Math.random() - 0.5) * 40;
            const z = (Math.random() - 0.5) * 40;
            
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            
            // Colores más suaves para nebulosa
            const color = new THREE.Color(style.colors[Math.floor(Math.random() * style.colors.length)]);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            sizes[i] = Math.random() * 3 + 1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                audioData: { value: 0 }
            },
            vertexShader: this.getVertexShader(),
            fragmentShader: this.getNebulaFragmentShader(),
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    createCosmosVisualization(style) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(style.particleCount * 3);
        const colors = new Float32Array(style.particleCount * 3);
        const sizes = new Float32Array(style.particleCount);
        
        for (let i = 0; i < style.particleCount; i++) {
            // Posiciones en múltiples capas esféricas
            const radius = 10 + Math.random() * 30;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.cos(phi);
            positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
            
            const color = new THREE.Color(style.colors[Math.floor(Math.random() * style.colors.length)]);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            sizes[i] = Math.random() * 2.5 + 0.5;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                audioData: { value: 0 }
            },
            vertexShader: this.getVertexShader(),
            fragmentShader: this.getCosmosFragmentShader(),
            transparent: true,
            vertexColors: true
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    getVertexShader() {
        return `
            attribute float size;
            uniform float time;
            uniform float audioData;
            varying vec3 vColor;
            
            void main() {
                vColor = color;
                
                vec3 pos = position;
                
                // Rotación basada en tiempo
                float angle = time * 0.5;
                mat3 rotY = mat3(
                    cos(angle), 0.0, sin(angle),
                    0.0, 1.0, 0.0,
                    -sin(angle), 0.0, cos(angle)
                );
                
                pos = rotY * pos;
                
                // Efecto de audio
                float audioEffect = audioData * 0.1 + 1.0;
                pos *= audioEffect;
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                
                // Tamaño de partícula con efecto de audio
                gl_PointSize = size * audioEffect * (300.0 / -mvPosition.z);
            }
        `;
    }
    
    getFragmentShader() {
        return `
            varying vec3 vColor;
            
            void main() {
                float distance = length(gl_PointCoord - vec2(0.5));
                if (distance > 0.5) discard;
                
                float alpha = 1.0 - distance * 2.0;
                gl_FragColor = vec4(vColor, alpha * 0.8);
            }
        `;
    }
    
    getNebulaFragmentShader() {
        return `
            varying vec3 vColor;
            
            void main() {
                float distance = length(gl_PointCoord - vec2(0.5));
                if (distance > 0.5) discard;
                
                float alpha = 1.0 - distance * 2.0;
                alpha *= 0.6; // Más transparente para efecto nebulosa
                gl_FragColor = vec4(vColor, alpha);
            }
        `;
    }
    
    getCosmosFragmentShader() {
        return `
            varying vec3 vColor;
            
            void main() {
                float distance = length(gl_PointCoord - vec2(0.5));
                if (distance > 0.5) discard;
                
                // Efecto de estrella con centro brillante
                float alpha = 1.0 - distance * 2.0;
                float brightness = 1.0 - distance;
                
                gl_FragColor = vec4(vColor * brightness, alpha * 0.9);
            }
        `;
    }
    
    setupEventListeners() {
        // Switch de modo visualización
        const modeToggle = document.getElementById('visualization-mode-toggle');
        if (modeToggle) {
            modeToggle.addEventListener('change', () => {
                this.toggleVisualizationMode(modeToggle.checked);
            });
        }
        
        // Botones de estilo
        const styleButtons = document.querySelectorAll('.style-btn');
        styleButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const styleIndex = parseInt(btn.getAttribute('data-style')) || index;
                this.changeStyle(styleIndex);
                this.updateStyleButtons(styleIndex);
            });
        });
        
        // Redimensionar
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
    }
    
    toggleVisualizationMode(isAnimationMode) {
        this.isActive = isAnimationMode;
        
        const canvas = document.getElementById('visualizer-canvas');
        const coverContainer = document.getElementById('cover-container');
        const styleSelector = document.getElementById('style-selector');
        
        if (isAnimationMode) {
            // Mostrar animación, ocultar cover
            canvas.classList.remove('hidden');
            coverContainer.style.opacity = '0';
            coverContainer.style.pointerEvents = 'none';
            styleSelector.classList.remove('hidden');
            this.startAnimation();
        } else {
            // Mostrar cover, ocultar animación
            canvas.classList.add('hidden');
            coverContainer.style.opacity = '1';
            coverContainer.style.pointerEvents = 'auto';
            styleSelector.classList.add('hidden');
            this.stopAnimation();
        }
    }
    
    // Método legacy para compatibilidad
    toggle() {
        const modeToggle = document.getElementById('visualization-mode-toggle');
        if (modeToggle) {
            modeToggle.checked = !modeToggle.checked;
            this.toggleVisualizationMode(modeToggle.checked);
        }
    }
    
    changeStyle(styleIndex) {
        if (styleIndex >= 0 && styleIndex < this.styles.length) {
            this.currentStyle = styleIndex;
            this.createVisualization();
        }
    }
    
    updateStyleButtons(activeIndex) {
        const styleButtons = document.querySelectorAll('.style-btn');
        styleButtons.forEach((btn, index) => {
            if (index === activeIndex) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    setAudioData(audioData) {
        this.audioData = audioData;
    }
    
    startAnimation() {
        if (!this.animationId) {
            this.animate();
        }
    }
    
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    animate() {
        if (!this.isActive) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (this.particles && this.particles.material.uniforms) {
            // Actualizar tiempo
            this.particles.material.uniforms.time.value += 0.01;
            
            // Actualizar datos de audio
            if (this.audioData) {
                const average = this.audioData.reduce((a, b) => a + b, 0) / this.audioData.length;
                this.particles.material.uniforms.audioData.value = average / 255;
            }
        }
        
        // Rotar la cámara suavemente
        if (this.camera) {
            this.camera.position.x = Math.cos(Date.now() * 0.0005) * 50;
            this.camera.position.z = Math.sin(Date.now() * 0.0005) * 50;
            this.camera.lookAt(this.scene.position);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        if (this.camera && this.renderer) {
            const width = this.canvas.offsetWidth;
            const height = this.canvas.offsetHeight;
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        }
    }
    
    clearScene() {
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
    }
    
    destroy() {
        this.stopAnimation();
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Variable global para el visualizador
let audioVisualizer;

document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que Three.js esté cargado
    setTimeout(() => {
        audioVisualizer = new AudioVisualizer();
        window.audioVisualizer = audioVisualizer;
    }, 200);
});