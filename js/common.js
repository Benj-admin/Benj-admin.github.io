/*
 * Shared by index.html and game.html: language state, theme toggle,
 * mobile nav, and the cursor glow. Loaded before main.js / game.js,
 * which each keep their own applyLang() (different string tables).
 */

/* ---------- Language ---------- */
const LANGS = ["en", "fr", "de"];
let lang = localStorage.getItem("lang");
if (!LANGS.includes(lang)) {
  const nav = navigator.language.slice(0, 2);
  lang = LANGS.includes(nav) ? nav : "en";
}

/* ---------- Theme ---------- */
// The <head> bootstrap already set data-theme before paint; read it back.
const themeBtn = document.getElementById("theme-toggle");
let theme = document.documentElement.dataset.theme;

function applyThemeIcon() {
  themeBtn.textContent = theme === "dark" ? "☀" : "☾";
}

themeBtn.addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", theme);
  document.documentElement.dataset.theme = theme;
  applyThemeIcon();
});

applyThemeIcon();

/* ---------- Mobile nav (index only; guarded) ---------- */
const navToggle = document.getElementById("nav-toggle");
if (navToggle) {
  const navEl = document.querySelector(".nav");
  navToggle.addEventListener("click", () => {
    const open = navEl.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  // Close the menu after tapping a link.
  navEl.querySelectorAll(".nav-links a").forEach((a) =>
    a.addEventListener("click", () => {
      navEl.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );
}

/* ---------- Cursor glow ---------- */
const glow = document.querySelector(".cursor-glow");
if (glow) {
  let mouseX = innerWidth / 2, mouseY = innerHeight / 3;
  let glowX = mouseX, glowY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  (function animateGlow() {
    // Lerp for a smooth, slightly lagging follow
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.transform = `translate(${glowX - 300}px, ${glowY - 300}px)`;
    requestAnimationFrame(animateGlow);
  })();
}

/* ---------- Print: a QR code back to the live site, instead of the page ---------- */
// The goal of this site is to draw people to it — not to be printed as a CV.
// So when someone prints, we hide the page and show a QR code pointing to the
// real URL (read at print time, so it always matches wherever the site is hosted).
(function () {
  const card = document.getElementById("print-card");
  if (!card || typeof qrcode === "undefined") return;

  const TAG = {
    en: "Scan to view my profile online",
    fr: "Scannez pour voir mon profil en ligne",
    de: "Scannen, um mein Profil online zu sehen",
  };

  function siteUrl() {
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && canonical.href && !canonical.href.includes("REPLACE-ME")) {
      return canonical.href;
    }
    // Fall back to the directory of the current page (works once deployed).
    return location.origin + location.pathname.replace(/[^/]*$/, "");
  }

  let built = false;
  function buildPrintCard() {
    if (built) return;
    const url = siteUrl();
    const qr = qrcode(0, "M"); // 0 = auto-size, M = ~15% error correction
    qr.addData(url, "Byte");
    qr.make();
    const svg = qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
    const pretty = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    card.innerHTML =
      `<div class="pc-qr">${svg}</div>` +
      `<div class="pc-name">Benjamin Gras</div>` +
      `<div class="pc-role">AI Engineer</div>` +
      `<div class="pc-url">${pretty}</div>` +
      `<div class="pc-tag">${TAG[lang] || TAG.en}</div>`;
    built = true;
  }

  // Chrome/Firefox fire beforeprint; Safari only updates the print media query.
  window.addEventListener("beforeprint", buildPrintCard);
  const mql = matchMedia("print");
  const onChange = (e) => { if (!e || e.matches) buildPrintCard(); };
  if (mql.addEventListener) mql.addEventListener("change", onChange);
  else if (mql.addListener) mql.addListener(onChange);
})();
