let currentLang = 'sr';
    function toggleLanguage() {
      const elements = document.querySelectorAll('.lang');
      currentLang = currentLang === 'sr' ? 'en' : 'sr';
      elements.forEach(el => {
        const newText = el.getAttribute(`data-${currentLang}`);
        if (newText) el.textContent = newText;
      });
    }

    function validateForm(event) {
      const form = document.querySelector('form');
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      let isValid = true;
      let errorMsg = "";

      if (!name) {
        errorMsg += "Unesite vaše ime.\n";
        isValid = false;
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorMsg += "Unesite validnu email adresu.\n";
        isValid = false;
      }
      if (!message) {
        errorMsg += "Unesite poruku.\n";
        isValid = false;
      }

      if (!isValid) {
        event.preventDefault();
        alert(errorMsg);
      }
    }

    function toggleMenu() {
      const navLinks = document.querySelector('nav ul');
      navLinks.classList.toggle('active');
    }