# Fraud Decisioning: C4 Architecture Board
 
An interactive, Miro-style architecture board for a hypothetical ecommerce fraud decisioning system, built using the [C4 model](https://c4model.com/) (Context, Container, Component).
 
**[View the live experiment →](https://nikigolen.github.io/experiments/fraud-c4/)**

## What it is
 
A single-page, pannable and zoomable canvas that documents a fraud detection system at three levels of zoom, plus a process view showing how an order actually moves from checkout to a final decision.
 
- **C1 — System Context**: how the fraud system fits alongside the ecommerce platform, payment provider, order management, and the people involved
- **C2 — Container**: what's inside the fraud decisioning system itself (signal collection, feature store, risk scoring, decision engine, case queue, analyst console)
- **C3 — Component**: a drill-down into the Decision Engine's internal components
- **Process View**: a swimlane diagram of the order-to-decision flow across customer, platform, fraud system, analyst, and fulfillment
- **Risk Signal Taxonomy**: a reference grid of the signal categories a real fraud system would draw on
- **Product Experiment**: a sticky-note-style hypothesis and success metrics, in the spirit of how a product manager would actually propose testing a change
Every node, process step, and reference card is clickable and opens a detail panel with more context.
 
## Why it's built this way
 
Software architecture diagrams like C4 are usually static images. This treats the diagram itself as the product: something you can explore, not just look at. The interaction model (drag to pan, scroll to zoom, click for detail) is deliberately modeled on collaborative whiteboard tools like Miro, since that's how these diagrams actually get built and reviewed in practice.
 
## Tech stack
 
- Vanilla HTML/CSS/JavaScript — no framework, no build step
- Hand-rolled pan/zoom on a CSS-transformed canvas
- SVG connector lines computed from live DOM node positions, so they stay accurate if the layout changes
- No external dependencies beyond Google Fonts (Space Grotesk, Inter, IBM Plex Mono)
## Structure
 
```
fraud-c4/
├── index.html    # Board structure: frames, nodes, swimlanes, panels
├── style.css     # Miro-style canvas, node types, frame tabs, panels
├── script.js     # Pan/zoom, connector drawing, detail content, navigation
└── README.md
```
 
## Running locally
 
No build step required. Clone the repo and open `index.html` in a browser, or serve the folder locally:
 
```bash
python3 -m http.server 8000
```
 
Then visit `http://localhost:8000`.
 
## Notes
 
This is a hypothetical system, not documentation of any real company's fraud infrastructure. It's meant to demonstrate architecture communication, not disclose or imply insider knowledge of a specific product.
 
---
 
Part of a broader set of experiments — see the [full portfolio](https://nikigolen.github.io/) for more.
