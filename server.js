const express = require('express');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 3000;

// --------------------------------------------------
// CORS
// --------------------------------------------------

app.use(cors({

  origin: [

    'https://bioboom.netlify.app',

    'http://localhost:5500'

  ],

  methods: ['GET', 'POST'],

  allowedHeaders: ['Content-Type']

}));

app.use(express.json());

// --------------------------------------------------
// SCALE COST SYSTEM
// --------------------------------------------------

const scaleCost = {

  "Pilot": 2000,

  "Small Scale": 5000,

  "Medium Scale": 10000,

  "Large Scale": 20000,

  "Industrial Scale": 30000

};

// --------------------------------------------------
// ENCODING MAPS
// --------------------------------------------------

const sectorCodes = {

  "Precision Biopharma": 0,

  "Sustainable Materials": 1,

  "Industrial Fermentation": 2,

  "Bioenergy Systems": 3,

  "Circular Packaging": 4,

  "Regenerative Agriculture": 5,

  "Waste Biorefineries": 6,

  "Blue Bioeconomy": 7,

  "BioDigital Platforms & Intelligence Systems": 8,

  "Cellular & Synthetic Bioeconomy": 9

};

const strategyCodes = {

  "Breakthrough Innovation": 0,

  "Incremental Optimization": 1,

  "Circular Innovation": 2,

  "Platform & Ecosystem Expansion": 3,

  "Cost Leadership & Scale": 4,

  "Adaptive Resilience Strategy": 5

};

const targetCodes = {

  "European Union": 0,

  "Local Market": 1,

  "Global South": 2

};

const circularityCodes = {

  "Low": 0,

  "Medium": 1,

  "High": 2

};

const unitsBucketCodes = {

  "Pilot": 0,

  "Small Scale": 1,

  "Medium Scale": 2,

  "Large Scale": 3,

  "Industrial Scale": 4

};

const scenarioCodes = {

  "Recession": 0,

  "Boom": 1,

  "Carbon Pricing Transition": 2,

  "Trade Protection Escalation": 3,

  "Credit Liquidity Crunch": 4,

  "Tech Breakthrough": 5

};

// --------------------------------------------------
// RANDOM EVENTS
// --------------------------------------------------

const randomEvents = [

  {

    name: "Tech Disruption",

    description:
      "Unexpected technological instability affects innovation systems."

  },

  {

    name: "Green Funding",

    description:
      "Sustainable and circular ventures receive stronger institutional support."

  },

  {

    name: "Policy U-Turn",

    description:
      "Trade uncertainty increases regulatory instability."

  }

];

// --------------------------------------------------
// GAME STATE
// --------------------------------------------------

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

// --------------------------------------------------
// GM PIN
// --------------------------------------------------

const GM_PIN =
  process.env.GM_PIN || '2ai34Nid####';

// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------

app.get('/', (req, res) => {

  res.send(
    'BioBoom backend is live'
  );

});

// --------------------------------------------------
// AUTH
// --------------------------------------------------

app.post('/auth', (req, res) => {

  const { role, pin } = req.body;

  if (

    role === 'gm' &&

    pin === GM_PIN

  ) {

    return res.json({

      success: true

    });

  }

  if (

    role === 'player' &&

    pin === gameState.playerPIN &&

    new Date() < new Date(gameState.pinExpiry)

  ) {

    return res.json({

      success: true

    });

  }

  return res.json({

    success: false

  });

});

// --------------------------------------------------
// GENERATE PLAYER PIN
// --------------------------------------------------

app.post('/generate-pin', (req, res) => {

  const pin =

    'P' +

    Math.floor(

      100000 + Math.random() * 900000

    );

  const expires =

    new Date(

      Date.now() + 24 * 60 * 60 * 1000

    );

  gameState.playerPIN = pin;

  gameState.pinExpiry = expires.toISOString();

  res.json({

    pin,

    expires: gameState.pinExpiry

  });

});

// --------------------------------------------------
// SET SCENARIO
// --------------------------------------------------

app.post('/scenario', (req, res) => {

  const { scenario, policyNote } = req.body;

  gameState.scenario = scenario;

  gameState.policyNote =
    policyNote || "";

  gameState.randomEvent =

    randomEvents[
      Math.floor(
        Math.random() * randomEvents.length
      )
    ];

  gameState.submissions = {};

  gameState.submissionCount = {};

  gameState.playerBudget = {};

  gameState.playerScores = {};

  res.json({

    success: true,

    event: gameState.randomEvent

  });

});

// --------------------------------------------------
// GET SCENARIO
// --------------------------------------------------

app.get('/scenario', (req, res) => {

  res.json({

    scenario: gameState.scenario,

    policyNote: gameState.policyNote,

    randomEvent: gameState.randomEvent

  });

});

// --------------------------------------------------
// SUBMIT MOVE
// --------------------------------------------------

app.post('/submit', (req, res) => {

  const { playerId, data } = req.body;

  if (!playerId || !data) {

    return res.status(400).json({

      success: false,

      message: 'Missing submission data.'

    });

  }

  const totalCost =
    scaleCost[data.unitsBucket];

  if (!gameState.playerBudget[playerId]) {

    gameState.playerBudget[playerId] = 30000;

  }

  if (
    gameState.playerBudget[playerId] < totalCost
  ) {

    return res.status(400).json({

      success: false,

      message: 'Budget exceeded.'

    });

  }

  gameState.playerBudget[playerId] -= totalCost;

  if (!gameState.submissionCount[playerId]) {

    gameState.submissionCount[playerId] = 0;

  }

  if (
    gameState.submissionCount[playerId] >= 5
  ) {

    return res.status(400).json({

      success: false,

      message:
        'Maximum 5 submissions reached.'

    });

  }

  const scenarioID =

      sectorCodes[data.sector]

    + 10 *

      strategyCodes[data.strategy]

    + 60 *

      data.trl

    + 300 *

      data.mrl

    + 1500 *

      circularityCodes[data.circularity]

    + 4500 *

      targetCodes[data.target]

    + 13500 *

      scenarioCodes[gameState.scenario]

    + 81000 *

      unitsBucketCodes[data.unitsBucket];

  let cs = 0.8;
  let cst = 0.8;
  let ct = 0.8;
  let cm = 0.8;
  let cc = 0.8;
  let cu = 0.8;

  if (

    gameState.scenario === "Recession" &&

    data.strategy ===
      "Adaptive Resilience Strategy"

  ) {

    cst = 1.0;

  }

  if (

    gameState.scenario === "Boom" &&

    data.strategy ===
      "Cost Leadership & Scale"

  ) {

    cst = 1.0;

  }

  const diffTRL =
    Math.abs(data.trl - data.mrl);

  ct =
    Math.max(0.3, 1 - diffTRL * 0.2);

  cm =
    Math.max(0, 1 - diffTRL * 0.25);

  const coherenceScore = Number(

    (

      cs *

      cst *

      ct *

      cm *

      cc *

      cu *

      100

    ).toFixed(2)

  );

  let esg = 50;

  if (data.circularity === "High") {
    esg += 30;
  }

  if (data.circularity === "Medium") {
    esg += 15;
  }

  esg = Math.min(100, esg);

  let innovation =
    40 + data.trl * 10;

  if (
    data.strategy ===
      "Breakthrough Innovation"
  ) {

    innovation += 20;

  }

  innovation =
    Math.min(100, innovation);

  let resilience = 50;

  if (
    data.strategy ===
      "Adaptive Resilience Strategy"
  ) {

    resilience += 25;

  }

  resilience =
    Math.min(100, resilience);
    // --------------------------------------------------
  // FEEDBACK ENGINE
  // --------------------------------------------------

  let strengths = [];
  let weaknesses = [];
  let tips = [];

  let systemsInsight = "";
  let interpretation = "";
  let strategicProfile = "";
  let riskLevel = "Moderate";

  // --------------------------------------------------
  // INTERPRETATION
  // --------------------------------------------------

  if (coherenceScore >= 85) {

    interpretation =
      "Highly Coherent Strategy";

  }

  else if (coherenceScore >= 70) {

    interpretation =
      "Strong Strategic Alignment";

  }

  else if (coherenceScore >= 50) {

    interpretation =
      "Moderate Strategic Tension";

  }

  else {

    interpretation =
      "Structurally Fragile Strategy";

  }

  // --------------------------------------------------
  // FEEDBACK
  // --------------------------------------------------

  if (diffTRL === 0) {

    strengths.push(
      "Technology and manufacturing systems appear strongly aligned."
    );

  }

  if (diffTRL >= 2) {

    weaknesses.push(
      "Large TRL-MRL mismatch may create operational bottlenecks."
    );

    tips.push(
      "Improve manufacturing readiness alignment."
    );

    riskLevel = "High";

  }

  if (
    data.circularity === "High"
  ) {

    strengths.push(
      "High circularity improves sustainability resilience."
    );

  }

  if (
    gameState.scenario === "Recession"
  ) {

    systemsInsight =
      "Economic contractions reward resilience and operational flexibility.";

  }

  if (
    gameState.scenario === "Boom"
  ) {

    systemsInsight =
      "Expansion periods reward scaling and aggressive innovation.";

  }

  if (
    gameState.scenario ===
      "Carbon Pricing Transition"
  ) {

    systemsInsight =
      "Climate transition increasingly converts sustainability into competitiveness.";

  }

  if (
    gameState.scenario ===
      "Trade Protection Escalation"
  ) {

    systemsInsight =
      "Trade fragmentation rewards regional resilience.";

  }

  if (
    gameState.scenario ===
      "Credit Liquidity Crunch"
  ) {

    systemsInsight =
      "Innovation systems depend on stable financial infrastructure.";

  }

  if (
    gameState.scenario ===
      "Tech Breakthrough"
  ) {

    systemsInsight =
      "Technological disruption creates opportunity and instability simultaneously.";

  }

  // --------------------------------------------------
  // STRATEGIC PROFILE
  // --------------------------------------------------

  if (
    innovation >= esg &&
    innovation >= resilience
  ) {

    strategicProfile =
      "Aggressive Innovator";

  }

  else if (
    esg >= innovation &&
    esg >= resilience
  ) {

    strategicProfile =
      "Sustainability Leader";

  }

  else {

    strategicProfile =
      "Resilient Adapter";

  }

  // --------------------------------------------------
  // FINAL FEEDBACK
  // --------------------------------------------------

  const finalFeedback =
    "Interpretation:\n" +
    interpretation +

    "\n\nStrengths:\n" +
    (
      strengths.join(' ') ||
      "No major strengths detected."
    ) +

    "\n\nWeaknesses:\n" +
    (
      weaknesses.join(' ') ||
      "No major weaknesses detected."
    ) +

    "\n\nImprovement Suggestions:\n" +
    (
      tips.join(' ') ||
      "Current strategy appears relatively stable."
    ) +

    "\n\nSystems Insight:\n" +
    systemsInsight +

    "\n\nStrategic Profile:\n" +
    strategicProfile +

    "\n\nRisk Level:\n" +
    riskLevel;

  // --------------------------------------------------
  // SAVE RECORD
  // --------------------------------------------------

  const record = {

    ...data,

    scenario:
      gameState.scenario,

    scenarioID,

    coherenceScore,

    esg,

    innovation,

    resilience,

    interpretation,

    strategicProfile,

    riskLevel,

    feedback:
      finalFeedback

  };

  if (!gameState.submissions[playerId]) {

    gameState.submissions[playerId] = [];

  }

  gameState.submissions[playerId].push(record);

  gameState.submissionCount[playerId] += 1;

  // --------------------------------------------------
  // PLAYER SCORES
  // --------------------------------------------------

  if (!gameState.playerScores[playerId]) {

    gameState.playerScores[playerId] = {

      totalCoherence: 0,

      totalESG: 0,

      totalInnovation: 0,

      totalResilience: 0,

      submissions: 0

    };

  }

  gameState.playerScores[playerId].totalCoherence += coherenceScore;

  gameState.playerScores[playerId].totalESG += esg;

  gameState.playerScores[playerId].totalInnovation += innovation;

  gameState.playerScores[playerId].totalResilience += resilience;

  gameState.playerScores[playerId].submissions += 1;

  // --------------------------------------------------
  // RESPONSE
  // --------------------------------------------------

  res.json({

    success: true,

    scenarioID,

    coherenceScore,

    esg,

    innovation,

    resilience,

    interpretation,

    strategicProfile,

    riskLevel,

    feedback:
      finalFeedback,

    remainingBudget:
      gameState.playerBudget[playerId]

  });

});

// --------------------------------------------------
// GET SUBMISSIONS
// --------------------------------------------------

app.get('/submissions', (req, res) => {

  res.json(gameState.submissions);

});

// --------------------------------------------------
// LEADERBOARD
// --------------------------------------------------

app.get('/leaderboard', (req, res) => {

  const leaderboard = [];

  for (const player in gameState.playerScores) {

    const stats =
      gameState.playerScores[player];

    leaderboard.push({

      name: player,

      coherence:
        Number(
          (
            stats.totalCoherence /
            stats.submissions
          ).toFixed(2)
        ),

      esg:
        Number(
          (
            stats.totalESG /
            stats.submissions
          ).toFixed(2)
        ),

      innovation:
        Number(
          (
            stats.totalInnovation /
            stats.submissions
          ).toFixed(2)
        ),

      resilience:
        Number(
          (
            stats.totalResilience /
            stats.submissions
          ).toFixed(2)
        ),

      submissions:
        stats.submissions

    });

  }

  leaderboard.sort(

    (a, b) =>

      b.coherence - a.coherence

  );

  res.json(leaderboard);

});

// --------------------------------------------------
// RESET
// --------------------------------------------------

app.post('/reset', (req, res) => {

  gameState.submissions = {};

  gameState.submissionCount = {};

  gameState.playerBudget = {};

  gameState.playerScores = {};

  gameState.randomEvent = null;

  res.json({

    success: true

  });

});

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(port, () => {

  console.log(

    'BioBoom backend running on port',

    port

  );

});
