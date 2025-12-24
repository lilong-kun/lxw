// 视频背景设置
const videoBackground = document.getElementById('video-background');
videoBackground.src = '../../home/videos/city_pop_background.mp4';

// 确保视频播放
window.addEventListener('load', () => {
    // 尝试播放视频背景
    videoBackground.play().catch(err => console.log('视频播放失败:', err));
});

// 目录链接交互
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.directory-list a');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert(`即将跳转到：${link.textContent}`);
            window.location.href = link.href;
        });
    });
});