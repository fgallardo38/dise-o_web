/**
 * ===================================================================
 * GALLARDO SERVICE STORE - MAIN JAVASCRIPT
 * Arquitectura Frontend Senior - Clean Code & SoC
 * ISTP Argentina - Diseño Web (5to Ciclo)
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  init() {
    this.initNavbar();
    this.initScrollReveal();
    this.initCounters();
    this.initProgressBars();
    this.initServiceFilters();
    this.initContactForm();
    this.initFaqAccordion();
  },

  /**
   * === NAVBAR & MENÚ NAVEGACIÓN ===
   * Controla el efecto de scroll en la barra superior, la animación del menú hamburguesa
   * y resalta automáticamente el enlace correspondiente a la página actual.
   */
  initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      });
    }

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        navToggle.classList.toggle('open');
      });
    }

    // Auto-detectar página activa según la URL actual
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      const linkPage = link.getAttribute('href');
      if (linkPage === currentPage) {
        link.classList.add('active');
      } else if (currentPage === '' && linkPage === 'index.html') {
        link.classList.add('active');
      } else if (!link.classList.contains('nav-cta')) {
        link.classList.remove('active');
      }
    });
  },

  /**
   * === REVEAL ON SCROLL ===
   * IntersectionObserver unificado para animaciones de entrada de elementos con la clase .reveal
   */
  initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Dejar de observar una vez animado
          }
        });
      },
      { threshold: 0.1 }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  },

  /**
   * === CONTADORES NUMÉRICOS ANIMADOS ===
   * Anima las estadísticas numéricas en el Home cuando el elemento es visible
   */
  initCounters() {
    const stat1 = document.getElementById('stat1');
    if (!stat1) return; // Solo ejecutar si existen los contadores en la página actual

    const animateCounter = (el, target, suffix = '') => {
      let count = 0;
      const step = Math.ceil(target / 80);
      const timer = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = count.toLocaleString() + suffix;
        if (count >= target) clearInterval(timer);
      }, 20);
    };

    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(document.getElementById('stat1'), 1250, '+');
            animateCounter(document.getElementById('stat2'), 3400, '+');
            animateCounter(document.getElementById('stat3'), 10, '+');
            animateCounter(document.getElementById('stat4'), 98, '%');
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    counterObserver.observe(stat1);
  },

  /**
   * === BARRAS DE PROGRESO ===
   * Anima las barras de habilidades en la página "Nosotros" cuando son visibles
   */
  initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    if (!progressBars.length) return;

    const barObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const targetWidth = bar.dataset.width;
            if (targetWidth) {
              setTimeout(() => {
                bar.style.width = `${targetWidth}%`;
              }, 150);
            }
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.1 }
    );

    progressBars.forEach(bar => barObserver.observe(bar));
  },

  /**
   * === FILTROS DE SERVICIOS ===
   * Controla la barra de filtrado por categoría en la página "Servicios"
   */
  initServiceFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('[data-cat]');
    if (!filterBtns.length || !serviceCards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        serviceCards.forEach(card => {
          if (filter === 'all' || card.dataset.cat === filter) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transition = 'opacity 0.4s ease';
            }, 10);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  },

  /**
   * === FORMULARIO DE CONTACTO ===
   * Validación en tiempo real, contador de caracteres y respuesta simulada
   */
  initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const msgArea = document.getElementById('mensaje');
    const charCount = document.getElementById('charCount');

    // Contador de caracteres
    if (msgArea && charCount) {
      msgArea.addEventListener('input', () => {
        const len = msgArea.value.length;
        charCount.textContent = len;
        if (len > 450) {
          charCount.classList.add('text-danger');
        } else {
          charCount.classList.remove('text-danger');
        }
      });
    }

    // Botón de reintento/reset
    const resetBtn = document.getElementById('resetFormBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetContactForm());
    }

    if (!contactForm) return;

    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      // Limpiar errores previos
      contactForm.querySelectorAll('.error-msg').forEach(el => {
        el.style.display = 'none';
        el.textContent = '';
      });
      contactForm.querySelectorAll('.form-control').forEach(el => {
        el.classList.remove('input-error');
      });

      // Helper para mostrar error
      const showError = (input, msg) => {
        input.classList.add('input-error');
        const errEl = input.parentElement.querySelector('.error-msg');
        if (errEl) {
          errEl.textContent = msg;
          errEl.style.display = 'block';
        }
      };

      // Validar Nombre
      const nombre = document.getElementById('nombre');
      if (nombre && (!nombre.value.trim() || nombre.value.trim().length < 3)) {
        showError(nombre, 'Por favor ingresa tu nombre completo (mínimo 3 caracteres)');
        valid = false;
      }

      // Validar Email
      const email = document.getElementById('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && (!email.value.trim() || !emailRegex.test(email.value))) {
        showError(email, 'Por favor ingresa un correo electrónico válido');
        valid = false;
      }

      // Validar Teléfono
      const telefono = document.getElementById('telefono');
      if (telefono && (!telefono.value.trim() || telefono.value.trim().length < 7)) {
        showError(telefono, 'Por favor ingresa un número de teléfono válido');
        valid = false;
      }

      // Validar Servicio
      const servicio = document.getElementById('servicio');
      if (servicio && !servicio.value) {
        showError(servicio, 'Por favor selecciona el tipo de servicio');
        valid = false;
      }

      // Validar Mensaje
      const mensaje = document.getElementById('mensaje');
      if (mensaje && (!mensaje.value.trim() || mensaje.value.trim().length < 10)) {
        showError(mensaje, 'Por favor describe tu problema con al menos 10 caracteres');
        valid = false;
      }

      // Validar Términos
      const terminos = document.getElementById('terminos');
      if (terminos && !terminos.checked) {
        valid = false;
        alert('Debes aceptar la Política de Privacidad para continuar.');
      }

      if (valid) {
        const btn = document.getElementById('submitBtn');
        if (btn) {
          btn.disabled = true;
          btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Enviando...';
        }

        setTimeout(() => {
          const formContainer = document.getElementById('formContainer');
          const formSuccess = document.getElementById('formSuccess');
          if (formContainer) formContainer.style.display = 'none';
          if (formSuccess) formSuccess.style.display = 'block';
        }, 1200);
      }
    });
  },

  resetContactForm() {
    const contactForm = document.getElementById('contactForm');
    const charCount = document.getElementById('charCount');
    const formContainer = document.getElementById('formContainer');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) contactForm.reset();
    if (charCount) charCount.textContent = '0';
    if (formContainer) formContainer.style.display = 'block';
    if (formSuccess) formSuccess.style.display = 'none';
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa fa-paper-plane"></i> Enviar Mensaje';
    }
  },

  /**
   * === FAQ ACCORDION ===
   * Acordeón interactivo para las preguntas frecuentes de Contacto
   */
  initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (!faqQuestions.length) return;

    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const item = question.parentElement;
        const allOpen = document.querySelectorAll('.faq-item.open');

        allOpen.forEach(openItem => {
          if (openItem !== item) {
            openItem.classList.remove('open');
          }
        });

        item.classList.toggle('open');
      });
    });
  }
};
