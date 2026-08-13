const DETAILS = {
  "c1-customer": {
    kind: "Person",
    title: "Customer",
    summary: "The person checking out. Everything the system knows about risk starts with them: their device, their session, how they're paying.",
    points: [
      "Only talks to the Ecommerce Platform. Never touches Fraud Decisioning directly.",
      "Any friction we add here (extra verification, a hold on the order) costs us conversion, so it can't be free.",
      "The raw material for every signal downstream comes from this one interaction."
    ]
  },
  "c1-ecommerce": {
    kind: "Software System",
    title: "Ecommerce Platform",
    summary: "The storefront and checkout flow. It owns the customer relationship and calls Fraud Decisioning before it'll confirm an order.",
    points: [
      "Passes along cart, device, and session context at checkout.",
      "Has to handle three different outcomes gracefully: approve, quietly hold for review, or block.",
      "This call happens in the checkout path, so scoring needs to come back fast."
    ]
  },
  "c1-fraud": {
    kind: "Software System · in scope for this role",
    title: "Fraud Decisioning",
    summary: "Scores every order and decides whether it goes through, gets reviewed, or gets blocked. This is the system a Digital Fraud PM would actually own.",
    points: [
      "Always pulling in two directions: catch more fraud, but don't punish good customers for looking suspicious.",
      "Takes in signals from the platform and the payment provider, and outputs a decision plus a reason for it.",
      "Anything it can't decide confidently gets handed to a person."
    ]
  },
  "c1-payment": {
    kind: "External System",
    title: "Payment Provider",
    summary: "The third-party processor. Handles authorization, AVS/CVV checks, and lets us know when a chargeback comes in.",
    points: [
      "Fraud Decisioning calls out to it for payment-specific signals.",
      "Chargebacks that come back later are some of the best training data we get.",
      "We integrate with it, we don't build it."
    ]
  },
  "c1-order": {
    kind: "Software System",
    title: "Order Management",
    summary: "Takes over once a decision has been made and runs fulfillment.",
    points: [
      "Gets the final call and either ships the order or holds it.",
      "Once something's shipped, a bad decision is expensive to undo.",
      "A good place to actually measure what false positives cost us."
    ]
  },
  "c1-analyst": {
    kind: "Person",
    title: "Fraud Ops Analyst",
    summary: "The person who steps in when the system can't confidently make the call on its own.",
    points: [
      "Works cases out of the queue through the Fraud Ops Console.",
      "Every override they make is basically free labeled data for the model.",
      "How aggressive we can set the 'review' threshold is limited by how many people we have to actually review cases."
    ]
  },

  "c2-signal": {
    kind: "Container",
    title: "Signal Collection",
    summary: "Grabs raw events off the platform, device, session, behavior, the moment checkout starts.",
    points: [
      "Sits on the checkout path, so it has to be fast and it has to not fall over.",
      "Cleans up event data that comes in differently from web vs. the app.",
      "Feeds the Feature Store, doesn't talk to scoring directly."
    ]
  },
  "c2-feature": {
    kind: "Container",
    title: "Feature Store",
    summary: "Blends what just happened with what we already know about the account and device into something the model can actually use.",
    points: [
      "One source of truth for both live scoring and model training, which keeps them from drifting apart.",
      "When the model quietly gets worse over time, this is usually where to look first.",
      "Product should have a say in what data is even fair game to use here."
    ]
  },
  "c2-scoring": {
    kind: "Container",
    title: "Risk Scoring Service",
    summary: "Runs the model and turns features into a single risk score for the order.",
    points: [
      "Outputs a probability, not a decision. Routing lives downstream in the Decision Engine.",
      "Needs to support shadow deployments so a new model version can be tested without affecting real orders.",
      "How well this is calibrated basically sets the size of the review queue."
    ]
  },
  "c2-decision": {
    kind: "Container · in scope",
    title: "Decision Engine",
    summary: "Takes the score, runs it through rules and thresholds, and decides: approve, review, or reject.",
    points: [
      "This is where risk tolerance stops being a philosophy and becomes actual configuration.",
      "Thresholds should flex by segment, a brand-new account isn't the same bet as a five-year customer.",
      "Every decision needs a reason attached, or nobody downstream can trust it."
    ]
  },
  "c2-queue": {
    kind: "Container",
    title: "Case Queue",
    summary: "Where orders sit once they've been flagged for a human to look at, roughly sorted by risk and value.",
    points: [
      "If this queue keeps growing, it's usually a sign the thresholds are set too cautiously.",
      "How fast we clear it affects how fast customers actually get their orders.",
      "Deciding what gets prioritized first is a product call, not just an engineering one."
    ]
  },
  "c2-console": {
    kind: "Container",
    title: "Fraud Ops Console",
    summary: "The internal tool analysts actually work in to investigate and close out cases.",
    points: [
      "Needs to surface reason codes and evidence clearly, or analysts end up guessing.",
      "Every decision an analyst makes here becomes a training label later.",
      "If the console is clunky, you need more analysts to get through the same volume."
    ]
  },
  "c2-approve": {
    kind: "Outcome",
    title: "Approve",
    summary: "Low-risk orders go straight through to Order Management. No extra steps.",
    points: ["This is the path most orders should take.", "Getting this precise is what protects conversion."]
  },
  "c2-review": {
    kind: "Outcome",
    title: "Review",
    summary: "Medium-risk orders get held and sent to the Case Queue for a person to decide.",
    points: ["Limited by how many analysts we actually have.", "The main dial for trading fraud loss against operating cost."]
  },
  "c2-reject": {
    kind: "Outcome",
    title: "Reject",
    summary: "High-risk orders get blocked automatically before they reach fulfillment.",
    points: ["A false positive here is the most visible way to upset a real customer.", "Should always come with a reason the customer can actually appeal."]
  },

  "c3-rules": {
    kind: "Component",
    title: "Rule Evaluator",
    summary: "Runs the hand-written fraud rules, either before the model score or alongside it.",
    points: [
      "Handy for known patterns you don't need a model to catch, like a hard blocklist.",
      "Rules ship faster than model updates, so they need their own versioning and a way to roll back.",
      "Leaning on rules too heavily is an easy trap to fall into without noticing."
    ]
  },
  "c3-threshold": {
    kind: "Component",
    title: "Threshold Manager",
    summary: "Maps a risk score to a cutoff, approve, review, or reject, and lets that vary by segment.",
    points: [
      "The most direct dial product has for balancing fraud against friction.",
      "Should be built for experimentation, different cohorts probably need different cutoffs.",
      "Whatever gets changed here needs a fast way to see what it actually did downstream."
    ]
  },
  "c3-mladapter": {
    kind: "Component",
    title: "ML Score Adapter",
    summary: "Calls the Risk Scoring Service and cleans up its response for the rest of the engine.",
    points: [
      "Keeps the Decision Engine from caring about model versioning or API changes.",
      "Handles what happens if scoring is slow or just down.",
      "A clean spot to run a shadow model without it touching live decisions."
    ]
  },
  "c3-explain": {
    kind: "Component",
    title: "Explainability Service",
    summary: "Turns each decision into a reason a person could actually read and understand.",
    points: [
      "Feeds both the analyst console and anything we tell the customer when we decline them.",
      "Often required for compliance, not just nice for UX.",
      "A system that can't explain its own decisions is hard to trust day to day."
    ]
  },
  "c3-audit": {
    kind: "Component",
    title: "Audit Logger",
    summary: "Keeps a permanent record of every decision, score, and rule that fired along the way.",
    points: [
      "Needed for disputes and for anyone auditing the process later.",
      "Also the raw material for measuring how the policy is actually performing over time.",
      "Should capture why a decision happened, not just what the decision was."
    ]
  },

  "p-place": { kind: "Process step", title: "Places order", summary: "The customer finishes checkout on the platform.", points: ["This is what kicks off the whole fraud decisioning flow."] },
  "p-submit": { kind: "Process step", title: "Submits order for scoring", summary: "The platform calls Fraud Decisioning before it'll confirm the order.", points: ["Happens inside the checkout flow, so speed matters here."] },
  "p-collect": { kind: "Process step", title: "Collects signals", summary: "Device, account, payment, and behavior signals get pulled together for this order.", points: ["Handled by Signal Collection and the Feature Store."] },
  "p-score": { kind: "Process step", title: "Scores risk", summary: "The Risk Scoring Service returns a fraud probability for the order.", points: ["Just a score at this point, routing happens next."] },
  "p-route": { kind: "Process step", title: "Routes decision", summary: "The Decision Engine runs the score through rules and thresholds and picks a path.", points: ["The one place where risk tolerance actually gets enforced."] },
  "p-approve": { kind: "Branch outcome", title: "Approve", summary: "The order moves on to fulfillment, no extra friction.", points: ["Where most orders should end up."] },
  "p-review": { kind: "Branch outcome", title: "Review", summary: "The order gets held and sent to the Case Queue for a person to decide.", points: ["Limited by how many analysts are available."] },
  "p-reject": { kind: "Branch outcome", title: "Reject", summary: "The order gets blocked before it ever reaches fulfillment.", points: ["Should come with a reason the customer can appeal."] },
  "p-analyst": { kind: "Process step", title: "Resolves reviewed cases", summary: "An analyst looks into queued orders in the console and makes the call.", points: ["Their decisions become training data for the next model version."] },
  "p-fulfill": { kind: "Process step", title: "Fulfills or cancels order", summary: "Order Management acts on whatever the final decision was.", points: ["The last point where a wrong call is still cheap to fix."] },

  "sig-device": {
    kind: "Reference · Risk Signals",
    title: "Device",
    summary: "What we can tell about the hardware and connection placing the order, separate from who's logged in.",
    points: [
      "Device fingerprint: a rough identity for the device itself, useful for spotting repeat offenders across accounts.",
      "Emulator detection: catches automated or spoofed environments that don't behave like a real phone or browser.",
      "IP reputation: flags addresses tied to known abuse, VPNs, or proxies worth a second look."
    ]
  },
  "sig-account": {
    kind: "Reference · Risk Signals",
    title: "Account",
    summary: "History and behavior tied to the account itself.",
    points: [
      "Account age: brand-new accounts carry more risk than ones with a track record.",
      "Login velocity: a lot of logins in a short window can mean credential stuffing.",
      "Prior chargebacks: past disputes are one of the strongest predictors we have."
    ]
  },
  "sig-payment": {
    kind: "Reference · Risk Signals",
    title: "Payment",
    summary: "Signals about the payment method itself.",
    points: [
      "BIN risk: some card ranges just see more fraud than others.",
      "AVS / CVV match: whether the billing details actually line up with what the bank has on file.",
      "Card velocity: the same card getting used across many accounts or orders fast."
    ]
  },
  "sig-behavior": {
    kind: "Reference · Risk Signals",
    title: "Behavior",
    summary: "How someone moves through checkout, which is surprisingly hard to fake convincingly.",
    points: [
      "Session pattern: mouse movement, navigation, timing that looks scripted rather than human.",
      "Time on site: fraud sessions tend to move unnaturally fast through checkout.",
      "Copy/paste at checkout: often just how people fill forms, but combined with other signals it can matter."
    ]
  },
  "sig-order": {
    kind: "Reference · Risk Signals",
    title: "Order",
    summary: "What's actually in the cart and where it's going.",
    points: [
      "Basket value: unusually high-value orders warrant a closer look.",
      "Ship/bill mismatch: shipping and billing addresses in different places isn't automatically suspicious, but it raises the odds.",
      "High-resale items: electronics and gift cards are disproportionately targeted because they're easy to flip."
    ]
  }
};

const CONNECTORS = {
  "conn-c1": [
    { from: "c1-customer",  to: "c1-ecommerce", fromSide: "top",   toSide: "left",  label: "places order" },
    { from: "c1-ecommerce", to: "c1-fraud",      fromSide: "bottom",toSide: "top",   label: "sends order for scoring" },
    { from: "c1-fraud",     to: "c1-payment",    fromSide: "top",   toSide: "bottom",label: "checks payment signals" },
    { from: "c1-fraud",     to: "c1-order",      fromSide: "right", toSide: "left",  label: "returns decision" },
    { from: "c1-analyst",   to: "c1-fraud",      fromSide: "left",  toSide: "right", label: "reviews queued cases" }
  ],
  "conn-c2": [
    { from: "c2-signal",  to: "c2-feature",  fromSide: "top",   toSide: "left",   label: "" },
    { from: "c2-signal",  to: "c2-scoring",  fromSide: "bottom",toSide: "left",   label: "" },
    { from: "c2-feature", to: "c2-decision", fromSide: "right", toSide: "top",    label: "features" },
    { from: "c2-scoring", to: "c2-decision", fromSide: "right", toSide: "bottom", label: "risk score" },
    { from: "c2-decision",to: "c2-approve",  fromSide: "right", toSide: "left",   label: "" },
    { from: "c2-decision",to: "c2-review",   fromSide: "right", toSide: "left",   label: "" },
    { from: "c2-decision",to: "c2-reject",   fromSide: "right", toSide: "left",   label: "" },
    { from: "c2-review",  to: "c2-queue",    fromSide: "right", toSide: "left",   label: "" },
    { from: "c2-queue",   to: "c2-console",  fromSide: "bottom",toSide: "top",    label: "" },
    { from: "c2-console", to: "c2-decision", fromSide: "left",  toSide: "bottom", label: "override / retrain", dashed: true }
  ],
  "conn-c3": [
    { from: "c3-rules",     to: "c3-threshold", fromSide: "right", toSide: "left", label: "" },
    { from: "c3-threshold", to: "c3-mladapter", fromSide: "right", toSide: "left", label: "" },
    { from: "c3-mladapter", to: "c3-explain",   fromSide: "right", toSide: "left", label: "" },
    { from: "c3-explain",   to: "c3-audit",     fromSide: "right", toSide: "left", label: "" }
  ]
};

const viewport   = document.getElementById("viewport");
const canvasGrid = document.getElementById("canvasGrid");
const canvasInner= document.getElementById("canvasInner");
const zoomLevelEl= document.getElementById("zoomLevel");

let scale = 1;
let tx = 0;
let ty = 0;
const MIN_SCALE = 0.35;
const MAX_SCALE = 1.6;

function applyTransform(){
  canvasInner.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  canvasGrid.style.backgroundPosition = `${tx}px ${ty}px`;
  zoomLevelEl.textContent = Math.round(scale * 100) + "%";
}

function setZoom(newScale, pivotX, pivotY){
  newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));
  // keep the point under the cursor stable while zooming
  const rect = viewport.getBoundingClientRect();
  const px = pivotX !== undefined ? pivotX - rect.left : rect.width / 2;
  const py = pivotY !== undefined ? pivotY - rect.top : rect.height / 2;
  const worldX = (px - tx) / scale;
  const worldY = (py - ty) / scale;
  scale = newScale;
  tx = px - worldX * scale;
  ty = py - worldY * scale;
  applyTransform();
}

let isPanning = false;
let panStartX = 0, panStartY = 0, txStart = 0, tyStart = 0;

viewport.addEventListener("mousedown", (e) => {
  if (e.target.closest(".node, .step-card, .branch")) return;
  isPanning = true;
  viewport.classList.add("is-panning");
  panStartX = e.clientX; panStartY = e.clientY;
  txStart = tx; tyStart = ty;
});
window.addEventListener("mousemove", (e) => {
  if (!isPanning) return;
  tx = txStart + (e.clientX - panStartX);
  ty = tyStart + (e.clientY - panStartY);
  applyTransform();
});
window.addEventListener("mouseup", () => {
  isPanning = false;
  viewport.classList.remove("is-panning");
});

let touchStartX = 0, touchStartY = 0;
viewport.addEventListener("touchstart", (e) => {
  if (e.touches.length !== 1) return;
  if (e.target.closest(".node, .step-card, .branch")) return;
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  txStart = tx; tyStart = ty;
}, { passive: true });
viewport.addEventListener("touchmove", (e) => {
  if (e.touches.length !== 1) return;
  tx = txStart + (e.touches[0].clientX - touchStartX);
  ty = tyStart + (e.touches[0].clientY - touchStartY);
  applyTransform();
}, { passive: true });

viewport.addEventListener("wheel", (e) => {
  e.preventDefault();
  const delta = -e.deltaY * 0.0015;
  setZoom(scale * (1 + delta), e.clientX, e.clientY);
}, { passive: false });

document.getElementById("zoomIn").addEventListener("click", () => setZoom(scale * 1.2));
document.getElementById("zoomOut").addEventListener("click", () => setZoom(scale / 1.2));
document.getElementById("zoomReset").addEventListener("click", () => {
  scale = 1; tx = 0; ty = 0; applyTransform();
});

applyTransform();

function anchorPoint(node, side){
  const left = node.offsetLeft;
  const top = node.offsetTop;
  const w = node.offsetWidth;
  const h = node.offsetHeight;
  switch (side){
    case "top":    return { x: left + w / 2, y: top };
    case "bottom": return { x: left + w / 2, y: top + h };
    case "left":   return { x: left,         y: top + h / 2 };
    case "right":  return { x: left + w,     y: top + h / 2 };
    default:       return { x: left + w / 2, y: top + h / 2 };
  }
}

function drawConnectors(frameId, edges){
  const frame = document.getElementById(frameId.replace("conn-", "frame-"));
  const svg = document.getElementById(frameId);
  if (!frame || !svg) return;
  svg.innerHTML = "";

  const marker = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  marker.innerHTML = `
    <marker id="arrow-${frameId}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L6,3 L0,6 Z" fill="#B7BEDB"></path>
    </marker>`;
  svg.appendChild(marker);

  edges.forEach((edge) => {
    const fromNode = document.getElementById(edge.from);
    const toNode = document.getElementById(edge.to);
    if (!fromNode || !toNode) return;

    const p1 = anchorPoint(fromNode, edge.fromSide);
    const p2 = anchorPoint(toNode, edge.toSide);

    const dx = Math.max(Math.abs(p2.x - p1.x) * 0.5, 30);
    const dy = Math.max(Math.abs(p2.y - p1.y) * 0.5, 30);
    let c1x = p1.x, c1y = p1.y, c2x = p2.x, c2y = p2.y;
    if (edge.fromSide === "left" || edge.fromSide === "right") c1x += (edge.fromSide === "right" ? dx : -dx);
    else c1y += (edge.fromSide === "bottom" ? dy : -dy);
    if (edge.toSide === "left" || edge.toSide === "right") c2x += (edge.toSide === "right" ? -dx : dx);
    else c2y += (edge.toSide === "bottom" ? -dy : dy);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M ${p1.x} ${p1.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`);
    path.setAttribute("marker-end", `url(#arrow-${frameId})`);
    if (edge.dashed) path.classList.add("dashed");
    svg.appendChild(path);

    if (edge.label){
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", midX);
      text.setAttribute("y", midY - 6);
      text.setAttribute("text-anchor", "middle");
      text.textContent = edge.label;
      svg.appendChild(text);
    }
  });
}

function drawAllConnectors(){
  Object.keys(CONNECTORS).forEach((frameId) => drawConnectors(frameId, CONNECTORS[frameId]));
}

window.addEventListener("load", drawAllConnectors);
window.addEventListener("resize", drawAllConnectors);
setTimeout(drawAllConnectors, 50);

const detailPanel   = document.getElementById("detailPanel");
const detailKind    = document.getElementById("detailKind");
const detailTitle   = document.getElementById("detailTitle");
const detailSummary = document.getElementById("detailSummary");
const detailList    = document.getElementById("detailList");

function openDetail(id){
  const data = DETAILS[id];
  if (!data) return;
  detailKind.textContent = data.kind.toUpperCase();
  detailTitle.textContent = data.title;
  detailSummary.textContent = data.summary;
  detailList.innerHTML = "";
  (data.points || []).forEach((pt) => {
    const li = document.createElement("li");
    li.textContent = pt;
    detailList.appendChild(li);
  });
  detailPanel.classList.add("is-open");
  detailPanel.setAttribute("aria-hidden", "false");
}

function closeDetail(){
  detailPanel.classList.remove("is-open");
  detailPanel.setAttribute("aria-hidden", "true");
}

document.getElementById("detailClose").addEventListener("click", closeDetail);

document.querySelectorAll("[id]").forEach((el) => {
  if (DETAILS[el.id] && (el.classList.contains("node") || el.classList.contains("step-card") || el.classList.contains("branch") || el.classList.contains("signal-card"))){
    el.addEventListener("click", () => openDetail(el.id));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " "){
        e.preventDefault();
        openDetail(el.id);
      }
    });
  }
});

const navButtons = document.querySelectorAll(".frame-nav-btn");

function goToFrame(frameId){
  const frame = document.getElementById(frameId);
  if (!frame) return;
  const rect = viewport.getBoundingClientRect();

  // frame position in canvasInner's local (unscaled) space
  const targetScale = Math.min(1, MAX_SCALE);
  const localLeft = frame.offsetLeft;
  const localTop = frame.offsetTop;
  const localW = frame.offsetWidth || 600;
  const localH = frame.offsetHeight || 400;

  scale = targetScale;
  tx = rect.width / 2 - (localLeft + localW / 2) * scale;
  ty = rect.height / 2 - (localTop + localH / 2) * scale;
  applyTransform();

  navButtons.forEach((b) => b.classList.remove("is-active"));
  const activeBtn = document.querySelector(`.frame-nav-btn[data-target="${frameId}"]`);
  if (activeBtn) activeBtn.classList.add("is-active");
}

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => goToFrame(btn.dataset.target));
});

setTimeout(() => goToFrame("frame-c1"), 60);

const legendToggle = document.getElementById("legendToggle");
const legendPanel = document.getElementById("legendPanel");

legendToggle.addEventListener("click", () => {
  const isOpen = legendPanel.classList.toggle("is-open");
  legendToggle.classList.toggle("is-active", isOpen);
  legendToggle.setAttribute("aria-expanded", String(isOpen));
  legendPanel.setAttribute("aria-hidden", String(!isOpen));
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape"){
    closeDetail();
    legendPanel.classList.remove("is-open");
    legendToggle.classList.remove("is-active");
    legendToggle.setAttribute("aria-expanded", "false");
  }
});
