'use strict';

let currentUser = null;
let isDark = localStorage.getItem('mr_theme') !== 'light';
const USERS_KEY = 'mr_users';
const SESSION_KEY = 'mr_session';

window.addEventListener('load', () => {
  initParticles();
  initMouseGlow();
  initPasswordToggles();
  initRipples();
  applyTheme();
  setDateTime();
  setTimeout(() => {
    document.getElementById('loader').classList.add('out');
    checkSession();
  }, 2500);
});

function initParticles() {
  const c = document.getElementById('particles');
  const ctx = c.getContext('2d');
  const cols = ['rgba(0,245,212,', 'rgba(123,97,255,', 'rgba(212,175,55,', 'rgba(255,77,141,'];
  let pts = [];
  const resize = () => { c.width = innerWidth; c.height = innerHeight; };
  resize(); addEventListener('resize', resize);
  for (let i = 0; i < 60; i++) pts.push(mkPt());
  function mkPt() {
    return {
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.3, dy: (Math.random() - 0.5) * 0.3,
      col: cols[~~(Math.random() * cols.length)],
      a: Math.random() * 0.4 + 0.05,
      life: Math.random() * 250 + 120, age: 0
    };
  }
  (function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    pts.forEach((p, i) => {
      p.x += p.dx; p.y += p.dy; p.age++;
      if (p.age > p.life || p.x < 0 || p.x > c.width || p.y < 0 || p.y > c.height)
        { pts[i] = mkPt(); return; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + (p.a * (1 - p.age / p.life)) + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  })();
}

function initMouseGlow() {
  const g = document.getElementById('mouseGlow');
  document.addEventListener('mousemove', e => {
    g.style.left = e.clientX + 'px';
    g.style.top = e.clientY + 'px';
  });
}

function initRipples() {
  document.querySelectorAll('.btn-primary, .social-btn, .btn-sm').forEach(btn => {
    btn.addEventListener('click', e => {
      const r = document.createElement('span');
      r.classList.add('ripple');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(r);
      setTimeout(() => r.remove(), 600);
    });
  });
}

function initPasswordToggles() {
  document.querySelectorAll('.toggle-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const inp = document.getElementById(btn.dataset.target);
      if (!inp) return;
      inp.type = inp.type === 'password' ? 'text' : 'password';
      btn.textContent = inp.type === 'password' ? '👁' : '🙈';
    });
  });
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  const btn = document.getElementById('themeBtn');
  const toggle = document.getElementById('themeToggle');
  if (btn) btn.textContent = isDark ? '🌙' : '☀️';
  if (toggle) toggle.classList.toggle('active', isDark);
}
function toggleTheme() {
  isDark = !isDark;
  localStorage.setItem('mr_theme', isDark ? 'dark' : 'light');
  applyTheme();
}
function toggleSetting(el) {
  el.classList.toggle('active');
}

function setDateTime() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const hr = now.getHours();
  const greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const dashG = document.getElementById('dashGreeting');
  if (dashG) dashG.textContent = greet;
}

function showPage(id) {
  document.querySelectorAll('.auth-form').forEach(f => {
    f.classList.remove('active');
    f.style.display = 'none';
  });
  const target = document.getElementById(id);
  if (target) {
    target.style.display = 'block';
    requestAnimationFrame(() => target.classList.add('active'));
  }
}

function toast(msg, type = 'success') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warn: '⚠️' };
  const wrap = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type] || '📌'}</span><span>${msg}</span>`;
  wrap.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3000);
}

function setField(id, state, msg = '') {
  const f = document.getElementById(id);
  if (!f) return;
  f.classList.remove('error', 'success');
  if (state) f.classList.add(state);
  const msgEl = f.querySelector('.field-msg') || document.getElementById(id.replace('f-','') + 'Msg');
  // Try by convention
  const parts = id.split('-'); // f-login-email → loginEmailMsg
  const msgId = parts.slice(1).map((s,i) => i === 0 ? s : s[0].toUpperCase() + s.slice(1)).join('') + 'Msg';
  const m = document.getElementById(msgId);
  if (m) m.textContent = msg;
}
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function passwordStrength(pass) {
  let score = 0;
  if (pass.length >= 8) score++;
  if (pass.length >= 12) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  return score;
}

document.addEventListener('input', e => {
  if (e.target.id === 'regPass') {
    const pass = e.target.value;
    const score = passwordStrength(pass);
    const fill = document.getElementById('strengthFill');
    const label = document.getElementById('strengthLabel');
    const colors = ['', '#FF4D8D', '#FF8C00', '#F9A825', '#00C4AA', '#00F5D4'];
    const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    if (fill) {
      fill.style.width = (score / 5 * 100) + '%';
      fill.style.background = colors[score] || 'transparent';
    }
    if (label) label.textContent = labels[score] || 'Password strength';
  }
});

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ ...user, password: undefined, ts: Date.now() }));
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
}
function checkSession() {
  const session = getSession();
  if (session) {
    currentUser = session;
    const remember = localStorage.getItem('mr_remember') === 'true';
    if (remember || (Date.now() - session.ts < 24 * 60 * 60 * 1000)) {
      showDashboard();
      return;
    }
  }
  showAuth();
}

function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value;
  const remember = document.getElementById('rememberMe').checked;
  let valid = true;

  if (!validateEmail(email)) {
    setField('f-login-email', 'error', 'Please enter a valid email');
    valid = false;
  } else setField('f-login-email', 'success', '');

  if (!pass) {
    setField('f-login-pass', 'error', 'Password is required');
    valid = false;
  } else setField('f-login-pass', 'success', '');

  if (!valid) return;

  const btn = document.getElementById('loginBtn');
  const btnText = btn.querySelector('.btn-text');
  const btnLoader = btn.querySelector('.btn-loader');
  btnText.style.display = 'none';
  btnLoader.style.display = 'block';
  btn.disabled = true;

  setTimeout(() => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === hashPass(pass));
    if (!user) {
      // Demo: auto-create a demo account if no users exist
      if (!users.length) {
        toast('No account found. Please register first.', 'error');
      } else {
        toast('Invalid email or password', 'error');
        setField('f-login-pass', 'error', 'Incorrect password');
      }
      btnText.style.display = 'block';
      btnLoader.style.display = 'none';
      btn.disabled = false;
      return;
    }
    localStorage.setItem('mr_remember', remember);
    currentUser = user;
    saveSession(user);
    logLoginActivity(user);
    btnText.style.display = 'block';
    btnLoader.style.display = 'none';
    btn.disabled = false;
    showSuccessOverlay(() => showDashboard());
  }, 1400);
}

function handleRegister() {
  const fname = document.getElementById('regFname').value.trim();
  const lname = document.getElementById('regLname').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPass').value;
  const confirm = document.getElementById('regConfirm').value;
  const agree = document.getElementById('agreeTerms').checked;
  let valid = true;

  if (!fname) { setField('f-reg-fname', 'error', 'First name required'); valid = false; }
  else setField('f-reg-fname', 'success', '');
  if (!validateEmail(email)) { setField('f-reg-email', 'error', 'Enter a valid email'); valid = false; }
  else { setField('f-reg-email', 'success', ''); }
  if (passwordStrength(pass) < 2) { setField('f-reg-pass', 'error', 'Password too weak'); valid = false; }
  else setField('f-reg-pass', 'success', '');
  if (pass !== confirm) { setField('f-reg-confirm', 'error', 'Passwords do not match'); valid = false; }
  else if (confirm) setField('f-reg-confirm', 'success', '');
  if (!agree) { toast('Please agree to Terms & Privacy Policy', 'error'); valid = false; }
  if (!valid) return;

  const users = getUsers();
  if (users.find(u => u.email === email)) {
    setField('f-reg-email', 'error', 'Email already registered');
    return;
  }

  const user = {
    id: Date.now().toString(36),
    fname, lname,
    email,
    password: hashPass(pass),
    createdAt: new Date().toISOString(),
    bio: '',
    loginHistory: []
  };
  users.push(user);
  saveUsers(users);
  toast('Account created! Please sign in.', 'success');
  showPage('loginForm');
  document.getElementById('loginEmail').value = email;
}

function handleForgot() {
  const email = document.getElementById('forgotEmail').value.trim();
  if (!validateEmail(email)) {
    setField('f-forgot-email', 'error', 'Enter a valid email');
    return;
  }
  setField('f-forgot-email', 'success', '');
  setTimeout(() => {
    document.getElementById('forgotSuccess').style.display = 'block';
    toast('Reset link sent to ' + email, 'success');
  }, 1000);
}

function socialLogin(provider) {
  toast(`${provider} login coming soon!`, 'info');
}

function handleLogout() {
  clearSession();
  currentUser = null;
  showAuth();
  toast('Logged out successfully', 'info');
}

function hashPass(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(36);
}

function showAuth() {
  document.getElementById('authWrapper').style.display = 'grid';
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('appFooter').style.display = 'block';
  showPage('loginForm');
}

function showDashboard() {
  document.getElementById('authWrapper').style.display = 'none';
  document.getElementById('dashboard').style.display = 'grid';
  document.getElementById('appFooter').style.display = 'block';
  populateDashboard();
  animateCounters();
  renderActivity();
  renderLoginTable();
  renderTimeline();
}

function populateDashboard() {
  if (!currentUser) return;
  const name = `${currentUser.fname || ''} ${currentUser.lname || ''}`.trim() || 'User';
  const initial = (currentUser.fname || currentUser.email || 'U')[0].toUpperCase();
  const email = currentUser.email || '';
  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';

  setText('dashGreeting', greet);
  setText('dashWelcome', `Welcome back, ${currentUser.fname || 'User'}!`);
  setText('wcTitle', `Hello, ${currentUser.fname || 'User'}! 👋`);
  setText('profileName', name);
  setText('profileEmail', email);
  setText('suName', name);
  setText('editFname', ''); document.getElementById('editFname').value = currentUser.fname || '';
  setText('editLname', ''); document.getElementById('editLname').value = currentUser.lname || '';
  document.getElementById('editEmail').value = email;
  document.getElementById('editBio').value = currentUser.bio || '';

  ['dashAvatar','wcAvatar','sidebarAvatar','profileAvatar'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = initial;
  });
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function animateCounters() {
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const dur = 1200; const start = performance.now();
    const step = now => {
      const t = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

function logLoginActivity(user) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === user.id);
  if (idx < 0) return;
  const entry = {
    time: new Date().toISOString(),
    device: getDevice(),
    location: 'India',
    status: 'success'
  };
  users[idx].loginHistory = [entry, ...(users[idx].loginHistory || [])].slice(0, 20);
  saveUsers(users);
  currentUser = users[idx];
  saveSession(users[idx]);
}

function getDevice() {
  const ua = navigator.userAgent;
  if (/Mobile|Android/i.test(ua)) return 'Mobile · ' + getBrowser(ua);
  return 'Desktop · ' + getBrowser(ua);
}
function getBrowser(ua) {
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'Browser';
}

const ACTIVITIES = [
  { icon: '🔐', title: 'Successful login', sub: 'Chrome · Windows', color: 'rgba(0,245,212,0.12)', time: '2 min ago' },
  { icon: '🛡', title: 'Password updated', sub: 'Security settings changed', color: 'rgba(123,97,255,0.12)', time: '1 day ago' },
  { icon: '🌐', title: 'New device added', sub: 'iPhone 15 Pro · iOS', color: 'rgba(212,175,55,0.12)', time: '3 days ago' },
  { icon: '✅', title: 'Email verified', sub: 'Account fully verified', color: 'rgba(0,245,212,0.12)', time: '7 days ago' },
];
function renderActivity() {
  const list = document.getElementById('activityList');
  if (!list) return;
  list.innerHTML = ACTIVITIES.map(a => `
    <div class="act-item">
      <div class="act-icon" style="background:${a.color}">${a.icon}</div>
      <div class="act-body">
        <div class="act-title">${a.title}</div>
        <div class="act-sub">${a.sub}</div>
      </div>
      <div class="act-time">${a.time}</div>
    </div>`).join('');
}

function renderLoginTable() {
  const wrap = document.getElementById('loginTable');
  if (!wrap) return;
  const users = getUsers();
  const user = users.find(u => u.id === currentUser?.id);
  const history = (user?.loginHistory || []).slice(0, 6);
  const rows = history.length ? history : [
    { time: new Date().toISOString(), device: getDevice(), location: 'India', status: 'success' }
  ];
  wrap.innerHTML = `
    <div class="lt-row lt-header"><span>Date & Time</span><span>Device</span><span>Location</span><span>Status</span></div>
    ${rows.map(r => `
      <div class="lt-row">
        <span>${new Date(r.time).toLocaleString('en-IN', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</span>
        <span>${r.device}</span>
        <span>${r.location}</span>
        <span><span class="lt-badge ${r.status === 'success' ? 'lt-ok' : 'lt-fail'}">${r.status === 'success' ? '✓ Success' : '✗ Failed'}</span></span>
      </div>`).join('')}`;
}

function renderTimeline() {
  const wrap = document.getElementById('timeline');
  if (!wrap) return;
  const items = [
    { icon: '🚀', title: 'Account Created', sub: `Joined as a verified member · ${new Date(currentUser?.createdAt || Date.now()).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}` },
    { icon: '✅', title: 'Email Verified', sub: 'Account fully verified and activated' },
    { icon: '🛡', title: 'Two-Factor Auth Enabled', sub: 'Enhanced security configured' },
    { icon: '🔐', title: 'First Login', sub: 'Successfully authenticated from Chrome on Desktop' },
  ];
  wrap.innerHTML = items.map(t => `
    <div class="tl-item">
      <div class="tl-dot">${t.icon}</div>
      <div class="tl-body">
        <div class="tl-title">${t.title}</div>
        <div class="tl-sub">${t.sub}</div>
      </div>
    </div>`).join('');
}

function showDashTab(name, btn) {
  document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.snav-item').forEach(b => b.classList.remove('active'));
  const tab = document.getElementById('tab-' + name);
  if (tab) tab.classList.add('active');
  if (btn) btn.classList.add('active');
}

function saveProfile() {
  if (!currentUser) return;
  const fname = document.getElementById('editFname').value.trim();
  const lname = document.getElementById('editLname').value.trim();
  const email = document.getElementById('editEmail').value.trim();
  const bio = document.getElementById('editBio').value.trim();
  if (!fname || !validateEmail(email)) { toast('Please fill all fields correctly', 'error'); return; }

  const users = getUsers();
  const idx = users.findIndex(u => u.id === currentUser.id);
  if (idx >= 0) {
    users[idx] = { ...users[idx], fname, lname, email, bio };
    saveUsers(users);
    currentUser = users[idx];
    saveSession(currentUser);
    populateDashboard();
    toast('Profile updated!', 'success');
  }
}

function changePassword() {
  const cur = document.getElementById('curPass').value;
  const nw = document.getElementById('newPass').value;
  const conf = document.getElementById('confirmPass').value;
  if (!cur || !nw || !conf) { toast('Please fill all password fields', 'error'); return; }
  const users = getUsers();
  const idx = users.findIndex(u => u.id === currentUser?.id);
  if (idx < 0) return;
  if (users[idx].password !== hashPass(cur)) { toast('Current password is incorrect', 'error'); return; }
  if (nw !== conf) { toast('New passwords do not match', 'error'); return; }
  if (passwordStrength(nw) < 2) { toast('New password is too weak', 'error'); return; }
  users[idx].password = hashPass(nw);
  saveUsers(users);
  toast('Password changed successfully!', 'success');
  document.getElementById('curPass').value = '';
  document.getElementById('newPass').value = '';
  document.getElementById('confirmPass').value = '';
}

function showSuccessOverlay(cb) {
  const overlay = document.getElementById('successOverlay');
  overlay.style.display = 'flex';
  setTimeout(() => {
    overlay.style.display = 'none';
    if (cb) cb();
  }, 1800);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const loginForm = document.getElementById('loginForm');
    const regForm = document.getElementById('registerForm');
    const forgotForm = document.getElementById('forgotForm');
    if (loginForm?.classList.contains('active')) handleLogin();
    else if (regForm?.classList.contains('active')) handleRegister();
    else if (forgotForm?.classList.contains('active')) handleForgot();
  }
});

const dashObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.stat-card, .dash-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  dashObserver.observe(card);
});

// Pre-seed a demo account so the tester can log in immediately
(function seedDemo() {
  const users = getUsers();
  const demoEmail = 'demo@mr.com';
  if (!users.find(u => u.email === demoEmail)) {
    users.push({
      id: 'demo001',
      fname: 'Mohsin',
      lname: 'Raza',
      email: demoEmail,
      password: hashPass('Demo@1234'),
      createdAt: new Date().toISOString(),
      bio: 'Full Stack Developer · Mohsin Raza Auth',
      loginHistory: []
    });
    saveUsers(users);
  }
})();
