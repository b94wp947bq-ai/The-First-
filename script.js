// Бургер-меню
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
    burger.addEventListener('click', () => {
        nav.classList.toggle('open');
        burger.classList.toggle('open');
    });
}

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        if (nav) {
            nav.classList.remove('open');
            if (burger) burger.classList.remove('open');
        }
    });
});

// Активная полоска при скролле
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;

        if (Math.ceil(scrollPos + windowHeight) >= docHeight - 10) {
            current = sections[sections.length - 1].getAttribute('id');
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                if (scrollPos >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Вызов при загрузке, чтобы сразу подсветить
    window.dispatchEvent(new Event('scroll'));
}

// Увеличение фото при клике
function openLightbox(src) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.9); z-index: 9999;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
    `;
    const bigImg = document.createElement('img');
    bigImg.src = src;
    bigImg.style.cssText = `
        max-width: 90vw; max-height: 90vh; border-radius: 16px;
        object-fit: contain; box-shadow: 0 0 40px rgba(0,0,0,0.5);
    `;
    overlay.appendChild(bigImg);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', () => overlay.remove());
}

document.querySelectorAll('.gallery__item img').forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src));
});

document.querySelectorAll('.news-card__media-wrap img').forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src));
});


