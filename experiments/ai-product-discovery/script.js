let knowledgeBase = [];
let globalCatalog = [];
let taxonomy = {};

const EXPLAIN_ENDPOINT = "https://desk-ai-explain.nmgolen.workers.dev";

let activeAttrs = {
    deskTypes: [],
    materials: [],
    colors: [],
    styles: [],
    features: [],
    excluded: {
        deskTypes: [],
        materials: [],
        colors: [],
        styles: [],
        features: []
    }
};

let currentInputLower = "";
let pendingTimers = [];
let typeInterval = null;

const ATTR_KEYS = ["deskTypes", "materials", "colors", "styles", "features"];

const FILTER_GROUPS = [
    { key: "deskTypes", label: "Desk Type", source: () => taxonomy.deskTypes || [] },
    { key: "materials", label: "Materials", source: () => Object.values(taxonomy.materials || {}).flat() },
    { key: "colors", label: "Color", source: () => Object.values(taxonomy.colors || {}).flat() },
    { key: "styles", label: "Style", source: () => taxonomy.styles || [] },
    { key: "features", label: "Features", source: () => (taxonomy.functionalFeatures || []).concat(taxonomy.storageFeatures || []) }
];

Promise.all([
    fetch("data/products.json").then(r => r.json()),
    fetch("data/taxonomy.json").then(r => r.json())
]).then(([p, t]) => {
    knowledgeBase = p.intents;
    globalCatalog = p.catalog || [];
    taxonomy = t;
    buildFilterPanel();
});

document.querySelectorAll(".prompt").forEach(b => b.onclick = () => { userInput.value = b.innerText; });
analyzeButton.onclick = analyzeRequest;

function analyzeRequest() {
    const input = userInput.value.toLowerCase().trim();
    if (!input) { alert("Please enter a request."); return; }

    currentInputLower = input;
    activeAttrs = detectAttributes(input);
    runPipeline(true);
}

const NEGATION_PATTERN = "(?:no|not|don'?t|doesn'?t|won'?t|without|non-?|excluding|except(?:\\s+for)?)";

function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function isNegated(input, term) {
    const pattern = new RegExp(`\\b${NEGATION_PATTERN}[\\s-]+(?:a[\\s-]+|an[\\s-]+)?${escapeRegExp(term.toLowerCase())}\\b`, "i");
    return pattern.test(input);
}

function detectAttributes(input) {
    const d = { deskTypes: [], materials: [], colors: [], styles: [], features: [], excluded: { deskTypes: [], materials: [], colors: [], styles: [], features: [] } };

    const add = (cat, v, matchTerm) => {
        if (isNegated(input, matchTerm)) d.excluded[cat].push(v);
        else d[cat].push(v);
    };

    (taxonomy.deskTypes || []).forEach(v => {
        const term = v.toLowerCase().replace(" desk", "");
        if (input.includes(term)) add("deskTypes", v, term);
    });
    ["wood", "engineeredWood", "metal", "glass", "stone", "other"].forEach(k => {
        (taxonomy.materials?.[k] || []).forEach(v => { if (input.includes(v.toLowerCase())) add("materials", v, v); });
    });
    Object.values(taxonomy.colors || {}).flat().forEach(v => { if (input.includes(v.toLowerCase())) add("colors", v, v); });
    (taxonomy.styles || []).forEach(v => { if (input.includes(v.toLowerCase())) add("styles", v, v); });
    (taxonomy.functionalFeatures || []).concat(taxonomy.storageFeatures || []).forEach(v => { if (input.includes(v.toLowerCase())) add("features", v, v); });

    return d;
}

function scoreIntent(intent, input, attrs) {
    let score = 0;
    intent.keywords.forEach(k => {
        const term = k.term.toLowerCase();
        if (input && input.includes(term)) {
            score += isNegated(input, term) ? -k.weight : k.weight;
        }
    });

    const pref = intent.preferredAttributes || {};
    ["deskTypes", "materials", "styles", "features"].forEach(field => {
        const wanted = pref[field] || [];
        const active = attrs[field] || [];
        const excluded = (attrs.excluded && attrs.excluded[field]) || [];
        wanted.forEach(w => {
            if (active.some(a => a.toLowerCase() === w.toLowerCase())) score += 12;
            if (excluded.some(a => a.toLowerCase() === w.toLowerCase())) score -= 40;
        });
    });
    return score;
}

function rankAllIntents(input, attrs) {
    const scored = knowledgeBase.map(intent => ({ intent, score: scoreIntent(intent, input, attrs) }));
    scored.sort((a, b) => b.score - a.score);
    const total = scored.reduce((s, x) => s + Math.max(x.score, 0), 0) || 1;
    return scored.map(x => ({ ...x, confidence: x.score > 0 ? Math.round((x.score / total) * 100) : 0 }));
}

function clearTimers() {
    pendingTimers.forEach(clearTimeout);
    pendingTimers = [];
    if (typeInterval) { clearInterval(typeInterval); typeInterval = null; }
}

function reveal(el) { el.classList.remove("hidden"); el.classList.add("fade-in"); }
function hide(el) { el.classList.add("hidden"); }

function runPipeline(animate) {
    clearTimers();
    const ranked = rankAllIntents(currentInputLower, activeAttrs);
    const top = ranked[0];

    renderChips();
    syncFilterPanel();

    const hasActiveFilters = Object.values(activeAttrs).some(val => Array.isArray(val) && val.length > 0) || 
                             Object.values(activeAttrs.excluded || {}).some(val => Array.isArray(val) && val.length > 0);

    if ((!top || top.score <= 0) && !hasActiveFilters) {
        hideThinking();
        showNoResults();
        reveal(attributeCard);
        [graphCard, reasoningCard, categoryCard, productCard, explanationCard].forEach(hide);
        return;
    }

    let fallbackName = "Custom Attribute Match";
    if (activeAttrs.styles && activeAttrs.styles.length > 0) {
        fallbackName = `${activeAttrs.styles.join(", ")} Style Match`;
    } else if (activeAttrs.materials && activeAttrs.materials.length > 0) {
        fallbackName = `${activeAttrs.materials.join(", ")} Material Match`;
    } else if (activeAttrs.deskTypes && activeAttrs.deskTypes.length > 0) {
        fallbackName = `${activeAttrs.deskTypes.join(", ")} Match`;
    }

    const effectiveTop = (top && top.score > 0) ? top : {
        intent: { 
            name: fallbackName, 
            categories: ["Desks"], 
            keywords: [], 
            preferredAttributes: activeAttrs 
        },
        score: 1,
        confidence: 50
    };
    if (!animate) {
        renderIntentGraph(ranked);
        renderReasoning(effectiveTop);
        renderCategories(effectiveTop.intent);
        renderProducts(effectiveTop.intent);
        setExplanationInstant(effectiveTop);
        [attributeCard, graphCard, reasoningCard, categoryCard, productCard, explanationCard].forEach(reveal);
        return;
    }

    showThinking();
    pendingTimers.push(setTimeout(() => { hideThinking(); reveal(attributeCard); }, 400));
    pendingTimers.push(setTimeout(() => { renderIntentGraph(ranked); reveal(graphCard); }, 900));
    pendingTimers.push(setTimeout(() => { renderReasoning(effectiveTop); reveal(reasoningCard); }, 1400));
    pendingTimers.push(setTimeout(() => { renderCategories(effectiveTop.intent); reveal(categoryCard); }, 1800));
    pendingTimers.push(setTimeout(() => { renderProducts(effectiveTop.intent); reveal(productCard); }, 2100));
    pendingTimers.push(setTimeout(() => { reveal(explanationCard); typeExplanation(effectiveTop); }, 2500));
}
function showThinking() { thinkingIndicator.classList.remove("hidden"); }
function hideThinking() { thinkingIndicator.classList.add("hidden"); }

function renderChips() {
    let html = "";
    let any = false;
    ATTR_KEYS.forEach(cat => {
        (activeAttrs[cat] || []).forEach(v => {
            any = true;
            html += `<span class="attribute-chip removable" data-cat="${cat}" data-val="${escapeAttr(v)}">${v}<button type="button" class="chip-remove" aria-label="Remove ${v}">&times;</button></span>`;
        });
        ((activeAttrs.excluded && activeAttrs.excluded[cat]) || []).forEach(v => {
            any = true;
            html += `<span class="attribute-chip excluded removable" data-cat="${cat}" data-val="${escapeAttr(v)}" data-excluded="true">No ${v}<button type="button" class="chip-remove" aria-label="Remove exclusion ${v}">&times;</button></span>`;
        });
    });
    attributeOutput.innerHTML = any ? html : `<span class="empty-note">No attributes detected yet — type a request or pick filters below.</span>`;

    attributeOutput.querySelectorAll(".chip-remove").forEach(btn => {
        btn.onclick = (e) => {
            const chip = e.target.closest(".attribute-chip");
            const cat = chip.dataset.cat, val = chip.dataset.val;
            if (chip.dataset.excluded) {
                activeAttrs.excluded[cat] = activeAttrs.excluded[cat].filter(v => v !== val);
            } else {
                activeAttrs[cat] = activeAttrs[cat].filter(v => v !== val);
            }
            runPipeline(false);
        };
    });
}

function escapeAttr(v) { return v.replace(/"/g, "&quot;"); }

function buildFilterPanel() {
    filterOutput.innerHTML = FILTER_GROUPS.map(group => `
        <div class="filter-group">
            <h4>${group.label}</h4>
            <div class="filter-options">
                ${group.source().map(v => `
                    <label class="filter-option">
                        <input type="checkbox" data-cat="${group.key}" value="${escapeAttr(v)}">
                        <span>${v}</span>
                    </label>
                `).join("")}
            </div>
        </div>
    `).join("");

    filterOutput.querySelectorAll("input[type=checkbox]").forEach(cb => {
        cb.onchange = () => {
            const cat = cb.dataset.cat, val = cb.value;
            if (cb.checked) {
                if (!activeAttrs[cat].includes(val)) activeAttrs[cat].push(val);
            } else {
                activeAttrs[cat] = activeAttrs[cat].filter(v => v !== val);
            }
            runPipeline(false);
        };
    });
}

function syncFilterPanel() {
    filterOutput.querySelectorAll("input[type=checkbox]").forEach(cb => {
        cb.checked = (activeAttrs[cb.dataset.cat] || []).includes(cb.value);
    });
}

function renderIntentGraph(ranked) {
    const maxScore = Math.max(...ranked.map(r => r.score), 1);
    graphOutput.innerHTML = ranked.map(r => `
        <div class="graph-row ${r.score > 0 && r === ranked[0] ? "graph-row-top" : ""}">
            <div class="graph-label">${r.intent.name}</div>
            <div class="graph-bar-track">
                <div class="graph-bar" style="width:${r.score > 0 ? Math.max((r.score / maxScore) * 100, 4) : 0}%"></div>
            </div>
            <div class="graph-value">${r.confidence}%</div>
        </div>
    `).join("");
}

function renderReasoning(top) {
    reasoningOutput.innerHTML = `
        <div class="reasoning-item">
            <div class="reasoning-label">Top Intent</div>
            <div class="reasoning-value">${top.intent.name}</div>
        </div>
        <div class="reasoning-item">
            <div class="reasoning-label">Match Score</div>
            <div class="reasoning-value">${top.score}</div>
        </div>
        <div class="reasoning-item">
            <div class="reasoning-label">Confidence</div>
            <div class="reasoning-value">${top.confidence}%</div>
        </div>
    `;
}

function renderCategories(intent) {
    categoryOutput.innerHTML = (intent.categories || []).map(c => `<div class="chip">${c}</div>`).join("");
}

function renderProducts(intent) {
    if (!globalCatalog || globalCatalog.length === 0) {
        productOutput.innerHTML = `<div class="product"><p>No products available.</p></div>`;
        return;
    }

    const pref = intent.preferredAttributes || {};

    const scoredProducts = globalCatalog.map(prod => {
        let matchScore = 0;
        
        if (pref.deskTypes && prod.deskType && pref.deskTypes.some(dt => dt.toLowerCase() === prod.deskType.toLowerCase())) matchScore += 2;
        if (pref.materials && prod.material && pref.materials.some(m => m.toLowerCase() === prod.material.toLowerCase())) matchScore += 3;
        if (pref.styles && prod.style && pref.styles.some(s => s.toLowerCase() === prod.style.toLowerCase())) matchScore += 3;

        if (activeAttrs.deskTypes && activeAttrs.deskTypes.length > 0 && prod.deskType) {
            if (activeAttrs.deskTypes.some(dt => dt.toLowerCase() === prod.deskType.toLowerCase())) matchScore += 4;
        }
        if (activeAttrs.materials && activeAttrs.materials.length > 0 && prod.material) {
            if (activeAttrs.materials.some(m => m.toLowerCase() === prod.material.toLowerCase())) matchScore += 4;
        }
        if (activeAttrs.styles && activeAttrs.styles.length > 0 && prod.style) {
            if (activeAttrs.styles.some(s => s.toLowerCase() === prod.style.toLowerCase())) matchScore += 5; 
        }
        if (activeAttrs.colors && activeAttrs.colors.length > 0 && prod.color) {
            if (activeAttrs.colors.some(c => c.toLowerCase() === prod.color.toLowerCase())) matchScore += 3;
        }

        if (activeAttrs.excluded) {
            if (prod.material && activeAttrs.excluded.materials?.some(m => m.toLowerCase() === prod.material.toLowerCase())) matchScore -= 50;
            if (prod.style && activeAttrs.excluded.styles?.some(s => s.toLowerCase() === prod.style.toLowerCase())) matchScore -= 50;
        }

        return { product: prod, score: matchScore };
    });

    scoredProducts.sort((a, b) => b.score - a.score);

    let displayList = scoredProducts.filter(item => item.score >= 0).map(item => item.product);

    if (displayList.length === 0 && scoredProducts.length > 0) {
        displayList = scoredProducts.slice(0, 3).map(item => item.product);
    } else {

        displayList = displayList.slice(0, 4);
    }

    if (displayList.length > 0) {
        productOutput.innerHTML = displayList.map(p => `
            <div class="product-card" style="border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; margin-bottom: 12px; background: #fff;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <h3 style="margin: 0; font-size: 16px; color: #0f172a;">${p.name || 'Desk'}</h3>
                    <span style="font-weight: 700; color: #2563eb; background: #dbeafe; padding: 2px 8px; border-radius: 20px; font-size: 13px;">${p.price || ''}</span>
                </div>
                <p style="color: #64748b; font-size: 13px; margin-bottom: 10px; line-height: 1.4;">${p.description || ''}</p>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                    ${p.deskType ? `<span class="chip">${p.deskType}</span>` : ''}
                    ${p.material ? `<span class="chip">${p.material}</span>` : ''}
                    ${p.style ? `<span class="chip">${p.style}</span>` : ''}
                    ${p.color ? `<span class="chip">${p.color}</span>` : ''}
                </div>
            </div>
        `).join("");
    } else {
        productOutput.innerHTML = `<p style="color: #64748b; font-size: 14px; text-align: center; padding: 20px;">No matching products found.</p>`;
    }
}

function buildExplanationText(top) {
    const matchedTerms = top.intent.keywords
        .filter(k => currentInputLower.includes(k.term.toLowerCase()) && !isNegated(currentInputLower, k.term))
        .map(k => k.term);

    const attrHits = [];
    const excludedHits = [];
    ATTR_KEYS.forEach(cat => {
        (activeAttrs[cat] || []).forEach(v => attrHits.push(v));
        ((activeAttrs.excluded && activeAttrs.excluded[cat]) || []).forEach(v => excludedHits.push(v));
    });

    let text = "Here's why I recommended these: ";
    if (matchedTerms.length) {
        text += `your request matched ${matchedTerms.map(t => `"${t}"`).join(", ")}. `;
    }
    if (attrHits.length) {
        text += `I also detected ${attrHits.join(", ")} as relevant attributes. `;
    }
    if (excludedHits.length) {
        text += `I ruled out matches involving ${excludedHits.join(", ")} since you excluded those. `;
    }
    text += `Together that gives the ${top.intent.name} intent a ${top.confidence}% confidence score relative to the other matches shown in the graph above.`;
    return text;
}

async function typeExplanation(top) {
    let text = buildExplanationText(top);

    try {
        const res = await fetch(EXPLAIN_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userInput: currentInputLower,
                attributes: activeAttrs,
                intentName: top.intent.name,
                confidence: top.confidence
            })
        });
        if (res.ok) {
            const data = await res.json();
            if (data.explanation) text = data.explanation;
        }
    } catch (e) {
        console.warn("Gemini explanation unavailable, using fallback:", e);
    }

    explanationOutput.innerHTML = "";
    let i = 0;
    typeInterval = setInterval(() => {
        explanationOutput.textContent = text.slice(0, i);
        i++;
        if (i > text.length) clearInterval(typeInterval);
    }, 12);
}

function setExplanationInstant(top) {
    explanationOutput.textContent = buildExplanationText(top);
}

function showNoResults() {
    reasoningOutput.innerHTML = "No match yet — try a different phrase or add a filter.";
    categoryOutput.innerHTML = "";
    productOutput.innerHTML = "";
    explanationOutput.innerHTML = "";
    graphOutput.innerHTML = "";
    reveal(reasoningCard);
    [graphCard, categoryCard, productCard, explanationCard].forEach(hide);
}
