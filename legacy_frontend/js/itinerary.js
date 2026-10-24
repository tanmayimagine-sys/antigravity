/**
 * itinerary.js — Itinerary Page Logic (classic script)
 * Reads tripData from sessionStorage and renders content.
 * [API-READY] stubs marked for backend connection.
 */

(function() {
  const raw = sessionStorage.getItem('tripData');
  const trip = raw ? JSON.parse(raw) : {
    destination:'Jaipur', start_date:'2026-03-15', end_date:'2026-03-18',
    budget:30000, travel_type:'Solo', interests:[]
  };

  function daysBetween(a, b) { return Math.max(1, Math.round((new Date(b) - new Date(a)) / 86400000)); }
  function fmtDate(d) { return new Date(d).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'}); }
  function fmtINR(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

  const days = daysBetween(trip.start_date, trip.end_date);
  const dest = trip.destination || 'Jaipur';

  // Summary
  const sumDest = document.getElementById('sum-dest'); if (sumDest) sumDest.textContent = dest;
  const sumDates = document.getElementById('sum-dates'); if (sumDates) sumDates.textContent = `${fmtDate(trip.start_date)} – ${fmtDate(trip.end_date)}`;
  const sumDays = document.getElementById('sum-days'); if (sumDays) sumDays.textContent = `${days} Day${days>1?'s':''}`;
  const sumBudget = document.getElementById('sum-budget'); if (sumBudget) sumBudget.textContent = fmtINR(trip.budget);
  const sumType = document.getElementById('sum-type'); if (sumType) sumType.textContent = (trip.travel_type||'Solo').charAt(0).toUpperCase()+(trip.travel_type||'solo').slice(1);

  // [API-READY] — replace with API response: POST /api/itinerary/generate
  const SAMPLE_PLACES = [
    [
      { name:'Amber Fort',    emoji:'🏰', desc:'Majestic hilltop fort with mirror palace' },
      { name:'Jal Mahal',    emoji:'🌅', desc:'Water palace on Man Sagar Lake' },
      { name:'Amer Village',  emoji:'🐘', desc:'Traditional Rajasthani village walk' },
    ],
    [
      { name:'Hawa Mahal',   emoji:'🕌', desc:'Palace of winds — iconic pink facade' },
      { name:'City Palace',  emoji:'👑', desc:'Royal residence with museums' },
      { name:'Jantar Mantar',emoji:'🔭', desc:'UNESCO astronomical observatory' },
    ],
    [
      { name:'Nahargarh Fort',emoji:'🦁', desc:'Sun-drenched hilltop with city views' },
      { name:'Albert Hall',   emoji:'🎨', desc:'Oldest museum in Rajasthan' },
    ],
    [
      { name:'Birla Mandir',  emoji:'⛩', desc:'Magnificent white marble temple' },
      { name:'Local Bazaar',  emoji:'🛍', desc:'Johari & Bapu Bazaar shopping' },
    ],
  ];

  const placesForDays = SAMPLE_PLACES.slice(0, Math.min(days, SAMPLE_PLACES.length));
  let placeCount = 0;
  const allPlaces = [];

  const daysContainer = document.getElementById('days-container');
  if (daysContainer) {
    daysContainer.innerHTML = placesForDays.map((places, idx) => {
      placeCount += places.length;
      allPlaces.push(...places.map(p => p.name));
      const dayDate = new Date(trip.start_date);
      dayDate.setDate(dayDate.getDate() + idx);
      return `
        <div class="day-card">
          <div class="day-header">
            <span class="day-badge">Day ${idx+1}</span>
            <span class="day-title">${dayDate.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'short'})}</span>
          </div>
          ${places.map(p => `
            <div class="place-card" data-place="${p.name}">
              <div class="place-icon" style="background:rgba(30,58,138,.1)">${p.emoji}</div>
              <div class="place-info"><h4>${p.name}</h4><span>${p.desc}</span></div>
              <div class="place-actions">
                <button class="btn btn-accent btn-sm" onclick="addToMap('${p.name}')" data-tooltip="Add to map">🗺</button>
                <button class="btn btn-sm" style="background:rgba(239,68,68,.1);color:#dc2626" onclick="removePlace(this)" data-tooltip="Remove">✕</button>
              </div>
            </div>
          `).join('')}
          <button class="btn btn-outline btn-sm" style="margin-top:.5rem;width:100%" onclick="addPlaceToDay(${idx})">+ Add Place</button>
        </div>`;
    }).join('');
  }

  const sp = document.getElementById('sum-places'); if (sp) sp.textContent = placeCount;

  // Optimizer list
  const optList = document.getElementById('opt-list');
  if (optList) {
    optList.innerHTML = allPlaces.slice(0,6).map((name,i) =>
      `<div class="opt-item"><span class="opt-num">${i+1}</span>${name}</div>`
    ).join('');
  }

  // Budget breakdown
  const budget = trip.budget || 30000;
  const costs = { Hotel:Math.round(budget*.40), Food:Math.round(budget*.20), Transport:Math.round(budget*.20), Activities:Math.round(budget*.15), Misc:Math.round(budget*.05) };
  const costIcons = { Hotel:'🏨', Food:'🍜', Transport:'🚗', Activities:'🎭', Misc:'💼' };
  const costColors = ['rgba(30,58,138,.1)','rgba(6,182,212,.1)','rgba(245,158,11,.1)','rgba(34,197,94,.1)','rgba(139,92,246,.1)'];
  const budgetRows = document.getElementById('budget-rows');
  if (budgetRows) {
    budgetRows.innerHTML = Object.entries(costs).map(([cat,amt],i) => `
      <div class="cost-row">
        <div class="cost-label"><div class="cost-icon" style="background:${costColors[i]}">${costIcons[cat]}</div>${cat}</div>
        <span class="cost-amount">${fmtINR(amt)}</span>
      </div>`).join('');
  }
  const tc = document.getElementById('total-cost');
  if (tc) tc.textContent = fmtINR(Object.values(costs).reduce((a,b)=>a+b,0));

  // AI Recommendations
  // [API-READY] — GET /api/recommend?dest=<destination>&limit=8
  const AI_RECS = [
    { name:'Rambagh Palace',     desc:'Luxury heritage stay turned tourist spot', img:'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=300&q=80&auto=format' },
    { name:'Panna Meena Kund',   desc:'Stunning stepwell with geometric patterns', img:'https://images.unsplash.com/photo-1548013146-72479768bada?w=300&q=80&auto=format' },
    { name:'Galta Ji Temple',    desc:'Monkey temple with natural water pools', img:'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=300&q=80&auto=format' },
    { name:'Chokhi Dhani',       desc:'Authentic Rajasthani cultural village', img:'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=300&q=80&auto=format' },
    { name:'Sisodia Rani Garden',desc:'Terraced gardens with scenic fountains', img:'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=300&q=80&auto=format' },
  ];
  const aiScroll = document.getElementById('ai-rec-scroll');
  if (aiScroll) {
    aiScroll.innerHTML = AI_RECS.map(r => `
      <div class="ai-card">
        <img src="${r.img}" alt="${r.name}" loading="lazy" />
        <div class="ai-card-body">
          <h4>${r.name}</h4><p>${r.desc}</p>
          <button class="btn btn-primary btn-sm" style="width:100%" onclick="addAIPlace('${r.name}')">+ Add to Itinerary</button>
        </div>
      </div>`).join('');
  }

  // Global action handlers
  window.removePlace = function(btn) {
    const card = btn.closest('.place-card');
    card.style.transition = 'all .3s ease';
    card.style.opacity = '0'; card.style.transform = 'translateX(-20px)';
    setTimeout(() => card.remove(), 300);
  };
  window.addToMap = function(name) {
    alert(`📍 "${name}" added to map!\nGoogle Maps integration will visualize this location.`);
  };
  window.addPlaceToDay = function(dayIdx) {
    const name = prompt('Enter place name to add:');
    if (!name?.trim()) return;
    const dayCards = document.querySelectorAll('.day-card');
    if (!dayCards[dayIdx]) return;
    const html = `<div class="place-card">
      <div class="place-icon" style="background:rgba(30,58,138,.1)">📍</div>
      <div class="place-info"><h4>${name}</h4><span>Custom place</span></div>
      <div class="place-actions">
        <button class="btn btn-accent btn-sm" onclick="addToMap('${name}')">🗺</button>
        <button class="btn btn-sm" style="background:rgba(239,68,68,.1);color:#dc2626" onclick="removePlace(this)">✕</button>
      </div>
    </div>`;
    dayCards[dayIdx].querySelector('.btn-outline').insertAdjacentHTML('beforebegin', html);
  };
  window.addAIPlace = function(name) {
    const dayCard = document.querySelector('.day-card');
    if (!dayCard) return;
    const html = `<div class="place-card">
      <div class="place-icon" style="background:rgba(6,182,212,.1)">🤖</div>
      <div class="place-info"><h4>${name}</h4><span>AI Recommended</span></div>
      <div class="place-actions">
        <button class="btn btn-accent btn-sm" onclick="addToMap('${name}')">🗺</button>
        <button class="btn btn-sm" style="background:rgba(239,68,68,.1);color:#dc2626" onclick="removePlace(this)">✕</button>
      </div>
    </div>`;
    dayCard.querySelector('.btn-outline').insertAdjacentHTML('beforebegin', html);
  };
  window.saveTrip = function() {
    sessionStorage.setItem('savedTrip', JSON.stringify({ destination:dest, days, budget }));
    alert('✅ Itinerary saved to My Trips!');
  };
  window.shareTrip = function() {
    const url = window.location.href;
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => alert('🔗 Link copied!')).catch(() => alert('Share: ' + url));
    else alert('Share: ' + url);
  };
})();
