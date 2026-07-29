let productCatalog = [];

const wirelessSynonyms = [
    "wireless", "cordless", "bluetooth", "wifi", "wi-fi",
    "battery", "portable", "rf", "true wireless"
];

const wiredSynonyms = [
    "wired", "corded", "cable", "plugged", "usb", "usb-c",
    "lightning", "aux", "has wire", "with wire", "with a wire"
];

const negativeModifiers = ["no ", "not ", "without ", "non-"];

const CATEGORIES = ["accessory", "peripherals", "audio"];

fetch("catalog-schema.json")
    .then(response => response.json())
    .then(data => {
        productCatalog = data;
        renderRecordGrid(productCatalog);
        evaluateSearch("");
    })
    .catch(error => {
        console.error("Error loading catalog schema:", error);
    });

function resolveAttribute(product) {
    let resolvedIsWireless = product.isWireless;
    let wasResolved = false;

    if (resolvedIsWireless === null) {
        const tags = product.tags || [];
        if (tags.includes("corded") || tags.includes("wired")) {
            resolvedIsWireless = false;
            wasResolved = true;
        }
    }

    return { ...product, resolvedIsWireless, wasResolved };
}
function evaluateSearch(queryText) {
    const trace = [];
    const query = (queryText || "").toLowerCase().trim();

    if (!query) {
        trace.push({ tag: "parse", text: "No query — showing full catalog" });
        const resolved = productCatalog.map(resolveAttribute);
        renderTrace(trace);
        renderResults(resolved, resolved.length);
        return;
    }

    trace.push({ tag: "parse", text: `tokenize → "${query}"` });

    let negatedWireless = false;
    let negatedWired = false;
    let negationTerm = null;

    negativeModifiers.forEach(mod => {
        wirelessSynonyms.forEach(term => {
            if (query.includes(mod + term)) {
                negatedWireless = true;
                negationTerm = mod.trim() + " " + term;
            }
        });
        wiredSynonyms.forEach(term => {
            if (query.includes(mod + term)) {
                negatedWired = true;
                negationTerm = mod.trim() + " " + term;
            }
        });
        if (query.includes(mod + "wire")) {
            negatedWired = true;
            negationTerm = mod.trim() + " wire";
        }
    });

    if (negationTerm) {
        trace.push({ tag: "detect", text: `negation found → "${negationTerm}"` });
    } else {
        trace.push({ tag: "detect", text: "no negation modifier present" });
    }

    const matchesWirelessKeyword = wirelessSynonyms.some(term => new RegExp(`\\b${term}\\b`, "i").test(query));
    const matchesWiredKeyword = wiredSynonyms.some(term => new RegExp(`\\b${term}\\b`, "i").test(query));

    const isWirelessQuery = (matchesWirelessKeyword && !negatedWireless) || negatedWired;
    const isWiredQuery = (matchesWiredKeyword && !negatedWired) || negatedWireless;

    if (isWirelessQuery) {
        trace.push({ tag: "detect", text: "intent resolved → WIRELESS" });
    } else if (isWiredQuery) {
        trace.push({ tag: "detect", text: "intent resolved → WIRED" });
    } else {
        trace.push({ tag: "detect", text: "no boolean intent — category/text match only" });
    }

    const targetCategory = CATEGORIES.find(category => query.includes(category));
    if (targetCategory) {
        trace.push({ tag: "filter", text: `category constraint → "${targetCategory}"` });
    }

    const withResolution = productCatalog.map(resolveAttribute);
    const rescuedCount = withResolution.filter(p => p.wasResolved).length;

    if (rescuedCount > 0) {
        trace.push({
            tag: "resolve",
            text: `${rescuedCount} null attribute${rescuedCount > 1 ? "s" : ""} inferred from tags`
        });
    }

    const results = withResolution.filter(product => {
        const matchesCategory = targetCategory ? product.category === targetCategory : true;

        if (isWirelessQuery) {
            return matchesCategory && product.resolvedIsWireless === true;
        }
        if (isWiredQuery) {
            return matchesCategory && product.resolvedIsWireless === false;
        }
        return matchesCategory;
    });

    trace.push({ tag: "filter", text: "applying resolved filter to catalog" });
    trace.push({ tag: "result", text: `${results.length} record${results.length === 1 ? "" : "s"} matched` });

    renderTrace(trace);
    renderResults(results, productCatalog.length, query);
}
function renderRecordGrid(products) {
    const grid = document.getElementById("record-grid");
    if (!grid) return;

    grid.innerHTML = products.map(product => {
        const isGap = product.isWireless === null;

        const flagPill = isGap
            ? `<span class="flag-pill is-null">null</span>`
            : product.isWireless
                ? `<span class="flag-pill is-true">true</span>`
                : `<span class="flag-pill is-false">false</span>`;

        const tags = (product.tags || [])
            .map(tag => `<span class="record-tag">#${tag}</span>`)
            .join("");

        return `
            <div class="record-card ${isGap ? "is-gap" : ""}">
                <div class="record-name">${product.name}</div>
                <div class="record-category">${product.category}</div>
                <div class="record-flag">
                    <span class="record-flag-key">isWireless:</span>
                    ${flagPill}
                </div>
                <div class="record-tags">${tags}</div>
            </div>
        `;
    }).join("");
}
const TAG_LABEL = {
    parse: "[PARSE]",
    detect: "[DETECT]",
    resolve: "[RESOLVE]",
    filter: "[FILTER]",
    result: "[RESULT]"
};

function renderTrace(trace) {
    const console_ = document.getElementById("trace-console");
    if (!console_) return;

    const lines = trace.map((step, i) => `
        <div class="trace-line" style="animation-delay:${i * 60}ms">
            <span class="trace-tag trace-tag--${step.tag}">${TAG_LABEL[step.tag] || ""}</span>
            <span>${step.text}</span>
        </div>
    `).join("");

    console_.innerHTML = lines + `<span class="trace-cursor"></span>`;
    console_.scrollTop = console_.scrollHeight;
}

function renderResults(products, totalCount, query) {
    const container = document.getElementById("results-container");
    const countEl = document.getElementById("results-count");

    if (countEl) {
        countEl.textContent = query
            ? `${products.length} of ${totalCount} records`
            : `showing all ${totalCount} records`;
    }

    if (!container) return;

    if (!products.length) {
        container.innerHTML = `<p class="empty-state">No records satisfy this constraint.</p>`;
        return;
    }

    container.innerHTML = products.map(product => {
        const wirelessStatus = product.isWireless === null
            ? "unresolved"
            : product.isWireless ? "true" : "false";

        const chip = product.resolvedIsWireless === true
            ? `<span class="result-chip is-true">wireless</span>`
            : `<span class="result-chip is-false">wired</span>`;

        const rescueChip = product.wasResolved
            ? `<span class="result-chip is-rescued">qsf resolved</span>`
            : "";

        return `
            <div class="result-card ${product.wasResolved ? "is-rescued" : ""}">
                <div class="result-top">
                    <span class="result-name">${product.name}</span>
                    <span style="display:flex; gap:6px;">${chip}${rescueChip}</span>
                </div>
                <div class="result-meta">
                    ${product.category} &middot; raw isWireless: ${wirelessStatus}
                </div>
            </div>
        `;
    }).join("");
}


let debounceHandle;
const searchInput = document.getElementById("search-input");

if (searchInput) {
    searchInput.addEventListener("input", event => {
        clearTimeout(debounceHandle);
        const value = event.target.value;
        debounceHandle = setTimeout(() => evaluateSearch(value), 120);
    });
}

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
} else {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("in-view"));
}
