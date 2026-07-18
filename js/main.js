/* ---------- Language ---------- */
// LANGS and `lang` live in common.js (shared with the game page).
function t(obj) {
  return typeof obj === "string" ? obj : obj[lang] || obj.en;
}

function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll("#lang-switch button").forEach((b) => {
    b.classList.toggle("active", b.dataset.lang === lang);
  });
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (UI_STRINGS[lang][key]) el.textContent = UI_STRINGS[lang][key];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    const key = el.dataset.i18nPh;
    if (UI_STRINGS[lang][key]) el.placeholder = UI_STRINGS[lang][key];
  });
  renderContent();
}

document.querySelectorAll("#lang-switch button").forEach((b) => {
  b.addEventListener("click", () => {
    lang = b.dataset.lang;
    localStorage.setItem("lang", lang);
    applyLang();
  });
});

/* ---------- Content rendering ---------- */
function orgHtml(e) {
  return e.url
    ? `<a class="ti-org" href="${e.url}" target="_blank" rel="noopener">${e.org}</a>`
    : `<span class="ti-org">${e.org}</span>`;
}

function renderContent() {
  const exp = document.getElementById("experience-list");
  exp.innerHTML = EXPERIENCE.map(
    (e) => `
    <div class="timeline-item reveal">
      <div class="ti-meta">
        ${orgHtml(e)}
        <span class="ti-date">${t(e.date)}</span>
      </div>
      <div class="ti-role">${t(e.role)}</div>
    </div>`
  ).join("");

  const edu = document.getElementById("education-list");
  edu.innerHTML = EDUCATION.map(
    (e) => `
    <div class="card reveal">
      <div class="ti-meta">
        ${orgHtml(e)}
        <span class="ti-date">${t(e.date)}</span>
      </div>
      <div class="ti-desc">${t(e.degree)}</div>
    </div>`
  ).join("");

  const proj = document.getElementById("projects-list");
  proj.innerHTML = PROJECTS.map((p) => {
    const card = `
    <div class="card reveal">
      <div class="ti-meta">
        <span class="ti-org">${t(p.name)}</span>
        <span class="ti-date">${t(p.date)}</span>
      </div>
      <div class="ti-desc">${t(p.desc)}</div>
      <div class="proj-foot">
        <div class="tags">${p.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
        ${p.link ? `<a class="proj-link" href="${p.link}"${p.link.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${p.linkText ? t(p.linkText) : UI_STRINGS[lang]["proj.view"] + " →"}</a>` : ""}
      </div>
    </div>`;
    if (!p.carAnim) return card;
    return `
    <div class="card-carwrap">
      ${card}
      <div class="car-track" aria-hidden="true">
        <svg class="car" viewBox="0 0 44 22" width="34" height="17">
          <rect class="car-body" x="1" y="3" width="42" height="16" rx="6"/>
          <rect class="car-window" x="6" y="6" width="9" height="10" rx="2.5"/>
          <rect class="car-window" x="26" y="6" width="11" height="10" rx="2.5"/>
          <circle class="car-light" cx="41.5" cy="7" r="1.4"/>
          <circle class="car-light" cx="41.5" cy="15" r="1.4"/>
        </svg>
        <div class="tlight green"><span class="tlight-dot"></span></div>
        <div class="crosswalk"></div>
        <div class="ped" hidden></div>
      </div>
    </div>`;
  }).join("");

  observeReveals();
  initCarAnimation();
}

/* ---------- Car animation around the robotics card ---------- */
let carState = null;

const PED_SKINS = ["🚶", "🚶‍♀️", "🏃", "🧓", "👩‍🎓", "🐕", "🛹"];

function initCarAnimation() {
  // Tear down any previous instance (renderContent re-creates the DOM).
  if (carState) {
    cancelAnimationFrame(carState.raf);
    clearTimeout(carState.timerLight);
    clearTimeout(carState.timerPed);
    carState.ro.disconnect();
    carState = null;
  }

  const track = document.querySelector(".car-track");
  if (!track) return;
  const car = track.querySelector(".car");
  const light = track.querySelector(".tlight");
  const crosswalk = track.querySelector(".crosswalk");
  const ped = track.querySelector(".ped");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    track.style.display = "none";
    return;
  }

  const INSET = 16;
  const BAND = 32; // wrapper padding = road band height
  let perim = 1, lightLine = 0, crossLine = 0, crossX = 0, trackH = 0;

  function layout() {
    const w = track.clientWidth, h = track.clientHeight;
    if (w < 60 || h < 60) return;
    trackH = h;
    const x0 = INSET, y0 = INSET, x1 = w - INSET, y1 = h - INSET;
    car.style.offsetPath = `path("M ${x0} ${y0} H ${x1} V ${y1} H ${x0} Z")`;
    const topLen = x1 - x0, sideLen = y1 - y0;
    perim = 2 * (topLen + sideLen);
    // Stop line 1: just before the top-right corner (traffic light).
    lightLine = ((topLen - 8) / perim) * 100;
    light.style.left = x1 + "px";
    light.style.top = y0 + "px";
    // Crosswalk: middle of the bottom edge; the car drives right→left there.
    crossX = (x0 + x1) / 2;
    crosswalk.style.left = crossX - 14 + "px";
    crosswalk.style.top = h - BAND + "px";
    // Stop line 2: a car-length before the stripes.
    crossLine = ((topLen + sideLen + (x1 - (crossX + 36))) / perim) * 100;
  }

  const ro = new ResizeObserver(layout);
  ro.observe(track);
  layout();

  const state = {
    raf: 0, timerLight: 0, timerPed: 0, ro,
    dist: 0, waitingAt: null, light: "green", pedActive: false, speed: 0.16,
  };
  carState = state;

  /* Traffic light cycle */
  function setLight(s) {
    state.light = s;
    light.classList.toggle("red", s === "red");
    light.classList.toggle("green", s === "green");
  }
  (function lightCycle() {
    setLight("green");
    state.timerLight = setTimeout(() => {
      setLight("red");
      state.timerLight = setTimeout(lightCycle, 2800);
    }, 4500);
  })();

  /* Pedestrians: random skin, random direction, random schedule */
  function schedulePed() {
    state.timerPed = setTimeout(startCrossing, 1000 + Math.random() * 8000);
  }
  function startCrossing() {
    const goingUp = Math.random() < 0.5; // up = from outside toward (under) the card
    ped.textContent = PED_SKINS[Math.floor(Math.random() * PED_SKINS.length)];
    ped.style.left = crossX - 9 + (Math.random() * 8 - 4) + "px";
    ped.style.transition = "none";
    ped.style.top = (goingUp ? trackH - 6 : trackH - BAND - 12) + "px";
    ped.hidden = false;
    state.pedActive = true;
    void ped.offsetWidth; // flush so the transition starts from the initial position
    ped.style.transition = "top 2.6s linear";
    ped.style.top = (goingUp ? trackH - BAND - 12 : trackH - 6) + "px";
    state.timerPed = setTimeout(() => {
      ped.hidden = true;
      state.pedActive = false;
      schedulePed();
    }, 2700);
  }
  schedulePed();

  /* Car: one loop, two stop lines */
  const stops = [
    { line: () => lightLine, blocked: () => state.light === "red" },
    { line: () => crossLine, blocked: () => state.pedActive },
  ];

  function frame() {
    if (state.waitingAt && !state.waitingAt.blocked()) state.waitingAt = null;
    if (!state.waitingAt) {
      const next = state.dist + state.speed;
      for (const s of stops) {
        if (s.blocked() && state.dist <= s.line() && next >= s.line()) {
          state.dist = s.line();
          state.waitingAt = s;
          break;
        }
      }
      if (!state.waitingAt) state.dist = next % 100;
    }
    car.style.offsetDistance = state.dist.toFixed(2) + "%";
    state.raf = requestAnimationFrame(frame);
  }
  state.raf = requestAnimationFrame(frame);
}

/* ---------- Reveal on scroll ---------- */
let observer;

function observeReveals() {
  if (observer) observer.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  // Stagger siblings that appear together
  const groups = new Map();
  document.querySelectorAll(".reveal:not(.visible)").forEach((el) => {
    const parent = el.parentElement;
    const idx = groups.get(parent) || 0;
    el.style.setProperty("--delay", `${Math.min(idx * 0.09, 0.45)}s`);
    groups.set(parent, idx + 1);
    observer.observe(el);
  });
}

/* ---------- Init ---------- */
applyLang();
