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