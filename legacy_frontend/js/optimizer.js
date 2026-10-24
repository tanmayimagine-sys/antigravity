/**
 * optimizer.js — Smart Route Optimizer (classic script)
 * [API-READY] — replace body of runOptimizer with POST /api/optimize
 */
window.runOptimizer = async function() {
  const btn  = document.getElementById('optimize-btn');
  const list = document.getElementById('opt-list');
  const note = document.getElementById('opt-note');
  if (!list) return;

  btn.disabled = true;
  btn.textContent = '⏳ Optimizing…';
  const items = [...list.querySelectorAll('.opt-item')];
  items.forEach(el => el.classList.add('optimizing'));

  await new Promise(r => setTimeout(r, 500));
  const shuffled = items.sort(() => Math.random() - 0.5);
  await new Promise(r => setTimeout(r, 900));

  items.forEach(el => el.classList.remove('optimizing'));
  list.innerHTML = shuffled.map((el, i) => {
    const name = el.textContent.replace(/^\d+/, '').trim();
    return `<div class="opt-item" style="animation:slideInToast .3s ease ${i * 0.08}s both">
      <span class="opt-num">${i+1}</span>${name}
    </div>`;
  }).join('');

  if (note) note.style.display = 'block';
  btn.disabled   = false;
  btn.textContent = '✅ Re-Optimize';
};
