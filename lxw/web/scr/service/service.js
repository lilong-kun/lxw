// 视频背景设置
const videoBackground = document.getElementById('video-background');
videoBackground.src = '../../home/videos/city_pop_background.mp4';

// 确保视频播放
window.addEventListener('load', () => {
    // 尝试播放视频背景
    videoBackground.play().catch(err => console.log('视频播放失败:', err));
});

// 简单的交互效果
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});