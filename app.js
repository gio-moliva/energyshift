const nodePalette = {
  maritime: "#0A5BD3",
  industrial: "#0D0D0F",
  mining: "#5F98EE",
};

const nodeTypeLabel = {
  maritime: "marittimo",
  industrial: "industriale",
  mining: "minerario",
};

const nodes = [
  {
    id: "hormuz",
    label: "Hormuz",
    subtitle: "petrolio e GNL",
    coords: [26.56, 56.25],
    type: "maritime",
    placement: "place-right",
  },
  {
    id: "suez",
    label: "Suez / Bab el-Mandeb",
    subtitle: "energia e manifattura UE",
    coords: [20.8, 38.8],
    type: "maritime",
    placement: "place-right",
  },
  {
    id: "malacca",
    label: "Malacca",
    subtitle: "asse energetico Asia",
    coords: [3.1, 100.9],
    type: "maritime",
    placement: "place-right",
  },
  {
    id: "taiwan",
    label: "Mar Cinese / Taiwan",
    subtitle: "energia + tech",
    coords: [23.9, 121.0],
    type: "maritime",
    placement: "place-right",
  },
  {
    id: "china",
    label: "Hub cinese",
    subtitle: "raffinazione e batterie",
    coords: [31.2, 121.5],
    type: "industrial",
    placement: "place-up-right",
  },
  {
    id: "indonesia",
    label: "Indonesia",
    subtitle: "nichel",
    coords: [-2.0, 121.0],
    type: "mining",
    placement: "place-right-low",
  },
  {
    id: "congo",
    label: "R.D. Congo",
    subtitle: "cobalto",
    coords: [-11.6, 27.5],
    type: "mining",
    placement: "place-right",
  },
];

const baseFlows = [
  {
    id: "hormuz-eu-oil",
    label: "Golfo -> Europa",
    commodity: "oil",
    weight: 5.4,
    intensity: 0.88,
    route: [
      [26.56, 56.25],
      [22.0, 56.0],
      [18.0, 52.0],
      [12.6, 43.4],
      [20.8, 38.8],
      [30.2, 32.5],
      [36.0, 18.0],
      [43.0, 5.0],
    ],
    touches: ["hormuz", "suez"],
  },
  {
    id: "hormuz-asia-oil",
    label: "Golfo -> Asia",
    commodity: "oil",
    weight: 6.3,
    intensity: 0.94,
    route: [
      [26.56, 56.25],
      [19.0, 62.0],
      [12.0, 72.0],
      [6.0, 86.0],
      [3.1, 100.9],
      [10.0, 112.0],
      [23.9, 121.0],
      [31.2, 121.5],
    ],
    touches: ["hormuz", "malacca", "taiwan", "china"],
  },
  {
    id: "qatar-eu-lng",
    label: "Qatar LNG -> UE",
    commodity: "gas",
    weight: 4.8,
    intensity: 0.82,
    route: [
      [25.3, 51.5],
      [26.56, 56.25],
      [19.0, 54.0],
      [12.6, 43.4],
      [20.8, 38.8],
      [30.2, 32.5],
      [36.0, 18.0],
      [44.0, 2.0],
    ],
    touches: ["hormuz", "suez"],
  },
  {
    id: "asia-eu-container",
    label: "Asia -> UE",
    commodity: "containers",
    weight: 4.8,
    intensity: 0.8,
    route: [
      [31.2, 121.5],
      [22.3, 114.2],
      [3.1, 100.9],
      [10.0, 83.0],
      [12.6, 43.4],
      [20.8, 38.8],
      [30.2, 32.5],
      [36.0, 18.0],
      [48.0, 2.0],
    ],
    touches: ["china", "taiwan", "malacca", "suez"],
  },
  {
    id: "congo-china-minerals",
    label: "Cobalto -> Cina",
    commodity: "minerals",
    weight: 4.2,
    intensity: 0.74,
    route: [
      [-11.6, 27.5],
      [-5.0, 40.0],
      [2.0, 65.0],
      [10.0, 90.0],
      [23.9, 121.0],
      [31.2, 121.5],
    ],
    touches: ["congo", "taiwan", "china"],
  },
  {
    id: "indonesia-china-minerals",
    label: "Nichel -> Cina",
    commodity: "minerals",
    weight: 4.3,
    intensity: 0.78,
    route: [
      [-2.0, 121.0],
      [7.0, 118.0],
      [18.0, 120.0],
      [31.2, 121.5],
    ],
    touches: ["indonesia", "taiwan", "china"],
  },
  {
    id: "china-eu-cleantech",
    label: "Batterie e moduli -> UE",
    commodity: "containers",
    weight: 4.4,
    intensity: 0.77,
    route: [
      [31.2, 121.5],
      [23.9, 121.0],
      [3.1, 100.9],
      [12.6, 43.4],
      [20.8, 38.8],
      [30.2, 32.5],
      [36.0, 18.0],
      [46.0, 4.0],
    ],
    touches: ["china", "taiwan", "malacca", "suez"],
  },
];

const scenarios = [
  {
    id: "baseline",
    shortName: "Normalita",
    status: "Sistema aperto",
    name: "Normalita vigilata",
    description:
      "I principali choke point sono aperti e i flussi seguono le rotte piu efficienti tra Golfo, Asia ed Europa.",
    impact:
      "Le deviazioni sono minime: il sistema resta esposto, ma non sta ancora reagendo a uno shock locale.",
    stressNode: "Hormuz",
    flowAdjustments: {},
  },
  {
    id: "hormuz",
    shortName: "Hormuz",
    status: "Stress su energia primaria",
    name: "Crisi nello Stretto di Hormuz",
    description:
      "Il transito dal Golfo si restringe bruscamente. Petrolio e GNL perdono capacita e una parte dei carichi resta in attesa.",
    impact:
      "I flussi dal Golfo verso Europa e Asia si assottigliano; cresce il ricorso a carichi alternativi in Atlantico.",
    stressNode: "Hormuz",
    flowAdjustments: {
      "hormuz-eu-oil": { intensity: 0.12, label: "Golfo -> Europa bloccato" },
      "hormuz-asia-oil": { intensity: 0.18, label: "Golfo -> Asia ridotto" },
      "qatar-eu-lng": { intensity: 0.08, label: "Qatar LNG quasi fermo" },
      "asia-eu-container": { intensity: 0.64 },
      "china-eu-cleantech": { intensity: 0.62 },
    },
    extraFlows: [
      {
        id: "atlantic-eu-oil",
        label: "Atlantico -> UE",
        commodity: "oil",
        weight: 4.2,
        intensity: 0.72,
        rerouted: true,
        route: [
          [29.0, -90.0],
          [34.0, -52.0],
          [44.0, -15.0],
          [46.0, 4.0],
        ],
      },
      {
        id: "atlantic-eu-lng",
        label: "Atlantico LNG -> UE",
        commodity: "gas",
        weight: 3.9,
        intensity: 0.6,
        rerouted: true,
        route: [
          [25.0, -75.0],
          [37.0, -40.0],
          [44.0, -10.0],
          [50.0, 0.0],
        ],
      },
    ],
  },
  {
    id: "suez",
    shortName: "Suez",
    status: "Rerouting via Capo",
    name: "Crisi Mar Rosso - Suez",
    description:
      "L'asse Bab el-Mandeb - Mar Rosso - Suez si inceppa. Container, greggio e componenti destinati all'Europa allungano la rotta.",
    impact:
      "Le tratte verso l'Europa deviano attorno al Capo di Buona Speranza, con tempi piu lunghi e meno capacita disponibile.",
    stressNode: "Suez / Bab el-Mandeb",
    flowAdjustments: {
      "hormuz-eu-oil": { intensity: 0.16, label: "Golfo -> UE via Suez ridotto" },
      "qatar-eu-lng": { intensity: 0.12, label: "Qatar LNG -> UE ridotto" },
      "asia-eu-container": { intensity: 0.18, label: "Asia -> UE via Suez ridotto" },
      "china-eu-cleantech": { intensity: 0.22, label: "Clean tech -> UE rallentato" },
    },
    extraFlows: [
      {
        id: "cape-container",
        label: "Asia -> UE via Capo",
        commodity: "containers",
        weight: 4.8,
        intensity: 0.76,
        rerouted: true,
        route: [
          [31.2, 121.5],
          [10.0, 105.0],
          [-10.0, 84.0],
          [-34.0, 18.0],
          [0.0, -2.0],
          [43.0, 5.0],
        ],
      },
      {
        id: "cape-oil",
        label: "Golfo -> UE via Capo",
        commodity: "oil",
        weight: 4.2,
        intensity: 0.58,
        rerouted: true,
        route: [
          [26.56, 56.25],
          [10.0, 70.0],
          [-10.0, 80.0],
          [-34.0, 18.0],
          [0.0, -2.0],
          [43.0, 5.0],
        ],
      },
    ],
  },
  {
    id: "malacca",
    shortName: "Malacca",
    status: "Pressione sul baricentro asiatico",
    name: "Crisi nello Stretto di Malacca",
    description:
      "Malacca perde capacita e colpisce il principale corridoio energetico dell'Asia orientale.",
    impact:
      "Parte dei traffici prova a deviare verso i passaggi indonesiani piu meridionali, con piu miglia e minore efficienza.",
    stressNode: "Malacca",
    flowAdjustments: {
      "hormuz-asia-oil": {
        intensity: 0.22,
        label: "Golfo -> Asia via Malacca ridotto",
      },
      "asia-eu-container": { intensity: 0.68 },
      "indonesia-china-minerals": { intensity: 0.5 },
      "china-eu-cleantech": { intensity: 0.6 },
    },
    extraFlows: [
      {
        id: "lombok-oil",
        label: "Golfo -> Asia via Lombok",
        commodity: "oil",
        weight: 5.1,
        intensity: 0.68,
        rerouted: true,
        route: [
          [26.56, 56.25],
          [10.0, 70.0],
          [-3.0, 95.0],
          [-8.0, 115.0],
          [-2.0, 121.0],
          [18.0, 122.0],
          [31.2, 121.5],
        ],
      },
      {
        id: "south-route-nickel",
        label: "Nichel -> Cina via sud",
        commodity: "minerals",
        weight: 4.0,
        intensity: 0.54,
        rerouted: true,
        route: [
          [-2.0, 121.0],
          [-10.0, 125.0],
          [-6.0, 134.0],
          [12.0, 128.0],
          [31.2, 121.5],
        ],
      },
    ],
  },
  {
    id: "taiwan",
    shortName: "Taiwan",
    status: "Shock congiunto energia-tech",
    name: "Crisi Mar Cinese Meridionale - Taiwan",
    description:
      "La tensione nell'area colpisce insieme rotte energetiche, manifattura elettronica e passaggi verso l'Asia orientale.",
    impact:
      "Una parte dei traffici scivola piu a est nel Pacifico, mentre i flussi industriali verso la Cina perdono fluidita.",
    stressNode: "Mar Cinese / Taiwan",
    flowAdjustments: {
      "hormuz-asia-oil": { intensity: 0.48 },
      "asia-eu-container": { intensity: 0.4, label: "Asia -> UE con congestione pacifica" },
      "congo-china-minerals": { intensity: 0.32, label: "Cobalto -> Cina rallentato" },
      "indonesia-china-minerals": { intensity: 0.3, label: "Nichel -> Cina rallentato" },
      "china-eu-cleantech": { intensity: 0.22, label: "Export tech -> UE ridotto" },
    },
    extraFlows: [
      {
        id: "deep-pacific",
        label: "Bypass Pacifico orientale",
        commodity: "containers",
        weight: 4.3,
        intensity: 0.58,
        rerouted: true,
        route: [
          [31.2, 121.5],
          [34.0, 140.0],
          [26.0, 158.0],
          [10.0, 165.0],
          [-2.0, 150.0],
          [-5.0, 132.0],
        ],
      },
    ],
  },
  {
    id: "china",
    shortName: "Cina",
    status: "Collo di bottiglia industriale",
    name: "Stress sull'hub cinese",
    description:
      "Il problema non e il passaggio marittimo ma la concentrazione industriale di raffinazione, celle, magneti e batterie.",
    impact:
      "I flussi minerari continuano a muoversi, ma si accumulano o cercano capacita manifatturiera alternativa altrove in Asia.",
    stressNode: "Hub cinese",
    flowAdjustments: {
      "congo-china-minerals": { intensity: 0.56, label: "Cobalto in accumulo" },
      "indonesia-china-minerals": { intensity: 0.58, label: "Nichel in accumulo" },
      "china-eu-cleantech": { intensity: 0.16, label: "Export clean tech ridotto" },
      "asia-eu-container": { intensity: 0.56 },
    },
    extraFlows: [
      {
        id: "alt-manufacturing",
        label: "Capacita alternativa Asia",
        commodity: "containers",
        weight: 3.8,
        intensity: 0.48,
        rerouted: true,
        route: [
          [13.0, 100.0],
          [15.0, 92.0],
          [12.6, 43.4],
          [20.8, 38.8],
          [30.2, 32.5],
          [46.0, 4.0],
        ],
      },
    ],
  },
  {
    id: "indonesia",
    shortName: "Indonesia",
    status: "Rischio materiali batterie",
    name: "Shock sul nichel indonesiano",
    description:
      "La filiera battery-grade perde flessibilita proprio nel nodo che ha guidato la crescita del nichel negli ultimi anni.",
    impact:
      "Il sistema prova a compensare con flussi alternativi dall'area australiana, ma la sostituzione resta parziale.",
    stressNode: "Indonesia",
    flowAdjustments: {
      "indonesia-china-minerals": { intensity: 0.12, label: "Nichel -> Cina quasi fermo" },
      "china-eu-cleantech": { intensity: 0.54 },
    },
    extraFlows: [
      {
        id: "australia-nickel",
        label: "Nichel alternativo",
        commodity: "minerals",
        weight: 3.9,
        intensity: 0.42,
        rerouted: true,
        route: [
          [-22.0, 121.0],
          [-15.0, 127.0],
          [8.0, 126.0],
          [31.2, 121.5],
        ],
      },
    ],
  },
  {
    id: "congo",
    shortName: "Congo",
    status: "Fragilita mineraria critica",
    name: "Shock sul cobalto del Congo",
    description:
      "La dipendenza dal Congo colpisce una materia prima chiave per batterie e accumuli.",
    impact:
      "La catena prova a reagire con stock e riciclo, ma senza rimpiazzi rapidi il flusso verso la Cina si assottiglia fortemente.",
    stressNode: "R.D. Congo",
    flowAdjustments: {
      "congo-china-minerals": { intensity: 0.1, label: "Cobalto -> Cina quasi fermo" },
      "china-eu-cleantech": { intensity: 0.5 },
    },
    extraFlows: [
      {
        id: "recycling-loop",
        label: "Riciclo e stock",
        commodity: "minerals",
        weight: 3.4,
        intensity: 0.38,
        rerouted: true,
        route: [
          [51.0, 4.0],
          [40.0, 28.0],
          [34.0, 60.0],
          [31.2, 121.5],
        ],
      },
    ],
  },
];

const scenarioButtonsContainer = document.getElementById("scenario-buttons");
const flowCountElement = document.getElementById("flow-count");
const rerouteCountElement = document.getElementById("reroute-count");
const stressNodeElement = document.getElementById("stress-node");
const systemStatusElement = document.getElementById("system-status");
const scenarioTitleElement = document.getElementById("scenario-title");
const scenarioDescriptionElement = document.getElementById("scenario-description");
const scenarioImpactElement = document.getElementById("scenario-impact");
const mapStatusElement = document.getElementById("map-status");
const mapElement = document.getElementById("world-map");

let map = null;
let flowLayer = null;
let nodeLayer = null;

const worldBounds = [
  [-45, -110],
  [65, 165],
];

function buildScenarioButtons() {
  scenarios.forEach((scenario) => {
    const button = document.createElement("button");
    button.className = "scenario-btn";
    button.type = "button";
    button.dataset.scenario = scenario.id;
    button.textContent = scenario.shortName;
    button.addEventListener("click", () => applyScenario(scenario.id));
    scenarioButtonsContainer.appendChild(button);
  });
}

function commodityColor(type) {
  return {
    oil: "#0D0D0F",
    gas: "#0A5BD3",
    containers: "#6C85A5",
    minerals: "#5F98EE",
  }[type];
}

function nodeColor(type) {
  return nodePalette[type];
}

function classForIntensity(intensity) {
  if (intensity <= 0.18) {
    return "flow-low";
  }

  if (intensity < 0.6) {
    return "flow-muted";
  }

  return "flow-strong";
}

function mergeFlows(scenario) {
  const adjustmentMap = scenario.flowAdjustments || {};
  const adjustedBase = baseFlows.map((flow) => {
    const override = adjustmentMap[flow.id] || {};
    return {
      ...flow,
      ...override,
      rerouted: override.rerouted || flow.rerouted || false,
      route: override.route || flow.route,
    };
  });

  return adjustedBase.concat(scenario.extraFlows || []);
}

function ensureMap() {
  mapStatusElement.textContent = "Inizializzazione layer...";

  if (typeof window.L === "undefined") {
    mapStatusElement.textContent = "Leaflet / OSM non disponibile";
    mapElement.innerHTML =
      '<div class="map-error">Impossibile caricare il layer OpenStreetMap. Verifica la connessione del browser e ricarica la pagina.</div>';
    return false;
  }

  try {
    map = L.map("world-map", {
      zoomControl: false,
      worldCopyJump: true,
      maxBounds: [
        [-70, -180],
        [85, 180],
      ],
    });

    map.fitBounds(worldBounds, { padding: [24, 24] });
    map.attributionControl.setPrefix(false);
    L.control.zoom({ position: "bottomright" }).addTo(map);

    const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      minZoom: 2,
      maxZoom: 6,
    });

    tileLayer.on("load", () => {
      mapStatusElement.textContent = "OpenStreetMap attivo";
    });

    tileLayer.on("tileerror", () => {
      mapStatusElement.textContent = "OpenStreetMap non raggiungibile";
    });

    tileLayer.addTo(map);

    flowLayer = L.layerGroup().addTo(map);
    nodeLayer = L.layerGroup().addTo(map);

    window.setTimeout(() => {
      map.invalidateSize();
    }, 50);

    return true;
  } catch (error) {
    mapStatusElement.textContent = "Errore inizializzazione mappa";
    mapElement.innerHTML = `<div class="map-error">La mappa non e stata inizializzata correttamente.<br />${error.message}</div>`;
    return false;
  }
}

function renderFlows(scenario) {
  const flows = mergeFlows(scenario);

  flowCountElement.textContent = String(flows.length);
  rerouteCountElement.textContent = String(flows.filter((flow) => flow.rerouted).length);

  if (!flowLayer) {
    return;
  }

  flowLayer.clearLayers();

  flows.forEach((flow) => {
    const color = commodityColor(flow.commodity);
    const intensityClass = classForIntensity(flow.intensity);
    const dashArray = flow.rerouted ? "10 12" : "14 10";

    L.polyline(flow.route, {
      color,
      weight: flow.weight + 6,
      opacity: Math.max(flow.intensity * 0.12, 0.06),
      className: `flow-halo ${flow.rerouted ? "flow-rerouted" : ""} ${intensityClass}`,
      interactive: false,
    }).addTo(flowLayer);

    const line = L.polyline(flow.route, {
      color,
      weight: Math.max(flow.weight * flow.intensity, 2.2),
      opacity: Math.max(flow.intensity, 0.12),
      dashArray,
      className: `flow-line flow-${flow.commodity} ${flow.rerouted ? "flow-rerouted" : ""} ${intensityClass}`,
    }).addTo(flowLayer);

    line.bindTooltip(flow.label, {
      sticky: true,
      direction: "top",
      className: "flow-tooltip",
    });
  });
}

function nodeIcon(node, isActive) {
  return L.divIcon({
    className: "node-marker-wrapper",
    iconSize: [230, 58],
    iconAnchor: [9, 9],
    html: `
      <button class="node-pin ${node.placement} ${isActive ? "is-active" : ""}" type="button" style="--node-color: ${nodeColor(node.type)};">
        <span class="node-dot" aria-hidden="true"></span>
        <span class="node-chip">
          <strong>${node.label}</strong>
          <em>${node.subtitle}</em>
        </span>
      </button>
    `,
  });
}

function renderNodes(activeScenarioId) {
  if (!nodeLayer) {
    return;
  }

  nodeLayer.clearLayers();

  nodes.forEach((node) => {
    const marker = L.marker(node.coords, {
      icon: nodeIcon(node, node.id === activeScenarioId),
      keyboard: false,
      title: `${node.label} (${nodeTypeLabel[node.type]})`,
    }).addTo(nodeLayer);

    marker.on("click", () => applyScenario(node.id));
  });
}

function setScenarioCopy(scenario) {
  systemStatusElement.textContent = scenario.status;
  scenarioTitleElement.textContent = scenario.name;
  scenarioDescriptionElement.textContent = scenario.description;
  scenarioImpactElement.textContent = scenario.impact;
  stressNodeElement.textContent = scenario.stressNode;
}

function applyScenario(id) {
  const scenario = scenarios.find((entry) => entry.id === id) || scenarios[0];

  document.querySelectorAll(".scenario-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.scenario === scenario.id);
  });

  setScenarioCopy(scenario);
  renderFlows(scenario);
  renderNodes(scenario.id);
}

function startClock() {
  const clockElement = document.getElementById("sim-clock");

  function tick() {
    const now = new Date();
    clockElement.textContent =
      now.toLocaleTimeString("it-IT", {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) + " UTC";
  }

  tick();
  window.setInterval(tick, 1000);
}

function init() {
  buildScenarioButtons();
  startClock();

  const ready = ensureMap();
  applyScenario("baseline");

  if (ready) {
    map.whenReady(() => {
      applyScenario("baseline");
      map.invalidateSize();
    });
  }
}

init();
