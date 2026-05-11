// Бургер-меню
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
        nav?.classList.remove('open');
        burger?.classList.remove('open');
    });
});

// Активная полоска
const allLinks = document.querySelectorAll('.nav__link');
const allSections = document.querySelectorAll('section[id]');

function updateActiveLink() {
    if (allSections.length === 0) return;
    let currentId = '';
    const scrollY = window.scrollY;
    const docH = document.documentElement.scrollHeight;
    const winH = window.innerHeight;

    if (Math.ceil(scrollY + winH) >= docH - 10) {
        currentId = allSections[allSections.length - 1].id;
    } else {
        allSections.forEach(sec => {
            if (scrollY >= sec.offsetTop - 150) currentId = sec.id;
        });
    }

    allLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === '#' + currentId || href === 'index.html#' + currentId) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);
updateActiveLink();

// Слайдер с точками
document.querySelectorAll('[data-slider]').forEach(slider => {
    const slides = slider.querySelector('[data-slides]');
    const dotsContainer = slider.querySelector('[data-dots]');
    const imgs = slides.querySelectorAll('img');
    const totalDots = imgs.length;
    dotsContainer.innerHTML = '';

    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('span');
        dot.className = 'news-card__dot';
        if (i === 0) dot.classList.add('active');
        dot.onclick = () => slides.scrollTo({ left: (slides.scrollWidth / totalDots) * i, behavior: 'smooth' });
        dotsContainer.appendChild(dot);
    }

    slides.addEventListener('scroll', () => {
        const page = Math.round(slides.scrollLeft / (slides.scrollWidth / totalDots));
        dotsContainer.querySelectorAll('.news-card__dot').forEach((d, i) => d.classList.toggle('active', i === page));
    });
});

// Лайтбокс с листанием
let curImgs = [], curIdx = 0;

function showLightbox() {
    const old = document.querySelector('.lightbox');
    if (old) old.remove();

    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    Object.assign(overlay.style, {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.95)', zIndex: 9999,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
    });

    const img = document.createElement('img');
    img.src = curImgs[curIdx].src;
    Object.assign(img.style, { maxWidth: '85vw', maxHeight: '75vh', borderRadius: 16, objectFit: 'contain' });

    const cap = document.createElement('p');
    cap.textContent = curImgs[curIdx].closest('.gallery__item')?.querySelector('.gallery__caption')?.textContent || curImgs[curIdx].alt || '';
    Object.assign(cap.style, { color: '#fff', marginTop: 16, maxWidth: '80vw', textAlign: 'center', opacity: .85 });

    const close = document.createElement('span');
    close.textContent = '✕';
    Object.assign(close.style, { position: 'absolute', top: 20, right: 30, color: '#fff', fontSize: '2rem', cursor: 'pointer' });
    close.onclick = (e) => { e.stopPropagation(); overlay.remove(); };

    overlay.appendChild(img);
    overlay.appendChild(cap);
    overlay.appendChild(close);

    if (curImgs.length > 1) {
        ['‹', '›'].forEach((sym, i) => {
            const btn = document.createElement('span');
            btn.textContent = sym;
            Object.assign(btn.style, {
                position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                [i === 0 ? 'left' : 'right']: '20px', color: '#fff', fontSize: '3rem', cursor: 'pointer', userSelect: 'none'
            });
            btn.onclick = (e) => {
                e.stopPropagation();
                curIdx = (curIdx + (i ? 1 : -1) + curImgs.length) % curImgs.length;
                showLightbox();
            };
            overlay.appendChild(btn);
        });
    }

    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => e.target === overlay && overlay.remove());
}

function openLightbox(images, idx) {
    if (!Array.isArray(images)) { images = [images]; idx = 0; }
    curImgs = images; curIdx = idx;
    showLightbox();
}

// Привязка кликов
document.querySelectorAll('.gallery__item img').forEach(img => img.onclick = () => openLightbox([img], 0));
document.querySelectorAll('.news-card__slides').forEach(slides => {
    const imgs = slides.querySelectorAll('img');
    imgs.forEach((img, i) => img.onclick = () => openLightbox(Array.from(imgs), i));
});
document.querySelectorAll('.news-card__media-wrap:not(.news-card__slides) img').forEach(img => {
    img.onclick = () => {
        const wrap = img.closest('.news-card__media-wrap');
        const imgs = wrap ? wrap.querySelectorAll('img') : [img];
        openLightbox(Array.from(imgs), Array.from(imgs).indexOf(img));
    };
});

// Прелоадер (основной)
const preloader = document.getElementById('preloader');
if (preloader) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            const t = document.querySelector('.hero .preloader__title');
            const s = document.querySelector('.hero__subtitle');
            if (t) t.classList.add('show');
            if (s) s.classList.add('show');
        }, 1500);
    });
}

// Анимация появления секций (кроме новостей)
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'));
}, { threshold: 0.15 });

document.querySelectorAll('.section, .footer').forEach(el => observer.observe(el));
document.querySelector('.hero')?.classList.add('visible');