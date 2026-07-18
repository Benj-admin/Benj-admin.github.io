/*
 * All site content lives here, in three languages (en / fr / de).
 * To edit the site, you almost never need to touch the HTML:
 * just edit this file.
 */

const UI_STRINGS = {
  en: {
    "nav.experience": "Experience",
    "nav.education": "Education",
    "nav.projects": "Projects",
    "nav.lab": "AI Lab",
    "nav.game": "Game",
    "nav.contact": "Contact",
    "hero.kicker": "Paris · London",
    "hero.sub":
      "MSc Artificial Intelligence student at Imperial College London, École Polytechnique graduate.",
    "hero.cta1": "Get in touch",
    "sec.experience": "Experience",
    "sec.education": "Education",
    "sec.projects": "Projects",
    "sec.lab": "AI Lab",
    "sec.contact": "Contact",
    "proj.view": "View on GitHub",
    "lab.intro":
      "Ask my profile a question in natural language. A sentence-embedding model runs entirely in your browser, ranks every passage of this site by cosine similarity, and shows you the retrieval step of a RAG pipeline — live.",
    "lab.load": "Launch the demo (~100 MB model, cached)",
    "lab.note": "Runs 100% locally — your questions never leave your machine.",
    "lab.step1": "1 · Embed question",
    "lab.step2": "2 · Similarity scoring",
    "lab.step3": "3 · Top passages",
    "lab.mode": "Retrieval strategy:",
    "lab.mode.cos": "Pooled cosine",
    "lab.mode.maxsim": "Late interaction (MaxSim)",
    "lab.placeholder": "Ask about my profile, in English, French or German…",
    "lab.ask": "Search",
    "game.title": "Quantum Eavesdropper",
    "game.tag": "You are Eve. Steal a quantum key without getting caught — then watch an AI learn the optimal attack and beat you. A playable spin-off of my Quantum Adversaries research.",
    "game.play": "Play",
    "contact.text": "Feel free to reach out.",
    "contact.wip": "Under construction",
  },
  fr: {
    "nav.experience": "Expérience",
    "nav.education": "Formation",
    "nav.projects": "Projets",
    "nav.lab": "AI Lab",
    "nav.game": "Jeu",
    "nav.contact": "Contact",
    "hero.kicker": "Paris · Londres",
    "hero.sub":
      "Étudiant en MSc Artificial Intelligence à Imperial College London, diplômé de l'École Polytechnique.",
    "hero.cta1": "Me contacter",
    "sec.experience": "Expérience",
    "sec.education": "Formation",
    "sec.projects": "Projets",
    "sec.lab": "AI Lab",
    "sec.contact": "Contact",
    "proj.view": "Voir sur GitHub",
    "lab.intro":
      "Posez une question sur mon profil en langage naturel. Un modèle d'embeddings tourne entièrement dans votre navigateur, classe chaque passage de ce site par similarité cosinus, et vous montre l'étape de retrieval d'un pipeline RAG — en direct.",
    "lab.load": "Lancer la démo (modèle de ~100 Mo, mis en cache)",
    "lab.note": "Tourne 100 % en local — vos questions ne quittent jamais votre machine.",
    "lab.step1": "1 · Vectorisation de la question",
    "lab.step2": "2 · Calcul de similarité",
    "lab.step3": "3 · Meilleurs passages",
    "lab.mode": "Stratégie de retrieval :",
    "lab.mode.cos": "Cosinus poolé",
    "lab.mode.maxsim": "Late interaction (MaxSim)",
    "lab.placeholder": "Une question sur mon profil, en français, anglais ou allemand…",
    "lab.ask": "Chercher",
    "game.title": "Quantum Eavesdropper",
    "game.tag": "Vous êtes Eve. Volez une clé quantique sans vous faire prendre — puis regardez une IA apprendre l'attaque optimale et vous battre. Un spin-off jouable de ma recherche Quantum Adversaries.",
    "game.play": "Jouer",
    "contact.text": "N'hésitez pas à me contacter.",
    "contact.wip": "En travaux",
  },
  de: {
    "nav.experience": "Erfahrung",
    "nav.education": "Ausbildung",
    "nav.projects": "Projekte",
    "nav.lab": "AI Lab",
    "nav.game": "Spiel",
    "nav.contact": "Kontakt",
    "hero.kicker": "Paris · London",
    "hero.sub":
      "Masterstudent (MSc Artificial Intelligence) am Imperial College London, Absolvent der École Polytechnique.",
    "hero.cta1": "Kontakt aufnehmen",
    "sec.experience": "Erfahrung",
    "sec.education": "Ausbildung",
    "sec.projects": "Projekte",
    "sec.lab": "AI Lab",
    "sec.contact": "Kontakt",
    "proj.view": "Auf GitHub ansehen",
    "lab.intro":
      "Stellen Sie meinem Profil eine Frage in natürlicher Sprache. Ein Embedding-Modell läuft vollständig in Ihrem Browser, ordnet jeden Abschnitt dieser Seite nach Kosinus-Ähnlichkeit und zeigt Ihnen live den Retrieval-Schritt einer RAG-Pipeline.",
    "lab.load": "Demo starten (~100 MB Modell, wird zwischengespeichert)",
    "lab.note": "Läuft zu 100 % lokal — Ihre Fragen verlassen niemals Ihren Rechner.",
    "lab.step1": "1 · Frage einbetten",
    "lab.step2": "2 · Ähnlichkeitsbewertung",
    "lab.step3": "3 · Beste Passagen",
    "lab.mode": "Retrieval-Strategie:",
    "lab.mode.cos": "Gepoolter Kosinus",
    "lab.mode.maxsim": "Late Interaction (MaxSim)",
    "lab.placeholder": "Eine Frage zu meinem Profil, auf Deutsch, Englisch oder Französisch…",
    "lab.ask": "Suchen",
    "game.title": "Quantum Eavesdropper",
    "game.tag": "Sie sind Eve. Stehlen Sie einen Quantenschlüssel, ohne aufzufliegen — und sehen Sie dann zu, wie eine KI den optimalen Angriff lernt und Sie schlägt. Ein spielbarer Ableger meiner Forschung zu Quantum Adversaries.",
    "game.play": "Spielen",
    "contact.text": "Melden Sie sich gerne.",
    "contact.wip": "Im Bau",
  },
};

const EXPERIENCE = [
  {
    org: "AMIAD",
    url: "https://www.linkedin.com/company/amiad-minarm/posts/?feedView=all",
    date: { en: "2026 – present", fr: "2026 – aujourd'hui", de: "2026 – heute" },
    role: {
      en: "Research Intern",
      fr: "Stagiaire de recherche",
      de: "Forschungspraktikant",
    },
  },
  {
    org: "CEA",
    url: "https://www.cea.fr",
    date: { en: "Sep 2024 – Mar 2025", fr: "Sept. 2024 – Mars 2025", de: "Sept. 2024 – März 2025" },
    role: {
      en: "Project Manager Intern",
      fr: "Stagiaire chef de projet",
      de: "Praktikant Projektleitung",
    },
  },
  {
    org: "Thales SIX",
    url: "https://www.thalesgroup.com",
    date: { en: "Apr 2024 – Aug 2024", fr: "Avr. 2024 – Août 2024", de: "Apr. 2024 – Aug. 2024" },
    role: {
      en: "Research Intern",
      fr: "Stagiaire de recherche",
      de: "Forschungspraktikant",
    },
  },
  {
    org: "École Polytechnique",
    url: "https://www.polytechnique.edu",
    date: { en: "Aug 2023 – Sep 2023", fr: "Août 2023 – Sept. 2023", de: "Aug. 2023 – Sept. 2023" },
    role: {
      en: "Section Leader, French Army",
      fr: "Chef de section, Armée française",
      de: "Zugführer, französische Armee",
    },
  },
  {
    org: "Storengy, ENGIE",
    url: "https://www.storengy.com",
    date: { en: "Jun 2023 – Aug 2023", fr: "Juin 2023 – Août 2023", de: "Juni 2023 – Aug. 2023" },
    role: {
      en: "Business Development Intern",
      fr: "Stagiaire en Business Development",
      de: "Praktikant Business Development",
    },
  },
  {
    org: "Centre National d'Entraînement Commando",
    url: "https://fr.wikipedia.org/wiki/Centre_national_d%27entra%C3%AEnement_commando",
    date: { en: "Dec 2021 – Apr 2022", fr: "Déc. 2021 – Avr. 2022", de: "Dez. 2021 – Apr. 2022" },
    role: {
      en: "Junior Officer, French Army",
      fr: "Aspirant officier, Armée française",
      de: "Offizieranwärter, französische Armee",
    },
  },
];

const EDUCATION = [
  {
    org: "Imperial College London",
    url: "https://www.imperial.ac.uk",
    date: { en: "2025 – present", fr: "2025 – aujourd'hui", de: "2025 – heute" },
    degree: {
      en: "MSc Artificial Intelligence Applications and Innovation",
      fr: "MSc Artificial Intelligence Applications and Innovation",
      de: "MSc Artificial Intelligence Applications and Innovation",
    },
  },
  {
    org: "École Polytechnique",
    url: "https://www.polytechnique.edu",
    date: { en: "2021 – 2025", fr: "2021 – 2025", de: "2021 – 2025" },
    degree: { en: "Engineering degree", fr: "Cycle ingénieur", de: "Ingenieurstudium" },
  },
  {
    org: "Lycée Louis-le-Grand",
    url: "https://louislegrand.fr",
    date: { en: "2019 – 2021", fr: "2019 – 2021", de: "2019 – 2021" },
    degree: { en: "MPSI/MP*", fr: "MPSI/MP*", de: "MPSI/MP*" },
  },
  {
    org: "Lycée Janson-de-Sailly",
    url: "https://www.janson-de-sailly.fr",
    date: { en: "2016 – 2019", fr: "2016 – 2019", de: "2016 – 2019" },
    degree: { en: "ABIBAC", fr: "ABIBAC", de: "ABIBAC" },
  },
];

const PROJECTS = [
  {
    name: {
      en: "Quantum Adversaries",
      fr: "Quantum Adversaries",
      de: "Quantum Adversaries",
    },
    date: { en: "2026", fr: "2026", de: "2026" },
    desc: {
      en: "Research project (I-X, Imperial College London) on the security of Quantum Key Distribution: extending quantum-circuit-learning attacks to the E91 protocol, discovering minimalist eavesdropping circuits with a hybrid evolutionary–SPSA optimiser, and training an RL agent that adapts its attack to dynamic channel noise in real time. Presented as a poster at QCrypt 2026.",
      fr: "Projet de recherche (I-X, Imperial College London) sur la sécurité de la distribution quantique de clés : extension des attaques par quantum circuit learning au protocole E91, découverte de circuits d'espionnage minimalistes via un optimiseur hybride évolutionnaire–SPSA, et entraînement d'un agent RL qui adapte son attaque en temps réel au bruit du canal. Présenté en poster à QCrypt 2026.",
      de: "Forschungsprojekt (I-X, Imperial College London) zur Sicherheit der Quantenschlüsselverteilung: Erweiterung von Quantum-Circuit-Learning-Angriffen auf das E91-Protokoll, Entdeckung minimalistischer Abhörschaltkreise mit einem hybriden Evolutions-SPSA-Optimierer und Training eines RL-Agenten, der seinen Angriff in Echtzeit an dynamisches Kanalrauschen anpasst. Als Poster auf der QCrypt 2026 präsentiert.",
    },
    tags: ["Quantum ML", "Reinforcement Learning", "PyTorch", "QKD"],
    link: "game.html",
    linkText: {
      en: "🕹️ Play the mini-game →",
      fr: "🕹️ Jouer au mini-jeu →",
      de: "🕹️ Mini-Spiel spielen →",
    },
  },
  {
    name: {
      en: "Autonomous Driving Robot",
      fr: "Robot de conduite autonome",
      de: "Autonom fahrender Roboter",
    },
    date: { en: "2026", fr: "2026", de: "2026" },
    desc: {
      en: "Academic group project (MSc, Imperial College London): a robot that navigates a full circuit without human intervention — lane following with HSV vision and proportional control, traffic sign and light detection with YOLOv4-tiny, and parking via a visual servo loop, all running on ROS with a LiDAR-based safety controller.",
      fr: "Projet académique en groupe (MSc, Imperial College London) : un robot qui parcourt un circuit complet sans intervention humaine — suivi de voie par vision HSV et contrôle proportionnel, détection de panneaux et feux avec YOLOv4-tiny, et stationnement par asservissement visuel, le tout sous ROS avec un contrôleur de sécurité LiDAR.",
      de: "Akademisches Gruppenprojekt (MSc, Imperial College London): ein Roboter, der einen kompletten Parcours ohne menschliches Eingreifen bewältigt — Spurverfolgung mit HSV-Bildverarbeitung und Proportionalregelung, Erkennung von Verkehrsschildern und Ampeln mit YOLOv4-tiny und Einparken per visueller Regelschleife, alles auf ROS mit einem LiDAR-basierten Sicherheitscontroller.",
    },
    tags: ["ROS", "OpenCV", "YOLO", "Python", "Robotics"],
    link: null,
    carAnim: true,
  },
  {
    name: {
      en: "Backdoor Detection in Transformers",
      fr: "Détection de backdoors dans les Transformers",
      de: "Backdoor-Erkennung in Transformern",
    },
    date: { en: "2022 – 2023", fr: "2022 – 2023", de: "2022 – 2023" },
    desc: {
      en: "Team research project (PSC, École Polytechnique) on the interpretability and security of transformer models: detecting backdoors — models that behave normally until a hidden trigger flips their behavior. Detection experiments on MNIST classifiers and GPT-style models, with a written research report.",
      fr: "Projet de recherche en équipe (PSC, École Polytechnique) sur l'interprétabilité et la sécurité des modèles Transformers : détecter les backdoors — des modèles au comportement normal jusqu'à ce qu'un déclencheur caché le fasse basculer. Expériences de détection sur des classifieurs MNIST et des modèles de type GPT, avec rapport de recherche.",
      de: "Forschungsprojekt im Team (PSC, École Polytechnique) zur Interpretierbarkeit und Sicherheit von Transformer-Modellen: Erkennung von Backdoors — Modelle, die sich normal verhalten, bis ein versteckter Trigger ihr Verhalten kippt. Detektionsexperimente an MNIST-Klassifikatoren und GPT-artigen Modellen, mit schriftlichem Forschungsbericht.",
    },
    tags: ["Python", "PyTorch", "Jupyter", "Interpretability", "AI Security"],
    link: "https://github.com/Benj-admin/psc",
  },
];
