/* ─────────────────────────────────────────────────────────────
 * THE DEV HOSTER PRO — SINGLE-FILE EDITION
 * Poora app isi ek file mein hai (frontend bhi). Iske saath sirf
 * package.json chahiye. GitHub pe folders upload karne ki zaroorat nahi.
 * ───────────────────────────────────────────────────────────── */
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');

/* ── OWNER-ORDERED HARDCODED KEYS ──
 * Render ke Environment Variables ki priority hoti hai; ye sirf tab chalti hain
 * jab wahan kuch set na ho. IS FILE KO SIRF PRIVATE REPO MEIN RAKHO. ── */
process.env.GITHUB_CLIENT_ID ||= 'Ov23li56no4IErN0tajt';
process.env.GITHUB_CLIENT_SECRET ||= '6a7418c92d111f5299509faaeb1254e4b8058973';
process.env.RENDER_API_KEY ||= 'rnd_rzbftPHLIoixi12BQkEyAMdTkWQO';
process.env.UPTIMEROBOT_API_KEY ||= 'u3755149-736f9baadd7d1660a892461c';
process.env.SESSION_SECRET ||= '2cec1ca2e0b5391aed54388d356c8e9fcbbd1f8b26cee146';
process.env.COOKIE_SECURE ||= 'true';

/* ── embedded frontend (served from memory) ── */
const FRONT = {
  html: "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"UTF-8\" />\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n<title>THE DEV HOSTER PRO — Ship repos in one click</title>\n<meta name=\"description\" content=\"Sign in with GitHub, deploy repositories in one click, automatic uptime monitoring. Zero config.\" />\n<link rel=\"stylesheet\" href=\"/styles.css\" />\n<link rel=\"icon\" href=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230b0e15'/%3E%3Cpath d='M17.5 4 8 18h6l-1.5 10L22 14h-6l1.5-10z' fill='%2337e2a0'/%3E%3C/svg%3E\" />\n</head>\n<body>\n<div class=\"bg-glow bg-glow-1\"></div>\n<div class=\"bg-glow bg-glow-2\"></div>\n<div id=\"app\" class=\"app-shell\">\n  <div class=\"boot-splash\">\n    <div class=\"spinner spinner-lg\"></div>\n  </div>\n</div>\n<div id=\"toasts\" class=\"toasts\"></div>\n<script src=\"/app.js\"></script>\n</body>\n</html>\n",
  css: "/* ── THE DEV HOSTER PRO — design system ─────────────────────── */\n:root {\n  --bg: #070a12;\n  --bg-soft: #0b0e15;\n  --panel: rgba(255, 255, 255, 0.035);\n  --panel-2: rgba(255, 255, 255, 0.06);\n  --border: rgba(255, 255, 255, 0.09);\n  --border-strong: rgba(255, 255, 255, 0.16);\n  --text: #e9edf5;\n  --text-dim: #97a1b4;\n  --text-faint: #5d6act;\n  --accent: #37e2a0;\n  --accent-2: #22b9d4;\n  --accent-grad: linear-gradient(120deg, #37e2a0, #22b9d4);\n  --warn: #f5b83d;\n  --danger: #f25d6a;\n  --info: #5b8cff;\n  --radius: 14px;\n  --font: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Inter, Helvetica, Arial, sans-serif;\n  --mono: ui-monospace, \"SF Mono\", SFMono-Regular, Menlo, Consolas, monospace;\n}\n* { margin: 0; padding: 0; box-sizing: border-box; }\nhtml { color-scheme: dark; }\nbody {\n  background: var(--bg);\n  color: var(--text);\n  font-family: var(--font);\n  font-size: 15px;\n  line-height: 1.55;\n  min-height: 100vh;\n  overflow-x: hidden;\n}\na { color: inherit; }\nbutton { font-family: inherit; cursor: pointer; }\n\n.bg-glow { position: fixed; border-radius: 50%; filter: blur(140px); opacity: .16; pointer-events: none; z-index: 0; }\n.bg-glow-1 { width: 520px; height: 520px; background: #37e2a0; top: -220px; right: -120px; }\n.bg-glow-2 { width: 460px; height: 460px; background: #2b5cff; bottom: -240px; left: -140px; opacity: .12; }\n\n.app-shell { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; padding: 0 24px 80px; }\n.boot-splash { display: flex; justify-content: center; padding-top: 30vh; }\n.spinner { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--border-strong); border-top-color: var(--accent); animation: spin .7s linear infinite; display: inline-block; }\n.spinner-lg { width: 34px; height: 34px; border-width: 3px; }\n@keyframes spin { to { transform: rotate(360deg); } }\n@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .35; } }\n@keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }\n\n/* ── topbar ── */\n.topbar {\n  display: flex; align-items: center; justify-content: space-between;\n  padding: 22px 0; border-bottom: 1px solid var(--border); margin-bottom: 34px;\n}\n.brand { display: flex; align-items: center; gap: 12px; font-weight: 800; letter-spacing: .06em; font-size: 15px; }\n.brand-badge {\n  width: 34px; height: 34px; border-radius: 9px; display: grid; place-items: center;\n  background: var(--bg-soft); border: 1px solid var(--border-strong);\n}\n.brand small { display: block; font-size: 10px; font-weight: 600; letter-spacing: .18em; color: var(--text-dim); }\n.topbar-right { display: flex; align-items: center; gap: 14px; }\n.user-chip { display: flex; align-items: center; gap: 10px; padding: 6px 6px 6px 14px; border: 1px solid var(--border); border-radius: 999px; background: var(--panel); font-size: 13.5px; color: var(--text-dim); }\n.user-chip img { width: 28px; height: 28px; border-radius: 50%; }\n.avatar-fallback { width: 28px; height: 28px; border-radius: 50%; background: var(--accent-grad); display: grid; place-items: center; color: #04110b; font-weight: 800; font-size: 13px; }\n\n/* ── buttons ── */\n.btn {\n  display: inline-flex; align-items: center; gap: 8px;\n  border: 1px solid var(--border-strong); background: var(--panel-2); color: var(--text);\n  border-radius: 10px; padding: 9px 16px; font-size: 13.5px; font-weight: 600;\n  transition: all .15s ease; text-decoration: none;\n}\n.btn:hover { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.24); transform: translateY(-1px); }\n.btn:active { transform: none; }\n.btn:disabled { opacity: .45; cursor: not-allowed; transform: none; }\n.btn-primary { background: var(--accent-grad); border: none; color: #04140d; }\n.btn-primary:hover { background: var(--accent-grad); filter: brightness(1.08); border: none; }\n.btn-ghost { background: transparent; }\n.btn-ghost:hover { background: var(--panel-2); }\n.btn-danger { color: var(--danger); }\n.btn-danger:hover { background: rgba(242,93,106,.12); border-color: rgba(242,93,106,.4); }\n.btn-sm { padding: 6px 12px; font-size: 12.5px; border-radius: 8px; }\n.btn-lg { padding: 14px 26px; font-size: 15px; border-radius: 12px; }\n.btn-github { background: #fff; color: #0a0c12; border: none; font-weight: 700; }\n.btn-github:hover { background: #e8ecf4; border: none; }\n\n/* ── landing ── */\n.hero { text-align: center; padding: 90px 20px 60px; animation: rise .5s ease both; }\n.hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--accent); border: 1px solid rgba(55,226,160,.35); background: rgba(55,226,160,.07); padding: 7px 16px; border-radius: 999px; margin-bottom: 28px; }\n.hero h1 { font-size: clamp(34px, 5.6vw, 58px); font-weight: 800; line-height: 1.08; letter-spacing: -.02em; margin-bottom: 20px; }\n.hero h1 .grad { background: var(--accent-grad); -webkit-background-clip: text; background-clip: text; color: transparent; }\n.hero p { color: var(--text-dim); font-size: 17px; max-width: 560px; margin: 0 auto 38px; }\n.hero-cta { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }\n.features { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px; margin-top: 30px; }\n.feature-card { text-align: left; padding: 26px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--panel); animation: rise .5s ease both; }\n.feature-card:nth-child(2) { animation-delay: .08s; }\n.feature-card:nth-child(3) { animation-delay: .16s; }\n.feature-icon { width: 40px; height: 40px; border-radius: 10px; display: grid; place-items: center; background: rgba(55,226,160,.1); border: 1px solid rgba(55,226,160,.25); margin-bottom: 16px; color: var(--accent); }\n.feature-card h3 { font-size: 15.5px; margin-bottom: 8px; }\n.feature-card p { color: var(--text-dim); font-size: 13.5px; }\n\n/* ── dashboard ── */\n.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 40px; animation: rise .4s ease both; }\n.stat { padding: 20px 22px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--panel); }\n.stat b { display: block; font-size: 28px; font-weight: 800; letter-spacing: -.02em; }\n.stat span { font-size: 12.5px; color: var(--text-dim); text-transform: uppercase; letter-spacing: .1em; font-weight: 600; }\n.stat-hot b { color: var(--accent); }\n\n.section-head { display: flex; align-items: center; justify-content: space-between; margin: 0 0 18px; gap: 12px; flex-wrap: wrap; }\n.section-head h2 { font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 10px; }\n.section-head .hint { font-size: 12.5px; color: var(--text-dim); }\n\n.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; margin-bottom: 48px; }\n.card { border: 1px solid var(--border); border-radius: var(--radius); background: var(--panel); padding: 20px; display: flex; flex-direction: column; gap: 12px; transition: border-color .15s ease, transform .15s ease; }\n.card:hover { border-color: var(--border-strong); transform: translateY(-2px); }\n.card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }\n.repo-name { font-weight: 700; font-size: 15px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; word-break: break-all; }\n.repo-name:hover { color: var(--accent); }\n.repo-desc { color: var(--text-dim); font-size: 13px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 20px; flex: 1; }\n.repo-meta { display: flex; align-items: center; gap: 14px; font-size: 12px; color: var(--text-dim); }\n.lang-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--accent-2); display: inline-block; margin-right: 5px; }\n.card-actions { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding-top: 4px; border-top: 1px solid var(--border); }\n\n/* ── badges & pills ── */\n.pill { display: inline-flex; align-items: center; gap: 7px; font-size: 11.5px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; padding: 4px 11px; border-radius: 999px; border: 1px solid transparent; }\n.pill .dot { width: 7px; height: 7px; border-radius: 50%; }\n.pill-live { color: var(--accent); background: rgba(55,226,160,.1); border-color: rgba(55,226,160,.3); }\n.pill-live .dot { background: var(--accent); animation: pulse 2s infinite; }\n.pill-building { color: var(--warn); background: rgba(245,184,61,.1); border-color: rgba(245,184,61,.3); }\n.pill-building .dot { background: var(--warn); animation: pulse 1s infinite; }\n.pill-failed { color: var(--danger); background: rgba(242,93,106,.1); border-color: rgba(242,93,106,.35); }\n.pill-failed .dot { background: var(--danger); }\n.pill-muted { color: var(--text-dim); background: rgba(255,255,255,.05); border-color: var(--border); }\n.pill-muted .dot { background: var(--text-dim); }\n.pill-down { color: var(--danger); background: rgba(242,93,106,.1); border-color: rgba(242,93,106,.35); }\n.pill-down .dot { background: var(--danger); }\n.tag-private { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; color: var(--warn); border: 1px solid rgba(245,184,61,.35); background: rgba(245,184,61,.08); padding: 3px 9px; border-radius: 999px; white-space: nowrap; }\n\n/* ── deployment cards ── */\n.dep-list { display: flex; flex-direction: column; gap: 14px; margin-bottom: 48px; }\n.dep-card { display: grid; grid-template-columns: 1fr auto; gap: 16px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--panel); padding: 20px 22px; animation: rise .35s ease both; }\n.dep-main { display: flex; flex-direction: column; gap: 9px; min-width: 0; }\n.dep-title { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }\n.dep-name { font-weight: 700; font-size: 15.5px; }\n.dep-repo { font-family: var(--mono); font-size: 12px; color: var(--text-dim); text-decoration: none; }\n.dep-repo:hover { color: var(--accent-2); }\n.dep-url { display: inline-flex; align-items: center; gap: 7px; font-family: var(--mono); font-size: 12.5px; color: var(--accent-2); text-decoration: none; background: rgba(34,185,212,.07); border: 1px solid rgba(34,185,212,.22); padding: 5px 12px; border-radius: 8px; width: fit-content; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.dep-url:hover { background: rgba(34,185,212,.14); }\n.dep-sub { font-size: 12px; color: var(--text-dim); display: flex; gap: 16px; flex-wrap: wrap; }\n.dep-error { color: var(--danger); font-size: 12.5px; }\n.dep-actions { display: flex; align-items: center; gap: 8px; }\n.monitor-chip { display: inline-flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 999px; border: 1px solid var(--border); background: rgba(255,255,255,.03); color: var(--text-dim); }\n.monitor-chip .dot { width: 7px; height: 7px; border-radius: 50%; }\n.monitor-up { color: var(--accent); border-color: rgba(55,226,160,.3); }\n.monitor-up .dot { background: var(--accent); animation: pulse 2s infinite; }\n.monitor-down { color: var(--danger); border-color: rgba(242,93,106,.35); }\n.monitor-down .dot { background: var(--danger); }\n.monitor-pending .dot { background: var(--text-dim); animation: pulse 1.4s infinite; }\n\n/* ── empty states ── */\n.empty { border: 1px dashed var(--border-strong); border-radius: var(--radius); padding: 44px 20px; text-align: center; color: var(--text-dim); margin-bottom: 48px; }\n.empty svg { opacity: .5; margin-bottom: 14px; }\n.empty p { margin-bottom: 4px; }\n.empty .sub { font-size: 12.5px; opacity: .75; }\n\n/* ── toasts ── */\n.toasts { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 10px; z-index: 50; max-width: min(420px, calc(100vw - 48px)); }\n.toast { padding: 14px 18px; border-radius: 12px; border: 1px solid var(--border-strong); background: #10141f; box-shadow: 0 12px 40px rgba(0,0,0,.5); font-size: 13.5px; animation: rise .25s ease both; }\n.toast-error { border-color: rgba(242,93,106,.5); }\n.toast-ok { border-color: rgba(55,226,160,.5); }\n\n/* ── misc ── */\n.row-loading { display: flex; justify-content: center; padding: 50px; }\n.divider-label { display: flex; align-items: center; gap: 12px; color: var(--text-dim); font-size: 12px; text-transform: uppercase; letter-spacing: .14em; font-weight: 700; margin-bottom: 18px; }\n.divider-label:before, .divider-label:after { content: \"\"; flex: 1; height: 1px; background: var(--border); }\n.demo-banner { margin: 0 0 24px; padding: 10px 16px; border-radius: 10px; font-size: 12.5px; background: rgba(91,140,255,.09); border: 1px solid rgba(91,140,255,.3); color: #9db8ff; text-align: center; }\n.footer { text-align: center; color: var(--text-faint); font-size: 12px; margin-top: 60px; color: #4b556c; }\n\n@media (max-width: 640px) {\n  .dep-card { grid-template-columns: 1fr; }\n  .dep-actions { justify-content: flex-start; }\n  .hero { padding-top: 60px; }\n}\n",
  js: "'use strict';\n/* THE DEV HOSTER PRO — dashboard client.\n * Talks only to this app's own API. No third-party (provider) calls, keys,\n * names, or scripts ever reach the browser. */\n\nconst state = {\n  user: null,\n  config: { brand: 'THE DEV HOSTER PRO', demo: false, maxDeployments: 3 },\n  repos: null,          // null = not loaded yet\n  deployments: [],\n  limit: 3,\n  deployingNow: new Set(),\n  pollTimer: null,\n};\n\n// ── inline icons (SVG, no network) ──\nconst ICON = {\n  bolt: '<svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M13 2 4.5 13.5h5L8 22l8.5-11.5h-5L13 2Z\" fill=\"currentColor\"/></svg>',\n  github: '<svg width=\"19\" height=\"19\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.05.78 2.13 0 1.54-.01 2.77-.01 3.15 0 .31.2.68.8.56A10.02 10.02 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z\"/></svg>',\n  rocket: '<svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z\"/><path d=\"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z\"/><path d=\"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0\"/><path d=\"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5\"/></svg>',\n  pulse: '<svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"22 12 18 12 15 21 9 3 6 12 2 12\"/></svg>',\n  wand: '<svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2 18l-2 4 4-2 15.64-15.64a1.21 1.21 0 0 0 0-1.72Z\"/><path d=\"m14 7 3 3\"/><path d=\"M5 6v4\"/><path d=\"M19 14v4\"/><path d=\"M3 8h4\"/><path d=\"M17 18h4\"/></svg>',\n  globe: '<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M2 12h20\"/><path d=\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z\"/></svg>',\n  refresh: '<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 12a9 9 0 1 1-2.64-6.36\"/><polyline points=\"21 3 21 9 15 9\"/></svg>',\n  trash: '<svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 6h18\"/><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\"/><path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/></svg>',\n  box: '<svg width=\"34\" height=\"34\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z\"/><path d=\"m3.3 7 8.7 5 8.7-5\"/><path d=\"M12 22V12\"/></svg>',\n  lock: '<svg width=\"11\" height=\"11\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\"><rect x=\"3\" y=\"11\" width=\"18\" height=\"10\" rx=\"2\"/><path d=\"M7 11V7a5 5 0 0 1 10 0v4\"/></svg>',\n  ext: '<svg width=\"11\" height=\"11\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\"><path d=\"M7 17 17 7\"/><path d=\"M8 7h9v9\"/></svg>',\n};\n\nconst esc = (s) => String(s ?? '').replace(/[&<>\"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', \"'\": '&#39;' }[c]));\nconst app = document.getElementById('app');\n\nasync function api(url, opts = {}) {\n  const res = await fetch(url, {\n    ...opts,\n    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },\n  });\n  let data = null;\n  try { data = await res.json(); } catch { /* non-JSON */ }\n  if (res.status === 401) { state.user = null; render(); throw new Error('Signed out'); }\n  if (!res.ok) throw new Error((data && data.error) || `Request failed (${res.status})`);\n  return data;\n}\n\nfunction toast(msg, kind = 'ok', ms = 5200) {\n  const el = document.createElement('div');\n  el.className = `toast toast-${kind}`;\n  el.textContent = msg;\n  document.getElementById('toasts').appendChild(el);\n  setTimeout(() => el.remove(), ms);\n}\n\n/* ─────────────────────────── landing ─────────────────────────── */\nfunction landingView() {\n  return `\n  <header class=\"topbar\">\n    <div class=\"brand\">\n      <span class=\"brand-badge\" style=\"color:var(--accent)\">${ICON.bolt}</span>\n      <div>THE DEV HOSTER&nbsp;<span class=\"grad\" style=\"background:var(--accent-grad);-webkit-background-clip:text;background-clip:text;color:transparent\">PRO</span><small>WHITE-LABEL HOSTING</small></div>\n    </div>\n  </header>\n\n  <section class=\"hero\">\n    <div class=\"hero-eyebrow\">${ICON.rocket} Deploy without DevOps</div>\n    <h1>Your code goes live.<br><span class=\"grad\">One click. Zero keys.</span></h1>\n    <p>Sign in with GitHub and every repository becomes deployable instantly — live URL, automatic health monitoring, and zero configuration. No API keys, no YAML, no dashboards-of-dashboards.</p>\n    <div class=\"hero-cta\">\n      <a class=\"btn btn-github btn-lg\" href=\"/auth/github\">${ICON.github} Continue with GitHub</a>\n      ${state.config.demo ? `<a class=\"btn btn-lg\" href=\"/auth/demo\">Explore the live demo</a>` : ''}\n    </div>\n  </section>\n\n  <section class=\"features\">\n    <div class=\"feature-card\">\n      <div class=\"feature-icon\">${ICON.rocket}</div>\n      <h3>One-click deploys</h3>\n      <p>Pick any repo and it ships — the platform detects your runtime and build commands automatically. Node, Python, Go, Ruby, Docker, or plain static sites.</p>\n    </div>\n    <div class=\"feature-card\">\n      <div class=\"feature-icon\">${ICON.pulse}</div>\n      <h3>Monitoring on autopilot</h3>\n      <p>The moment your app is live, uptime checks are registered for you automatically. See Up / Down status right next to each project.</p>\n    </div>\n    <div class=\"feature-card\">\n      <div class=\"feature-icon\">${ICON.wand}</div>\n      <h3>Nothing to configure</h3>\n      <p>No YAML pipelines, no API keys, no third-party accounts. Your GitHub sign-in is the entire onboarding process.</p>\n    </div>\n  </section>`;\n}\n\n/* ─────────────────────────── dashboard ─────────────────────────── */\nconst STATUS_PILL = {\n  live: ['pill-live', 'Live'],\n  building: ['pill-building', 'Building'],\n  queued: ['pill-building', 'Queued'],\n  failed: ['pill-failed', 'Failed'],\n};\n\nfunction monitorChip(m, deployStatus) {\n  if (!m) {\n    return deployStatus === 'live'\n      ? `<span class=\"monitor-chip monitor-pending\"><span class=\"dot\"></span>Monitor starting</span>`\n      : '';\n  }\n  if (m === 'up') return `<span class=\"monitor-chip monitor-up\"><span class=\"dot\"></span>Monitored · Up</span>`;\n  if (m === 'down' || m === 'seems_down') return `<span class=\"monitor-chip monitor-down\"><span class=\"dot\"></span>Monitored · Down</span>`;\n  return `<span class=\"monitor-chip monitor-pending\"><span class=\"dot\"></span>Monitor ${esc(m)}</span>`;\n}\n\nfunction depCard(d) {\n  const [cls, label] = STATUS_PILL[d.status] || ['pill-muted', d.status];\n  const created = d.created_at ? d.created_at.replace('T', ' ').slice(0, 16) : '';\n  return `\n  <article class=\"dep-card\" data-id=\"${d.id}\">\n    <div class=\"dep-main\">\n      <div class=\"dep-title\">\n        <span class=\"dep-name\">${esc(d.name)}</span>\n        <a class=\"dep-repo\" href=\"${esc(d.repo_url)}\" target=\"_blank\" rel=\"noopener\">${esc(d.repo_full_name)}${ICON.ext}</a>\n        <span class=\"pill ${cls}\"><span class=\"dot\"></span>${label}</span>\n        ${monitorChip(d.monitor, d.status)}\n      </div>\n      ${d.service_url ? `<a class=\"dep-url\" href=\"${esc(d.service_url)}\" target=\"_blank\" rel=\"noopener\">${ICON.globe} ${esc(d.service_url)}</a>` : ''}\n      <div class=\"dep-sub\">\n        <span>branch: ${esc(d.branch)}</span>\n        <span>runtime: ${esc(d.runtime || 'auto')}</span>\n        <span>created ${esc(created)} UTC</span>\n      </div>\n      ${d.error ? `<div class=\"dep-error\">${esc(d.error)}</div>` : ''}\n    </div>\n    <div class=\"dep-actions\">\n      <button class=\"btn btn-sm\" data-action=\"redeploy\" data-id=\"${d.id}\" title=\"Trigger a fresh deploy\">${ICON.refresh} Redeploy</button>\n      <button class=\"btn btn-sm btn-danger btn-ghost\" data-action=\"delete\" data-id=\"${d.id}\" title=\"Delete app, its URL and its monitor\">${ICON.trash} Delete</button>\n    </div>\n  </article>`;\n}\n\nfunction repoCard(r) {\n  const [owner, name] = r.full_name.split('/');\n  const busy = state.deployingNow.has(r.full_name);\n  const updated = r.updated_at ? new Date(r.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';\n  return `\n  <article class=\"card\">\n    <div class=\"card-top\">\n      <a class=\"repo-name\" href=\"${esc(r.html_url)}\" target=\"_blank\" rel=\"noopener\">${ICON.github} ${esc(r.name)}</a>\n      ${r.private ? `<span class=\"tag-private\">${ICON.lock} Private</span>` : ''}\n    </div>\n    <p class=\"repo-desc\">${esc(r.description || 'No description')}</p>\n    <div class=\"repo-meta\">\n      ${r.language ? `<span><span class=\"lang-dot\"></span>${esc(r.language)}</span>` : ''}\n      <span>★ ${r.stargazers_count}</span>\n      <span>updated ${esc(updated)}</span>\n    </div>\n    <div class=\"card-actions\">\n      <span class=\"hint\" style=\"font-size:12px;color:var(--text-dim)\">branch: ${esc(r.default_branch)}</span>\n      <button class=\"btn btn-primary btn-sm\" data-action=\"deploy\" data-owner=\"${esc(owner)}\" data-repo=\"${esc(name)}\" data-full=\"${esc(r.full_name)}\"\n        ${r.private || busy ? 'disabled' : ''}>\n        ${busy ? '<span class=\"spinner\"></span> Deploying…' : `${ICON.rocket} Deploy`}\n      </button>\n    </div>\n    ${r.private ? `<div style=\"font-size:11.5px;color:var(--text-dim)\">Private repos are not supported yet.</div>` : ''}\n  </article>`;\n}\n\nfunction dashboardView() {\n  const u = state.user;\n  const live = state.deployments.filter((d) => d.status === 'live').length;\n  const monitored = state.deployments.filter((d) => !!d.monitor).length;\n  const slotsUsed = `${state.deployments.length}/${state.limit}`;\n\n  return `\n  <header class=\"topbar\">\n    <div class=\"brand\">\n      <span class=\"brand-badge\" style=\"color:var(--accent)\">${ICON.bolt}</span>\n      <div>THE DEV HOSTER&nbsp;<span style=\"background:var(--accent-grad);-webkit-background-clip:text;background-clip:text;color:transparent\">PRO</span><small>WHITE-LABEL HOSTING</small></div>\n    </div>\n    <div class=\"topbar-right\">\n      <div class=\"user-chip\">\n        <span>${esc(u.name || u.login)}</span>\n        ${u.avatar_url ? `<img src=\"${esc(u.avatar_url)}\" alt=\"\" />` : `<span class=\"avatar-fallback\">${esc((u.login || 'U')[0].toUpperCase())}</span>`}\n      </div>\n      <button class=\"btn btn-ghost btn-sm\" data-action=\"logout\">Sign out</button>\n    </div>\n  </header>\n\n  ${state.config.demo ? `<div class=\"demo-banner\">Demo mode — repositories and deployments below are mock data. Configure real keys to go live.</div>` : ''}\n\n  <div class=\"stats\">\n    <div class=\"stat\"><b>${state.deployments.length}</b><span>Your apps</span></div>\n    <div class=\"stat stat-hot\"><b>${live}</b><span>Live now</span></div>\n    <div class=\"stat\"><b>${monitored}</b><span>Monitored</span></div>\n    <div class=\"stat\"><b>${slotsUsed}</b><span>Plan slots used</span></div>\n  </div>\n\n  <div class=\"section-head\">\n    <h2>${ICON.pulse} Your deployments</h2>\n    <span class=\"hint\">Status refreshes automatically</span>\n  </div>\n  <div class=\"dep-list\">\n    ${state.deployments.length\n      ? state.deployments.map(depCard).join('')\n      : `<div class=\"empty\">${ICON.box}<p>No deployments yet.</p><p class=\"sub\">Pick a repository below and hit Deploy — that's the whole workflow.</p></div>`}\n  </div>\n\n  <div class=\"section-head\">\n    <h2>${ICON.github} Your GitHub repositories</h2>\n    <span class=\"hint\">One click per repo · up to ${state.limit} apps on your plan</span>\n  </div>\n  <div class=\"grid\">\n    ${state.repos === null\n      ? `<div class=\"row-loading\" style=\"grid-column:1/-1\"><div class=\"spinner spinner-lg\"></div></div>`\n      : state.repos.length ? state.repos.map(repoCard).join('')\n      : `<div class=\"empty\" style=\"grid-column:1/-1\">${ICON.box}<p>No repositories found on this GitHub account.</p></div>`}\n  </div>\n\n  <div class=\"footer\">THE DEV HOSTER PRO · your code, live in one click</div>`;\n}\n\n/* ─────────────────────────── render & data ─────────────────────────── */\nfunction render() {\n  app.innerHTML = state.user ? dashboardView() : landingView();\n}\n\nasync function loadRepos() {\n  try {\n    const { repos } = await api('/api/repos');\n    state.repos = repos;\n  } catch (e) {\n    state.repos = [];\n    toast(e.message, 'error');\n  }\n  render();\n}\n\nasync function loadDeployments() {\n  if (!state.user) return;\n  try {\n    const { deployments, limit } = await api('/api/deployments');\n    state.deployments = deployments;\n    state.limit = limit;\n    render();\n  } catch (e) { /* signed out or transient — next poll retries */ }\n}\n\nasync function onDeploy(owner, repo, full) {\n  state.deployingNow.add(full);\n  render();\n  try {\n    await api('/api/deploy', { method: 'POST', body: JSON.stringify({ owner, repo }) });\n    toast(`Deployment started for ${full}. Monitoring will attach automatically once it is live.`);\n    await loadDeployments();\n  } catch (e) {\n    toast(e.message, 'error');\n  } finally {\n    state.deployingNow.delete(full);\n    render();\n  }\n}\n\nasync function onAction(action, id) {\n  if (action === 'logout') {\n    await fetch('/auth/logout', { method: 'POST' });\n    location.reload();\n    return;\n  }\n  if (action === 'deploy') return; // handled separately\n  if (action === 'delete') {\n    if (!confirm('Delete this app? Its live URL and monitor will be removed. This cannot be undone.')) return;\n    try {\n      await api(`/api/deployments/${id}`, { method: 'DELETE' });\n      toast('App, URL and monitor removed.');\n      await loadDeployments();\n    } catch (e) { toast(e.message, 'error'); }\n    return;\n  }\n  if (action === 'redeploy') {\n    try {\n      await api(`/api/deployments/${id}/redeploy`, { method: 'POST', body: '{}' });\n      toast('Redeploy started.');\n      await loadDeployments();\n    } catch (e) { toast(e.message, 'error'); }\n  }\n}\n\ndocument.addEventListener('click', (e) => {\n  const btn = e.target.closest('[data-action]');\n  if (!btn) return;\n  const { action, id, owner, repo, full } = btn.dataset;\n  if (action === 'deploy' && owner && repo) onDeploy(owner, repo, full);\n  else onAction(action, id);\n});\n\n/* boot */\n(async function init() {\n  try {\n    const cfg = await api('/api/config');\n    state.config = cfg;\n  } catch { /* defaults fine */ }\n  try {\n    const me = await api('/api/me');\n    state.user = me.user;\n  } catch { state.user = null; }\n\n  render();\n  if (state.user) {\n    loadRepos();\n    loadDeployments();\n    state.pollTimer = setInterval(loadDeployments, 5000);\n  }\n})();\n",
};

/* ── bundled modules ── */
const dbLib = (() => {
const module = { exports: {} };
/* SQLite persistence: users (GitHub identities), sessions, deployments. */
const path = require('path');
const Database = require('better-sqlite3');

fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
const db = new Database(path.join(process.cwd(), 'data', 'devhoster.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  github_id     INTEGER NOT NULL UNIQUE,
  login         TEXT    NOT NULL,
  name          TEXT,
  avatar_url    TEXT,
  access_token  TEXT    NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS deployments (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id            INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  repo_full_name     TEXT NOT NULL,
  repo_url           TEXT NOT NULL,
  branch             TEXT NOT NULL,
  name               TEXT NOT NULL,
  provider_service_id TEXT NOT NULL,
  service_url        TEXT,
  status             TEXT NOT NULL DEFAULT 'deploying',
  kind               TEXT NOT NULL DEFAULT 'web',
  runtime            TEXT,
  uptime_monitor_id  TEXT,
  error              TEXT,
  created_at         TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at         TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_deployments_user ON deployments(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);
`);

const stmts = {
  upsertUser: db.prepare(`
    INSERT INTO users (github_id, login, name, avatar_url, access_token)
    VALUES (@github_id, @login, @name, @avatar_url, @access_token)
    ON CONFLICT(github_id) DO UPDATE SET
      login = excluded.login,
      name = excluded.name,
      avatar_url = excluded.avatar_url,
      access_token = excluded.access_token,
      last_login_at = datetime('now')
  `),
  getUserByGithubId: db.prepare('SELECT * FROM users WHERE github_id = ?'),
  getUserById: db.prepare('SELECT * FROM users WHERE id = ?'),

  createSession: db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'),
  getSession: db.prepare('SELECT * FROM sessions WHERE id = ?'),
  deleteSession: db.prepare('DELETE FROM sessions WHERE id = ?'),
  deleteExpiredSessions: db.prepare('DELETE FROM sessions WHERE expires_at < ?'),

  createDeployment: db.prepare(`
    INSERT INTO deployments
      (user_id, repo_full_name, repo_url, branch, name, provider_service_id, service_url, status, kind, runtime)
    VALUES
      (@user_id, @repo_full_name, @repo_url, @branch, @name, @provider_service_id, @service_url, @status, @kind, @runtime)
  `),
  getDeployment: db.prepare('SELECT * FROM deployments WHERE id = ?'),
  listDeployments: db.prepare('SELECT * FROM deployments WHERE user_id = ? ORDER BY created_at DESC, id DESC'),
  countDeployments: db.prepare('SELECT COUNT(*) AS n FROM deployments WHERE user_id = ?'),
  deleteDeployment: db.prepare('DELETE FROM deployments WHERE id = ?'),
  pendingDeployments: db.prepare(`SELECT * FROM deployments WHERE status IN ('queued', 'building')`),

  sweepOrphanSessions: db.prepare(`DELETE FROM sessions WHERE user_id NOT IN (SELECT id FROM users)`),
};

function upsertGithubUser(gh, token) {
  stmts.upsertUser.run({
    github_id: gh.id,
    login: gh.login,
    name: gh.name || gh.login,
    avatar_url: gh.avatar_url || '',
    access_token: token,
  });
  return stmts.getUserByGithubId.get(gh.id);
}

function getSession(sid) {
  const s = stmts.getSession.get(sid);
  if (!s) return null;
  if (s.expires_at < Date.now()) { stmts.deleteSession.run(sid); return null; }
  return s;
}

function updateDeployment(id, fields) {
  const keys = Object.keys(fields);
  if (!keys.length) return;
  const set = keys.map(k => `${k} = @${k}`).join(', ');
  db.prepare(`UPDATE deployments SET ${set}, updated_at = datetime('now') WHERE id = @__id`)
    .run({ ...fields, __id: id });
}

module.exports = {
  upsertGithubUser,
  getUserById: (id) => stmts.getUserById.get(id),
  createSession: (sid, userId, expiresAt) => stmts.createSession.run(sid, userId, expiresAt),
  getSession,
  deleteSession: (sid) => stmts.deleteSession.run(sid),
  cleanupSessions: () => { stmts.deleteExpiredSessions.run(Date.now()); stmts.sweepOrphanSessions.run(); },
  createDeployment: (row) => {
    const info = stmts.createDeployment.run(row);
    return stmts.getDeployment.get(info.lastInsertRowid);
  },
  getDeployment: (id) => stmts.getDeployment.get(Number(id)),
  listDeployments: (userId) => stmts.listDeployments.all(userId),
  countDeployments: (userId) => stmts.countDeployments.get(userId).n,
  deleteDeployment: (id) => stmts.deleteDeployment.run(Number(id)),
  pendingDeployments: () => stmts.pendingDeployments.all(),
  updateDeployment,
};

return module.exports;
})();

const githubLib = (() => {
const module = { exports: {} };
/* GitHub OAuth + REST API. The user's token is used ONLY to read their
 * identity and repository list — never to modify their account, and it
 * is never sent to the browser. */

const GH_API = 'https://api.github.com';
const GH_WEB = 'https://github.com';

function oauthAuthorizeUrl({ clientId, redirectUri, state }) {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'repo', // needed to render the repo list incl. private repos UI-side
    state,
    allow_signup: 'true',
  });
  return `${GH_WEB}/login/oauth/authorize?${params}`;
}

async function exchangeCodeForToken(code) {
  const res = await fetch(`${GH_WEB}/login/oauth/access_token`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const data = await res.json().catch(() => null);
  if (!data || !data.access_token) {
    throw new Error((data && (data.error_description || data.error)) || 'GitHub token exchange failed');
  }
  return data.access_token;
}

async function gh(pathname, token, opts = {}) {
  const res = await fetch(GH_API + pathname, {
    ...opts,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(opts.headers || {}),
    },
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error((data && data.message) || `GitHub API error ${res.status}`);
  return data;
}

const getUser = (token) => gh('/user', token);

/* Up to 300 repos the user owns / collaborates on / has org access to. */
async function listRepos(token) {
  const out = [];
  for (let page = 1; page <= 3; page++) {
    const batch = await gh(
      `/user/repos?per_page=100&page=${page}&sort=updated&affiliation=owner,collaborator,organization_member`,
      token
    );
    out.push(...batch);
    if (batch.length < 100) break;
  }
  return out.map((r) => ({
    id: r.id,
    name: r.name,
    full_name: r.full_name,
    html_url: r.html_url,
    private: r.private,
    description: r.description,
    language: r.language,
    default_branch: r.default_branch,
    stargazers_count: r.stargazers_count,
    updated_at: r.updated_at,
  }));
}

/* Verifies the signed-in user actually owns/collaborates on the repo —
 * stops people deploying arbitrary public repos onto the platform owner's bill. */
async function isCollaborator(token, owner, repo, username) {
  const res = await fetch(
    `${GH_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/collaborators/${encodeURIComponent(username)}`,
    { headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}` } }
  );
  if (res.status === 204) return true;
  if (res.status === 404) return false;
  const data = await res.json().catch(() => null);
  throw new Error((data && data.message) || `GitHub API error ${res.status}`);
}

const getRepo = (token, owner, repo) =>
  gh(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, token);

async function listRootFiles(token, owner, repo, ref) {
  try {
    const q = ref ? `?ref=${encodeURIComponent(ref)}` : '';
    const items = await gh(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${q}`, token);
    if (Array.isArray(items)) return items.map((i) => i.name);
  } catch (_) { /* empty repo or API hiccup → fall through to defaults */ }
  return [];
}

/* ── Demo fixtures (DEMO_MODE only) ── */
function demoRepos() {
  const now = Date.now();
  const mk = (n, lang, priv, desc, hours) => ({
    id: Math.abs(n.split('').reduce((a, c) => a * 31 + c.charCodeAt(0) | 0, 7)),
    name: n,
    full_name: `demo-dev/${n}`,
    html_url: `https://github.com/demo-dev/${n}`,
    private: priv,
    description: desc,
    language: lang,
    default_branch: 'main',
    stargazers_count: (n.length * 7) % 42,
    updated_at: new Date(now - hours * 3600e3).toISOString(),
  });
  return [
    mk('api-gateway', 'JavaScript', false, 'Express API gateway with JWT auth and rate limiting', 3),
    mk('portfolio-2026', 'HTML', false, 'Personal portfolio site', 9),
    mk('flask-ml-starter', 'Python', false, 'Scikit-learn model serving scaffold', 26),
    mk('go-url-shortener', 'Go', false, 'Tiny URL shortener with Redis cache', 50),
    mk('client-billing-app', 'TypeScript', true, 'Invoicing dashboard (private)', 74),
    mk('docs-site', 'CSS', false, 'Static documentation site', 120),
  ];
}

module.exports = {
  oauthAuthorizeUrl,
  exchangeCodeForToken,
  getUser,
  listRepos,
  isCollaborator,
  getRepo,
  listRootFiles,
  demoRepos,
};

return module.exports;
})();

const renderLib = (() => {
const module = { exports: {} };
/* Deployment provider adapter — Render API v1.
 *
 * White-label contract: every function here is called server-side with the
 * PLATFORM OWNER'S Render API key (RENDER_API_KEY env var). End users never
 * see, supply, or learn about this provider. Do not leak error strings
 * containing provider details to the client without normalizing them.
 *
 * To swap providers later (Railway, Fly.io, a Kubernetes cluster), implement
 * the same 5 functions and change one require() line in server.js.
 */

const API = 'https://api.render.com/v1';
const DEMO = /^true$/i.test(process.env.DEMO_MODE || '');

// ── Demo provider state (DEMO_MODE only) ──
const demoState = new Map(); // serviceId -> { createdAt, url, name }

function apiKey() {
  const k = process.env.RENDER_API_KEY;
  if (!k) throw new Error('Deployment backend is not configured on the server (owner API key missing)');
  return k;
}

async function r(pathname, opts = {}) {
  const res = await fetch(API + pathname, {
    ...opts,
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  if (!res.ok) throw new Error((data && data.message) || `Upstream provider error ${res.status}`);
  return data;
}

let ownerIdCache = null;
async function getOwnerId() {
  if (ownerIdCache) return ownerIdCache;
  const owners = await r('/owners?limit=1');
  const id = owners && owners[0] && owners[0].owner && owners[0].owner.id;
  if (!id) throw new Error('Could not resolve provider workspace (owner id)');
  ownerIdCache = id;
  return id;
}

/**
 * cfg: { name, repo, branch, kind: 'web'|'static', env, region, plan,
 *        buildCommand, startCommand, publishPath, envVars }
 * returns provider service object: { id, serviceDetails: { url } }
 */
async function createService(cfg) {
  if (DEMO) {
    const id = 'srv-demo-' + Math.random().toString(36).slice(2, 10);
    const url = `https://${cfg.name}.dhp-demo.site`;
    demoState.set(id, { createdAt: Date.now(), url, name: cfg.name });
    return { id, name: cfg.name, serviceDetails: { url } };
  }

  const ownerId = await getOwnerId();
  const common = {
    name: cfg.name,
    ownerId,
    repo: cfg.repo,
    branch: cfg.branch,
    autoDeploy: 'yes',
  };

  const body = cfg.kind === 'static'
    ? {
        ...common,
        type: 'static_site',
        serviceDetails: {
          buildCommand: cfg.buildCommand || '',
          publishPath: cfg.publishPath || '.',
          pullRequestPreviewsEnabled: false,
        },
      }
    : {
        ...common,
        type: 'web_service',
        serviceDetails: {
          env: cfg.env || 'node',
          region: cfg.region || 'oregon',
          plan: cfg.plan || 'free',
          buildCommand: cfg.buildCommand || '',
          startCommand: cfg.startCommand || '',
          envVars: cfg.envVars || [],
          pullRequestPreviewsEnabled: false,
        },
      };

  const data = await r('/services', { method: 'POST', body: JSON.stringify(body) });
  return data.service || data;
}

async function getService(id) {
  if (DEMO) {
    const s = demoState.get(id);
    return { id, serviceDetails: { url: s ? s.url : null } };
  }
  return r(`/services/${encodeURIComponent(id)}`);
}

/* Latest deploy status: created | build_in_progress | update_in_progress |
 * live | build_failed | update_failed | canceled | deactivated | ... */
async function getLatestDeploy(id) {
  if (DEMO) {
    const s = demoState.get(id);
    if (!s) return null;
    const elapsed = Date.now() - s.createdAt;
    if (elapsed < 8000) return { status: 'created' };
    if (elapsed < 25000) return { status: 'build_in_progress' };
    return { status: 'live' };
  }
  const data = await r(`/services/${encodeURIComponent(id)}/deploys?limit=1`);
  return (Array.isArray(data) && data[0] && data[0].deploy) || null;
}

async function triggerDeploy(id) {
  if (DEMO) {
    const s = demoState.get(id) || { url: null, name: id };
    demoState.set(id, { ...s, createdAt: Date.now() });
    return { id: 'dep-demo', status: 'created' };
  }
  return r(`/services/${encodeURIComponent(id)}/deploys`, {
    method: 'POST',
    body: JSON.stringify({ clearCache: 'do_not_clear' }),
  });
}

async function deleteService(id) {
  if (DEMO) { demoState.delete(id); return true; }
  await r(`/services/${encodeURIComponent(id)}`, { method: 'DELETE' });
  return true;
}

module.exports = { createService, getService, getLatestDeploy, triggerDeploy, deleteService };

return module.exports;
})();

const uptimeLib = (() => {
const module = { exports: {} };
/* Monitoring adapter — UptimeRobot API v2.
 *
 * White-label contract: uses the PLATFORM OWNER'S UptimeRobot API key
 * (UPTIMEROBOT_API_KEY env var) server-side only. Users simply see
 * "Monitoring: Enabled / Up / Down" in their dashboard.
 */

const BASE = 'https://api.uptimerobot.com/v2';
const DEMO = /^true$/i.test(process.env.DEMO_MODE || '');

const STATUS = { 0: 'paused', 1: 'pending', 2: 'up', 8: 'seems_down', 9: 'down' };

function apiKey() {
  const k = process.env.UPTIMEROBOT_API_KEY;
  if (!k) throw new Error('Monitoring backend is not configured on the server (owner API key missing)');
  return k;
}

async function call(endpoint, params) {
  const body = new URLSearchParams({ api_key: apiKey(), format: 'json', ...params });
  const res = await fetch(`${BASE}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = await res.json().catch(() => null);
  if (!data || data.stat !== 'ok') {
    throw new Error((data && data.error && data.error.message) || `Monitoring provider error ${res.status}`);
  }
  return data;
}

/* type=1 → HTTP(s) check, every 5 minutes. Returns monitor id (string). */
async function createMonitor(url, friendlyName) {
  if (DEMO) return 'mon-demo-' + Math.random().toString(36).slice(2, 10);
  const d = await call('newMonitor', {
    friendly_name: friendlyName.slice(0, 60),
    url,
    type: '1',
    interval: '300',
    http_method: '2', // HEAD — cheaper than GET
  });
  return String(d.monitor.id);
}

async function deleteMonitor(id) {
  if (DEMO) return true;
  await call('deleteMonitor', { id: String(id) });
  return true;
}

/* Map { monitorId: 'up' | 'down' | 'pending' | 'paused' | 'seems_down' } */
async function getStatuses(ids) {
  const clean = [...new Set((ids || []).filter(Boolean).map(String))];
  if (!clean.length) return {};
  if (DEMO) return Object.fromEntries(clean.map((i) => [i, 'up']));
  const d = await call('getMonitors', { monitors: clean.join('-') });
  const map = {};
  for (const m of d.monitors || []) map[String(m.id)] = STATUS[m.status] || 'unknown';
  return map;
}

/* 60s in-memory cache so a busy dashboard doesn't hammer the provider. */
let cache = { at: 0, map: {} };
async function getStatusesCached(ids) {
  const missing = (ids || []).filter((i) => !(String(i) in cache.map));
  if (Date.now() - cache.at > 60_000 || missing.length) {
    try {
      const fresh = await getStatuses(ids);
      cache = { at: Date.now(), map: { ...cache.map, ...fresh } };
    } catch (e) {
      if (!Object.keys(cache.map).length) throw e; // no stale data to fall back to
    }
  }
  return cache.map;
}

module.exports = { createMonitor, deleteMonitor, getStatuses, getStatusesCached };

return module.exports;
})();

const detectLib = (() => {
const module = { exports: {} };
/* Zero-config runtime detection from a repo's root file listing.
 * Returns a deploy "plan": web service vs static site + commands. */

function plan(fileNames) {
  const files = new Set((fileNames || []).map((f) => f.toLowerCase()));
  const has = (f) => files.has(f.toLowerCase());

  if (has('Dockerfile')) {
    return { kind: 'web', env: 'docker', buildCommand: '', startCommand: '' };
  }
  if (has('package.json')) {
    return { kind: 'web', env: 'node', buildCommand: 'npm install', startCommand: 'npm start' };
  }
  if (has('requirements.txt')) {
    return { kind: 'web', env: 'python', buildCommand: 'pip install -r requirements.txt', startCommand: 'python app.py' };
  }
  if (has('pyproject.toml')) {
    return { kind: 'web', env: 'python', buildCommand: 'pip install .', startCommand: 'python app.py' };
  }
  if (has('go.mod')) {
    return { kind: 'web', env: 'go', buildCommand: 'go build -o app .', startCommand: './app' };
  }
  if (has('gemfile')) {
    return { kind: 'web', env: 'ruby', buildCommand: 'bundle install', startCommand: 'bundle exec ruby app.rb' };
  }
  if (has('index.html')) {
    return { kind: 'static', buildCommand: '', publishPath: '.' };
  }
  // Fallback: assume a Node-style web service; the name tells the user nothing.
  return { kind: 'web', env: 'node', buildCommand: '', startCommand: '' };
}

module.exports = { plan };

return module.exports;
})();

/* ── application ── */
/* ─────────────────────────────────────────────────────────────────
 * THE DEV HOSTER PRO — application server
 *
 * User-facing contract: GitHub sign-in only. Users never type an API key,
 * never see the infrastructure provider's name, never leave this dashboard.
 *
 * Server-side truth: the platform owner's Render key provisions services
 * and the owner's UptimeRobot key monitors them. Those tokens live only
 * in env vars on this server.
 * ───────────────────────────────────────────────────────────────── */


// ── tiny .env loader (so we don't need an extra dependency) ──
(function loadEnvFile() {
  const p = path.join(__dirname, '.env');
  if (!fs.existsSync(p)) return;
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const val = m[2].replace(/^["']|["']$/g, '');
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
})();
// ensure data dir exists even without a .env
fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });

const PORT = parseInt(process.env.PORT || '3000', 10);
const BASE_URL = (process.env.BASE_URL || process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`).replace(/\/+$/, '');
const DEMO_MODE = /^true$/i.test(process.env.DEMO_MODE || '');
const COOKIE_SECURE = /^true$/i.test(process.env.COOKIE_SECURE || '');
const SESSION_COOKIE = 'dhp_sid';
const SESSION_TTL_MS = 30 * 24 * 3600e3;
const MAX_DEPLOYMENTS = parseInt(process.env.MAX_DEPLOYMENTS_PER_USER || '3', 10);
const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || '15000', 10);

const db = dbLib;
const github = githubLib;
const provider = renderLib;
const uptime = uptimeLib;
const detect = detectLib;

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '64kb' }));
if (COOKIE_SECURE) app.set('trust proxy', 1);

// ── cookie + session plumbing ──
function parseCookies(req) {
  const out = {};
  const header = req.headers.cookie || '';
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i > -1) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}
function setCookie(res, name, value, opts = {}) {
  const bits = [`${name}=${encodeURIComponent(value)}`, `Path=${opts.path || '/'}`];
  if (opts.maxAge !== undefined) bits.push(`Max-Age=${Math.floor(opts.maxAge)}`);
  if (opts.httpOnly !== false) bits.push('HttpOnly');
  bits.push(`SameSite=${opts.sameSite || 'Lax'}`);
  if (COOKIE_SECURE) bits.push('Secure');
  res.append('Set-Cookie', bits.join('; '));
}

app.use((req, res, next) => {
  req.cookies = parseCookies(req);
  req.user = null;
  const sid = req.cookies[SESSION_COOKIE];
  if (sid) {
    const sess = db.getSession(sid);
    if (sess) req.user = db.getUserById(sess.user_id) || null;
  }
  next();
});

function issueSession(res, userId) {
  const sid = crypto.randomBytes(24).toString('hex');
  db.createSession(sid, userId, Date.now() + SESSION_TTL_MS);
  setCookie(res, SESSION_COOKIE, sid, { maxAge: SESSION_TTL_MS / 1000 });
}
function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Sign in required' });
  next();
}
const uniqueName = (repo) => {
  const base = String(repo).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 38) || 'app';
  return `${base}-${crypto.randomBytes(3).toString('hex')}`;
};

/* ═════════════════════════ AUTH ═════════════════════════ */

app.get('/auth/github', (req, res) => {
  if (DEMO_MODE) return res.redirect('/auth/demo');
  if (!process.env.GITHUB_CLIENT_ID) {
    return res.status(500).send('GitHub OAuth is not configured. The site owner must set GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET.');
  }
  const state = crypto.randomBytes(16).toString('hex');
  setCookie(res, 'dhp_oauth', state, { maxAge: 600 });
  res.redirect(github.oauthAuthorizeUrl({
    clientId: process.env.GITHUB_CLIENT_ID,
    redirectUri: `${BASE_URL}/auth/github/callback`,
    state,
  }));
});

app.get('/auth/github/callback', async (req, res) => {
  const { code, state } = req.query;
  const expected = req.cookies.dhp_oauth;
  setCookie(res, 'dhp_oauth', '', { maxAge: 0 });
  if (!code || !state || !expected || state !== expected) {
    return res.status(400).send('Invalid or expired sign-in attempt. Please try again.');
  }
  try {
    const token = await github.exchangeCodeForToken(String(code));
    const ghUser = await github.getUser(token);
    const user = db.upsertGithubUser(ghUser, token);
    issueSession(res, user.id);
    res.redirect('/');
  } catch (e) {
    console.error('OAuth callback failed:', e.message);
    res.status(502).send('GitHub sign-in failed. Please try again.');
  }
});

// Demo login — only registered when DEMO_MODE=true, for UI previews.
if (DEMO_MODE) {
  app.get('/auth/demo', (req, res) => {
    const user = db.upsertGithubUser(
      { id: 1, login: 'demo-dev', name: 'Demo Developer', avatar_url: '' },
      'demo-token'
    );
    issueSession(res, user.id);
    res.redirect('/');
  });
}

app.post('/auth/logout', (req, res) => {
  if (req.cookies[SESSION_COOKIE]) db.deleteSession(req.cookies[SESSION_COOKIE]);
  setCookie(res, SESSION_COOKIE, '', { maxAge: 0 });
  res.json({ ok: true });
});

/* ═════════════════════════ API ═════════════════════════ */

app.get('/api/config', (req, res) => {
  res.json({ brand: 'THE DEV HOSTER PRO', demo: DEMO_MODE, maxDeployments: MAX_DEPLOYMENTS });
});

app.get('/api/me', (req, res) => {
  if (!req.user) return res.json({ user: null });
  const u = req.user;
  res.json({ user: { id: u.id, login: u.login, name: u.name, avatar_url: u.avatar_url } });
});

app.get('/api/repos', requireAuth, async (req, res) => {
  try {
    const repos = DEMO_MODE ? github.demoRepos() : await github.listRepos(req.user.access_token);
    res.json({ repos });
  } catch (e) {
    console.error('list repos failed:', e.message);
    res.status(502).json({ error: 'Could not load your repositories from GitHub. Try signing out and back in.' });
  }
});

/* One-click deploy */
app.post('/api/deploy', requireAuth, async (req, res) => {
  const { owner, repo } = req.body || {};
  if (typeof owner !== 'string' || typeof repo !== 'string' ||
      !/^[\w.-]{1,100}$/.test(owner) || !/^[\w.-]{1,100}$/.test(repo)) {
    return res.status(400).json({ error: 'A valid repository (owner + name) is required.' });
  }

  if (db.countDeployments(req.user.id) >= MAX_DEPLOYMENTS) {
    return res.status(429).json({ error: `You've reached the plan limit of ${MAX_DEPLOYMENTS} live apps. Delete one to free a slot.` });
  }

  try {
    // 1. Resolve the repo and prove the user owns/collaborates on it.
    let meta;
    if (DEMO_MODE) {
      meta = { full_name: `${owner}/${repo}`, html_url: `https://github.com/${owner}/${repo}`, default_branch: 'main', private: false };
    } else {
      const owned = await github.isCollaborator(req.user.access_token, owner, repo, req.user.login);
      if (!owned) return res.status(403).json({ error: 'You can only deploy repositories you own or collaborate on.' });
      meta = await github.getRepo(req.user.access_token, owner, repo);
    }
    if (meta.private) {
      return res.status(422).json({ error: 'Private repositories are not supported yet. Make the repo public, deploy, and this notice disappears once private-repo support ships.' });
    }

    // 2. Zero-config runtime detection from the repo root.
    const files = DEMO_MODE ? ['package.json', 'README.md'] : await github.listRootFiles(req.user.access_token, owner, repo, meta.default_branch);
    const planInfo = detect.plan(files);

    // 3. Provision on the hidden provider under the owner's workspace.
    const name = uniqueName(repo);
    const svc = await provider.createService({
      name,
      repo: meta.html_url,
      branch: meta.default_branch || 'main',
      kind: planInfo.kind,
      env: planInfo.env,
      region: process.env.RENDER_REGION || 'oregon',
      plan: process.env.RENDER_PLAN || 'free',
      buildCommand: planInfo.buildCommand,
      startCommand: planInfo.startCommand,
      publishPath: planInfo.publishPath,
      envVars: [{ key: 'NODE_ENV', value: 'production' }],
    });

    const row = db.createDeployment({
      user_id: req.user.id,
      repo_full_name: meta.full_name,
      repo_url: meta.html_url,
      branch: meta.default_branch || 'main',
      name,
      provider_service_id: svc.id,
      service_url: (svc.serviceDetails && svc.serviceDetails.url) || null,
      status: 'building',
      kind: planInfo.kind,
      runtime: planInfo.env || planInfo.kind,
    });

    res.status(201).json({ deployment: row });
  } catch (e) {
    console.error('deploy failed:', e.message);
    res.status(502).json({ error: 'Deployment could not be started right now. Please try again in a moment.' });
  }
});

app.get('/api/deployments', requireAuth, async (req, res) => {
  const rows = db.listDeployments(req.user.id);
  let monitorMap = {};
  try {
    monitorMap = await uptime.getStatusesCached(rows.map((r) => r.uptime_monitor_id));
  } catch (e) {
    console.error('monitor status fetch failed:', e.message);
  }
  res.json({
    deployments: rows.map((r) => ({
      id: r.id,
      repo_full_name: r.repo_full_name,
      repo_url: r.repo_url,
      branch: r.branch,
      name: r.name,
      service_url: r.service_url,
      status: r.status,
      runtime: r.runtime,
      kind: r.kind,
      error: r.error,
      created_at: r.created_at,
      monitor: r.uptime_monitor_id ? (monitorMap[String(r.uptime_monitor_id)] || 'pending') : null,
    })),
    limit: MAX_DEPLOYMENTS,
  });
});

app.post('/api/deployments/:id/redeploy', requireAuth, async (req, res) => {
  const dep = db.getDeployment(req.params.id);
  if (!dep || dep.user_id !== req.user.id) return res.status(404).json({ error: 'Deployment not found' });
  try {
    await provider.triggerDeploy(dep.provider_service_id);
    db.updateDeployment(dep.id, { status: 'building', error: null });
    res.json({ ok: true });
  } catch (e) {
    console.error('redeploy failed:', e.message);
    res.status(502).json({ error: 'Redeploy could not be started.' });
  }
});

app.delete('/api/deployments/:id', requireAuth, async (req, res) => {
  const dep = db.getDeployment(req.params.id);
  if (!dep || dep.user_id !== req.user.id) return res.status(404).json({ error: 'Deployment not found' });

  // Clean up monitoring + hosting, but always free the slot.
  if (dep.uptime_monitor_id) {
    try { await uptime.deleteMonitor(dep.uptime_monitor_id); }
    catch (e) { console.error('monitor delete failed:', e.message); }
  }
  try { await provider.deleteService(dep.provider_service_id); }
  catch (e) { console.error('service delete failed:', e.message); }

  db.deleteDeployment(dep.id);
  res.json({ ok: true });
});

/* ══════════════════ DEPLOY → MONITOR PIPELINE ══════════════════
 * Polls the provider for build progress. When a service flips live,
 * registers its URL with the (hidden) monitoring provider exactly once. */
const FAILED_STATES = new Set(['build_failed', 'update_failed', 'canceled', 'pre_deploy_failed', 'deactivated']);

async function pollPipeline() {
  for (const dep of db.pendingDeployments()) {
    try {
      const latest = await provider.getLatestDeploy(dep.provider_service_id);
      if (!latest) continue;

      if (latest.status === 'live') {
        let serviceUrl = dep.service_url;
        let monitorId = dep.uptime_monitor_id;
        if (!serviceUrl) {
          const svc = await provider.getService(dep.provider_service_id);
          serviceUrl = (svc && svc.serviceDetails && svc.serviceDetails.url) || null;
        }
        if (serviceUrl && !monitorId) {
          try {
            monitorId = await uptime.createMonitor(serviceUrl, `${dep.name} — Dev Hoster Pro`);
          } catch (e) {
            console.error(`monitor registration failed for ${dep.id}:`, e.message);
          }
        }
        console.log(`[pipeline] #${dep.id} ${dep.repo_full_name} is LIVE ${serviceUrl || ''} ${monitorId ? `(monitor ${monitorId})` : ''}`);
        db.updateDeployment(dep.id, { status: 'live', service_url: serviceUrl, uptime_monitor_id: monitorId || null, error: null });
      } else if (FAILED_STATES.has(latest.status)) {
        db.updateDeployment(dep.id, { status: 'failed', error: 'The build did not complete. Check the repo configuration and try again.' });
      } else {
        db.updateDeployment(dep.id, { status: 'building' });
      }
    } catch (e) {
      console.error(`[pipeline] poll failed for #${dep.id}:`, e.message);
    }
  }
}

/* ═════════════════════════ STATIC + FALLBACK ═════════════════════════ */

app.get('/api/healthz', (req, res) => res.json({ ok: true, demo: DEMO_MODE }));
app.get('/', (req, res) => res.type('html').send(FRONT.html));
app.get('/index.html', (req, res) => res.type('html').send(FRONT.html));
app.get('/styles.css', (req, res) => res.type('text/css').send(FRONT.css));
app.get('/app.js', (req, res) => res.type('application/javascript').send(FRONT.js));
app.use((req, res) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) return res.type('html').send(FRONT.html);
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('──────────────────────────────────────────────');
  console.log('  THE DEV HOSTER PRO');
  console.log(`  Listening on ${BASE_URL} (port ${PORT})`);
  if (DEMO_MODE) console.log('  MODE: demo — mocked repos/deploys, no keys needed');
  const missing = ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET', 'RENDER_API_KEY', 'UPTIMEROBOT_API_KEY']
    .filter((k) => !process.env[k]);
  if (!DEMO_MODE && missing.length) console.log(`  WARNING: not configured: ${missing.join(', ')}`);
  console.log('──────────────────────────────────────────────');
});

db.cleanupSessions();
setInterval(pollPipeline, POLL_INTERVAL_MS).unref();
setInterval(() => db.cleanupSessions(), 3600e3).unref();
setTimeout(pollPipeline, 1500);
