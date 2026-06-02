# 🔐 Mohsin Raza — Login Authentication System

A production-grade authentication system built with pure HTML, CSS, and JavaScript. Designed to look like a real SaaS product — not a basic college login page.

---

## What It Does

This is a complete client-side authentication system with a full login flow and user dashboard. All data is stored in `localStorage` so everything persists across page refreshes.

### Authentication Pages
- **Login** — Email + password login with floating labels, show/hide password, Remember Me, and form validation
- **Register** — Full name, email, password with live strength indicator, confirm password, and terms agreement
- **Forgot Password** — Email reset flow with success feedback
- **Social Login UI** — Google and GitHub buttons (UI only)

### Dashboard Features
- **Overview Tab** — Animated stat cards (total logins, security score, active sessions, devices), welcome card, recent activity feed, security checklist
- **Profile Tab** — Edit name, email, bio; change password with current password verification
- **Activity Tab** — Login history table with timestamps, device, location, status badge; activity timeline
- **Settings Tab** — Toggle switches for dark mode, 2FA, notifications; danger zone panel

### Smart Features
- Session management via `localStorage` with optional Remember Me
- Auto-login if a valid session exists on page load
- Password strength indicator (Very Weak → Very Strong)
- Form validation with inline error and success states
- Animated success screen on login
- Toast notification system
- Dark / Light mode toggle
- Fully responsive for mobile, tablet, and desktop

---

## Demo Account

A demo account is automatically created on first load:

| Field | Value |
|---|---|
| Email | `demo@mr.com` |
| Password | `Demo@1234` |

---

## How to Run

1. Download the folder
2. Make sure all 3 files are in the **same folder**: `index.html`, `style.css`, `script.js`
3. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)
4. No server, no install, no build step needed

---

## Technologies Used

| Layer | Details |
|---|---|
| Structure | HTML5 (semantic, single-page multi-view) |
| Styling | CSS3 — custom properties, glassmorphism, keyframe animations, floating labels |
| Logic | Vanilla JavaScript ES6+ — localStorage, Canvas API |
| Typography | Poppins + Space Grotesk + Inter via Google Fonts |
| Effects | HTML5 Canvas particles, mouse glow, ripple clicks, animated counters |

No frameworks. No libraries. No build tools.

---

## Project Structure

```
auth-system/
├── index.html   ← full markup: login, register, forgot password, dashboard
├── style.css    ← all styling and animations
├── script.js    ← all logic: auth, session, dashboard, UI
└── README.md    ← this file
```

---

## Key Features

| Feature | Status |
|---|---|
| Login with validation | ✅ |
| Registration with password strength | ✅ |
| Forgot password flow | ✅ |
| Session persistence (localStorage) | ✅ |
| Auto-login on revisit | ✅ |
| Remember Me | ✅ |
| Show/Hide password | ✅ |
| Dashboard with 4 tabs | ✅ |
| Profile edit | ✅ |
| Password change | ✅ |
| Login history | ✅ |
| Settings with toggles | ✅ |
| Dark / Light mode | ✅ |
| Fully responsive | ✅ |

---

## Developer

Made by **Mohsin Raza**

- 📧 Email: mr.mohsinraza26@gmail.com
- 💻 GitHub: github.com/mohsinrz-dev
- 🔗 LinkedIn: linkedin.com/in/mohsin-raza-338439408
