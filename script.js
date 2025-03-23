/**
 * 初始化粒子效果背景
 */
document.addEventListener('DOMContentLoaded', function() {
    // 初始化粒子效果
    initParticles();
    
    // 初始化滚动动画
    initScrollAnimations();
    
    // 初始化筛选功能
    initFilters();
    
    // 添加导航栏滚动效果
    initNavbarEffect();
});

/**
 * 创建粒子效果背景
 */
function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-bg';
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
    
    // 粒子参数
    const particlesArray = [];
    const particleCount = 100;
    const particleMaxSize = 3;
    const particleMaxSpeed = 0.5;
    const particleOpacity = 0.6;
    
    // 粒子类
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * particleMaxSize + 0.5;
            this.speedX = (Math.random() * particleMaxSpeed * 2) - particleMaxSpeed;
            this.speedY = (Math.random() * particleMaxSpeed * 2) - particleMaxSpeed;
            this.color = getParticleColor();
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // 边界检查
            if (this.x > width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            if (this.y > height || this.y < 0) {
                this.speedY = -this.speedY;
            }
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // 获取粒子颜色
    function getParticleColor() {
        const colors = [
            `rgba(37, 99, 235, ${particleOpacity})`,
            `rgba(6, 182, 212, ${particleOpacity})`,
            `rgba(16, 185, 129, ${particleOpacity})`
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // 创建粒子
    function createParticles() {
        for (let i = 0; i < particleCount; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    // 更新粒子
    function updateParticles() {
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
    }
    
    // 连接粒子
    function connectParticles() {
        const maxDistance = 150;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = 1 - (distance / maxDistance);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, width, height);
        updateParticles();
        connectParticles();
        requestAnimationFrame(animate);
    }
    
    // 设置样式
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-2';
    canvas.style.background = 'transparent';
    
    // 初始化
    createParticles();
    animate();
}

/**
 * 初始化滚动动画
 */
function initScrollAnimations() {
    const productCards = document.querySelectorAll('.product-card');
    
    // 检查元素是否在视口中
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // 添加动画类
    function addAnimationClass() {
        productCards.forEach((card, index) => {
            if (isInViewport(card) && !card.classList.contains('animate')) {
                setTimeout(() => {
                    card.classList.add('animate');
                }, index * 100);
            }
        });
    }
    
    // 给卡片添加初始类
    productCards.forEach(card => {
        card.classList.add('product-card-hidden');
    });
    
    // 监听滚动事件
    window.addEventListener('scroll', addAnimationClass);
    
    // 初始检查
    addAnimationClass();
}

/**
 * 初始化筛选功能
 */
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // 添加当前按钮的active类
            button.classList.add('active');
            
            const filterValue = button.textContent.trim();
            
            // 筛选产品卡片
            productCards.forEach(card => {
                const category = card.querySelector('.category').textContent.trim();
                
                if (filterValue === '全部' || filterValue === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * 初始化导航栏滚动效果
 */
function initNavbarEffect() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.8)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        }
    });
} 