(function () {
  'use strict';

  var root = document.documentElement;
  var STORAGE_KEY = 'maxtra-lang';
  var titles = {
    sr: 'Maxtra Orasi – domaći orasi iz Mačve',
    en: 'Maxtra Walnuts – home-grown walnuts from Mačva'
  };
  var messages = {
    sr: {
      name: 'Unesite vaše ime.',
      email: 'Unesite ispravnu email adresu.',
      message: 'Unesite poruku.',
      sending: 'Šaljem poruku…',
      sent: 'Hvala! Poruka je poslata, javićemo vam se uskoro.',
      failed: 'Poruka nije poslata. Pokušajte ponovo ili nas pozovite telefonom.'
    },
    en: {
      name: 'Please enter your name.',
      email: 'Please enter a valid email address.',
      message: 'Please enter a message.',
      sending: 'Sending your message…',
      sent: 'Thank you! Your message has been sent and we will reply soon.',
      failed: 'The message could not be sent. Please try again or give us a call.'
    }
  };

  function currentLang() {
    return root.lang === 'en' ? 'en' : 'sr';
  }

  function setLanguage(lang) {
    root.lang = lang;
    document.title = titles[lang];
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* storage unavailable */ }
  }

  // ---------- Language ----------
  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* storage unavailable */ }
  if (saved === 'en' || saved === 'sr') setLanguage(saved);

  document.getElementById('lang-toggle').addEventListener('click', function () {
    setLanguage(currentLang() === 'sr' ? 'en' : 'sr');
  });

  // ---------- Mobile menu ----------
  var menuButton = document.querySelector('.menu-toggle');
  var navList = document.querySelector('#main-nav ul');

  function closeMenu() {
    navList.classList.remove('active');
    menuButton.setAttribute('aria-expanded', 'false');
  }

  menuButton.addEventListener('click', function () {
    var open = navList.classList.toggle('active');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  navList.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', function (e) {
    if (navList.classList.contains('active') && !e.target.closest('header')) closeMenu();
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 960) closeMenu();
  });

  // ---------- Footer year ----------
  var year = String(new Date().getFullYear());
  document.querySelectorAll('.year').forEach(function (el) { el.textContent = year; });

  // ---------- Contact form ----------
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');

  function showStatus(text, type) {
    status.textContent = text;
    status.className = 'form-status' + (type ? ' ' + type : '');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var t = messages[currentLang()];
    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var message = form.elements.message.value.trim();

    var errors = [];
    if (!name) errors.push(t.name);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push(t.email);
    if (!message) errors.push(t.message);
    if (errors.length) {
      showStatus(errors.join(' '), 'error');
      return;
    }

    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    showStatus(t.sending, '');

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      form.reset();
      showStatus(t.sent, 'success');
    }).catch(function () {
      showStatus(t.failed, 'error');
    }).then(function () {
      button.disabled = false;
    });
  });
})();
