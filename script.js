(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  const setMenu = (open) => {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
    menuButton.innerHTML = `<svg><use href="#${open ? 'i-close' : 'i-menu'}"/></svg>`;
    mobileNav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  };

  menuButton?.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });
  mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  // Scroll-aware header and active section indicator.
  const header = document.querySelector('.site-header');
  const navLinks = [...document.querySelectorAll('.main-nav a')];
  const sections = ['routes', 'schedule', 'fleet', 'parcels', 'about', 'faq']
    .map((id) => document.getElementById(id)).filter(Boolean);
  const updateScrollState = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 12);
    document.body.classList.toggle('show-mobile-bar', window.scrollY > 240);
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      const bookingRect = bookingSection.getBoundingClientRect();
      document.body.classList.toggle('booking-in-view', bookingRect.top < window.innerHeight && bookingRect.bottom > 0);
    }
    const contactSection = document.getElementById('contacts');
    const footerSection = document.querySelector('.site-footer');
    const contactRect = contactSection?.getBoundingClientRect();
    const footerRect = footerSection?.getBoundingClientRect();
    const contactAreaInView = [contactRect, footerRect].some((rect) => rect && rect.top < window.innerHeight && rect.bottom > 0);
    document.body.classList.toggle('contact-in-view', contactAreaInView);
    let active = '';
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 180) active = section.id;
    }
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${active}` || (!active && link.getAttribute('href') === '#top')));
  };
  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  // Keep the FAQ compact on mobile: only one answer can stay expanded at a time.
  const faqItems = [...document.querySelectorAll('.faq-list details')];
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item && other.open) other.open = false;
      });
    });
  });

  // Route cards and timetable chips set useful values in the booking form.
  const destinationInput = document.querySelector('input[name="to"]');
  document.querySelectorAll('[data-route]').forEach((link) => {
    link.addEventListener('click', () => {
      if (destinationInput) destinationInput.value = link.dataset.route;
    });
  });
  const dateInput = document.querySelector('input[name="date"]');
  if (dateInput) {
    const now = new Date();
    const localToday = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
    dateInput.min = localToday;
  }
  document.querySelectorAll('[data-date]').forEach((button) => {
    button.addEventListener('click', () => {
      if (dateInput) dateInput.value = button.dataset.date;
      document.querySelectorAll('[data-date]').forEach((other) => other.classList.toggle('selected', other === button));
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Switch between passenger travel and parcel enquiry; only relevant fields remain.
  const form = document.getElementById('bookingForm');
  const typeInput = form?.querySelector('input[name="requestType"]');
  const passengerField = form?.querySelector('.passenger-field');
  const typeButtons = [...document.querySelectorAll('[data-form-type]')];
  typeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const parcel = button.dataset.formType === 'parcel';
      typeButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      if (typeInput) typeInput.value = parcel ? 'Передача посилки' : 'Пасажирська поїздка';
      if (passengerField) passengerField.hidden = parcel;
      if (form) form.classList.toggle('parcel-mode', parcel);
    });
  });

  // Send each completed enquiry directly to the company's WhatsApp number.
  const result = document.getElementById('formResult');
  const requestText = document.getElementById('requestText');
  const copyButton = document.getElementById('copyRequest');
  const whatsappLink = document.getElementById('openWhatsApp');
  const formHelper = form?.querySelector('.form-helper');
  const companyWhatsApp = '380679341600';

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const parcel = data.get('requestType') === 'Передача посилки';
    const dateValue = data.get('date')
      ? new Date(`${data.get('date')}T12:00:00`).toLocaleDateString('uk-UA')
      : (parcel ? 'За домовленістю' : 'Потрібно узгодити');

    const lines = [
      'Нова заявка з сайту — Пасажирські перевезення ЄВРОПА+',
      `Тип звернення: ${data.get('requestType')}`,
      `Звідки: ${data.get('from')}`,
      `Куди: ${data.get('to')}`,
      `Дата: ${dateValue}`,
      ...(!parcel ? [`Кількість пасажирів: ${data.get('passengers')}`] : []),
      `Контактний телефон клієнта: ${data.get('phone')}`
    ];

    const message = lines.join('\n');
    const whatsappUrl = `https://wa.me/${companyWhatsApp}?text=${encodeURIComponent(message)}`;

    if (requestText) requestText.value = message;
    if (whatsappLink) whatsappLink.href = whatsappUrl;

    // window.open runs directly from the submit gesture so browsers allow the WhatsApp tab.
    const whatsappTab = window.open(whatsappUrl, '_blank');
    if (whatsappTab) whatsappTab.opener = null;

    if (result) {
      result.hidden = false;
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (formHelper) formHelper.textContent = 'Після натискання кнопки відкривається WhatsApp із готовою заявкою на номер +380 67 934 16 00.';
    if (copyButton) copyButton.textContent = 'Скопіювати текст заявки';
  });
  copyButton?.addEventListener('click', async () => {
    if (!requestText) return;
    try {
      await navigator.clipboard.writeText(requestText.value);
      copyButton.innerHTML = '<svg><use href="#i-check"/></svg> Скопійовано';
    } catch {
      requestText.focus();
      requestText.select();
      copyButton.textContent = 'Виділіть текст і скопіюйте';
    }
  });

  // Video modal works on both desktop and mobile.
  const modal = document.getElementById('videoModal');
  const modalVideo = modal?.querySelector('video');
  const openVideo = () => {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modalVideo?.play().catch(() => {});
  };
  const closeVideo = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    modalVideo?.pause();
    if (modalVideo) modalVideo.currentTime = 0;
  };
  document.querySelector('[data-open-video]')?.addEventListener('click', openVideo);
  modal?.querySelectorAll('[data-close-video]').forEach((control) => control.addEventListener('click', closeVideo));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeVideo();
  });

  // Reduced-motion preference: pause autoplay to respect user settings.
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo && window.matchMedia('(prefers-reduced-motion: reduce)').matches) heroVideo.pause();
})();
