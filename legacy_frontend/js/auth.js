/**
 * auth.js — Authentication Form Logic (classic script)
 * [API-READY] stubs marked for backend integration
 */

(function() {
  function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function markErr(fgId, errId, msg) {
    document.getElementById(fgId)?.classList.add('input-invalid');
    const e = document.getElementById(errId);
    if (e) { if (msg) e.textContent = msg; e.classList.add('visible'); }
  }
  function clearErrs() {
    document.querySelectorAll('.input-invalid').forEach(el => el.classList.remove('input-invalid'));
    document.querySelectorAll('.form-error.visible').forEach(el => el.classList.remove('visible'));
  }

  // LOGIN
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault(); clearErrs();
      let valid = true;
      const email = document.getElementById('email').value.trim();
      const pw    = document.getElementById('password').value;
      if (!isValidEmail(email)) { markErr('fg-email','err-email'); valid = false; }
      if (pw.length < 6)         { markErr('fg-password','err-password'); valid = false; }
      if (!valid) return;
      const btn = document.getElementById('login-btn');
      btn.disabled = true; btn.textContent = 'Logging in…';
      // [API-READY] — POST /api/auth/login { email, password }
      setTimeout(() => {
        alert('✅ Logged in successfully! (Demo)');
        window.location.href = 'dashboard.html';
      }, 1200);
    });
  }

  // SIGNUP
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault(); clearErrs();
      let valid = true;
      const fname = document.getElementById('fname')?.value.trim();
      const email = document.getElementById('semail')?.value.trim();
      const pw    = document.getElementById('spw')?.value;
      const cpw   = document.getElementById('cpw')?.value;
      const terms = document.getElementById('terms')?.checked;
      if (!fname)                { markErr('fg-fname','err-fname'); valid = false; }
      if (!isValidEmail(email))  { markErr('fg-semail','err-semail'); valid = false; }
      if (!pw || pw.length < 8)  { markErr('fg-spw','err-spw'); valid = false; }
      if (pw !== cpw)            { markErr('fg-cpw','err-cpw'); valid = false; }
      if (!terms) { alert('Please accept the Terms of Service.'); return; }
      if (!valid) return;
      const btn = document.getElementById('signup-btn');
      btn.disabled = true; btn.textContent = 'Creating account…';
      // [API-READY] — POST /api/auth/signup { name: fname, email, password: pw }
      setTimeout(() => {
        alert('🎉 Account created! Welcome to TravelPlanner. (Demo)');
        window.location.href = 'dashboard.html';
      }, 1400);
    });
  }
})();
