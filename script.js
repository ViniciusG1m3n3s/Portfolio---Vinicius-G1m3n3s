document.addEventListener("DOMContentLoaded", function() {

    // Variável para armazenar a instância da animação VANTA
    let vantaEffect = null;

    // 1. ANIMAÇÃO DE SCROLL
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });

    
    // 2. LÓGICA DE TROCA DE TEMA
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const htmlEl = document.documentElement;

    function updateIcons(theme) {
        if (!sunIcon || !moonIcon) return;
        if (theme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }
    
    function setTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateIcons(theme);

        if (vantaEffect) {
            const isDark = theme === 'dark';
            
            // ** NOVAS CORES PARA O TEMA ESCURO (AINDA MAIS SUTIS) **
            vantaEffect.setOptions({
                baseColor: isDark ? 0x121212 : 0xf8f9fa,
                highlightColor: isDark ? 0x251d30 : 0xeae4f2, // Roxo muito escuro, quase preto
                midtoneColor: isDark ? 0x1e263b : 0xd4e2f7,   // Azul muito escuro, quase preto
                lowlightColor: isDark ? 0x1d2121 : 0xd8e1e8,  // Cinza/Verde muito escuro
                speed: isDark ? 1.0 : 1.5 // Velocidade ainda menor no tema escuro
            });
        }
    }

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
    
    themeToggleBtn.addEventListener('click', () => {
        const newTheme = htmlEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });


    // 3. LÓGICA DA NAVEGAÇÃO FLUTUANTE
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    function scrollHeader() {
        if (this.scrollY >= 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }

    function updateActiveLink() {
        let currentSectionId = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            const linkHref = link.getAttribute('href');
            if (linkHref && linkHref.substring(1) === currentSectionId) {
                link.classList.add('active-link');
            }
        });
    }

    window.addEventListener('scroll', scrollHeader);
    window.addEventListener('scroll', updateActiveLink);
    
    // 4. INICIALIZAÇÃO DO VANTA.JS COM NOVAS CORES E PARÂMETROS
    if (window.VANTA) {
        const isDark = currentTheme === 'dark';
        vantaEffect = VANTA.FOG({
            el: "#sobre",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            
            // ** PARÂMETROS DE COR E VELOCIDADE INICIAIS **
            baseColor: isDark ? 0x121212 : 0xf8f9fa,
            highlightColor: isDark ? 0x1a1a1f : 0xeae4f2,
            midtoneColor:   isDark ? 0x1c1a1f : 0xd4e2f7,
            lowlightColor:  isDark ? 0x141414 : 0xd8e1e8,
            speed: isDark ? 1.0 : 1.5,

            // Parâmetros de Comportamento
            blurFactor: 0.90,
            zoom: 1.00
        });
    }

    // Define o estado inicial do tema e do link ativo ao carregar a página
    setTheme(currentTheme); 
    updateActiveLink(); 
});