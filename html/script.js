// 冬日暖心祝福网页交互脚本 - 升级版

class WinterBlessing {
    constructor() {
        this.isMusicPlaying = false;
        this.isTransitioning = false;
        this.audioContext = null;
        this.snowParticles = [];
        this.particleSystem = [];
        this.audioAnalyser = null;
        this.audioData = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initAllCanvas();
        this.initAudio();
        this.createParticleSystem();
        this.setupAdvancedAnimations();
        this.setupWarmEffects();
        
        // 页面加载完成后的初始化
        setTimeout(() => {
            this.addLoadedStyles();
            this.startWarmAmbience();
        }, 100);
    }

    setupEventListeners() {
        // 接受祝福按钮
        const acceptButton = document.getElementById('acceptBlessing');
        if (acceptButton) {
            acceptButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('按钮被点击');
                this.transitionToBlessing();
            });
        } else {
            console.error('找不到接受祝福按钮');
        }

        // 音乐控制
        const musicControl = document.getElementById('musicControl');
        if (musicControl) {
            musicControl.addEventListener('click', () => this.toggleMusic());
        }

        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isTransitioning) {
                e.preventDefault();
                console.log('空格键被按下');
                this.transitionToBlessing();
            }
        });

        // 鼠标跟随效果
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));

        // 窗口大小调整
        window.addEventListener('resize', () => {
            this.resizeAllCanvas();
        });
    }

    initAllCanvas() {
        this.snowCanvas = document.getElementById('snowCanvas');
        this.particleCanvas = document.getElementById('particleCanvas');
        this.audioVisualizer = document.getElementById('audioVisualizer');
        
        this.snowCtx = this.snowCanvas.getContext('2d');
        this.particleCtx = this.particleCanvas.getContext('2d');
        this.audioCtx = this.audioVisualizer.getContext('2d');
        
        this.resizeAllCanvas();
        this.initSnowParticles();
    }

    resizeAllCanvas() {
        const canvases = [this.snowCanvas, this.particleCanvas, this.audioVisualizer];
        canvases.forEach(canvas => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    initAudio() {
        this.createAudioContext();
    }

    createAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('音频上下文创建失败:', e);
        }
    }

    toggleMusic() {
        const musicControl = document.getElementById('musicControl');
        
        if (!this.audioContext) {
            this.createAudioContext();
        }

        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.isMusicPlaying = !this.isMusicPlaying;
        
        if (this.isMusicPlaying) {
            this.playWarmMelody();
            musicControl.classList.remove('paused');
        } else {
            this.stopMelody();
            musicControl.classList.add('paused');
        }
    }

    playWarmMelody() {
        if (!this.audioContext) return;

        // 创建温暖的冬日旋律
        this.createWarmMelody();
        this.initAudioVisualization();
    }

    stopMelody() {
        if (this.oscillators) {
            this.oscillators.forEach(osc => {
                if (osc) {
                    osc.stop();
                }
            });
        }
        this.stopAudioVisualization();
    }

    createWarmMelody() {
        if (!this.audioContext) return;

        // 温暖的冬日旋律 (C大调，温暖音程)
        const melody = [
            { note: 'C4', duration: 0.8, type: 'sine' },
            { note: 'E4', duration: 0.8, type: 'sine' },
            { note: 'G4', duration: 0.8, type: 'sine' },
            { note: 'C5', duration: 1.2, type: 'sine' },
            { note: 'B4', duration: 0.6, type: 'triangle' },
            { note: 'A4', duration: 0.6, type: 'triangle' },
            { note: 'G4', duration: 1.0, type: 'triangle' },
            { note: 'F4', duration: 0.8, type: 'sine' },
            { note: 'E4', duration: 0.8, type: 'sine' },
            { note: 'D4', duration: 0.8, type: 'sine' },
            { note: 'C4', duration: 1.6, type: 'sine' }
        ];

        this.oscillators = [];
        let currentTime = this.audioContext.currentTime;

        melody.forEach((noteData, index) => {
            const frequency = this.getNoteFrequency(noteData.note);
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filterNode = this.audioContext.createBiquadFilter();

            oscillator.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.setValueAtTime(frequency, currentTime);
            oscillator.type = noteData.type;

            // 添加温暖的滤波器效果
            filterNode.type = 'lowpass';
            filterNode.frequency.setValueAtTime(800, currentTime);
            filterNode.Q.setValueAtTime(1, currentTime);

            // ADSR 包络
            const attack = 0.1;
            const decay = 0.2;
            const sustain = 0.3;
            const release = 0.3;

            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.15, currentTime + attack);
            gainNode.gain.linearRampToValueAtTime(0.1, currentTime + attack + decay);
            gainNode.gain.setValueAtTime(0.1, currentTime + noteData.duration - release);
            gainNode.gain.linearRampToValueAtTime(0, currentTime + noteData.duration);

            oscillator.start(currentTime);
            oscillator.stop(currentTime + noteData.duration);

            this.oscillators.push({ osc: oscillator, gain: gainNode });
            currentTime += noteData.duration * 0.9; // 音符间稍微重叠
        });

        // 循环播放
        setTimeout(() => {
            if (this.isMusicPlaying) {
                this.createWarmMelody();
            }
        }, melody.reduce((sum, note) => sum + note.duration, 0) * 900);
    }

    initAudioVisualization() {
        if (!this.audioContext) return;

        this.audioAnalyser = this.audioContext.createAnalyser();
        this.audioAnalyser.fftSize = 256;
        this.audioData = new Uint8Array(this.audioAnalyser.frequencyBinCount);

        // 连接分析器到音频图
        const dest = this.audioContext.destination;
        const merger = this.audioContext.createChannelMerger(2);
        merger.connect(this.audioAnalyser);
        merger.connect(dest);
    }

    stopAudioVisualization() {
        this.audioAnalyser = null;
        this.audioData = null;
    }

    getNoteFrequency(note) {
        const noteMap = {
            'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
            'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
            'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77
        };
        return noteMap[note] || 440;
    }

    initSnowParticles() {
        const particleCount = window.innerWidth < 768 ? 60 : 120;
        this.snowParticles = [];

        for (let i = 0; i < particleCount; i++) {
            this.snowParticles.push({
                x: Math.random() * this.snowCanvas.width,
                y: Math.random() * this.snowCanvas.height,
                radius: Math.random() * 4 + 1,
                speed: Math.random() * 3 + 1,
                opacity: Math.random() * 0.8 + 0.2,
                drift: Math.random() * 2 - 1,
                twinkle: Math.random() * Math.PI * 2
            });
        }
    }

    createParticleSystem() {
        const particleCount = window.innerWidth < 768 ? 30 : 60;
        this.particleSystem = [];

        for (let i = 0; i < particleCount; i++) {
            this.particleSystem.push({
                x: Math.random() * this.particleCanvas.width,
                y: Math.random() * this.particleCanvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                life: Math.random(),
                maxLife: 1,
                hue: Math.random() * 20 + 0 // 纯白色调
            });
        }
    }

    setupAdvancedAnimations() {
        // 启动所有动画循环
        this.animateSnow();
        this.animateParticles();
        this.animateAudioVisualizer();
    }

    animateSnow() {
        this.snowCtx.clearRect(0, 0, this.snowCanvas.width, this.snowCanvas.height);

        this.snowParticles.forEach(particle => {
            // 更新位置
            particle.y += particle.speed;
            particle.x += particle.drift * 0.3;
            particle.twinkle += 0.02;

            // 边界检测和重置
            if (particle.y > this.snowCanvas.height) {
                particle.y = -10;
                particle.x = Math.random() * this.snowCanvas.width;
            }
            if (particle.x > this.snowCanvas.width) {
                particle.x = 0;
            }
            if (particle.x < 0) {
                particle.x = this.snowCanvas.width;
            }

            // 绘制雪花（带闪烁效果）
            const twinkleOpacity = particle.opacity * (0.5 + 0.5 * Math.sin(particle.twinkle));
            
            this.snowCtx.save();
            this.snowCtx.globalAlpha = twinkleOpacity;
            this.snowCtx.fillStyle = `rgba(255, 255, 255, ${twinkleOpacity})`;
            this.snowCtx.shadowBlur = particle.radius * 4;
            this.snowCtx.shadowColor = 'rgba(255, 255, 255, 1)';
            
            this.snowCtx.beginPath();
            this.snowCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.snowCtx.fill();
            
            // 添加十字形雪花效果
            this.snowCtx.strokeStyle = `rgba(255, 255, 255, ${twinkleOpacity * 0.8})`;
            this.snowCtx.lineWidth = 0.5;
            this.snowCtx.beginPath();
            this.snowCtx.moveTo(particle.x - particle.radius, particle.y);
            this.snowCtx.lineTo(particle.x + particle.radius, particle.y);
            this.snowCtx.moveTo(particle.x, particle.y - particle.radius);
            this.snowCtx.lineTo(particle.x, particle.y + particle.radius);
            this.snowCtx.stroke();
            
            this.snowCtx.restore();
        });

        requestAnimationFrame(() => this.animateSnow());
    }

    animateParticles() {
        this.particleCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);

        this.particleSystem.forEach((particle, index) => {
            // 更新位置和生命值
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.005;

            // 重生粒子
            if (particle.life <= 0) {
                particle.x = Math.random() * this.particleCanvas.width;
                particle.y = Math.random() * this.particleCanvas.height;
                particle.life = 1;
                particle.vx = (Math.random() - 0.5) * 0.5;
                particle.vy = (Math.random() - 0.5) * 0.5;
            }

            // 边界反弹
            if (particle.x < 0 || particle.x > this.particleCanvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.particleCanvas.height) {
                particle.vy *= -1;
            }

            // 绘制粒子 - 纯白色
            const alpha = particle.life * 0.8;
            this.particleCtx.save();
            this.particleCtx.globalAlpha = alpha;
            this.particleCtx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            this.particleCtx.shadowBlur = particle.size * 3;
            this.particleCtx.shadowColor = `rgba(255, 255, 255, ${alpha})`;
            
            this.particleCtx.beginPath();
            this.particleCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.particleCtx.fill();
            this.particleCtx.restore();
        });

        requestAnimationFrame(() => this.animateParticles());
    }

    animateAudioVisualizer() {
        if (!this.audioAnalyser || !this.audioData) {
            requestAnimationFrame(() => this.animateAudioVisualizer());
            return;
        }

        this.audioAnalyser.getByteFrequencyData(this.audioData);
        
        this.audioCtx.clearRect(0, 0, this.audioVisualizer.width, this.audioVisualizer.height);

        const barWidth = this.audioVisualizer.width / this.audioData.length;
        
        for (let i = 0; i < this.audioData.length; i++) {
            const barHeight = (this.audioData[i] / 255) * 100;
            const hue = (i / this.audioData.length) * 60 + 40; // 温暖色调
            
            this.audioCtx.fillStyle = `rgba(255, 255, 255, 0.4)`;
            this.audioCtx.fillRect(i * barWidth, this.audioVisualizer.height - barHeight, barWidth - 2, barHeight);
        }

        requestAnimationFrame(() => this.animateAudioVisualizer());
    }

    handleMouseMove(e) {
        // 创建鼠标跟随的温暖光效
        if (Math.random() < 0.1) {
            this.createMouseTrail(e.clientX, e.clientY);
        }
    }

    createMouseTrail(x, y) {
        const particle = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1,
            size: Math.random() * 4 + 2,
            hue: Math.random() * 20 + 0 // 纯白色调
        };
        
        this.particleSystem.push(particle);
        
        // 限制粒子数量
        if (this.particleSystem.length > 100) {
            this.particleSystem.shift();
        }
    }

    setupWarmEffects() {
        // 暖色调呼吸效果
        setInterval(() => {
            this.createWarmPulse();
        }, 3000);
    }

    createWarmPulse() {
        const pulse = document.createElement('div');
        pulse.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent);
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 50;
            animation: warmPulseExpand 2s ease-out forwards;
        `;
        
        document.body.appendChild(pulse);
        
        setTimeout(() => {
            document.body.removeChild(pulse);
        }, 2000);
    }

    startWarmAmbience() {
        // 定期创建温暖氛围效果
        setInterval(() => {
            if (Math.random() < 0.3) {
                this.createAmbientSparkle();
            }
        }, 2000);
    }

    createAmbientSparkle() {
        const sparkle = document.createElement('div');
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        sparkle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, #FFFFFF, rgba(255, 255, 255, 0.5), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10;
            animation: sparkleFloat 3s ease-out forwards;
        `;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if (document.body.contains(sparkle)) {
                document.body.removeChild(sparkle);
            }
        }, 3000);
    }

    transitionToBlessing() {
        console.log('开始过渡到祝福界面');
        if (this.isTransitioning) {
            console.log('正在过渡中，跳过');
            return;
        }
        
        this.isTransitioning = true;

        const button = document.getElementById('acceptBlessing');
        const screen1 = document.getElementById('screen1');
        const screen2 = document.getElementById('screen2');
        
        console.log('元素检查:', { button: !!button, screen1: !!screen1, screen2: !!screen2 });

        if (!button || !screen1 || !screen2) {
            console.error('缺少必要的DOM元素');
            this.isTransitioning = false;
            return;
        }

        // 按钮效果
        button.classList.add('button-explosion');
        
        // 创建简单的波纹效果
        this.createSimpleWaveEffect();

        // 延迟切换屏幕 - 简化时间
        setTimeout(() => {
            console.log('开始切换界面');
            screen1.style.opacity = '0';
            screen1.style.zIndex = '5';
            
            setTimeout(() => {
                console.log('激活第二屏');
                screen2.classList.add('active');
                
                // 延迟显示祝福卡片
                setTimeout(() => {
                    console.log('显示祝福卡片');
                    const card = document.getElementById('blessingCard');
                    if (card) {
                        card.classList.add('revealed');
                        this.startCardEffects();
                    }
                    
                    // 重置状态
                    setTimeout(() => {
                        this.isTransitioning = false;
                        console.log('过渡完成');
                    }, 1000);
                }, 300);
            }, 500);
        }, 800);
    }

    createSimpleWaveEffect() {
        // 创建简单的波纹效果
        const wave = document.createElement('div');
        wave.className = 'wave-effect';
        document.body.appendChild(wave);

        setTimeout(() => {
            if (document.body.contains(wave)) {
                document.body.removeChild(wave);
            }
        }, 2000);
    }

    createFireworks() {
        // 创建简化的烟花效果
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                
                firework.style.cssText = `
                    position: fixed;
                    left: ${x}px;
                    top: ${y}px;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: radial-gradient(circle, #FFFFFF, rgba(255, 255, 255, 0.7), transparent);
                    pointer-events: none;
                    z-index: 100;
                    animation: fireworkExplode 1.5s ease-out forwards;
                `;
                
                document.body.appendChild(firework);
                
                setTimeout(() => {
                    if (document.body.contains(firework)) {
                        document.body.removeChild(firework);
                    }
                }, 1500);
            }, i * 200);
        }
    }

    startCardEffects() {
        // 启动卡片内部的各种特效
        const warmIcon = document.querySelector('.warm-icon');
        if (warmIcon) {
            warmIcon.style.animation = 'warmPulse 2s ease-in-out infinite';
        }

        // 启动文字逐个显示
        const paragraphs = document.querySelectorAll('.blessing-content p');
        paragraphs.forEach((p, index) => {
            setTimeout(() => {
                p.style.animation = 'contentFadeIn 1s ease-out forwards';
            }, index * 200);
        });
    }

    addLoadedStyles() {
        // 添加CSS动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes warmPulseExpand {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(20); opacity: 0; }
            }
            
            @keyframes sparkleFloat {
                0% { transform: scale(0) rotate(0deg); opacity: 1; }
                50% { transform: scale(1) rotate(180deg); opacity: 0.8; }
                100% { transform: scale(0) rotate(360deg); opacity: 0; }
            }
            
            @keyframes fireworkExplode {
                0% { transform: scale(0); opacity: 1; }
                50% { transform: scale(4); opacity: 0.8; }
                100% { transform: scale(8); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// 测试函数 - 手动触发界面切换
window.testTransition = function() {
    console.log('手动测试切换');
    
    // 直接调用原有的过渡方法
    if (window.blessingApp) {
        window.blessingApp.transitionToBlessing();
    } else {
        // 备用的简化版本
        const screen1 = document.getElementById('screen1');
        const screen2 = document.getElementById('screen2');
        const card = document.getElementById('blessingCard');
        
        console.log('元素检查:', { screen1: !!screen1, screen2: !!screen2, card: !!card });
        
        if (screen1 && screen2) {
            screen1.style.opacity = '0';
            screen1.style.zIndex = '5';
            
            setTimeout(() => {
                screen2.classList.add('active');
                
                if (card) {
                    setTimeout(() => {
                        card.classList.add('revealed');
                        console.log('界面切换完成');
                    }, 300);
                }
            }, 500);
        } else {
            console.error('无法找到屏幕元素');
        }
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('页面加载完成，初始化圣诞祝福网页');
    
    try {
        window.blessingApp = new WinterBlessing();
        console.log('圣诞祝福网页初始化成功');
    } catch (error) {
        console.error('初始化失败:', error);
    }
});

// 防止右键菜单（可选，增强沉浸感）
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// 防止选择文本（可选，增强沉浸感）
document.addEventListener('selectstart', (e) => {
    e.preventDefault();
});