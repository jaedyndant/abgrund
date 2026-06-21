/* ========== ABGRUND — Core Interactions ========== */

// --- NAV TRIGGER ---
const navTrigger = document.querySelector('.nav-trigger');
const navOverlay = document.querySelector('.nav-overlay');
if (navTrigger && navOverlay) {
  navTrigger.addEventListener('click', () => {
    navTrigger.classList.toggle('open');
    navOverlay.classList.toggle('open');
    navTrigger.textContent = navTrigger.classList.contains('open') ? '×' : '☰';
  });
  navOverlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navTrigger.classList.remove('open');
      navOverlay.classList.remove('open');
      navTrigger.textContent = '☰';
    });
  });
}

// Active link
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-overlay__link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === page || (page === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// --- SCROLL PROGRESS BAR ---
const progressBar = document.querySelector('.scroll-progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = maxScroll > 0 ? (scrolled / maxScroll * 100) + '%' : '0%';
  }, { passive: true });
}

// --- GSAP ANIMATIONS ---
window.addEventListener('load', () => {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // --- Landing title glitch-in ---
  const titleLines = document.querySelectorAll('.landing__title span');
  if (titleLines.length) {
    gsap.set(titleLines, { opacity: 0, x: -60, skewX: 10 });
    gsap.to(titleLines, {
      opacity: 1, x: 0, skewX: 0,
      duration: 0.5, stagger: 0.12,
      ease: 'power3.out', delay: 0.3
    });
  }

  // Ghost text parallax
  const ghost = document.querySelector('.landing__ghost');
  if (ghost) {
    gsap.to(ghost, {
      scrollTrigger: { trigger: '.landing', start: 'top top', end: 'bottom top', scrub: true },
      y: -120, x: 40, ease: 'none'
    });
  }

  // Landing halftone images parallax
  document.querySelectorAll('.landing__halftone-img').forEach((img, i) => {
    gsap.to(img, {
      scrollTrigger: { trigger: '.landing', start: 'top top', end: 'bottom top', scrub: true },
      y: i % 2 === 0 ? -60 : -30, rotation: i % 2 === 0 ? 4 : -2, ease: 'none'
    });
  });

  // Landing meta scatter in
  document.querySelectorAll('.landing__meta').forEach((el, i) => {
    gsap.from(el, { opacity: 0, y: 20, duration: 0.4, delay: 0.8 + i * 0.15, ease: 'power2.out' });
  });

  // Crop marks scale in
  document.querySelectorAll('.landing__crop').forEach((el, i) => {
    gsap.from(el, { scale: 0, duration: 0.3, delay: 1.2 + i * 0.1, ease: 'back.out(2)' });
  });

  // --- Headliners clip-path wipe ---
  const headlinerNames = gsap.utils.toArray('.headliners__name');
  if (headlinerNames.length) {
    gsap.set(headlinerNames, { clipPath: 'inset(0 100% 0 0)' });
    ScrollTrigger.batch(headlinerNames, {
      start: 'top 90%',
      onEnter: batch => gsap.to(batch, {
        clipPath: 'inset(0 0% 0 0)', duration: 0.6, stagger: 0.08, ease: 'power3.inOut', overwrite: true
      }),
      onLeaveBack: batch => gsap.to(batch, {
        clipPath: 'inset(0 100% 0 0)', duration: 0.3, stagger: 0.04, overwrite: true
      })
    });
  }

  // --- Program strips stagger ---
  const strips = gsap.utils.toArray('.program-strip');
  if (strips.length) {
    gsap.set(strips, { x: -30, opacity: 0 });
    ScrollTrigger.batch(strips, {
      start: 'top 92%',
      onEnter: batch => gsap.to(batch, { x: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power2.out', overwrite: true }),
      onLeaveBack: batch => gsap.to(batch, { x: -30, opacity: 0, duration: 0.2, stagger: 0.03, overwrite: true })
    });
  }

  // --- Artist cards scatter-in ---
  const artistCards = gsap.utils.toArray('.artist-card');
  if (artistCards.length) {
    gsap.set(artistCards, { scale: 0.8, opacity: 0, rotation: () => gsap.utils.random(-5, 5) });
    ScrollTrigger.batch(artistCards, {
      start: 'top 90%',
      onEnter: batch => gsap.to(batch, {
        scale: 1, opacity: 1, rotation: (i, el) => parseFloat(el.style.getPropertyValue('--rot') || 0),
        duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)', overwrite: true
      }),
      onLeaveBack: batch => gsap.to(batch, { scale: 0.8, opacity: 0, duration: 0.3, stagger: 0.05, overwrite: true })
    });
  }

  // --- Zine pages ---
  gsap.utils.toArray('.zine-page').forEach(page => {
    const els = page.querySelectorAll('.zine-page__tag, .zine-page__title, .zine-page__body, .zine-page__img');
    gsap.set(els, { y: 30, opacity: 0 });
    ScrollTrigger.create({
      trigger: page,
      start: 'top 70%',
      onEnter: () => gsap.to(els, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }),
      onLeaveBack: () => gsap.to(els, { y: 30, opacity: 0, duration: 0.3, stagger: 0.05 })
    });
  });

  // Zine page numbers
  gsap.utils.toArray('.zine-page__number').forEach(num => {
    gsap.to(num, {
      scrollTrigger: { trigger: num.closest('.zine-page'), start: 'top bottom', end: 'bottom top', scrub: true },
      y: -60, ease: 'none'
    });
  });

  // --- Ticket cards ---
  const ticketCards = gsap.utils.toArray('.ticket-card');
  if (ticketCards.length) {
    gsap.set(ticketCards, { y: 40, opacity: 0 });
    ScrollTrigger.batch(ticketCards, {
      start: 'top 88%',
      onEnter: batch => gsap.to(batch, { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out', overwrite: true }),
      onLeaveBack: batch => gsap.to(batch, { y: 40, opacity: 0, duration: 0.3, stagger: 0.06, overwrite: true })
    });
  }

  // --- Contact title skew animate ---
  const contactTitle = document.querySelector('.contact-panel__title');
  if (contactTitle) {
    gsap.from(contactTitle, {
      scrollTrigger: { trigger: contactTitle, start: 'top 80%', toggleActions: 'play none none reverse' },
      scaleY: 1.8, skewX: -12, opacity: 0, duration: 0.8, ease: 'power3.out'
    });
  }

  // --- HOME: Manifesto text slide in ---
  const manifestoText = document.querySelector('.home-manifesto__text');
  if (manifestoText) {
    gsap.from(manifestoText, {
      scrollTrigger: { trigger: manifestoText, start: 'top 80%', toggleActions: 'play none none reverse' },
      x: -60, skewX: 5, opacity: 0, duration: 0.7, ease: 'power3.out'
    });
  }

  // --- HOME: Manifesto image parallax ---
  const manifestoImg = document.querySelector('.home-manifesto__img img');
  if (manifestoImg) {
    gsap.to(manifestoImg, {
      scrollTrigger: { trigger: '.home-manifesto', start: 'top bottom', end: 'bottom top', scrub: true },
      y: -40, scale: 1.08, ease: 'none'
    });
  }

  // --- HOME: Numbers count up ---
  gsap.utils.toArray('.numbers-band__num').forEach(num => {
    const target = parseInt(num.textContent);
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: num,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(obj, {
          val: target, duration: 1.2, ease: 'power2.out',
          onUpdate: () => { num.textContent = Math.round(obj.val); }
        });
      }
    });
  });

  // --- HOME: Program day cards stagger ---
  const programDays = gsap.utils.toArray('.home-program__day');
  if (programDays.length) {
    gsap.set(programDays, { y: 40, opacity: 0 });
    ScrollTrigger.batch(programDays, {
      start: 'top 88%',
      onEnter: batch => gsap.to(batch, { y: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'power2.out', overwrite: true }),
      onLeaveBack: batch => gsap.to(batch, { y: 40, opacity: 0, duration: 0.3, stagger: 0.08, overwrite: true })
    });
  }

  // --- HOME: Venue cards ---
  const venueCards = gsap.utils.toArray('.home-venue-card');
  if (venueCards.length) {
    gsap.set(venueCards, { y: 30, opacity: 0 });
    ScrollTrigger.batch(venueCards, {
      start: 'top 90%',
      onEnter: batch => gsap.to(batch, { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out', overwrite: true }),
      onLeaveBack: batch => gsap.to(batch, { y: 30, opacity: 0, duration: 0.3, stagger: 0.06, overwrite: true })
    });
  }

  // --- HOME: CTA band ---
  const ctaText = document.querySelector('.cta-band__text');
  if (ctaText) {
    gsap.from(ctaText, {
      scrollTrigger: { trigger: ctaText, start: 'top 85%', toggleActions: 'play none none reverse' },
      skewX: -10, x: -40, opacity: 0, duration: 0.6, ease: 'power3.out'
    });
  }

  // --- HOME: Numbers band items ---
  const numItems = gsap.utils.toArray('.numbers-band__item');
  if (numItems.length) {
    gsap.set(numItems, { y: 20, opacity: 0 });
    ScrollTrigger.batch(numItems, {
      start: 'top 90%',
      onEnter: batch => gsap.to(batch, { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out', overwrite: true }),
      onLeaveBack: batch => gsap.to(batch, { y: 20, opacity: 0, duration: 0.2, stagger: 0.05, overwrite: true })
    });
  }

  // --- Contact blocks ---
  const contactBlocks = gsap.utils.toArray('.contact-block');
  if (contactBlocks.length) {
    gsap.set(contactBlocks, { y: 20, opacity: 0 });
    ScrollTrigger.batch(contactBlocks, {
      start: 'top 90%',
      onEnter: batch => gsap.to(batch, { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out', overwrite: true }),
      onLeaveBack: batch => gsap.to(batch, { y: 20, opacity: 0, duration: 0.2, overwrite: true })
    });
  }

  // --- Section tags ---
  gsap.utils.toArray('.section-tag').forEach(tag => {
    gsap.from(tag, {
      scrollTrigger: { trigger: tag, start: 'top 90%', toggleActions: 'play none none reverse' },
      x: -20, opacity: 0, duration: 0.4, ease: 'power2.out'
    });
  });

  // --- Program day headers skew snap ---
  gsap.utils.toArray('.program-day__title').forEach(title => {
    gsap.from(title, {
      scrollTrigger: { trigger: title, start: 'top 85%', toggleActions: 'play none none reverse' },
      skewX: -15, x: -60, opacity: 0, duration: 0.5, ease: 'power3.out'
    });
  });
});
