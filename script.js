const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
    burger.addEventListener('click', () => {
        nav.classList.toggle('open');
    });
}

document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        if (nav) nav.classList.remove('open');
    });
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

if (sections.length > 0) {
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;

        if (Math.ceil(scrollPos + windowHeight) >= docHeight) {
            current = sections[sections.length - 1].getAttribute('id');
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
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
}