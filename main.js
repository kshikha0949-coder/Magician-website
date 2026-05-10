/* ========================================
   MAGICIAN PARTH — Shared JavaScript
======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  /* ── Mobile hamburger menu ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Active nav link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Scroll-to-top button ── */
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    window.addEventListener('scroll', () => {
      scrollTop.classList.toggle('visible', window.scrollY > 400);
    });
    scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Fade-up on scroll (IntersectionObserver) ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  /* ── Animated counter ── */
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target) + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  /* ── Testimonial slider ── */
  const slider = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');

  if (slider && dots.length) {
    let current = 0;
    const slides = slider.querySelectorAll('.testimonial-card');
    const total = slides.length;

    function goTo(idx) {
      current = (idx + total) % total;
      slider.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

    // Auto-advance
    setInterval(() => goTo(current + 1), 5000);
  }

  /* ── Contact form validation ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = contactForm.querySelectorAll('[required]');
      let valid = true;

      fields.forEach(field => {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
        if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          field.classList.add('error');
          valid = false;
        }
      });

      if (valid) {
        const btn = contactForm.querySelector('button[type="submit"]');
        const original = btn.innerHTML;
        btn.innerHTML = '✅ Message Sent!';
        btn.disabled = true;
        btn.style.background = 'linear-gradient(135deg, #27ae60, #1e8449)';
        setTimeout(() => {
          btn.innerHTML = original;
          btn.disabled = false;
          btn.style.background = '';
          contactForm.reset();
        }, 3500);
      }
    });

    // Real-time validation
    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', () => field.classList.remove('error'));
    });
  }

  /* ── Floating particles (hero only) ── */
  const heroParticles = document.getElementById('hero-particles');
  if (heroParticles) {
    const symbols = ['✦', '★', '✧', '✶', '✸', '◈', '⬡'];
    for (let i = 0; i < 22; i++) {
      const el = document.createElement('span');
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.cssText = `
        position:absolute;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        font-size:${0.5 + Math.random() * 1.2}rem;
        color: rgba(201,168,76,${0.1 + Math.random() * 0.35});
        animation: float ${3 + Math.random() * 5}s ease-in-out ${Math.random() * 4}s infinite alternate;
        pointer-events:none;
        user-select:none;
      `;
      heroParticles.appendChild(el);
    }
  }

  /* ── Blog category filter ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const blogCards = document.querySelectorAll('.blog-card[data-category]');
  if (filterBtns.length && blogCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        blogCards.forEach(card => {
          const match = cat === 'all' || card.dataset.category === cat;
          card.style.display = match ? '' : 'none';
          card.style.opacity = match ? '1' : '0';
        });
      });
    });
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

});