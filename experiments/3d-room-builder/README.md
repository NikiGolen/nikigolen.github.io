# 3D SimLab Room Builder

A browser-based tool for planning clinical simulation spaces in real-time 3D. Built from scratch with Three.js — no game engine, no framework, just vanilla JavaScript.

**[Live demo →](https://nikigolen.github.io/experiments/3d-room-builder/)**

## What it does

The builder lets you lay out medical equipment inside a scaled hospital room and see the result in real time. Pick a room footprint, click an item in the catalog to spawn it, drag it into place, rotate it, and remove it — all while the layout is checked against the room's actual dimensions.

- **Constraint-based placement** — floor items are clamped to the room's boundaries as you drag them; wall-mounted items (headwalls, biohazard boxes, posters) snap to a wall and slide along it instead of floating in open space.
- **Camera-relative wall transparency** — walls fade out automatically depending on your viewing angle, so you can always see inside the room without manually toggling anything.
- **Three room presets** — swap between a small consultation room, a standard training room, and a full ward suite, each with its own dimensions and calculated square footage.
- **Live bill of materials** — every item you place shows up in a running list with its SKU, and can be removed from either the list or the 3D scene directly.

## Stack

- [Three.js](https://threejs.org/) for rendering and camera/orbit controls
- Vanilla HTML, CSS, and JavaScript — no build step, no framework
- All 3D models are procedurally built from primitive geometry (no external model files)

## Running it locally

No build step required. Clone the repo and serve the folder with any static file server, for example:

```bash
python3 -m http.server
```

Then open `http://localhost:8000` in your browser.

## Why I built this

My current employer has been exploring adding a feature like this to one of our products. I wanted to find out firsthand how difficult it would actually be to build from scratch, so I put together this prototype to test the approach: real-time 3D placement, spatial constraints, and a working cart flow, all without relying on a pre-built room-planning library.
