// ============================================================
//  EXCELLENTIA CONTROLL — Core App (Auth Guard + Sidebar)
// ============================================================
import { firebaseConfig } from './firebase/config.js';

let _app, _auth, _db;

export async function initFirebase() {
  if (_app) return { app: _app, auth: _auth, db: _db };
  const { initializeApp }  = await import('https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js');
  const { getAuth }        = await import('https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js');
  const { getFirestore }   = await import('https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js');
  _app  = initializeApp(firebaseConfig);
  _auth = getAuth(_app);
  _db   = getFirestore(_app);
  return { app: _app, auth: _auth, db: _db };
}

// ── AUTH GUARD ────────────────────────────────────────────────
export async function requireAuth(redirectTo = '../login.html') {
  const { auth } = await initFirebase();
  return new Promise((resolve) => {
    const { onAuthStateChanged } = _authModule();
    const unsub = onAuthStateChanged(auth, async (user) => {
      unsub();
      if (!user) {
        window.location.href = redirectTo;
        return;
      }
      resolve(user);
    });
  });
}

function _authModule() {
  // Will be resolved from the already-imported module
  return window.__fbAuth || {};
}

// ── SIDEBAR HTML ──────────────────────────────────────────────
export function getSidebarHTML(userNome = '', userPerfil = 'usuario') {
  const isAdmin = userPerfil === 'admin';
  const ini = (userNome || 'U').charAt(0).toUpperCase();
  return `
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-brand">
      <img src="assets/logo.png" alt="Logo" onerror="this.style.display='none'">
      <div class="sidebar-brand-text">
        <div class="name">Excellentia</div>
        <div class="sub">Controll</div>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div class="sidebar-section-label">Principal</div>
      <a href="dashboard.html"><span class="nav-icon">📊</span>Dashboard</a>
      <a href="demandas.html"><span class="nav-icon">📋</span>Projetos</a>
      <a href="kanban.html"><span class="nav-icon">🗂️</span>Kanban</a>
      <a href="calendario.html"><span class="nav-icon">📅</span>Calendário</a>
      <a href="orcamento.html"><span class="nav-icon">💰</span>Orçamentos</a>
      <a href="relatorios.html"><span class="nav-icon">📈</span>Relatórios</a>

      <div class="sidebar-section-label">Cadastros</div>
      <a href="clientes.html"><span class="nav-icon">👥</span>Clientes</a>
      <a href="fornecedores.html"><span class="nav-icon">🏭</span>Fornecedores</a>
      <a href="materiais.html"><span class="nav-icon">🧱</span>Materiais</a>
      <a href="servicos.html"><span class="nav-icon">🔧</span>Serviços</a>

      <div class="sidebar-section-label">Outros</div>
      ${isAdmin ? `<a href="usuarios.html"><span class="nav-icon">👤</span>Usuários</a>` : ''}
      <a href="agenda.html"><span class="nav-icon">📒</span>Agenda de Contatos</a>
      <a href="sugestoes.html"><span class="nav-icon">💡</span>Sugestões</a>
      <a href="creditos.html"><span class="nav-icon">⭐</span>Créditos</a>
    </nav>
    <div class="sidebar-footer">
      <div class="sidebar-theme-row">
        <button class="theme-toggle" id="sidebar-theme-toggle" onclick="window.toggleTheme && window.toggleTheme()">
          <span id="theme-icon">☀️</span> <span id="theme-label">Modo Claro</span>
        </button>
      </div>
      <div class="sidebar-user">
        <div class="sidebar-avatar">${ini}</div>
        <div class="sidebar-user-info">
          <div class="u-name">${userNome}</div>
          <div class="u-role">${isAdmin ? 'Administrador' : 'Usuário'}</div>
        </div>
      </div>
      <button class="btn-logout" id="btn-logout">
        <span>🚪</span> Sair
      </button>
    </div>
  </aside>
  <div class="sidebar-overlay" id="sidebar-overlay"></div>`;
}

// ── THEME TOGGLE ──────────────────────────────────────────────
export function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  _updateThemeBtn(isLight);
}

export function applyTheme() {
  const saved = localStorage.getItem('theme');
  const isLight = saved === 'light';
  document.body.classList.toggle('light-mode', isLight);
  // Defer icon update until sidebar is in DOM
  requestAnimationFrame(() => _updateThemeBtn(isLight));
  // Expose to window for onclick handlers
  window.toggleTheme = toggleTheme;
}

function _updateThemeBtn(isLight) {
  const icon  = document.getElementById('theme-icon');
  const label = document.getElementById('theme-label');
  if (icon)  icon.textContent  = isLight ? '🌙' : '☀️';
  if (label) label.textContent = isLight ? 'Modo Escuro' : 'Modo Claro';
}
