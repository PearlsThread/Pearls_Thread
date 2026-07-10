// ===== Pearls Thread — site script =====

document.addEventListener('DOMContentLoaded', () => {

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Collection filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('#productGrid .card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.cat === filter;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // ---- Product cards -> preselect order form ----
  const productSelect = document.getElementById('ofProduct');
  document.querySelectorAll('.card-cta[data-product]').forEach(link => {
    link.addEventListener('click', () => {
      if (productSelect) {
        productSelect.value = link.dataset.product;
      }
    });
  });

  // ---- Order form ----
  const orderForm = document.getElementById('orderForm');
  const formError = document.getElementById('formError');
  const WHATSAPP_NUMBER = '918918267781';
  const ORDER_EMAIL = 'threadpearls@gmail.com';

  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sendType = e.submitter ? e.submitter.dataset.send : 'whatsapp';

      const product = document.getElementById('ofProduct').value.trim();
      const qty = document.getElementById('ofQty').value.trim() || '1';
      const colour = document.getElementById('ofColour').value.trim();
      const name = document.getElementById('ofName').value.trim();
      const phone = document.getElementById('ofPhone').value.trim();
      const address = document.getElementById('ofAddress').value.trim();
      const notes = document.getElementById('ofNotes').value.trim();

      // Validate required fields
      const missing = [];
      if (!product) missing.push('a product');
      if (!name) missing.push('your name');
      if (!phone) missing.push('a phone number');

      if (missing.length) {
        formError.textContent = 'Please fill in ' + missing.join(', ') + ' before sending.';
        formError.classList.add('is-visible');
        return;
      }
      formError.textContent = '';
      formError.classList.remove('is-visible');

      // Build order summary
      const lines = [
        'Hi Pearls Thread! I\'d like to place an order:',
        '',
        `Piece: ${product}`,
        `Quantity: ${qty}`,
      ];
      if (colour) lines.push(`Preferred colour: ${colour}`);
      lines.push(`Name: ${name}`, `Phone: ${phone}`);
      if (address) lines.push(`Delivery: ${address}`);
      if (notes) lines.push(`Notes: ${notes}`);

      const summaryText = lines.join('\n');

      if (sendType === 'email') {
        const subject = encodeURIComponent(`New order — ${product}`);
        const body = encodeURIComponent(summaryText);
        window.location.href = `mailto:${ORDER_EMAIL}?subject=${subject}&body=${body}`;
      } else {
        const encoded = encodeURIComponent(summaryText);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank', 'noopener');
      }
    });
  }

});
