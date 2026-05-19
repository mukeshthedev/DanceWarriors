// ============================================================
//  DANCE WARRIORS STUDIO — script.js
// ============================================================

// ─── DISCORD WEBHOOK ────────────────────────────────────────
// Replace with your actual Discord webhook URL:
const API_URL = '/api/contact';// ────────────────────────────────────────────────────────────

// ===== NAVBAR =====
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const backdrop  = document.getElementById('navBackdrop');

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  // scroll does NOT close the menu
});

hamburger.addEventListener('click', () => {
  const isOpen = !navLinks.classList.contains('open');
  if (isOpen) {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  } else {
    closeMenu();
  }
});

// Close when a link is clicked
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', closeMenu)
);

// Close when clicking the backdrop
backdrop.addEventListener('click', closeMenu);

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up, .fade-in').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.1 + 's';
  revealObserver.observe(el);
});

// ===== ANIMATED COUNTERS =====
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const tick = () => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start).toLocaleString();
    if (start < target) requestAnimationFrame(tick);
  };
  tick();
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target, parseInt(e.target.dataset.target));
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-num[data-target]').forEach(el =>
  counterObserver.observe(el)
);

// ===== ENROLL BUTTONS → scroll to contact =====
document.querySelectorAll('.enroll-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== CONTACT FORM — validation + Discord webhook =====
const form  = document.getElementById('contactForm');
const modal = document.getElementById('successModal');

// Close modal
document.getElementById('closeModal').addEventListener('click', () =>
  modal.classList.remove('active')
);
modal.addEventListener('click', e => {
  if (e.target === modal) modal.classList.remove('active');
});

// Validate a single field and toggle error state
function validate(id, condition) {
  const fg = document.getElementById('fg-' + id);
  if (!fg) return true;
  fg.classList.toggle('error', !condition);
  return condition;
}

// Clear error styling while the user is typing
form.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('input', () => {
    const fg = el.closest('.form-group');
    if (fg) fg.classList.remove('error');
  });
});

// Build a rich Discord embed from form data
function buildDiscordPayload(name, phone, email, classChoice, message) {
  const now = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return {
    username: 'Dance Warriors Studio',
    embeds: [
      {
        title: '💃 New Enquiry Received!',
        color: 0xC9A84C,
        fields: [
          { name: '👤 Name',          value: name        || '—', inline: true  },
          { name: '📞 Phone',         value: phone       || '—', inline: true  },
          { name: '📧 Email',         value: email       || '—', inline: false },
          { name: '🎭 Interested In', value: classChoice || '—', inline: false },
          { name: '💬 Message',       value: message     || '—', inline: false },
        ],
        footer: {
          text: 'Dance Warriors Studio • ' + now + ' IST'
        }
      }
    ]
  };
}

// Submit handler
form.addEventListener('submit', async e => {
  e.preventDefault();

  const nameEl    = document.getElementById('name');
  const phoneEl   = document.getElementById('phone');
  const emailEl   = document.getElementById('email');
  const classEl   = document.getElementById('classChoice');
  const msgEl     = document.getElementById('message');
  const submitBtn = form.querySelector('.submit-btn');

  // Run all validations; every() ensures all errors show at once
  const isValid = [
    validate('name',    nameEl.value.trim().length >= 2),
    validate('email',   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)),
    validate('phone',   /^[\d\s\+\-]{7,}$/.test(phoneEl.value.trim())),
    validate('message', msgEl.value.trim().length >= 10),
  ].every(Boolean);

  if (!isValid) return;

  // Disable button while sending to prevent double-submit
  const originalHTML  = submitBtn.innerHTML;
  submitBtn.disabled  = true;
  submitBtn.innerHTML = '⏳ Sending…';

  const payload = buildDiscordPayload(
    nameEl.value.trim(),
    phoneEl.value.trim(),
    emailEl.value.trim(),
    classEl  ? classEl.value.trim() : '',
    msgEl.value.trim()
  );

  try {
   // AFTER ✅
const res = await fetch(API_URL, {
  method:  'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name:        nameEl.value.trim(),
    phone:       phoneEl.value.trim(),
    email:       emailEl.value.trim(),
    classChoice: classEl ? classEl.value.trim() : '',
    message:     msgEl.value.trim()
  })
});

    if (res.ok || res.status === 204) {
      form.reset();
      modal.classList.add('active');
    } else {
      console.error('Discord webhook error:', res.status, await res.text());
      alert('Something went wrong. Please try again or contact us directly.');
    }
  } catch (err) {
    console.error('Network error:', err);
    alert('Could not send your message. Please check your connection and try again.');
  } finally {
    submitBtn.disabled  = false;
    submitBtn.innerHTML = originalHTML;
  }
});