/*
 * AI Lab — in-browser semantic search over the profile.
 * Loads a sentence-embedding model with transformers.js,
 * embeds the corpus below, and ranks passages by cosine similarity
 * against the visitor's question. Everything runs client-side.
 */

const CORPUS = [
  {
    tag: "Experience · AMIAD",
    text: "I am currently a research intern at AMIAD, working on the evaluation of Retrieval-Augmented Generation (RAG) systems.",
  },
  {
    tag: "Education · Imperial College London",
    text: "I am studying for an MSc in Artificial Intelligence Applications and Innovation at Imperial College London.",
  },
  {
    tag: "Education · École Polytechnique",
    text: "I graduated from École Polytechnique, a top French engineering school, with a curriculum focused on data, AI and networks.",
  },
  {
    tag: "Experience · Thales SIX",
    text: "At Thales SIX, I worked as a research intern designing resource allocation algorithms for LEO satellite constellations.",
  },
  {
    tag: "Experience · CEA",
    text: "At CEA, I was a project manager intern on an industrial project, from design phase to realization.",
  },
  {
    tag: "Experience · French Army",
    text: "I served as a section leader in the French Army, organizing and supervising the training of 36 officers.",
  },
  {
    tag: "Experience · Storengy, ENGIE",
    text: "At Storengy (ENGIE) in Berlin, I worked in business development and performed financial valuations.",
  },
  {
    tag: "Experience · Commando Training Center",
    text: "I trained as a junior officer at the French National Commando Training Center and obtained commando instructor and military skier qualifications.",
  },
  {
    tag: "Education · Louis-le-Grand",
    text: "I studied in classe préparatoire MPSI/MP* at Lycée Louis-le-Grand, an intensive mathematics, physics and computer science program.",
  },
  {
    tag: "Education · Janson-de-Sailly",
    text: "I hold the ABIBAC, a French-German double high-school diploma, from Lycée Janson-de-Sailly.",
  },
  {
    tag: "Project · Quantum Adversaries",
    text: "In the Quantum Adversaries research project at Imperial College London, we studied the security of Quantum Key Distribution: machine-learned eavesdropping attacks on the E91 protocol, minimalist attack circuits found by an evolutionary-SPSA optimiser, and a reinforcement learning agent adapting to dynamic noise. We presented it as a poster at QCrypt 2026.",
  },
  {
    tag: "Project · Autonomous Robot",
    text: "For a robotics group project at Imperial College London, we built an autonomous driving robot: lane following with HSV vision, traffic sign detection with YOLOv4-tiny, and visual-servo parking, all on ROS.",
  },
  {
    tag: "Project · Quantum Eavesdropper",
    text: "I built Quantum Eavesdropper, a browser mini-game where you play Eve attacking the BB84 quantum key distribution protocol, and where a bandit agent then learns the optimal interception attack live. You can play it on this website.",
  },
  {
    tag: "Project · PSC",
    text: "For my team research project (PSC) at École Polytechnique, I worked on the interpretability and security of transformer models: detecting backdoors, with experiments on MNIST classifiers and GPT-style models. The code is on my GitHub.",
  },
  {
    tag: "Contact",
    text: "You can contact me by email at benjamin.gras@polytechnique.edu, or find me on GitHub and LinkedIn.",
  },
  {
    tag: "This website",
    text: "I hand-built this website as a trilingual static site; this demo runs a sentence-embedding model entirely in your browser, so your questions never leave your machine.",
  },
];

// Multilingual model: FR/EN/DE… queries match the English corpus cross-lingually.
const MODEL_ID = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";
const TOP_K = 3;

let extractor = null;
let corpusIndex = null; // per chunk: { pooled, toks } (all L2-normalized)
let scoreMode = "cos"; // "cos" (pooled) | "maxsim" (late interaction)
let lastRanked = null;

const $ = (id) => document.getElementById(id);

/* ---------- Embedding helpers ---------- */
function l2norm(v) {
  let n = 0;
  for (let i = 0; i < v.length; i++) n += v[i] * v[i];
  n = Math.sqrt(n) || 1;
  const out = new Float32Array(v.length);
  for (let i = 0; i < v.length; i++) out[i] = v[i] / n;
  return out;
}

// One forward pass without pooling → normalized token embeddings + pooled vector.
async function embed(text) {
  const out = await extractor(text, { pooling: "none" });
  const dim = out.dims[out.dims.length - 1];
  const seq = out.dims[out.dims.length - 2];
  const toks = [];
  const mean = new Float32Array(dim);
  for (let i = 0; i < seq; i++) {
    const v = out.data.slice(i * dim, (i + 1) * dim);
    for (let d = 0; d < dim; d++) mean[d] += v[d] / seq;
    toks.push(l2norm(v));
  }
  return { pooled: l2norm(mean), toks };
}

// Late interaction: for each query token, best match among chunk tokens; average.
function maxSim(qToks, dToks) {
  let sum = 0;
  for (const q of qToks) {
    let best = -1;
    for (const d of dToks) {
      let s = 0;
      for (let i = 0; i < q.length; i++) s += q[i] * d[i];
      if (s > best) best = s;
    }
    sum += best;
  }
  return sum / qToks.length;
}

/* ---------- Model loading ---------- */
$("lab-load").addEventListener("click", async () => {
  $("lab-start").hidden = true;
  $("lab-progress").hidden = false;
  const fill = $("lab-progress-fill");
  const txt = $("lab-progress-text");
  txt.textContent = t({ en: "Downloading model…", fr: "Téléchargement du modèle…", de: "Modell wird heruntergeladen…" });

  try {
    const { pipeline } = await import(
      "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2"
    );

    extractor = await pipeline("feature-extraction", MODEL_ID, {
      progress_callback: (p) => {
        if (p.status === "progress" && p.file && p.file.endsWith(".onnx")) {
          const pct = Math.round(p.progress);
          fill.style.width = pct + "%";
          txt.textContent =
            t({ en: "Downloading model… ", fr: "Téléchargement du modèle… ", de: "Modell wird heruntergeladen… " }) + pct + "%";
        }
      },
    });

    fill.style.width = "100%";
    txt.textContent = t({ en: "Indexing profile…", fr: "Indexation du profil…", de: "Profil wird indexiert…" });
    corpusIndex = [];
    for (const c of CORPUS) corpusIndex.push(await embed(c.text));

    $("lab-progress").hidden = true;
    $("lab-ui").hidden = false;
  } catch (err) {
    console.error(err);
    txt.textContent = t({
      en: "Could not load the model (network issue?). Please try again later.",
      fr: "Impossible de charger le modèle (problème réseau ?). Réessayez plus tard.",
      de: "Modell konnte nicht geladen werden (Netzwerkproblem?). Bitte später erneut versuchen.",
    });
    fill.style.width = "0%";
  }
});

/* ---------- Search ---------- */
function dot(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

function setStep(n) {
  document.querySelectorAll(".pstep").forEach((el, i) => {
    el.classList.toggle("active", i < n);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runSearch(query) {
  query = query.trim();
  if (!query || !extractor) return;

  $("lab-results").innerHTML = "";
  setStep(0);
  await sleep(80);
  setStep(1);

  const q = await embed(query);

  await sleep(250);
  setStep(2);

  // Both scoring strategies, side by side (vectors are normalized: dot = cosine).
  lastRanked = CORPUS.map((c, i) => ({
    ...c,
    cos: dot(q.pooled, corpusIndex[i].pooled),
    maxsim: maxSim(q.toks, corpusIndex[i].toks),
  }));

  await sleep(250);
  setStep(3);
  renderResults();
}

function renderResults() {
  if (!lastRanked) return;
  const ranked = [...lastRanked]
    .sort((a, b) => b[scoreMode] - a[scoreMode])
    .slice(0, TOP_K);

  $("lab-results").innerHTML = ranked
    .map(
      (r, i) => `
      <div class="lab-result" style="--delay:${i * 0.12}s">
        <div class="lab-result-head">
          <span class="lab-result-tag">${r.tag}</span>
          <span class="lab-result-score">
            <b class="${scoreMode === "cos" ? "score-on" : ""}">cos&nbsp;${r.cos.toFixed(3)}</b>
            &nbsp;·&nbsp;
            <b class="${scoreMode === "maxsim" ? "score-on" : ""}">MaxSim&nbsp;${r.maxsim.toFixed(3)}</b>
          </span>
        </div>
        <p>${r.text}</p>
        <div class="score-bar"><div class="score-fill" style="width:${Math.max(0, r[scoreMode] * 100).toFixed(1)}%"></div></div>
      </div>`
    )
    .join("");
}

document.querySelectorAll(".score-mode").forEach((b) => {
  b.addEventListener("click", () => {
    scoreMode = b.dataset.mode;
    document.querySelectorAll(".score-mode").forEach((x) => x.classList.toggle("active", x === b));
    renderResults();
  });
});

$("lab-form").addEventListener("submit", (e) => {
  e.preventDefault();
  runSearch($("lab-input").value);
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    $("lab-input").value = chip.textContent;
    runSearch(chip.textContent);
  });
});
