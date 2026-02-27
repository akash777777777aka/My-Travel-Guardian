/* =====================================================
   MY TRAVEL GUARDIAN — app.js
   Shared JS: ripple effects, scroll animations, toast
   ===================================================== */

// ── Ripple Effect ─────────────────────────────────────
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.ripple-btn');
  if (!btn) return;
  const circle = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  circle.style.cssText = `
    width:${size}px; height:${size}px;
    left:${e.clientX - rect.left - size / 2}px;
    top:${e.clientY - rect.top - size / 2}px;
  `;
  circle.classList.add('ripple-wave');
  btn.appendChild(circle);
  setTimeout(() => circle.remove(), 700);
});

// ── Scroll Fade-In ─────────────────────────────────────
(function initFadeIn() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-in-section').forEach(el => observer.observe(el));
})();

// ── Toast Notification ─────────────────────────────────
function showToast(msg, duration = 3500) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ── Active Nav Link highlight ──────────────────────────
(function highlightNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a[href]').forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('text-primary', '!text-primary');
    }
  });
})();

// ── Smooth page-exit transitions ──────────────────────
document.addEventListener('click', function (e) {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('https://wa.me')) return;
  e.preventDefault();
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s ease';
  setTimeout(() => { window.location.href = href; }, 280);
});

// ── Newsletter subscribe (footer) ─────────────────────
document.addEventListener('submit', function (e) {
  const form = e.target;
  if (!form.querySelector('input[type="email"]')) return;
  if (form.id === 'trip-form') return;
  e.preventDefault();
  const input = form.querySelector('input[type="email"]');
  if (!input.value) return;
  input.value = '';
  showToast('🎉 Subscribed! Welcome to the Guardian community.');
});

// ── Button click feedback (scale) ─────────────────────
document.addEventListener('mousedown', function (e) {
  const btn = e.target.closest('.btn');
  if (btn) btn.style.transform = 'scale(0.96)';
});
document.addEventListener('mouseup', function (e) {
  const btn = e.target.closest('.btn');
  if (btn) btn.style.transform = '';
});

// ── Transparent Nav on Hero → Blur on Scroll ──────────
(function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  function updateNav() {
    if (window.scrollY > 60) {
      nav.classList.remove('nav-transparent');
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
      nav.classList.add('nav-transparent');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();

// ── Hero Search Bar Logic ────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Flatpickr for Dates
  const dateInput = document.getElementById('hero-dates');
  if (dateInput && typeof flatpickr !== 'undefined') {
    flatpickr(dateInput, {
      mode: 'range',
      minDate: 'today',
      dateFormat: 'M j, Y',
      altFormat: 'F j, Y',
      altInput: true,
      placeholder: 'Add dates',
      disableMobile: true
    });
  }

  // 2. Destination Autocomplete Logic
  const destInput = document.getElementById('hero-dest');
  const destList = document.getElementById('hero-dest-list');
  const searchBtn = document.getElementById('hero-search-btn');

  if (!destInput || !destList) return;

  const destinations = [
    // Existing non-India / Existing India
    { name: 'Sambalpur, Odisha', category: 'Heritage' },
    { name: 'Puri, Odisha', category: 'Spiritual' },
    { name: 'Taj Mahal, Agra', category: 'Heritage' },
    { name: 'Kerala Backwaters', category: 'Nature' },
    { name: 'Jaipur Palaces', category: 'Culture' },
    { name: 'Ladakh, Himalayas', category: 'Adventure' },
    { name: 'Varanasi', category: 'Spiritual' },

    // North India
    { name: 'New Delhi', category: 'Heritage & Culture' },
    { name: 'Agra, Uttar Pradesh', category: 'Heritage' },
    { name: 'Jaipur, Rajasthan', category: 'Culture' },
    { name: 'Udaipur, Rajasthan', category: 'Luxury & Heritage' },
    { name: 'Jodhpur, Rajasthan', category: 'Heritage' },
    { name: 'Jaisalmer, Rajasthan', category: 'Adventure & Heritage' },
    { name: 'Rishikesh, Uttarakhand', category: 'Spiritual & Adventure' },
    { name: 'Haridwar, Uttarakhand', category: 'Spiritual' },
    { name: 'Amritsar, Punjab', category: 'Spiritual & Culture' },
    { name: 'Shimla, Himachal Pradesh', category: 'Nature' },
    { name: 'Manali, Himachal Pradesh', category: 'Adventure & Nature' },
    { name: 'Dharamshala, Himachal Pradesh', category: 'Culture & Nature' },
    { name: 'Leh Ladakh', category: 'Adventure' },
    { name: 'Srinagar, Jammu & Kashmir', category: 'Nature' },
    { name: 'Gulmarg, Jammu & Kashmir', category: 'Adventure & Nature' },

    // South India
    { name: 'Munnar, Kerala', category: 'Nature' },
    { name: 'Kochi, Kerala', category: 'Heritage' },
    { name: 'Thiruvananthapuram, Kerala', category: 'Culture' },
    { name: 'Bengaluru, Karnataka', category: 'City & Culture' },
    { name: 'Mysuru, Karnataka', category: 'Heritage' },
    { name: 'Hampi, Karnataka', category: 'Heritage' },
    { name: 'Coorg, Karnataka', category: 'Nature' },
    { name: 'Chennai, Tamil Nadu', category: 'Culture' },
    { name: 'Mahabalipuram, Tamil Nadu', category: 'Heritage' },
    { name: 'Ooty, Tamil Nadu', category: 'Nature' },
    { name: 'Kodaikanal, Tamil Nadu', category: 'Nature' },
    { name: 'Madurai, Tamil Nadu', category: 'Spiritual' },
    { name: 'Hyderabad, Telangana', category: 'Heritage & Food' },
    { name: 'Andaman & Nicobar Islands', category: 'Beach & Adventure' },
    { name: 'Lakshadweep Islands', category: 'Beach & Luxury' },

    // West & Central India
    { name: 'Mumbai, Maharashtra', category: 'City & Culture' },
    { name: 'Pune, Maharashtra', category: 'Culture' },
    { name: 'Mahabaleshwar, Maharashtra', category: 'Nature' },
    { name: 'Goa', category: 'Beach & Nightlife' },
    { name: 'Ahmedabad, Gujarat', category: 'Heritage' },
    { name: 'Rann of Kutch, Gujarat', category: 'Culture & Nature' },
    { name: 'Gir National Park, Gujarat', category: 'Wildlife' },
    { name: 'Bhopal, Madhya Pradesh', category: 'Heritage' },
    { name: 'Indore, Madhya Pradesh', category: 'Culture & Food' },
    { name: 'Khajuraho, Madhya Pradesh', category: 'Heritage' },
    { name: 'Kanha National Park, Madhya Pradesh', category: 'Wildlife' },
    { name: 'Bandhavgarh, Madhya Pradesh', category: 'Wildlife' },

    // East & North East India
    // East & North East India
    { name: 'Kolkata, West Bengal', category: 'Heritage & Culture' },
    { name: 'Darjeeling, West Bengal', category: 'Nature' },
    { name: 'Sundarbans, West Bengal', category: 'Wildlife' },
    { name: 'Bhubaneswar, Odisha', category: 'Spiritual' },
    { name: 'Konark, Odisha', category: 'Heritage' },
    { name: 'Chilika Lake, Odisha', category: 'Nature' },
    { name: 'Guwahati, Assam', category: 'Culture' },
    { name: 'Kaziranga National Park, Assam', category: 'Wildlife' },
    { name: 'Shillong, Meghalaya', category: 'Nature' },
    { name: 'Cherrapunji, Meghalaya', category: 'Nature' },
    { name: 'Gangtok, Sikkim', category: 'Nature & Culture' },
    { name: 'Tawang, Arunachal Pradesh', category: 'Culture' }
  ];

  function renderList(query) {
    destList.innerHTML = '';
    const filtered = destinations.filter(d => d.name.toLowerCase().includes(query.toLowerCase()));

    if (filtered.length === 0) {
      destList.innerHTML = '<li class="px-6 py-4 text-secondary/50 text-sm">No destinations found</li>';
    } else {
      filtered.forEach(dest => {
        const li = document.createElement('li');
        li.className = 'px-6 py-3 hover:bg-background-light cursor-pointer border-b border-secondary/5 transition-colors flex flex-col group';
        li.innerHTML = `
          <span class="font-medium text-secondary group-hover:text-primary transition-colors">${dest.name}</span>
          <span class="text-[10px] text-secondary/50 uppercase tracking-wider">${dest.category}</span>
        `;
        li.addEventListener('click', () => {
          destInput.value = dest.name;
          closeList();
        });
        destList.appendChild(li);
      });
    }
  }

  function openList() {
    destList.classList.remove('hidden');
    requestAnimationFrame(() => {
      destList.classList.remove('opacity-0', 'translate-y-2');
      destList.classList.add('opacity-100', 'translate-y-0');
    });
  }

  function closeList() {
    destList.classList.remove('opacity-100', 'translate-y-0');
    destList.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => destList.classList.add('hidden'), 200);
  }

  destInput.addEventListener('input', (e) => {
    renderList(e.target.value);
    openList();
  });

  destInput.addEventListener('focus', () => {
    if (!destInput.value) renderList('');
    else renderList(destInput.value);
    openList();
  });

  document.addEventListener('click', (e) => {
    if (!destInput.contains(e.target) && !destList.contains(e.target)) {
      closeList();
    }
  });

  // 3. Search Button Action
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const q = destInput.value;
      if (q) {
        window.location.href = `destinations.html?query=${encodeURIComponent(q)}`;
      } else {
        showToast('Please select a destination first.');
      }
    });
  }
});
