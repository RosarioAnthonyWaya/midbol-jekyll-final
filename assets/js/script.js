const menuToggle = document.querySelector('.menu-toggle, .menu-button');
const mobileNav = document.querySelector('.mobile-nav, .mobile-menu');
const toast = document.querySelector('.toast');

function closeMenu() {
  if (!mobileNav || !menuToggle) return;
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    mobileNav.setAttribute('aria-hidden', String(!open));
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

const demoForm = document.querySelector('#demo-form');
if (demoForm) demoForm.addEventListener('submit', event => {
  event.preventDefault();
  showToast('Thank you — your demo request has been captured.');
  demoForm.reset();
});

const contactForm = document.querySelector('#contact-form');
if (contactForm) contactForm.addEventListener('submit', event => {
  event.preventDefault();
  showToast('Thank you — your enquiry has been captured.');
  contactForm.reset();
});

document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('toggle', () => {
    const symbol = item.querySelector('summary span');
    if (symbol) symbol.textContent = item.open ? '−' : '+';
  });
});

/* Cookie consent banner
   Shows once per browser until the person accepts or rejects (stored in localStorage).
   NOTE: acceptance currently only gates our own toggle below — hook real analytics/marketing
   scripts (e.g. Google Analytics) behind `cookieConsent === 'accepted'` before loading them. */
(function cookieBanner() {
  const KEY = 'midbolcare_cookie_consent';
  const existing = localStorage.getItem(KEY);
  if (existing) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie notice');
  banner.innerHTML = `
    <p>We use essential cookies to run this site, and optional analytics cookies to understand how it's used. Read our <a href="#">Cookie Policy</a>.</p>
    <div class="cookie-actions">
      <button class="cookie-accept" type="button">Accept all</button>
      <button class="cookie-reject" type="button">Essential only</button>
    </div>`;
  document.body.appendChild(banner);
  requestAnimationFrame(() => banner.classList.add('show'));

  function dismiss(value) {
    localStorage.setItem(KEY, value);
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 400);
  }
  banner.querySelector('.cookie-accept').addEventListener('click', () => dismiss('accepted'));
  banner.querySelector('.cookie-reject').addEventListener('click', () => dismiss('essential-only'));
})();

/* Newsletter sign-up
   The form itself now lives directly in _includes/footer.html (Jekyll handles the
   one-place-to-maintain job that this script used to do by injecting it on every page). */
(function newsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    showToast('Thanks — you\'re on the list.');
    form.reset();
  });
})();
