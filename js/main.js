/**
 * KHUSHI ENTERPRISES — Main JavaScript
 */

(function () {
  'use strict';

  const CONFIG = {
    phone: '9958252825',
    phone2: '6281948633',
    phoneLandline: '0124-4280858',
    email: 'shushienterprises5564@gmail.com',
    whatsapp: '919958252825',
    address: 'Palam Road, H.No. 204 Tibidi Mohalla, Village Dundahera, Gurgaon – 122016, Haryana, India',
    gstin: '06IANPK3388E1ZB',
    company: 'KHUSHI ENTERPRISES'
  };

  /* ── Preloader ── */
  function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('hidden'), 400);
    });
  }

  /* ── Header Scroll ── */
  function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    if (toggle && nav) {
      const setMenuOpen = (open) => {
        toggle.classList.toggle('active', open);
        nav.classList.toggle('mobile-open', open);
        document.body.classList.toggle('menu-open', open);
        document.body.style.overflow = open ? 'hidden' : '';
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      };

      toggle.addEventListener('click', () => {
        setMenuOpen(!nav.classList.contains('mobile-open'));
      });

      nav.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
        link.addEventListener('click', () => setMenuOpen(false));
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && nav.classList.contains('mobile-open')) {
          setMenuOpen(false);
        }
      });
    }
  }

  /* ── Active Nav Link ── */
  function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ── Animated Counters ── */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const start = performance.now();

      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString('en-IN') + suffix;
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  /* ── Services Filter ── */
  function initServicesFilter() {
    const tabs = document.querySelectorAll('.services-tab');
    const grid = document.getElementById('servicesGrid');
    const featured = document.querySelector('.services-featured');
    const emptyEl = document.getElementById('servicesEmpty');
    const countEl = document.querySelector('.services-count');
    if (!tabs.length || !grid) return;

    const items = grid.querySelectorAll('.service-card-v2[data-category]');
    const defaultCountHtml = countEl ? countEl.innerHTML : '';

    function revealCard(card) {
      card.style.display = '';
      card.style.opacity = '1';
      card.style.transform = 'none';
      card.removeAttribute('hidden');
    }

    function hideCard(card) {
      card.style.display = 'none';
    }

    function applyFilter(filter) {
      const showAll = filter === 'all';
      let visible = 0;

      if (featured) {
        featured.hidden = !showAll;
      }

      items.forEach(item => {
        const show = showAll || item.dataset.category === filter;
        if (show) {
          revealCard(item);
          visible++;
        } else {
          hideCard(item);
        }
      });

      if (emptyEl) {
        emptyEl.hidden = visible > 0;
      }

      if (countEl) {
        if (showAll) {
          countEl.innerHTML = defaultCountHtml;
        } else {
          const label = visible === 1 ? 'service' : 'services';
          countEl.innerHTML = `<strong>${visible} ${label}</strong> in this category — <a href="contact.html" style="color:var(--accent-dark);font-weight:600;">get a quote</a> or <a href="tel:+919958252825" style="color:var(--accent-dark);font-weight:600;">call 9958252825</a>.`;
        }
      }
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        applyFilter(tab.dataset.filter);
      });
    });

    /* Ensure cards are visible on load (no GSAP opacity on service cards) */
    items.forEach(revealCard);
  }

  /* ── Portfolio Filter ── */
  function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.portfolio-item[data-category]');
    if (!filterBtns.length || !items.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        items.forEach(item => {
          const show = filter === 'all' || item.dataset.category === filter;
          item.style.display = show ? '' : 'none';
          if (show && typeof gsap !== 'undefined') {
            gsap.fromTo(item, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
          }
        });
      });
    });
  }

  function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(item => {
      const btn = item.querySelector('.faq-question');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        items.forEach(i => {
          i.classList.remove('active');
          const b = i.querySelector('.faq-question');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        if (!isActive) {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ── Contact Form ── */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('name');
      const phone = formData.get('phone');
      const service = formData.get('service');
      const message = formData.get('message');

      const whatsappMsg = encodeURIComponent(
        `Hello KHUSHI ENTERPRISES,\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}`
      );
      window.open(`https://wa.me/${CONFIG.whatsapp}?text=${whatsappMsg}`, '_blank');

      form.style.display = 'none';
      const success = document.querySelector('.form-success');
      if (success) success.style.display = 'block';
    });
  }

  /* ── Hero Particles ── */
  function initParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'hero-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      container.appendChild(particle);

      if (typeof gsap !== 'undefined') {
        gsap.to(particle, {
          y: Math.random() * 100 - 50,
          x: Math.random() * 60 - 30,
          opacity: Math.random() * 0.5 + 0.1,
          duration: Math.random() * 4 + 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }
    }
  }

  /* ── GSAP Animations ── */
  function initGSAP() {
    if (typeof gsap === 'undefined') return;

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    gsap.from('.hero-badge', { opacity: 0, y: 30, duration: 0.8, delay: 0.3 });
    gsap.from('.hero-title', { opacity: 0, y: 40, duration: 1, delay: 0.5 });
    gsap.from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.8, delay: 0.7 });
    gsap.from('.hero .btn-group .btn', {
      opacity: 0, y: 20, duration: 0.6, stagger: 0.15, delay: 0.9
    });
    gsap.from('.hero-stat-item', {
      opacity: 0, y: 20, duration: 0.6, stagger: 0.1, delay: 1.2
    });

    /* service-card-v2: no GSAP — avoids invisible cards when filtering categories */

    /* why-card-v2: no GSAP — avoids opacity conflict with AOS */

    gsap.utils.toArray('.stat-item').forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: 'top 90%' },
        opacity: 0, y: 30, duration: 0.6, delay: i * 0.1
      });
    });

    gsap.from('.cta-box', {
      scrollTrigger: { trigger: '.cta-box', start: 'top 85%' },
      opacity: 0, y: 40, duration: 0.8
    });
  }

  /* ── Swiper Testimonials ── */
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    const el = document.querySelector('.testimonials-swiper');
    if (!el) return;

    new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  }

  /* ── AOS ── */
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({ duration: 800, once: true, offset: 80 });
    }
  }

  /* ── Services Data (for dynamic rendering if needed) ── */
  window.KHUSHI = { CONFIG };

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initHeader();
    initActiveNav();
    initCounters();
    initServicesFilter();
    initPortfolioFilter();
    initContactForm();
    initFAQ();
    initParticles();
    initAOS();
    initSwiper();
  });

  window.addEventListener('load', () => {
    initGSAP();
  });
})();
