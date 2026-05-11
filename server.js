
// ✅ BioBoom Backend v5.0 – Systemic Coherence Engine

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
// STRUCTURAL ENCODING MAPS
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
    '✅ BioBoom v5.0 systemic coherence backend is live'
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
    Math.floor(100000 + Math.random() * 900000);

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

  // RESET ROUND DATA

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

  // -----------------------------------
  // VALIDATION
  // -----------------------------------

  if (!playerId || !data) {

    return res.status(400).json({

      success: false,

      message: 'Missing submission data.'

    });

  }

  // -----------------------------------
  // BUDGET
  // -----------------------------------

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

      message: '💸 Budget exceeded.'

    });

  }

  gameState.playerBudget[playerId] -= totalCost;

  // -----------------------------------
  // SUBMISSION LIMIT
  // -----------------------------------

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

  // -----------------------------------
  // STRUCTURAL ENCODING
  // -----------------------------------

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

  // -----------------------------------
  // COHERENCE COMPONENTS
  // -----------------------------------

  let cs = 0.8;
  let cst = 0.8;
  let ct = 0.8;
  let cm = 0.8;
  let cc = 0.8;
  let cu = 0.8;

  // -----------------------------------
  // SECTOR-SCENARIO COHERENCE
  // -----------------------------------

  if (

    gameState.scenario ===
      "Carbon Pricing Transition"

    &&

    data.sector ===
      "Circular Packaging"

  ) {

    cs = 1.0;

  }

  if (

    gameState.scenario ===
      "Recession"

    &&

    data.sector ===
      "Cellular & Synthetic Bioeconomy"

  ) {

    cs = 0.5;

  }

  // -----------------------------------
  // STRATEGY COHERENCE
  // -----------------------------------

  if (

    gameState.scenario ===
      "Recession"

    &&

    data.strategy ===
      "Adaptive Resilience Strategy"

  ) {

    cst = 1.0;

  }

  if (

    gameState.scenario ===
      "Boom"

    &&

    data.strategy ===
      "Cost Leadership & Scale"

  ) {

    cst = 1.0;

  }

  if (

    gameState.scenario ===
      "Carbon Pricing Transition"

    &&

    data.strategy ===
      "Circular Innovation"

  ) {

    cst = 1.0;

  }

  // -----------------------------------
  // TRL-MRL ALIGNMENT
  // -----------------------------------

  const diffTRL =
    Math.abs(data.trl - data.mrl);

  ct =
    Math.max(
      0.3,
      1 - diffTRL * 0.2
    );

  cm =
    Math.max(
      0,
      1 - diffTRL * 0.25
    );

  // -----------------------------------
  // CIRCULARITY COHERENCE
  // -----------------------------------

  if (

    data.circularity === "High"

    &&

    gameState.scenario ===
      "Carbon Pricing Transition"

  ) {

    cc = 1.0;

  }

  if (

    data.circularity === "Low"

    &&

    data.target ===
      "European Union"

  ) {

    cc = 0.5;

  }

  // -----------------------------------
  // SCALE COHERENCE
  // -----------------------------------

  if (

    data.unitsBucket ===
      "Industrial Scale"

    &&

    gameState.scenario ===
      "Recession"

  ) {

    cu = 0.4;

  }

  if (

    data.unitsBucket ===
      "Industrial Scale"

    &&

    gameState.scenario ===
      "Boom"

  ) {

    cu = 1.0;

  }

  // -----------------------------------
  // FINAL COHERENCE SCORE
  // -----------------------------------

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

  // -----------------------------------
  // ESG SCORE
  // -----------------------------------

  let esg = 50;

  if (
    data.circularity === "High"
  ) {
    esg += 30;
  }

  if (
    data.circularity === "Medium"
  ) {
    esg += 15;
  }

  if (
    data.sector ===
      "Circular Packaging"
  ) {
    esg += 10;
  }

  esg = Math.min(100, esg);

  // -----------------------------------
  // INNOVATION SCORE
  // -----------------------------------

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

  // -----------------------------------
  // RESILIENCE SCORE
  // -----------------------------------

  let resilience = 50;

  if (

    data.strategy ===
      "Adaptive Resilience Strategy"

  ) {

    resilience += 25;

  }

  if (

    data.circularity === "High"

  ) {

    resilience += 15;

  }

  if (

    gameState.scenario ===
      "Recession"

  ) {

    resilience -= 10;

  }

  resilience =
    Math.min(100, resilience);

  // -----------------------------------
  // FEEDBACK ENGINE
  // -----------------------------------

// -----------------------------------
// FEEDBACK ENGINE
// -----------------------------------

let strengths = [];

let weaknesses = [];

let tips = [];

let systemsInsight = "";

let interpretation = "";

let strategicProfile = "";

let riskLevel = "Moderate";

// -----------------------------------
// COHERENCE INTERPRETATION
// -----------------------------------

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

else if (coherenceScore >= 30) {

  interpretation =
    "Weak Systemic Alignment";

}

else {

  interpretation =
    "Structurally Fragile Strategy";

}

// ==================================================
// RECESSION
// ==================================================

if (gameState.scenario === "Recession") {

  if (

    data.strategy ===
      "Adaptive Resilience Strategy"

  ) {

    strengths.push(
      "Adaptive operational structures improve survivability during economic contraction."
    );

  }

  if (

    data.unitsBucket ===
      "Industrial Scale"

  ) {

    weaknesses.push(
      "Large-scale expansion increases systemic exposure during recession conditions."
    );

    tips.push(
      "Consider phased or medium-scale deployment strategies."
    );

    riskLevel = "High";

  }

  if (

    data.strategy ===
      "Breakthrough Innovation"

  ) {

    weaknesses.push(
      "High-risk innovation systems may struggle under reduced investment conditions."
    );

  }

  systemsInsight =
    "Economic contractions often reward flexibility and resilience more than aggressive expansion.";
}

// ==================================================
// BOOM
// ==================================================

if (gameState.scenario === "Boom") {

  if (

    data.unitsBucket ===
      "Industrial Scale"

  ) {

    strengths.push(
      "Industrial-scale deployment may efficiently capture expansionary market demand."
    );

  }

  if (

    data.strategy ===
      "Breakthrough Innovation"

  ) {

    strengths.push(
      "Boom environments often support ambitious innovation investment."
    );

  }

  if (

    data.unitsBucket ===
      "Pilot"

  ) {

    weaknesses.push(
      "Pilot-scale deployment may underutilize favorable expansion conditions."
    );

    tips.push(
      "Economic expansion may support more aggressive scaling strategies."
    );

  }

  systemsInsight =
    "Boom periods reward expansion but may also increase long-term overgrowth risks.";
}

// ==================================================
// CARBON PRICING TRANSITION
// ==================================================

if (

  gameState.scenario ===
    "Carbon Pricing Transition"

) {

  if (

    data.circularity === "High"

  ) {

    strengths.push(
      "High circularity improves competitiveness under carbon-constrained systems."
    );

  }

  if (

    data.strategy ===
      "Circular Innovation"

  ) {

    strengths.push(
      "Circular innovation strongly aligns with climate transition conditions."
    );

  }

  if (

    data.circularity === "Low"

  ) {

    weaknesses.push(
      "Low circularity may increase regulatory and operational pressure."
    );

    tips.push(
      "Carbon transition systems generally reward resource efficiency and circularity."
    );

  }

  systemsInsight =
    "Climate policy increasingly transforms sustainability performance into economic competitiveness.";
}

// ==================================================
// TRADE PROTECTION ESCALATION
// ==================================================

if (

  gameState.scenario ===
    "Trade Protection Escalation"

) {

  if (

    data.target ===
      "Local Market"

  ) {

    strengths.push(
      "Localized operational systems improve resilience under fragmented trade conditions."
    );

  }

  if (

    data.unitsBucket ===
      "Industrial Scale"

  ) {

    weaknesses.push(
      "Large-scale global systems may become vulnerable under protectionist trade environments."
    );

    tips.push(
      "Regional operational flexibility may reduce geopolitical exposure."
    );

  }

  systemsInsight =
    "Global efficiency often increases vulnerability during geopolitical fragmentation.";
}

// ==================================================
// CREDIT LIQUIDITY CRUNCH
// ==================================================

if (

  gameState.scenario ===
    "Credit Liquidity Crunch"

) {

  if (

    data.strategy ===
      "Incremental Optimization"

  ) {

    strengths.push(
      "Operational efficiency strategies improve financial survivability during liquidity constraints."
    );

  }

  if (

    data.strategy ===
      "Breakthrough Innovation"

  ) {

    weaknesses.push(
      "Speculative innovation systems may struggle under restricted financing conditions."
    );

    riskLevel = "High";

  }

  if (

    data.unitsBucket ===
      "Industrial Scale"

  ) {

    weaknesses.push(
      "Capital-intensive expansion increases vulnerability during credit contraction."
    );

  }

  systemsInsight =
    "Innovation systems depend not only on technology but also on financial infrastructure stability.";
}

// ==================================================
// TECH BREAKTHROUGH
// ==================================================

if (

  gameState.scenario ===
    "Tech Breakthrough"

) {

  if (

    data.strategy ===
      "Breakthrough Innovation"

  ) {

    strengths.push(
      "Breakthrough-oriented systems align strongly with technological disruption environments."
    );

  }

  if (

    data.strategy ===
      "Platform & Ecosystem Expansion"

  ) {

    strengths.push(
      "Platform ecosystems accelerate technology diffusion and adaptive scaling."
    );

  }

  if (

    data.strategy ===
      "Incremental Optimization"

  ) {

    weaknesses.push(
      "Incremental adaptation may underperform during disruptive technological transitions."
    );

    tips.push(
      "Rapid capability development may improve long-term competitiveness."
    );

  }

  systemsInsight =
    "Technological disruption simultaneously creates opportunity and systemic instability.";
}

// ==================================================
// TRL-MRL ALIGNMENT
// ==================================================

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
    "Improving manufacturing readiness may strengthen scalability."
  );

}

// ==================================================
// CIRCULARITY
// ==================================================

if (

  data.circularity === "High"

) {

  strengths.push(
    "High circularity improves long-term sustainability resilience."
  );

}

if (

  data.circularity === "Low"

  &&

  data.target ===
    "European Union"

) {

  weaknesses.push(
    "Low circularity may reduce EU market competitiveness."
  );

}

// ==================================================
// STRATEGIC PROFILE
// ==================================================

if (

  innovation >= esg

  &&

  innovation >= resilience

) {

  strategicProfile =
    "Aggressive Innovator";

}

else if (

  esg >= innovation

  &&

  esg >= resilience

) {

  strategicProfile =
    "Sustainability Leader";

}

else if (

  resilience >= innovation

  &&

  resilience >= esg

) {

  strategicProfile =
    "Resilient Adapter";

}

else {

  strategicProfile =
    "Balanced Systems Strategist";

}

// ==================================================
// LIMIT TIPS
// ==================================================

tips = tips.slice(0, 3);

// ==================================================
// FINAL FEEDBACK TEXT
// ==================================================

const finalFeedback = `

Interpretation:
${interpretation}

Strengths:
${strengths.join(' ') || "No major strategic strengths detected."}

Weaknesses:
${weaknesses.join(' ') || "No major structural weaknesses detected."}

Improvement Suggestions:
${tips.join(' ') || "Current strategy appears relatively stable under present conditions."}

Systems Insight:
${systemsInsight}

Strategic Profile:
${strategicProfile}

Risk Level:
${riskLevel}

`;

// -----------------------------------
// SAVE RECORD
// -----------------------------------

const record = {

  ...data,

  scenario: gameState.scenario,

  scenarioID,

  coherenceScore,

  esg,

  innovation,

  resilience,

  interpretation,

  strategicProfile,

  riskLevel,

  budgetStress,

  feedback:
    feedback.join(' '),

  improvementTips

};

if (!gameState.submissions[playerId]) {

  gameState.submissions[playerId] = [];

}

gameState.submissions[playerId].push(record);

gameState.submissionCount[playerId] += 1;
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

    const avgCoherence =

      stats.totalCoherence /
      stats.submissions;

    const avgESG =

      stats.totalESG /
      stats.submissions;

    const avgInnovation =

      stats.totalInnovation /
      stats.submissions;

    const avgResilience =

      stats.totalResilience /
      stats.submissions;

    leaderboard.push({

      name: player,

      coherence:
        Number(avgCoherence.toFixed(2)),

      esg:
        Number(avgESG.toFixed(2)),

      innovation:
        Number(avgInnovation.toFixed(2)),

      resilience:
        Number(avgResilience.toFixed(2)),

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
    '✅ BioBoom v5.0 running on port',
    port
  );

});
