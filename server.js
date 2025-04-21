
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://bioboomserver.netlify.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

let gameState = {
  scenario: null,
  policyNote: "",
  submissions: {},
  submissionCount: {},
  playerPIN: null,
  pinExpiry: null
};

app.get('/', (req, res) => {
  res.send('✅ BioBoom GitHub-based backend with CORS for Netlify is live');
});

app.post('/auth', (req, res) => {
  const { role, pin } = req.body;
  if (role === 'gm' && pin === "2ai34Nid####") return res.json({ success: true });
  if (role === 'player' && pin === gameState.playerPIN && new Date() < new Date(gameState.pinExpiry)) {
    return res.json({ success: true });
  }
  return res.json({ success: false });
});

app.post('/generate-pin', (req, res) => {
  const pin = 'P' + Math.floor(100000 + Math.random() * 900000);
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  gameState.playerPIN = pin;
  gameState.pinExpiry = expires.toISOString();
  res.json({ pin, expires: gameState.pinExpiry });
});

app.post('/scenario', (req, res) => {
  const { scenario, policyNote } = req.body;
  gameState.scenario = scenario;
  gameState.policyNote = policyNote || "";
  gameState.submissions = {};
  gameState.submissionCount = {};
  res.json({ success: true });
});

app.get('/scenario', (req, res) => {
  res.json({ scenario: gameState.scenario, policyNote: gameState.policyNote });
});

app.post('/submit', (req, res) => {
  const { playerId, data } = req.body;
  if (!gameState.submissionCount[playerId]) {
    gameState.submissionCount[playerId] = 0;
  }
  if (gameState.submissionCount[playerId] >= 5) {
    return res.status(400).json({ success: false, message: 'Maximum 5 submissions reached for this scenario.' });
  }

  const esg = 50 + (Math.abs(data.trl - data.mrl) === 0 ? 10 : Math.abs(data.trl - data.mrl) === 1 ? -5 : -15);
  const feedback = data.sector === "Bioenergy" && data.units > 40
    ? "⚠️ Potential land-use pressure."
    : data.sector === "Agrobiotech" && data.trl <= 1
    ? "⚠️ Possible biosafety concerns."
    : data.sector === "Forestry" && data.trl >= 3
    ? "✅ Promotes carbon sequestration."
    : data.sector === "Biopharma"
    ? "✅ May improve public health resilience."
    : "ℹ️ External impacts under observation.";

  const record = { ...data, esg: Math.max(0, Math.min(100, esg)), feedback };

  if (!gameState.submissions[playerId]) {
    gameState.submissions[playerId] = [];
  }

  gameState.submissions[playerId].push(record);
  gameState.submissionCount[playerId] += 1;
  res.json({ success: true, esg: record.esg, feedback: record.feedback });
});

app.get('/submissions', (req, res) => {
  res.json(gameState.submissions);
});

app.listen(port, () => {
  console.log('✅ BioBoom backend deployed via GitHub is live on port', port);
});
