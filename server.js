// ==================================================
// ✅ BioBoom v6.0
// Systemic Combinatorial Bioeconomy Engine
// PART 1
// ==================================================

const express = require('express');

const cors = require('cors');

const app = express();

const port =
  process.env.PORT || 3000;

// ==================================================
// CORS
// ==================================================

app.use(cors({

  origin: [

    'https://bioboom.netlify.app',

    'http://localhost:5500'

  ],

  methods: ['GET', 'POST'],

  allowedHeaders: ['Content-Type']

}));

app.use(express.json());

// ==================================================
// SCALE COST SYSTEM
// ==================================================

const scaleCost = {

  "Pilot": 2000,

  "Small Scale": 5000,

  "Medium Scale": 10000,

  "Large Scale": 20000,

  "Industrial Scale": 30000
};

// ==================================================
// STRUCTURAL ENCODING MAPS
// ==================================================

const sectorCodes = {

  "Precision Biopharma": 1,

  "Sustainable Materials": 2,

  "Industrial Fermentation": 3,

  "Bioenergy Systems": 4,

  "Circular Packaging": 5,

  "Regenerative Agriculture": 6,

  "Waste Biorefineries": 7,

  "Blue Bioeconomy": 8,

  "BioDigital Platforms & Intelligence Systems": 9,

  "Cellular & Synthetic Bioeconomy": 10
};

const strategyCodes = {

  "Breakthrough Innovation": 1,

  "Incremental Optimization": 2,

  "Circular Innovation": 3,

  "Platform & Ecosystem Expansion": 4,

  "Cost Leadership & Scale": 5,

  "Adaptive Resilience Strategy": 6
};

const targetCodes = {

  "European Union": 1,

  "Local Market": 2,

  "Global South": 3
};

const circularityCodes = {

  "Low": 1,

  "Medium": 2,

  "High": 3
};

const scaleCodes = {

  "Pilot": 1,

  "Small Scale": 2,

  "Medium Scale": 3,

  "Large Scale": 4,

  "Industrial Scale": 5
};

const scenarioCodes = {

  "Recession": 1,

  "Boom": 2,

  "Carbon Pricing Transition": 3,

  "Trade Protection Escalation": 4,

  "Credit Liquidity Crunch": 5,

  "Tech Breakthrough": 6
};

// ==================================================
// RANDOM EVENTS
// ==================================================

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

// ==================================================
// GAME STATE
// ==================================================

let gameState = {

  scenario: null,

  policyNote: "",

  randomEvent: null,

  submissions: {},

  submissionCount: {},

  playerPIN: null,

  pinExpiry: null,

  playerBudget: {},

  playerScores: {},

  playerState: {}

};

// ==================================================
// GM PIN
// ==================================================

const GM_PIN =
  process.env.GM_PIN || '2ai34Nid####';

// ==================================================
// HEALTH CHECK
// ==================================================

app.get('/', (req, res) => {

  res.send(
    '✅ BioBoom v6 systemic engine running'
  );

});

// ==================================================
// AUTH
// ==================================================

app.post('/auth', (req, res) => {

  const { role, pin } = req.body;

  if (

    role === 'gm'

    &&

    pin === GM_PIN

  ) {

    return res.json({

      success: true

    });

  }

  if (

    role === 'player'

    &&

    pin === gameState.playerPIN

    &&

    new Date() <
    new Date(gameState.pinExpiry)

  ) {

    return res.json({

      success: true

    });

  }

  return res.json({

    success: false

  });

});

// ==================================================
// GENERATE PLAYER PIN
// ==================================================

app.post('/generate-pin', (req, res) => {

  const pin =

    'P' +

    Math.floor(
      100000 +
      Math.random() * 900000
    );

  const expires =

    new Date(
      Date.now() +
      24 * 60 * 60 * 1000
    );

  gameState.playerPIN = pin;

  gameState.pinExpiry =
    expires.toISOString();

  res.json({

    pin,

    expires:
      gameState.pinExpiry

  });

});

// ==================================================
// SET SCENARIO
// ==================================================

app.post('/scenario', (req, res) => {

  const {

    scenario,

    policyNote

  } = req.body;

  gameState.scenario = scenario;

  gameState.policyNote =
    policyNote || "";

  gameState.randomEvent =

    randomEvents[
      Math.floor(
        Math.random() *
        randomEvents.length
      )
    ];

  // RESET ROUND DATA

  gameState.submissions = {};

  gameState.submissionCount = {};

  gameState.playerBudget = {};

  gameState.playerScores = {};

  gameState.playerState = {};

  res.json({

    success: true,

    event:
      gameState.randomEvent

  });

});

// ==================================================
// GET SCENARIO
// ==================================================

app.get('/scenario', (req, res) => {

  res.json({

    scenario:
      gameState.scenario,

    policyNote:
      gameState.policyNote,

    randomEvent:
      gameState.randomEvent

  });

});
// ==================================================
// PART 2
// TRUE COMBINATORIAL SYSTEM ENGINE
// ==================================================

// ==================================================
// SUBMIT MOVE
// ==================================================

app.post('/submit', (req, res) => {

  const { playerId, data } = req.body;

  // ==================================================
  // VALIDATION
  // ==================================================

  if (!playerId || !data) {

    return res.status(400).json({

      success: false,

      message:
        'Missing submission data.'

    });

  }

  if (

    data.trl < 0 ||
    data.trl > 4 ||

    data.mrl < 0 ||
    data.mrl > 4

  ) {

    return res.status(400).json({

      success: false,

      message:
        'TRL and MRL must be between 0 and 4.'

    });

  }

  // ==================================================
  // BUDGET
  // ==================================================

  const totalCost =
    scaleCost[data.unitsBucket];

  if (!gameState.playerBudget[playerId]) {

    gameState.playerBudget[playerId] =
      30000;

  }

  if (

    gameState.playerBudget[playerId] <
    totalCost

  ) {

    return res.status(400).json({

      success: false,

      message:
        '💸 Budget exceeded.'

    });

  }

  gameState.playerBudget[playerId] -=
    totalCost;

  // ==================================================
  // SUBMISSION LIMIT
  // ==================================================

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

  // ==================================================
  // PLAYER MEMORY SYSTEM
  // ==================================================

  if (!gameState.playerState[playerId]) {

    gameState.playerState[playerId] = {

      accumulatedInnovation: 1,

      accumulatedResilience: 1,

      accumulatedSustainability: 1,

      accumulatedFinancialStress: 1,

      accumulatedManufacturingStress: 1,

      strategicConsistency: 1,

      historicalRisk: 1

    };

  }

  const playerState =
    gameState.playerState[playerId];

  // ==================================================
  // STRUCTURAL ENCODING
  // TRUE COMBINATORIAL ID
  // ==================================================

  const structuralID =

      sectorCodes[data.sector]

    + 100 *

      strategyCodes[data.strategy]

    + 10000 *

      data.trl

    + 1000000 *

      data.mrl

    + 100000000 *

      circularityCodes[data.circularity]

    + 10000000000 *

      targetCodes[data.target]

    + 1000000000000 *

      scaleCodes[data.unitsBucket]

    + 100000000000000 *

      scenarioCodes[gameState.scenario];

  // ==================================================
  // SYSTEM STATE
  // ==================================================

  let systemState = {

    innovationPotential: 1,

    resiliencePotential: 1,

    sustainabilityAlignment: 1,

    manufacturingPressure: 1,

    financialPressure: 1,

    marketCompatibility: 1,

    policyCompatibility: 1,

    strategicCoherence: 1

  };

  // ==================================================
  // SECTOR EFFECTS
  // ==================================================

  if (

    data.sector ===
    "Precision Biopharma"

  ) {

    systemState.innovationPotential *= 1.5;

    systemState.financialPressure *= 1.3;

  }

  if (

    data.sector ===
    "Bioenergy Systems"

  ) {

    systemState.manufacturingPressure *= 1.4;

    systemState.marketCompatibility *= 1.2;

  }

  if (

    data.sector ===
    "Circular Packaging"

  ) {

    systemState.sustainabilityAlignment *= 1.5;

  }

  if (

    data.sector ===
    "Cellular & Synthetic Bioeconomy"

  ) {

    systemState.innovationPotential *= 1.7;

    systemState.financialPressure *= 1.5;

    systemState.resiliencePotential *= 0.8;

  }

  // ==================================================
  // STRATEGY EFFECTS
  // ==================================================

  if (

    data.strategy ===
    "Breakthrough Innovation"

  ) {

    systemState.innovationPotential *= 1.8;

    systemState.financialPressure *= 1.4;

    systemState.resiliencePotential *= 0.7;

  }

  if (

    data.strategy ===
    "Adaptive Resilience Strategy"

  ) {

    systemState.resiliencePotential *= 1.8;

    systemState.financialPressure *= 0.8;

  }

  if (

    data.strategy ===
    "Circular Innovation"

  ) {

    systemState.sustainabilityAlignment *= 1.6;

  }

  if (

    data.strategy ===
    "Cost Leadership & Scale"

  ) {

    systemState.marketCompatibility *= 1.4;

    systemState.manufacturingPressure *= 1.3;

  }

  // ==================================================
  // TRL-MRL DYNAMICS
  // ==================================================

  const diffTRL =
    Math.abs(
      data.trl - data.mrl
    );

  systemState.strategicCoherence *=

    Math.max(
      0.3,
      1 - diffTRL * 0.18
    );

  systemState.manufacturingPressure *=

    (1 + diffTRL * 0.25);

  // ==================================================
  // CIRCULARITY EFFECTS
  // ==================================================

  if (

    data.circularity === "High"

  ) {

    systemState.sustainabilityAlignment *=
      1.7;

    systemState.resiliencePotential *=
      1.2;

  }

  if (

    data.circularity === "Low"

  ) {

    systemState.sustainabilityAlignment *=
      0.7;

  }

  // ==================================================
  // TARGET MARKET EFFECTS
  // ==================================================

  if (

    data.target ===
    "European Union"

  ) {

    systemState.policyCompatibility *=
      1.4;

  }

  if (

    data.target ===
    "Global South"

  ) {

    systemState.marketCompatibility *=
      1.3;

  }

  // ==================================================
  // SCALE EFFECTS
  // ==================================================

  if (

    data.unitsBucket ===
    "Industrial Scale"

  ) {

    systemState.financialPressure *=
      1.8;

    systemState.manufacturingPressure *=
      1.6;

  }

  if (

    data.unitsBucket ===
    "Pilot"

  ) {

    systemState.innovationPotential *=
      1.2;

  }

  // ==================================================
  // SCENARIO EFFECTS
  // ==================================================

  if (

    gameState.scenario ===
    "Recession"

  ) {

    systemState.financialPressure *=
      1.7;

    systemState.marketCompatibility *=
      0.7;

    systemState.resiliencePotential *=
      1.3;

  }

  if (

    gameState.scenario ===
    "Boom"

  ) {

    systemState.marketCompatibility *=
      1.7;

    systemState.innovationPotential *=
      1.2;

  }

  if (

    gameState.scenario ===
    "Carbon Pricing Transition"

  ) {

    systemState.policyCompatibility *=
      1.6;

    if (

      data.circularity === "High"

    ) {

      systemState.sustainabilityAlignment *=
        1.5;

    }

  }

  if (

    gameState.scenario ===
    "Credit Liquidity Crunch"

  ) {

    systemState.financialPressure *=
      2.0;

  }

  if (

    gameState.scenario ===
    "Tech Breakthrough"

  ) {

    systemState.innovationPotential *=
      1.8;

  }

  // ==================================================
  // TEMPORAL MEMORY EFFECTS
  // ==================================================

  systemState.innovationPotential *=

    playerState.accumulatedInnovation;

  systemState.resiliencePotential *=

    playerState.accumulatedResilience;

  systemState.sustainabilityAlignment *=

    playerState.accumulatedSustainability;

  systemState.financialPressure *=

    playerState.accumulatedFinancialStress;

  systemState.manufacturingPressure *=

    playerState.accumulatedManufacturingStress;

  // ==================================================
  // TRUE SYSTEMIC SCORE
  // ==================================================

  const rawScore =

    (

      systemState.innovationPotential *

      systemState.resiliencePotential *

      systemState.sustainabilityAlignment *

      systemState.marketCompatibility *

      systemState.policyCompatibility *

      systemState.strategicCoherence

    )

    /

    (

      systemState.financialPressure *

      systemState.manufacturingPressure

    );

  // ==================================================
  // UNIQUE POSITIONAL SCORE
  // ==================================================

  const positionalScore =

      sectorCodes[data.sector] * 0.01

    + strategyCodes[data.strategy] * 0.0001

    + data.trl * 0.000001

    + data.mrl * 0.00000001

    + circularityCodes[data.circularity] * 0.0000000001

    + targetCodes[data.target] * 0.000000000001

    + scaleCodes[data.unitsBucket] * 0.00000000000001

    + scenarioCodes[gameState.scenario] * 0.0000000000000001;

  // ==================================================
  // FINAL UNIQUE SCORE
  // ==================================================

  const coherenceScore = Number(
(
  rawScore * 100
).toFixed(2)
);
  
  // ==================================================
// STRATEGIC FINGERPRINT
// ==================================================

const scenarioFingerprint = positionalScore;

  // ==================================================
  // ESG
  // ==================================================

  const esg = Number(

    (
      systemState.sustainabilityAlignment *
      40
    ).toFixed(2)

  );

  // ==================================================
  // INNOVATION
  // ==================================================

const innovation = Number(
(
  Math.min(100, systemState.innovationPotential * 20)
).toFixed(2)
);

  // ==================================================
  // RESILIENCE
  // ==================================================

  const resilience = Number(

    (
      systemState.resiliencePotential *
      35
    ).toFixed(2)

  );
  // ==================================================
// PART 3
// FEEDBACK + MEMORY + RESPONSE + LEADERBOARD
// ==================================================

// ==================================================
// INTERPRETATION
// ==================================================

let interpretation = "";

if (coherenceScore >= 85) {

  interpretation =
    "Highly Coherent System";

}

else if (coherenceScore >= 65) {

  interpretation =
    "Strong Strategic Alignment";

}

else if (coherenceScore >= 45) {

  interpretation =
    "Moderate Systemic Stability";

}

else if (coherenceScore >= 25) {

  interpretation =
    "Weak Strategic Integration";

}

else {

  interpretation =
    "Structurally Fragile Configuration";

}

// ==================================================
// FEEDBACK ENGINE
// ==================================================

let strengths = [];

let weaknesses = [];

let tips = [];

let systemsInsight = "";

let strategicProfile = "";

let riskLevel = "Moderate";

// ==================================================
// STRENGTHS
// ==================================================

if (innovation > 60) {

  strengths.push(
    "Innovation capability appears structurally strong."
  );

}

if (resilience > 55) {

  strengths.push(
    "Operational resilience capacity is relatively stable."
  );

}

if (esg > 55) {

  strengths.push(
    "Sustainability alignment strengthens long-term transition potential."
  );

}

if (diffTRL === 0) {

  strengths.push(
    "Technology and manufacturing readiness appear strongly synchronized."
  );

}

// ==================================================
// WEAKNESSES
// ==================================================

if (diffTRL >= 2) {

  weaknesses.push(
    "TRL-MRL mismatch may create manufacturing bottlenecks."
  );

}

if (

  systemState.financialPressure > 2

) {

  weaknesses.push(
    "Financial exposure appears structurally elevated."
  );

  riskLevel = "High";

}

if (

  systemState.manufacturingPressure > 2

) {

  weaknesses.push(
    "Operational scale may exceed manufacturing stability."
  );

}

if (

  data.circularity === "Low"

  &&

  data.target ===
  "European Union"

) {

  weaknesses.push(
    "Low circularity weakens compatibility with EU transition systems."
  );

}

// ==================================================
// IMPROVEMENT TIPS
// ==================================================

if (diffTRL >= 2) {

  tips.push(
    "Improve manufacturing readiness before aggressive scaling."
  );

}

if (

  data.unitsBucket ===
  "Industrial Scale"

  &&

  gameState.scenario ===
  "Recession"

) {

  tips.push(
    "Consider phased deployment under recessionary conditions."
  );

}

if (

  data.circularity === "Low"

) {

  tips.push(
    "Circularity improvements may strengthen long-term resilience."
  );

}

if (

  data.strategy ===
  "Breakthrough Innovation"

  &&

  gameState.scenario ===
  "Credit Liquidity Crunch"

) {

  tips.push(
    "High-risk innovation may require financial stabilization mechanisms."
  );

}

// ==================================================
// SYSTEMS INSIGHT
// ==================================================

if (

  gameState.scenario ===
  "Recession"

) {

  systemsInsight =
    "Economic contractions reward flexibility and resilience over aggressive expansion.";

}

if (

  gameState.scenario ===
  "Boom"

) {

  systemsInsight =
    "Expansion periods reward rapid scaling but may increase systemic overextension.";

}

if (

  gameState.scenario ===
  "Carbon Pricing Transition"

) {

  systemsInsight =
    "Climate transitions increasingly transform sustainability into competitive advantage.";

}

if (

  gameState.scenario ===
  "Trade Protection Escalation"

) {

  systemsInsight =
    "Regional resilience becomes increasingly important under geopolitical fragmentation.";

}

if (

  gameState.scenario ===
  "Credit Liquidity Crunch"

) {

  systemsInsight =
    "Innovation systems remain dependent on financial infrastructure stability.";

}

if (

  gameState.scenario ===
  "Tech Breakthrough"

) {

  systemsInsight =
    "Technological disruption simultaneously creates opportunity and instability.";

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
    "Sustainability Transition Leader";

}

else {

  strategicProfile =
    "Resilient Systems Adapter";

}

// ==================================================
// TEMPORAL MEMORY UPDATE
// ==================================================

playerState.accumulatedInnovation *=

  1 + (innovation / 1000);

playerState.accumulatedResilience *=

  1 + (resilience / 1200);

playerState.accumulatedSustainability *=

  1 + (esg / 1300);

playerState.accumulatedFinancialStress *=

  1 + (
    systemState.financialPressure / 150
  );

playerState.accumulatedManufacturingStress *=

  1 + (
    systemState.manufacturingPressure / 170
  );

// ==================================================
// FINAL FEEDBACK
// ==================================================

const finalFeedback = `

Interpretation:
${interpretation}

Strengths:
${strengths.join(' ') || "No major strategic strengths detected."}

Weaknesses:
${weaknesses.join(' ') || "No major structural weaknesses detected."}

Improvement Suggestions:
${tips.join(' ') || "Current system appears relatively stable."}

Systems Insight:
${systemsInsight}

Strategic Profile:
${strategicProfile}

Risk Level:
${riskLevel}

Structural ID:
${structuralID}

`;

// ==================================================
// SAVE RECORD
// ==================================================

const record = {

  ...data,

  scenario:
    gameState.scenario,

  structuralID,

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

// ==================================================
// PLAYER SCORES
// ==================================================

if (!gameState.playerScores[playerId]) {

  gameState.playerScores[playerId] = {

    totalCoherence: 0,

    totalESG: 0,

    totalInnovation: 0,

    totalResilience: 0,

    submissions: 0

  };

}

gameState.playerScores[playerId].totalCoherence +=
  coherenceScore;

gameState.playerScores[playerId].totalESG +=
  esg;

gameState.playerScores[playerId].totalInnovation +=
  innovation;

gameState.playerScores[playerId].totalResilience +=
  resilience;

gameState.playerScores[playerId].submissions += 1;

// ==================================================
// RESPONSE
// ==================================================

res.json({

  success: true,

  structuralID,

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

// ==================================================
// GET SUBMISSIONS
// ==================================================

app.get('/submissions', (req, res) => {

  res.json(
    gameState.submissions
  );

});

// ==================================================
// LEADERBOARD
// ==================================================

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

      b.coherence -
      a.coherence

  );

  res.json(leaderboard);

});

// ==================================================
// RESET
// ==================================================

app.post('/reset', (req, res) => {

  gameState.submissions = {};

  gameState.submissionCount = {};

  gameState.playerBudget = {};

  gameState.playerScores = {};

  gameState.playerState = {};

  gameState.randomEvent = null;

  res.json({

    success: true

  });

});

// ==================================================
// START SERVER
// ==================================================

app.listen(port, () => {

  console.log(

    '✅ BioBoom v6 running on port',

    port

  );

});
