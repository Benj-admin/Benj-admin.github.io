/*
 * Quantum Eavesdropper — play Eve against BB84, then watch an AI learn the attack.
 *
 * Physics (intercept-resend model):
 *  - Alice sends each bit in a random basis (Z or X).
 *  - If Eve measures in the right basis, she learns the bit and leaves no trace.
 *  - If she measures in the wrong basis, she resends a disturbed qubit: when Alice
 *    and Bob's bases match (sifted bit), Bob reads a wrong bit 50% of the time.
 *  - Alice and Bob abort if the measured QBER exceeds ~11% (BB84 security threshold).
 */

/* ---------- i18n ---------- */
const G = {
  en: {
    intro: "Alice is sending Bob a secret key, one qubit at a time. You are Eve. Intercept qubits to steal key bits — but each wrong-basis measurement disturbs the channel, and if Alice and Bob's error rate (QBER) rises above 11%, you are exposed and the key is thrown away. Steal as much as you can without getting caught.",
    "tab.learn": "Learn", "tab.challenge": "Challenge", "tab.ai": "AI Eve",
    "learn.desc": "12 qubits, step by step, with an explanation after each choice. Ideal to understand why the 11% threshold protects the key.",
    "challenge.desc": "48 qubits, fast pace. Keys 1/2/3 to play. Your best score is saved.",
    "btn.start": "Start", "btn.next": "Next qubit →", "btn.replay": "Play again",
    "hud.qubit": "Qubit", "hud.stolen": "Bits stolen", "hud.risk": "Expected QBER",
    "act.pass": "Let it pass", "act.z": "Measure Z", "act.x": "Measure X",
    "fb.pass": "You let it pass — no disturbance, no information.",
    "fb.right": "Right basis ({b})! You know this bit for sure, and Bob will notice nothing.",
    "fb.wrong": "Wrong basis — Alice used {b}. Your measurement disturbed the qubit: if Bob picks the same basis as Alice, he gets a wrong bit 50% of the time.",
    "end.title": "Transmission over — Alice & Bob compare notes",
    "end.sifted": "Sifted key bits:", "end.qber": "Measured QBER:",
    "end.detected": "☠️ QBER above 11% — you were DETECTED. The key is discarded, score: 0.",
    "end.safe": "🎉 Undetected! Key bits stolen: {n}.",
    "end.high": "Best challenge score:",
    "ai.desc": "Now let an AI play Eve. A bandit agent (ε-greedy) plays hundreds of rounds and learns the interception rate that maximises stolen bits while staying under the detection threshold — the same trade-off you just played by hand, and the core idea of my Quantum Adversaries research project.",
    "ai.train": "Train the agent", "ai.episode": "Episode", "ai.bestp": "Learned interception rate", "ai.max": "Theoretical max rate", "ai.haul": "Haul if undetected", "ai.score": "Agent score (avg)",
    "ai.done": "Trained for {ep} rounds, then played {ev} fresh games with its frozen policy. At ≈{p}% interception it steals ≈{haul} bits when it slips through, but is caught {caught}% of the time — so its average score is {avg}.",
    "ai.cmp": "Your average over {pg} Challenge games (0 counted every time you were caught): {pavg} — {who}.",
    "ai.cmp.win": "the agent edges you out",
    "ai.cmp.lose": "you're still ahead",
    "ai.cmp.none": "Play a few Challenge rounds, then train again to compare your average with the agent's.",
    foot: "Intercept-resend attack on BB84 (Bennett & Brassard, 1984). The 11% threshold comes from the Shor–Preskill security proof. Related: my Quantum Adversaries project, presented at QCrypt 2026.",
  },
  fr: {
    intro: "Alice envoie une clé secrète à Bob, un qubit à la fois. Vous êtes Eve. Interceptez des qubits pour voler des bits de clé — mais chaque mesure dans la mauvaise base perturbe le canal, et si le taux d'erreur (QBER) d'Alice et Bob dépasse 11 %, vous êtes démasquée et la clé est jetée. Volez un maximum sans vous faire prendre.",
    "tab.learn": "Découverte", "tab.challenge": "Défi", "tab.ai": "IA Eve",
    "learn.desc": "12 qubits, pas à pas, avec une explication après chaque choix. Idéal pour comprendre pourquoi le seuil de 11 % protège la clé.",
    "challenge.desc": "48 qubits, rythme rapide. Touches 1/2/3 pour jouer. Votre meilleur score est sauvegardé.",
    "btn.start": "Commencer", "btn.next": "Qubit suivant →", "btn.replay": "Rejouer",
    "hud.qubit": "Qubit", "hud.stolen": "Bits volés", "hud.risk": "QBER attendu",
    "act.pass": "Laisser passer", "act.z": "Mesurer Z", "act.x": "Mesurer X",
    "fb.pass": "Vous laissez passer — aucune perturbation, aucune information.",
    "fb.right": "Bonne base ({b}) ! Vous connaissez ce bit avec certitude, et Bob ne verra rien.",
    "fb.wrong": "Mauvaise base — Alice utilisait {b}. Votre mesure a perturbé le qubit : si Bob choisit la même base qu'Alice, il lira un bit faux une fois sur deux.",
    "end.title": "Transmission terminée — Alice et Bob comparent leurs notes",
    "end.sifted": "Bits de clé retenus :", "end.qber": "QBER mesuré :",
    "end.detected": "☠️ QBER au-dessus de 11 % — vous êtes DÉMASQUÉE. La clé est jetée, score : 0.",
    "end.safe": "🎉 Non détectée ! Bits de clé volés : {n}.",
    "end.high": "Meilleur score en mode défi :",
    "ai.desc": "Laissez maintenant une IA jouer Eve. Un agent bandit (ε-greedy) joue des centaines de parties et apprend le taux d'interception qui maximise les bits volés tout en restant sous le seuil de détection — exactement le compromis que vous venez de jouer à la main, et l'idée centrale de mon projet de recherche Quantum Adversaries.",
    "ai.train": "Entraîner l'agent", "ai.episode": "Épisode", "ai.bestp": "Taux d'interception appris", "ai.max": "Max théorique", "ai.haul": "Butin si non détecté", "ai.score": "Score de l'agent (moy.)",
    "ai.done": "Entraîné sur {ep} parties, il en joue ensuite {ev} nouvelles avec sa politique gelée. À ≈{p} % d'interception, il vole ≈{haul} bits quand il passe, mais se fait prendre {caught} % du temps — son score moyen est donc de {avg}.",
    "ai.cmp": "Votre moyenne sur {pg} parties en mode Défi (0 compté à chaque fois que vous êtes pris) : {pavg} — {who}.",
    "ai.cmp.win": "l'agent vous devance",
    "ai.cmp.lose": "vous gardez l'avantage",
    "ai.cmp.none": "Jouez quelques parties en mode Défi, puis relancez l'entraînement pour comparer votre moyenne à celle de l'agent.",
    foot: "Attaque intercept-resend sur BB84 (Bennett & Brassard, 1984). Le seuil de 11 % vient de la preuve de sécurité de Shor–Preskill. En lien : mon projet Quantum Adversaries, présenté à QCrypt 2026.",
  },
  de: {
    intro: "Alice sendet Bob einen geheimen Schlüssel, Qubit für Qubit. Sie sind Eve. Fangen Sie Qubits ab, um Schlüsselbits zu stehlen — aber jede Messung in der falschen Basis stört den Kanal, und wenn die Fehlerrate (QBER) von Alice und Bob über 11 % steigt, sind Sie enttarnt und der Schlüssel wird verworfen. Stehlen Sie so viel wie möglich, ohne aufzufliegen.",
    "tab.learn": "Entdecken", "tab.challenge": "Herausforderung", "tab.ai": "KI-Eve",
    "learn.desc": "12 Qubits, Schritt für Schritt, mit einer Erklärung nach jeder Entscheidung. Ideal, um zu verstehen, warum die 11-%-Schwelle den Schlüssel schützt.",
    "challenge.desc": "48 Qubits, hohes Tempo. Tasten 1/2/3 zum Spielen. Ihr Bestwert wird gespeichert.",
    "btn.start": "Start", "btn.next": "Nächstes Qubit →", "btn.replay": "Nochmal spielen",
    "hud.qubit": "Qubit", "hud.stolen": "Gestohlene Bits", "hud.risk": "Erwartete QBER",
    "act.pass": "Durchlassen", "act.z": "Z messen", "act.x": "X messen",
    "fb.pass": "Sie lassen es durch — keine Störung, keine Information.",
    "fb.right": "Richtige Basis ({b})! Sie kennen dieses Bit mit Sicherheit, und Bob merkt nichts.",
    "fb.wrong": "Falsche Basis — Alice nutzte {b}. Ihre Messung hat das Qubit gestört: Wählt Bob dieselbe Basis wie Alice, liest er in 50 % der Fälle ein falsches Bit.",
    "end.title": "Übertragung beendet — Alice und Bob vergleichen ihre Notizen",
    "end.sifted": "Behaltene Schlüsselbits:", "end.qber": "Gemessene QBER:",
    "end.detected": "☠️ QBER über 11 % — Sie wurden ENTTARNT. Der Schlüssel wird verworfen, Punktzahl: 0.",
    "end.safe": "🎉 Unentdeckt! Gestohlene Schlüsselbits: {n}.",
    "end.high": "Bestwert im Herausforderungsmodus:",
    "ai.desc": "Lassen Sie nun eine KI Eve spielen. Ein Bandit-Agent (ε-greedy) spielt Hunderte von Runden und lernt die Abfangrate, die die gestohlenen Bits maximiert und dabei unter der Erkennungsschwelle bleibt — genau der Kompromiss, den Sie gerade von Hand gespielt haben, und die Kernidee meines Forschungsprojekts Quantum Adversaries.",
    "ai.train": "Agent trainieren", "ai.episode": "Episode", "ai.bestp": "Gelernte Abfangrate", "ai.max": "Theoretisches Maximum", "ai.haul": "Beute wenn unentdeckt", "ai.score": "Agentenpunktzahl (Ø)",
    "ai.done": "Nach {ep} Trainingsrunden spielt der Agent {ev} neue Partien mit seiner eingefrorenen Strategie. Bei ≈{p} % Abfangrate stiehlt er ≈{haul} Bits, wenn er durchkommt, wird aber in {caught} % der Fälle erwischt — seine Durchschnittspunktzahl liegt daher bei {avg}.",
    "ai.cmp": "Ihr Durchschnitt über {pg} Herausforderungs-Partien (0 bei jeder Enttarnung): {pavg} — {who}.",
    "ai.cmp.win": "der Agent liegt vorn",
    "ai.cmp.lose": "Sie liegen weiterhin vorn",
    "ai.cmp.none": "Spielen Sie ein paar Herausforderungs-Partien und trainieren Sie dann erneut, um Ihren Durchschnitt mit dem des Agenten zu vergleichen.",
    foot: "Intercept-Resend-Angriff auf BB84 (Bennett & Brassard, 1984). Die 11-%-Schwelle stammt aus dem Sicherheitsbeweis von Shor–Preskill. Verwandt: mein Projekt Quantum Adversaries, vorgestellt auf der QCrypt 2026.",
  },
};

// LANGS and `lang` live in common.js (shared with the main page).
const $ = (id) => document.getElementById(id);
const gt = (key, vars = {}) => {
  let s = (G[lang] && G[lang][key]) || G.en[key] || key;
  Object.entries(vars).forEach(([k, v]) => (s = s.replace("{" + k + "}", v)));
  return s;
};

function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll("#lang-switch button").forEach((b) => {
    b.classList.toggle("active", b.dataset.lang === lang);
  });
  document.querySelectorAll("[data-g]").forEach((el) => (el.textContent = gt(el.dataset.g)));
  $("mode-desc").textContent = gt(mode === "learn" ? "learn.desc" : "challenge.desc");
}

document.querySelectorAll("#lang-switch button").forEach((b) => {
  b.addEventListener("click", () => {
    lang = b.dataset.lang;
    localStorage.setItem("lang", lang);
    applyLang();
  });
});

/* ---------- BB84 simulation ---------- */
const THRESHOLD = 0.11;
const coin = () => Math.random() < 0.5;

// One qubit round. eveAction: "pass" | "Z" | "X". Returns full outcome.
function playQubit(eveAction) {
  const aliceBit = coin() ? 1 : 0;
  const aliceBasis = coin() ? "Z" : "X";
  const bobBasis = coin() ? "Z" : "X";

  let disturbed = false;
  let eveKnows = false;
  if (eveAction !== "pass") {
    if (eveAction === aliceBasis) {
      eveKnows = true; // right basis: perfect clone of this bit, no trace
    } else {
      disturbed = true; // wrong basis: resent state randomised in Eve's basis
    }
  }

  const sifted = aliceBasis === bobBasis;
  // Bob's bit is wrong only on sifted, disturbed qubits, with probability 1/2.
  const error = sifted && disturbed && coin();
  return { aliceBit, aliceBasis, sifted, error, eveKnows, intercepted: eveAction !== "pass" };
}

/* ---------- Game state ---------- */
let mode = "learn"; // learn | challenge
let rounds = [];
let total = 12;
let idx = 0;
let awaitingNext = false;

const highScore = () => parseInt(localStorage.getItem("qe-highscore") || "0", 10);
const playerGames = () => parseInt(localStorage.getItem("qe-games") || "0", 10);
const playerAvg = () => {
  const g = playerGames();
  return g ? parseFloat(localStorage.getItem("qe-sum") || "0") / g : 0;
};

function switchTab(tab) {
  document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  const isAI = tab === "ai";
  $("panel-play").hidden = isAI;
  $("panel-ai").hidden = !isAI;
  if (!isAI) {
    mode = tab;
    resetPlay();
  }
}
document.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => switchTab(b.dataset.tab)));

function resetPlay() {
  rounds = [];
  idx = 0;
  awaitingNext = false;
  total = mode === "learn" ? 12 : 48;
  $("play-start").hidden = false;
  $("play-area").hidden = true;
  $("play-end").hidden = true;
  $("mode-desc").textContent = gt(mode === "learn" ? "learn.desc" : "challenge.desc");
}

$("btn-start").addEventListener("click", () => {
  $("play-start").hidden = true;
  $("play-area").hidden = false;
  updateHud();
  pulseQubit();
});

function updateHud() {
  $("hud-count").textContent = `${Math.min(idx + 1, total)}/${total}`;
  $("hud-stolen").textContent = rounds.filter((r) => r.sifted && r.eveKnows).length;
  const f = idx ? rounds.filter((r) => r.intercepted).length / idx : 0;
  const expQber = 0.25 * f; // half of interceptions are wrong-basis; half of those flip the bit
  $("hud-risk").textContent = (expQber * 100).toFixed(0) + "%";
  $("risk-fill").style.width = Math.min(100, (expQber / 0.25) * 100) + "%";
  $("risk-fill").classList.toggle("danger", expQber > THRESHOLD);
}

function pulseQubit() {
  const q = $("qubit");
  q.classList.remove("pulse");
  void q.offsetWidth; // restart the CSS animation
  q.classList.add("pulse");
}

function act(action) {
  if (awaitingNext || idx >= total || $("play-area").hidden) return;
  const r = playQubit(action);
  rounds.push(r);
  idx++;
  updateHud();

  if (mode === "learn") {
    const fb = $("feedback");
    if (action === "pass") fb.textContent = gt("fb.pass");
    else if (r.eveKnows) fb.textContent = gt("fb.right", { b: r.aliceBasis });
    else fb.textContent = gt("fb.wrong", { b: r.aliceBasis });
    awaitingNext = true;
    $("btn-next").hidden = false;
  } else {
    nextOrEnd();
  }
}

$("btn-next").addEventListener("click", () => {
  awaitingNext = false;
  $("btn-next").hidden = true;
  $("feedback").textContent = "";
  nextOrEnd();
});

function nextOrEnd() {
  if (idx >= total) return endGame();
  pulseQubit();
}

function endGame() {
  const sifted = rounds.filter((r) => r.sifted);
  const errors = sifted.filter((r) => r.error).length;
  const qber = sifted.length ? errors / sifted.length : 0;
  const stolen = sifted.filter((r) => r.eveKnows).length;
  const detected = qber > THRESHOLD;

  $("play-area").hidden = true;
  $("play-end").hidden = false;
  $("end-sifted").textContent = sifted.length;
  $("end-qber").textContent = (qber * 100).toFixed(1) + "%";
  const v = $("verdict");
  v.textContent = detected ? gt("end.detected") : gt("end.safe", { n: stolen });
  v.classList.toggle("bad", detected);

  if (mode === "challenge") {
    // Running average across every Challenge game (0 counted when detected).
    const s = detected ? 0 : stolen;
    localStorage.setItem("qe-games", String(playerGames() + 1));
    localStorage.setItem("qe-sum", String(parseFloat(localStorage.getItem("qe-sum") || "0") + s));
    if (!detected && stolen > highScore()) localStorage.setItem("qe-highscore", String(stolen));
  }
  $("end-high").textContent = highScore();
}

$("btn-replay").addEventListener("click", resetPlay);

$("act-pass").addEventListener("click", () => act("pass"));
$("act-z").addEventListener("click", () => act("Z"));
$("act-x").addEventListener("click", () => act("X"));
window.addEventListener("keydown", (e) => {
  if (e.key === "1") act("pass");
  if (e.key === "2") act("Z");
  if (e.key === "3") act("X");
});

/* ---------- AI Eve: ε-greedy bandit over interception rates ---------- */
const ARMS = Array.from({ length: 21 }, (_, i) => i / 20); // 0%, 5%, …, 100%
const N_QUBITS = 48;
const EPISODES = 900; // training rounds
const EVAL_GAMES = 400; // evaluation games played after training with the frozen policy

function playEpisode(p) {
  const rs = [];
  for (let i = 0; i < N_QUBITS; i++) {
    const action = Math.random() < p ? (coin() ? "Z" : "X") : "pass";
    rs.push(playQubit(action));
  }
  const sifted = rs.filter((r) => r.sifted);
  const errors = sifted.filter((r) => r.error).length;
  const qber = sifted.length ? errors / sifted.length : 0;
  const haul = sifted.filter((r) => r.eveKnows).length;
  const caught = qber > THRESHOLD;
  return { reward: caught ? 0 : haul, haul, caught };
}

$("btn-train").addEventListener("click", () => {
  $("btn-train").disabled = true;
  $("ai-area").hidden = false;
  $("ai-result").textContent = "";

  const counts = new Array(ARMS.length).fill(0);
  const means = new Array(ARMS.length).fill(0);
  const haulSum = new Array(ARMS.length).fill(0); // stolen bits on undetected runs
  const haulN = new Array(ARMS.length).fill(0); // number of undetected runs
  const history = [];
  let ep = 0;

  const canvas = $("ai-curve");
  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = 140 * devicePixelRatio;
  const ctx = canvas.getContext("2d");
  ctx.scale(devicePixelRatio, devicePixelRatio);
  const W = canvas.clientWidth, H = 140;

  function drawCurve() {
    ctx.clearRect(0, 0, W, H);
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
    const line = getComputedStyle(document.documentElement).getPropertyValue("--line").trim();
    ctx.strokeStyle = line;
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
    if (history.length < 2) return;
    // rolling mean, window 25
    const win = 25;
    const pts = history.map((_, i) => {
      const s = history.slice(Math.max(0, i - win + 1), i + 1);
      return s.reduce((a, b) => a + b, 0) / s.length;
    });
    const maxY = Math.max(6, ...pts);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    pts.forEach((y, i) => {
      const px = (i / (EPISODES - 1)) * (W - 10) + 5;
      const py = H - 8 - (y / maxY) * (H - 20);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    });
    ctx.stroke();
  }

  function step() {
    for (let k = 0; k < 8 && ep < EPISODES; k++, ep++) {
      // ε-greedy with decaying exploration
      const eps = Math.max(0.08, 1 - ep / 400);
      let arm;
      if (Math.random() < eps || ep < ARMS.length) arm = ep < ARMS.length ? ep : Math.floor(Math.random() * ARMS.length);
      else arm = means.indexOf(Math.max(...means));
      const res = playEpisode(ARMS[arm]);
      counts[arm]++;
      means[arm] += (res.reward - means[arm]) / counts[arm];
      if (!res.caught) { haulN[arm]++; haulSum[arm] += res.haul; }
      history.push(res.reward);
    }

    const best = means.indexOf(Math.max(...means));
    $("ai-episode").textContent = ep;
    $("ai-bestp").textContent = (ARMS[best] * 100).toFixed(0) + "%";
    $("ai-max").textContent = Math.round((THRESHOLD / 0.25) * 100) + "%";
    $("ai-haul").textContent = haulN[best] ? (haulSum[best] / haulN[best]).toFixed(2) : "–";
    $("ai-score").textContent = means[best].toFixed(2);
    drawCurve();

    if (ep < EPISODES) requestAnimationFrame(step);
    else evaluate(best);
  }

  // After training: play EVAL_GAMES with the frozen best policy for a clean score.
  function evaluate(best) {
    let scoreSum = 0, haulSum2 = 0, undetected = 0;
    for (let i = 0; i < EVAL_GAMES; i++) {
      const r = playEpisode(ARMS[best]);
      scoreSum += r.reward;
      if (!r.caught) { undetected++; haulSum2 += r.haul; }
    }
    const avg = scoreSum / EVAL_GAMES;
    const haul = undetected ? haulSum2 / undetected : 0;
    const caughtPct = Math.round((1 - undetected / EVAL_GAMES) * 100);

    $("ai-haul").textContent = haul.toFixed(2);
    $("ai-score").textContent = avg.toFixed(2);

    let txt = gt("ai.done", {
      ep: EPISODES,
      ev: EVAL_GAMES,
      p: (ARMS[best] * 100).toFixed(0),
      haul: haul.toFixed(2),
      caught: caughtPct,
      avg: avg.toFixed(2),
    });
    if (playerGames() > 0) {
      const pavg = playerAvg();
      const who = gt(avg > pavg ? "ai.cmp.win" : "ai.cmp.lose");
      txt += " " + gt("ai.cmp", { pg: playerGames(), pavg: pavg.toFixed(2), who });
    } else {
      txt += " " + gt("ai.cmp.none");
    }
    $("ai-result").textContent = txt;
    $("btn-train").disabled = false;
  }

  requestAnimationFrame(step);
});

/* ---------- Init ---------- */
applyLang();
resetPlay();
