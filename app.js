// ===== Бургер-меню =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
    burger.addEventListener('click', () => {
        nav.classList.toggle('open');
        burger.classList.toggle('open');
    });
}

document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        if (nav) {
            nav.classList.remove('open');
            if (burger) burger.classList.remove('open');
        }
    });
});

// ===== Активная полоска при скролле (только на главной) =====
(function () {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    if (sections.length === 0 || navLinks.length === 0) return;

    function setActive() {
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

        if (current) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === '#' + current || href === 'index.html#' + current) {
                    link.classList.add('active');
                }
            });
        }
    }

    window.addEventListener('scroll', setActive);
    setActive();
})();

// ===== Слайдер с точками в новостях =====
document.querySelectorAll('[data-slider]').forEach(slider => {
    const slides = slider.querySelector('[data-slides]');
    const dotsContainer = slider.querySelector('[data-dots]');
    const images = slides.querySelectorAll('img');
    const totalSlides = images.length;
    const perView = 1;
    const totalDots = Math.ceil(totalSlides / perView);

    dotsContainer.innerHTML = '';

    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('span');
        dot.classList.add('news-card__dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            slides.scrollTo({
                left: (slides.scrollWidth / totalDots) * i,
                behavior: 'smooth'
            });
        });
        dotsContainer.appendChild(dot);
    }

    slides.addEventListener('scroll', () => {
        const pageWidth = slides.scrollWidth / totalDots;
        const currentPage = Math.round(slides.scrollLeft / pageWidth);
        dotsContainer.querySelectorAll('.news-card__dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentPage);
        });
    });
});

// ===== Лайтбокс с листанием =====
let currentImages = [];
let currentIndex = 0;

function showLightboxImage() {
    const old = document.querySelector('.lightbox');
    if (old) old.remove();

    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.95); z-index: 9999;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
    `;

    const img = document.createElement('img');
    img.src = currentImages[currentIndex].src;
    img.style.cssText = `
        max-width: 85vw; max-height: 75vh; border-radius: 16px;
        object-fit: contain; box-shadow: 0 0 40px rgba(0,0,0,0.5);
    `;

    const caption = document.createElement('p');
    const el = currentImages[currentIndex];
    const captionText = el.closest('.gallery__item')?.querySelector('.gallery__caption')?.textContent || el.alt || '';
    caption.textContent = captionText;
    caption.style.cssText = `
        color: #fff; font-size: 1rem; margin-top: 16px; max-width: 80vw;
        text-align: center; opacity: 0.85; line-height: 1.4;
    `;

    const close = document.createElement('span');
    close.textContent = '✕';
    close.style.cssText = `
        position: absolute; top: 20px; right: 30px; color: #fff;
        font-size: 2rem; cursor: pointer; z-index: 10;
    `;
    close.addEventListener('click', (e) => {
        e.stopPropagation();
        overlay.remove();
    });

    if (currentImages.length > 1) {
        const prev = document.createElement('span');
        prev.textContent = '‹';
        prev.style.cssText = `
            position: absolute; left: 20px; top: 50%; transform: translateY(-50%);
            color: #fff; font-size: 3rem; cursor: pointer; user-select: none;
            padding: 10px;
        `;
        prev.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            showLightboxImage();
        });

        const next = document.createElement('span');
        next.textContent = '›';
        next.style.cssText = `
            position: absolute; right: 20px; top: 50%; transform: translateY(-50%);
            color: #fff; font-size: 3rem; cursor: pointer; user-select: none;
            padding: 10px;
        `;
        next.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % currentImages.length;
            showLightboxImage();
        });

        overlay.appendChild(prev);
        overlay.appendChild(next);
    }

    overlay.appendChild(img);
    overlay.appendChild(caption);
    overlay.appendChild(close);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
}

function openLightbox(images, index) {
    if (!Array.isArray(images)) {
        images = [images];
        index = 0;
    }
    currentImages = images;
    currentIndex = index;
    showLightboxImage();
}

// ===== Привязка кликов =====
document.querySelectorAll('.gallery__item img').forEach(img => {
    img.addEventListener('click', () => {
        openLightbox([img], 0);
    });
});

document.querySelectorAll('.news-card__slides').forEach(slides => {
    const imgs = slides.querySelectorAll('img');
    imgs.forEach((img, index) => {
        img.addEventListener('click', () => {
            openLightbox(Array.from(imgs), index);
        });
    });
});

document.querySelectorAll('.news-card__media-wrap:not(.news-card__slides) img').forEach(img => {
    img.addEventListener('click', () => {
        const parent = img.closest('.news-card__media-wrap');
        const allImgs = parent ? parent.querySelectorAll('img') : [img];
        const index = Array.from(allImgs).indexOf(img);
        openLightbox(Array.from(allImgs), index >= 0 ? index : 0);
    });
});

// ===== Прелоадер =====
const preloader = document.getElementById('preloader');
const heroTitle = document.querySelector('.hero .preloader__title');
const heroSubtitle = document.querySelector('.hero__subtitle');

window.addEventListener('load', () => {
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('hidden');
        }
        setTimeout(() => {
            if (heroTitle) heroTitle.classList.add('show');
            if (heroSubtitle) heroSubtitle.classList.add('show');
        }, 100);
    }, 1500);
});

// ===== Плавное появление секций при скролле =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
});

document.querySelectorAll('.section, .footer').forEach(el => {
    observer.observe(el);
});

const hero = document.querySelector('.hero');
if (hero) hero.classList.add('visible');

// На странице новостей — первый блок сразу, остальные при скролле
if (!hero) {
    const firstCard = document.querySelector('.news-card');
    if (firstCard) {
        firstCard.style.opacity = '1';
        firstCard.style.transform = 'translateY(0)';
    }
}