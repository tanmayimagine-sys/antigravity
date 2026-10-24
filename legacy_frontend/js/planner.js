/**
 * planner.js — Trip Planner Form Logic (classic script)
 * [API-READY] stubs marked for backend integration
 */

(function() {
  // Pre-fill from URL
  const params = new URLSearchParams(window.location.search);
  const destParam = params.get('destination');
  const destInp = document.getElementById('destination');
  if (destParam && destInp) destInp.value = decodeURIComponent(destParam);

  // Set minimum dates
  const today = new Date().toISOString().split('T')[0];
  const startInput = document.getElementById('start-date');
  const endInput   = document.getElementById('end-date');
  if (startInput) { startInput.min = today; startInput.value = today; }
  if (endInput) endInput.min = today;
  if (startInput && endInput) {
    startInput.addEventListener('change', () => {
      endInput.min = startInput.value;
      if (endInput.value && endInput.value < startInput.value) endInput.value = '';
    });
  }

  // Travel type pill selection
  document.querySelectorAll('#type-pills .type-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('#type-pills .type-pill').forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      const tv = document.getElementById('travel-type');
      if (tv) tv.value = pill.dataset.type;
    });
  });

  // Interest pill multi-select
  document.querySelectorAll('#interest-pills .type-pill').forEach(pill => {
    pill.addEventListener('click', () => pill.classList.toggle('selected'));
  });

  // Trending sidebar
  const TRENDING = [
    { name:'Jaipur', duration:'3-4 Days', emoji:'🏰' },
    { name:'Goa',    duration:'4-5 Days', emoji:'🏖' },
    { name:'Manali', duration:'5-7 Days', emoji:'⛰' },
    { name:'Kerala', duration:'5-6 Days', emoji:'🌿' },
  ];
  const trendList = document.getElementById('trending-list');
  if (trendList) {
    trendList.innerHTML = TRENDING.map(t => `
      <div style="display:flex;align-items:center;gap:.75rem;padding:.6rem;background:var(--color-bg);border-radius:var(--radius-sm);cursor:pointer;transition:.2s"
           onmouseenter="this.style.background='rgba(30,58,138,.07)'" onmouseleave="this.style.background='var(--color-bg)'"
           onclick="document.getElementById('destination').value='${t.name}'">
        <span style="font-size:1.4rem">${t.emoji}</span>
        <div>
          <div style="font-weight:600;font-size:.9rem;color:var(--color-text)">${t.name}</div>
          <div style="font-size:.78rem;color:var(--color-text-muted)">${t.duration}</div>
        </div>
        <span style="margin-left:auto;color:var(--color-accent);font-weight:700">+</span>
      </div>
    `).join('');
  }

  // Form validation helpers
  function showErr(fgId, errId, msg) {
    document.getElementById(fgId)?.classList.add('input-invalid');
    const e = document.getElementById(errId);
    if (e) { if (msg) e.textContent = msg; e.classList.add('visible'); }
  }
  function clearErrs() {
    document.querySelectorAll('.input-invalid').forEach(el => el.classList.remove('input-invalid'));
    document.querySelectorAll('.form-error.visible').forEach(el => el.classList.remove('visible'));
  }

  // Form submit
  const form = document.getElementById('planner-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      clearErrs();
      let valid = true;
      const dest   = document.getElementById('destination').value.trim();
      const start  = document.getElementById('start-date').value;
      const end    = document.getElementById('end-date').value;
      const budget = document.getElementById('budget').value;
      const type   = document.getElementById('travel-type').value;
      const interests = [...document.querySelectorAll('#interest-pills .type-pill.selected')].map(p => p.dataset.int);

      if (!dest)  { showErr('fg-destination','err-dest'); valid = false; }
      if (!start) { showErr('fg-start','err-start'); valid = false; }
      if (!end)   { showErr('fg-end','err-end'); valid = false; }
      if (start && end && end < start) { showErr('fg-end','err-end','End date must be after start date'); valid = false; }
      if (!valid) return;

      const overlay = document.querySelector('.loading-overlay');
      if (overlay) overlay.classList.add('active');

      // [API-READY] — POST /api/itinerary/generate with tripData
      const tripData = { destination: dest, start_date: start, end_date: end, budget: parseInt(budget), travel_type: type, interests };
      sessionStorage.setItem('tripData', JSON.stringify(tripData));

      setTimeout(() => {
        if (overlay) overlay.classList.remove('active');
        window.location.href = 'itinerary.html';
      }, 1800);
    });
  }
})();
