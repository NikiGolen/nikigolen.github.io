import { programs } from "./data/programs.js";

let currentProgram = "search";

const programSelect = document.getElementById("programSelect");

const programTitle = document.getElementById("programTitle");
const programSubtitle = document.getElementById("programSubtitle");

const budget = document.getElementById("budget");
const timeline = document.getElementById("timeline");
const engineeringTeams = document.getElementById("engineeringTeams");

const statusLabel = document.getElementById("statusLabel");
const statusDescription = document.getElementById("statusDescription");

const durationMini = document.getElementById("durationMini");
const teamsMini = document.getElementById("teamsMini");
const complexityMini = document.getElementById("complexityMini");

const problemStatement = document.getElementById("problemStatement");
const objectiveList = document.getElementById("objectiveList");
const technicalScope = document.getElementById("technicalScope");
const expectedOutcomes = document.getElementById("expectedOutcomes");

const architectureDiagram = document.getElementById("architectureDiagram");

const stakeholderGrid = document.getElementById("stakeholderGrid");

const dependencyList = document.getElementById("dependencyList");
const criticalPath = document.getElementById("criticalPath");

const riskMatrix = document.getElementById("riskMatrix");
const riskTableBody = document.getElementById("riskTableBody");
const riskScore = document.getElementById("riskScore");
const riskScoreBar = document.getElementById("riskScoreBar");
const riskSummary = document.getElementById("riskSummary");
const riskActions = document.getElementById("riskActions");

const timelineContainer = document.getElementById("timelineContainer");

const kpiGrid = document.getElementById("kpiGrid");

const executiveSummary = document.getElementById("executiveSummary");

const programHealth = document.getElementById("programHealth");

function clear(element) {
    if (element) {
        element.innerHTML = "";
    }
}

function createList(element, items) {
    clear(element);

    if (!items || !Array.isArray(items)) {
        console.warn("Missing list data:", items);
        return;
    }

    items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        element.appendChild(li);
    });
}

const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(btn => btn.classList.remove("active"));
        tabContents.forEach(section => section.classList.remove("active"));

        tab.classList.add("active");

        const target = document.getElementById(tab.dataset.tab);
        if (target) {
            target.classList.add("active");
        }
    });
});

programSelect.addEventListener("change", event => {
    currentProgram = event.target.value;
    renderProgram(currentProgram);
});

function renderHeader(program) {
    programTitle.textContent = program.executive.title;
    programSubtitle.textContent = program.executive.subtitle;

    budget.textContent = program.executive.budget;
    timeline.textContent = program.executive.timeline;
    engineeringTeams.textContent = program.stakeholders.length;

    statusLabel.textContent = program.executive.status;
    statusDescription.textContent = program.executive.statusDescription;

    durationMini.textContent = program.executive.duration;
    teamsMini.textContent = program.stakeholders.length;
    complexityMini.textContent = program.executive.complexity;
}

function renderSummary(program) {
    problemStatement.textContent = program.summary.problem;

    createList(objectiveList, program.summary.objectives);
    createList(technicalScope, program.summary.technicalScope);
    createList(expectedOutcomes, program.summary.expectedOutcomes);
}
const LANES = [
    { type: "frontend", label: "Frontend" },
    { type: "service", label: "Services" },
    { type: "data", label: "Data" }
];

function renderArchitecture(program) {
    clear(architectureDiagram);

    const lanesPresent = LANES.filter(lane =>
        program.architecture.some(node => node.type === lane.type)
    );

    lanesPresent.forEach((lane, laneIndex) => {
        const laneEl = document.createElement("div");
        laneEl.className = "arch-lane";

        const nodesHtml = program.architecture
            .filter(node => node.type === lane.type)
            .map(node => `
                <div class="architecture-node ${node.type}">
                    <h3>${node.title}</h3>
                    <p>${node.description}</p>
                </div>
            `)
            .join("");

        laneEl.innerHTML = `
            <div class="arch-lane-label">${lane.label}</div>
            ${nodesHtml}
        `;

        architectureDiagram.appendChild(laneEl);

        if (laneIndex < lanesPresent.length - 1) {
            const connector = document.createElement("div");
            connector.className = "arch-connector";
            architectureDiagram.appendChild(connector);
        }
    });
}

function renderStakeholders(program) {
    clear(stakeholderGrid);

    program.stakeholders.forEach(person => {
        const card = document.createElement("div");
        card.className = "stakeholder-card";

        card.innerHTML = `
            <h3>${person.team}</h3>
            <strong>${person.owner}</strong>
            <p>${person.role}</p>
        `;

        stakeholderGrid.appendChild(card);
    });
}

function renderDependencies(program) {
    clear(dependencyList);
    clear(criticalPath);

    program.dependencies.forEach(dep => {
        const item = document.createElement("div");
        item.className = "dependency-item";
        item.dataset.status = dep.status;

        item.innerHTML = `
            <strong>${dep.name}</strong>
            <span>${dep.status}</span>
        `;

        dependencyList.appendChild(item);
    });

    const critical = program.dependencies.filter(dep => dep.status !== "Complete");

    if (!critical.length) {
        const done = document.createElement("p");
        done.className = "section-subtitle";
        done.textContent = "No outstanding dependencies — critical path is clear.";
        criticalPath.appendChild(done);
        return;
    }

    critical.forEach(item => {
        const step = document.createElement("div");
        step.className = "critical-step";
        step.textContent = `${item.name} — ${item.status}`;
        criticalPath.appendChild(step);
    });
}
const RISK_LEVELS = ["Low", "Medium", "High"];

function severityFor(probability, impact) {
    const pIndex = RISK_LEVELS.indexOf(probability);
    const iIndex = RISK_LEVELS.indexOf(impact);
    const sum = pIndex + iIndex;

    if (sum >= 3) return "high";
    if (sum >= 1) return "med";
    return "low";
}

function renderRiskMatrix(program) {
    clear(riskMatrix);

    // header row: corner + 3 probability columns
    riskMatrix.appendChild(makeCell("rm-corner", ""));
    RISK_LEVELS.forEach(level => {
        riskMatrix.appendChild(makeCell("rm-axis-label", level));
    });

    // rows: impact High -> Low (top = worst), each with 3 probability cells
    const impactRows = ["High", "Medium", "Low"];

    impactRows.forEach(impact => {
        riskMatrix.appendChild(makeCell("rm-row-label", impact));

        RISK_LEVELS.forEach(probability => {
            const sev = severityFor(probability, impact);
            const cell = document.createElement("div");
            cell.className = `rm-cell sev-${sev}`;

            const matches = program.risks.filter(
                risk => risk.probability === probability && risk.impact === impact
            );

            cell.innerHTML = matches
                .map(risk => `<span class="rm-chip">${risk.risk}</span>`)
                .join("");

            riskMatrix.appendChild(cell);
        });
    });
}

function makeCell(className, text) {
    const el = document.createElement("div");
    el.className = className;
    el.textContent = text;
    return el;
}

const RISK_WEIGHTS = { Low: 1, Medium: 2, High: 3 };

function riskSeverityScore(program) {
    const total = program.risks.reduce((sum, risk) => {
        return sum + RISK_WEIGHTS[risk.probability] * RISK_WEIGHTS[risk.impact];
    }, 0);

    const maxPossible = program.risks.length * 9; // 3 x 3 ceiling per risk
    return maxPossible ? Math.round((total / maxPossible) * 100) : 0;
}

function renderRisks(program) {
    clear(riskTableBody);
    clear(riskActions);

    renderRiskMatrix(program);

    program.risks.forEach(risk => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${risk.risk}</td>
            <td>${risk.probability}</td>
            <td>${risk.impact}</td>
            <td>${risk.owner}</td>
            <td>${risk.mitigation}</td>
        `;

        riskTableBody.appendChild(row);

        const action = document.createElement("li");
        action.textContent = `${risk.risk}: ${risk.mitigation}`;
        riskActions.appendChild(action);
    });

    const score = riskSeverityScore(program);

    riskScore.textContent = score;
    riskScoreBar.style.width = `${score}%`;

    riskSummary.textContent =
        score >= 60
            ? "Higher technical risk driven by multiple high-probability, high-impact items."
            : score >= 35
            ? "Moderate technical risk with manageable cross-team dependencies."
            : "Low overall technical risk based on current assessment.";
}

function renderProgramHealth(program) {
    const total = program.dependencies.length;
    const complete = program.dependencies.filter(d => d.status === "Complete").length;
    const completionRate = total ? (complete / total) * 100 : 100;

    const severity = riskSeverityScore(program);

    const health = Math.round(completionRate * 0.5 + (100 - severity) * 0.5);

    programHealth.textContent = `${health}%`;
}

function phaseRank(name) {
    const n = name.toLowerCase();
    if (/discovery|assessment|planning|vendor selection/.test(n)) return 0;
    if (/architecture|design/.test(n)) return 1;
    if (/development|migration|implementation|platform|integration|prototype|data collection|model training/.test(n)) return 2;
    if (/testing|validation|regional testing|parallel run/.test(n)) return 3;
    if (/pilot|beta|warehouse pilot|training/.test(n)) return 4;
    if (/production|launch|general availability|cutover|compliance audit|enterprise rollout/.test(n)) return 5;
    return 2;
}

function renderRoadmap(program) {
    clear(timelineContainer);

    const statusRank = phaseRank(program.executive.status);

    let activeIndex = 0;
    let bestDiff = Infinity;

    program.roadmap.forEach((phase, index) => {
        const diff = Math.abs(phaseRank(phase) - statusRank);
        if (diff < bestDiff) {
            bestDiff = diff;
            activeIndex = index;
        }
    });

    program.roadmap.forEach((phase, index) => {
        const step = document.createElement("div");

        let state = "is-upcoming";
        if (index < activeIndex) state = "is-complete";
        if (index === activeIndex) state = "is-current";

        step.className = `timeline-step ${state}`;

        step.innerHTML = `
            <div class="timeline-dot">${index < activeIndex ? "&#10003;" : index + 1}</div>
            <h4>${phase}</h4>
            <p>${state === "is-current" ? "In progress" : state === "is-complete" ? "Complete" : "Upcoming"}</p>
        `;

        timelineContainer.appendChild(step);
    });
}

function renderKPIs(program) {
    clear(kpiGrid);

    program.kpis.forEach(kpi => {
        const card = document.createElement("div");
        card.className = "kpi-card";

        card.innerHTML = `
            <h3>${kpi.name}</h3>
            <div class="kpi-value">${kpi.target}</div>
            <div class="kpi-target">Target Outcome</div>
        `;

        kpiGrid.appendChild(card);
    });
}

function renderExecutiveSummary(program) {
    clear(executiveSummary);

    const items = [
        { title: "Business Value", text: program.summary.businessValue },
        { title: "Program Complexity", text: program.executive.complexity },
        { title: "Timeline", text: program.executive.timeline },
        { title: "Investment", text: program.executive.budget }
    ];

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "executive-item";

        card.innerHTML = `
            <h4>${item.title}</h4>
            <p>${item.text}</p>
        `;

        executiveSummary.appendChild(card);
    });
}

function renderProgram(programKey) {
    const program = programs[programKey];

    if (!program) {
        console.error("Program not found:", programKey);
        return;
    }

    renderHeader(program);
    renderSummary(program);
    renderArchitecture(program);
    renderStakeholders(program);
    renderDependencies(program);
    renderRisks(program);
    renderRoadmap(program);
    renderKPIs(program);
    renderExecutiveSummary(program);
    renderProgramHealth(program);
}

document.addEventListener("DOMContentLoaded", () => {
    renderProgram(currentProgram);
});
