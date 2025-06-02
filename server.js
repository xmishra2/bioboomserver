// ✅ BioBoom Backend v4.3 – Sector Logic, Budget Cap, Leaderboard, Random Events
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// ✅ Allow Netlify frontend + local dev
app.use(cors({
  origin: ['https://bioboom.netlify.app', 'http://localhost:5500'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// ✅ Sector configuration
const sectorConfig = {
  Bioenergy: { unitCost: 100, esgPenalty: 5, externalityPerUnit: 2 },
  Biopharma: { unitCost: 120, esgBonus: 10, externalityPerUnit: 0 },
  Forestry: { unitCost: 80, esgBonus: 5, externalityPerUnit: -1 },
  Agrobiotech: { unitCost: 90, esgPenalty: 3, externalityPerUnit: 1 },
  Others: { unitCost: 100, esgPenalty: 0, externalityPerUnit: 0 }
};

// ✅ Random events
const randomEvents = [
  {
    name: "Tech Disruption",
    description: "Unexpected tech failure affects high-TRL projects.",
    impact: (data, esg) => data.trl >= 3 ? esg - 10 : esg
  },
  {
    name: "Green Funding",
    description: "Extra ESG points for ESG leaders.",
    impact: (data, esg) => esg > 60 ? esg + 5 : esg
  },
  {
    name: "Policy U-Turn",
    description: "Global strategies are penalized due to trade uncertainty.",
    impact: (data, esg) => data.target === "Global" ? esg - 5 : esg
  }
];

// ✅ Initial game state
let gameState = {
  scenario: null,
  policyNote: "",
  randomEvent: null,
  submissions: {},
  submissionCount: {},
  playerPIN: null,
  pinExpiry: null,
  playerBudget: {},
  playerScores: {}
};

const GM_PIN = process.env.GM_PIN || '2ai34Nid####';

app.get('/', (req, res) => {
  res.send('✅ BioBoom backend with logic, leaderboard, reset, and random events is live');
});

// ✅ Auth route
app.post('/auth', (req, res) => {
  const { role, pin } = req.body;
  if (role === 'gm' && pin === GM_PIN) return res.json({ success: true });
  if (role === 'player' && pin === gameState.playerPIN && new Date() < new Date(gameState.pinExpiry)) {
    return res.json({ success: true });
  }
  return res.json({ success: false });
});

// ✅ Generate player PIN
app.post('/generate-pin', (req, res) => {
  const pin = 'P' + Math.floor(100000 + Math.random() * 900000);
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  gameState.playerPIN = pin;
  gameState.pinExpiry = expires.toISOString();
  res.json({ pin, expires: gameState.pinExpiry });
});

// ✅ Set scenario
app.post('/scenario', (req, res) => {
  const { scenario, policyNote } = req.body;
  gameState.scenario = scenario;
  gameState.policyNote = policyNote || "";
  gameState.randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
  gameState.submissions = {};
  gameState.submissionCount = {};
  gameState.playerBudget = {};
  res.json({ success: true, event: gameState.randomEvent });
});

// ✅ Get current scenario and tips
app.get('/scenario', (req, res) => {
  res.json({ scenario: gameState.scenario, policyNote: gameState.policyNote, randomEvent: gameState.randomEvent });
});

// ✅ Submit move
app.post('/submit', (req, res) => {
  const { playerId, data } = req.body;
  const config = sectorConfig[data.sector] || sectorConfig["Others"];
  const unitCost = config.unitCost;
  const totalCost = unitCost * data.units;

  if (!gameState.playerBudget[playerId]) gameState.playerBudget[playerId] = 30000;
  if (gameState.playerBudget[playerId] < totalCost) {
    return res.status(400).json({ success: false, message: '💸 Budget exceeded.' });
  }
  gameState.playerBudget[playerId] -= totalCost;

  let baseESG = 50 + (Math.abs(data.trl - data.mrl) === 0 ? 10 : Math.abs(data.trl - data.mrl) === 1 ? -5 : -15);
  const esgDelta = config.esgBonus || -config.esgPenalty || 0;
  baseESG += esgDelta;

  if (gameState.randomEvent && typeof gameState.randomEvent.impact === 'function') {
    baseESG = gameState.randomEvent.impact(data, baseESG);
  }
  const esg = Math.max(0, Math.min(100, baseESG));

  const feedback = data.sector === "Bioenergy" && data.units > 40
    ? "⚠️ Potential land-use pressure."
    : data.sector === "Agrobiotech" && data.trl <= 1
    ? "⚠️ Possible biosafety concerns."
    : data.sector === "Forestry" && data.trl >= 3
    ? "✅ Promotes carbon sequestration."
    : data.sector === "Biopharma"
    ? "✅ May improve public health resilience."
    : "ℹ️ External impacts under observation.";

  const record = { ...data, esg, feedback };

  if (!gameState.submissions[playerId]) gameState.submissions[playerId] = [];
  if (!gameState.submissionCount[playerId]) gameState.submissionCount[playerId] = 0;
  if (gameState.submissionCount[playerId] >= 5) {
    return res.status(400).json({ success: false, message: 'Maximum 5 submissions reached for this scenario.' });
  }

  gameState.submissions[playerId].push(record);
  gameState.submissionCount[playerId] += 1;
  gameState.playerScores[playerId] = (gameState.playerScores[playerId] || 0) + esg;

  res.json({ success: true, esg: record.esg, feedback: record.feedback });
});

// ✅ Get all submissions
app.get('/submissions', (req, res) => {
  res.json(gameState.submissions);
});

// ✅ Leaderboard route
app.get('/leaderboard', (req, res) => {
  const scores = gameState.playerScores || {};
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  res.json(sorted.map(([name, score]) => ({ name, score })));
});

// ✅ Reset everything
app.post('/reset', (req, res) => {
  gameState.submissions = {};
  gameState.submissionCount = {};
  gameState.playerBudget = {};
  gameState.playerScores = {};
  gameState.randomEvent = null;
  res.json({ success: true });
});

// ✅ Start server
app.listen(port, () => {
  console.log('✅ BioBoom backend running on port', port);
});
