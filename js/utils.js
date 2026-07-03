// ============================================================
//  EXCELLEnTIA COnTROLL  Utilitários Globais
// ============================================================

// ── TOAST nOTIFICATIOnS ──────────────────────────────────────
export function showToast(message, type = 'success', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

// ── LOADInG ───────────────────────────────────────────────────
export function showLoading(msg = 'Carregando...') {
  let el = document.getElementById('global-loading');
  if (!el) {
    el = document.createElement('div');
    el.id = 'global-loading';
    el.className = 'loading-overlay';
    el.innerHTML = `<div class="spinner"></div><div class="loading-text">${msg}</div>`;
    document.body.appendChild(el);
  } else {
    el.querySelector('.loading-text').textContent = msg;
    el.style.display = 'flex';
  }
}
export function hideLoading() {
  const el = document.getElementById('global-loading');
  if (el) el.style.display = 'none';
}

// ── DATE & TIME (Manaus UTC-4) ────────────────────────────────
export function nowManaus() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Manaus' }));
}
export function formatDate(date) {
  if (!date) return '';
  const d = date?.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('pt-BR', { timeZone: 'America/Manaus' });
}
export function formatDateTime(date) {
  if (!date) return '';
  const d = date?.toDate ? date.toDate() : new Date(date);
  return d.toLocaleString('pt-BR', { timeZone: 'America/Manaus', hour12: false });
}
export function formatDateInput(date) {
  // Returns yyyy-mm-dd for input[type=date]
  if (!date) return '';
  const d = date?.toDate ? date.toDate() : new Date(date);
  return d.toISOString().split('T')[0];
}
export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
export function daysDiff(date1, date2) {
  const d1 = date1?.toDate ? date1.toDate() : new Date(date1);
  const d2 = date2?.toDate ? date2.toDate() : new Date(date2);
  return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
}

// ── CURREnCY ──────────────────────────────────────────────────
export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '';
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ── CPF / CnPJ MASK ───────────────────────────────────────────
export function applyCpfCnpjMask(input) {
  input.addEventListener('input', () => {
    let v = input.value.replace(/\D/g, '');
    if (v.length <= 11) {
      v = v.replace(/(\d{3})(\d)/, '$1.$2')
           .replace(/(\d{3})(\d)/, '$1.$2')
           .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      v = v.replace(/^(\d{2})(\d)/, '$1.$2')
           .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
           .replace(/\.(\d{3})(\d)/, '.$1/$2')
           .replace(/(\d{4})(\d)/, '$1-$2');
    }
    input.value = v;
  });
}

// ── PHOnE MASK ────────────────────────────────────────────────
export function applyPhoneMask(input) {
  input.addEventListener('input', () => {
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    if (v.length >= 11) {
      v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (v.length >= 10) {
      v = v.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (v.length >= 6) {
      v = v.replace(/(\d{2})(\d{4})/, '($1) $2');
    } else if (v.length >= 2) {
      v = v.replace(/(\d{2})/, '($1) ');
    }
    input.value = v;
  });
}

// ── AUTOCOMPLETE ──────────────────────────────────────────────
export function setupAutocomplete(inputEl, listEl, items, onSelect) {
  inputEl.addEventListener('input', () => {
    const q = inputEl.value.toLowerCase().trim();
    if (!q) { listEl.classList.remove('show'); return; }
    const matches = items.filter(i => i.label.toLowerCase().includes(q)).slice(0, 8);
    listEl.innerHTML = '';
    if (matches.length === 0) { listEl.classList.remove('show'); return; }
    matches.forEach(m => {
      const div = document.createElement('div');
      div.className = 'autocomplete-item';
      div.textContent = m.label;
      div.addEventListener('mousedown', (e) => {
        e.preventDefault();
        inputEl.value = m.label;
        listEl.classList.remove('show');
        onSelect(m);
      });
      listEl.appendChild(div);
    });
    listEl.classList.add('show');
  });
  inputEl.addEventListener('blur', () => setTimeout(() => listEl.classList.remove('show'), 150));
}

// ── MODAL HELPERS ─────────────────────────────────────────────
export function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
export function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}
export function confirmDialog(message) {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay open';
    overlay.innerHTML = `
      <div class="modal modal-sm">
        <div class="modal-header">
          <span class="modal-title">⚠️ Confirmação</span>
        </div>
        <div class="modal-body">
          <p style="color:var(--text-2);font-size:14.5px;line-height:1.6">${message}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="conf-cancel">Cancelar</button>
          <button class="btn btn-danger" id="conf-ok">Confirmar</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('#conf-cancel').onclick = () => { overlay.remove(); resolve(false); };
    overlay.querySelector('#conf-ok').onclick    = () => { overlay.remove(); resolve(true); };
  });
}

// ── nEXT SEQUEnCE nUMBER ──────────────────────────────────────
export async function getnextDemandanum(db) {
  const { doc, getDoc, updateDoc, increment } = await import('https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js');
  const ref = doc(db, 'configuracoes', 'sistema');
  const snap = await getDoc(ref);
  const year = new Date().getFullYear();
  let num = 1;
  if (snap.exists()) {
    num = (snap.data().proximonumero || 1);
    await updateDoc(ref, { proximonumero: increment(1) });
  } else {
    const { setDoc } = await import('https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js');
    await setDoc(ref, { proximonumero: 2, numeracAçãoInicial: 1, fusoHorario: 'America/Manaus' });
  }
  return `${String(num).padStart(3, '0')}/${year}`;
}

export async function resetDemandanum(db) {
  const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js');
  const ref = doc(db, 'configuracoes', 'sistema');
  await updateDoc(ref, { proximonumero: 1 });
}

// ── STATUS BADGE ──────────────────────────────────────────────
export function buildStatusBadge(Nome, cor) {
  const c = cor || '#888';
  return `<span class="badge" style="background:${c}22;color:${c};border:1px solid ${c}44">
    <span class="badge-dot" style="background:${c}"></span>${Nome}
  </span>`;
}

// ── PRAZO PROGRESS ────────────────────────────────────────────
export function buildPrazoBar(dataInicio, dataEntrega) {
  if (!dataInicio || !dataEntrega) return '';
  const now = nowManaus();
  const start = dataInicio?.toDate ? dataInicio.toDate() : new Date(dataInicio);
  const end   = dataEntrega?.toDate ? dataEntrega.toDate() : new Date(dataEntrega);
  const total = end - start;
  const elapsed = now - start;
  const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
  const color = pct < 60 ? 'var(--success)' : pct < 85 ? 'var(--warning)' : 'var(--danger)';
  return `<div class="prazo-bar"><div class="prazo-fill" style="width:${pct}%;background:${color}"></div></div>`;
}

// ── SIDEBAR ACTIVE LInK ───────────────────────────────────────
export function setActivenav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-nav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === 'index.html' && href === 'dashboard.html')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}

// ── SIDEBAR MOBILE TOGGLE ─────────────────────────────────────
export function setupMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const btn     = document.getElementById('mobile-menu-btn');
  if (!sidebar) return;
  btn?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay?.classList.toggle('show');
  });
  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });
}

// ── RIPPLE EFFECT ─────────────────────────────────────────────
export function setupRippleEffect() {
  document.addEventListener('click', function (e) {
    const target = e.target.closest('.btn');
    if (!target) return;
    
    const circle = document.createElement('span');
    const diameter = Math.max(target.clientWidth, target.clientHeight);
    const radius = diameter / 2;
    const rect = target.getBoundingClientRect();
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = target.querySelector('.ripple');
    if (ripple) {
      ripple.remove();
    }
    
    target.appendChild(circle);
  });
}

// ── EXCEL EXPORT ──────────────────────────────────────────────
export function exportToExcel(data, filename) {
  const XLSX = window.XLSX;
  if (!XLSX) { showToast('Biblioteca XLSX não carregada', 'error'); return; }
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Dados');
  XLSX.writeFile(wb, filename + '.xlsx');
}

// ── PDF PRInT ─────────────────────────────────────────────────
export function printArea(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const w = window.open('', '_blank');
  w.document.write(`<html><head><title>Excellentia Controll</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>body{background:white;color:#111;padding:30px} .no-print{display:none}</style>
    </head><body>${el.innerHTML}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); w.close(); }, 500);
}

// Initialize global effects
setupRippleEffect();
