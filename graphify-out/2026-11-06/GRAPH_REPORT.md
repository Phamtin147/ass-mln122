# Graph Report - ass-mln122  (2026-11-03)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 385 nodes · 632 edges · 20 communities (8 shown, 12 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `de88e233`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- l
- a
- render.py
- build-novel-reader.js
- s
- package.json
- e
- nep-sang-effect.js
- h
- trigger
- p
- manifest.json
- c
- u
- x
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `l` - 29 edges
2. `a` - 25 edges
3. `g` - 24 edges
4. `s` - 23 edges
5. `w` - 17 edges
6. `r` - 15 edges
7. `e` - 15 edges
8. `render_panel()` - 14 edges
9. `p` - 12 edges
10. `i` - 11 edges

## Surprising Connections (you probably didn't know these)
- `loadFromHTML()` --calls--> `g`  [EXTRACTED]
  libs/page-flip.browser.js → libs/page-flip.browser.js  _Bridges community 1 → community 10_
- `r` --inherits--> `e`  [EXTRACTED]
  libs/page-flip.browser.js → libs/page-flip.browser.js  _Bridges community 4 → community 7_
- `loadFromImages()` --calls--> `d`  [EXTRACTED]
  libs/page-flip.browser.js → libs/page-flip.browser.js  _Bridges community 0 → community 10_
- `n` --inherits--> `s`  [EXTRACTED]
  libs/page-flip.browser.js → libs/page-flip.browser.js  _Bridges community 10 → community 4_
- `c` --inherits--> `p`  [EXTRACTED]
  libs/page-flip.browser.js → libs/page-flip.browser.js  _Bridges community 11 → community 14_

## Import Cycles
- None detected.

## Communities (20 total, 12 thin omitted)

### Community 0 - "l"
Cohesion: 0.08
Nodes (4): d, getSettings(), l, w

### Community 2 - "render.py"
Cohesion: 0.10
Nodes (29): add(), blip(), chime(), click(), env_adsr(), note(), ping(), pluck() (+21 more)

### Community 3 - "build-novel-reader.js"
Cohesion: 0.06
Nodes (30): fs, pageBlocks, pages, path, promptBlocks, promptContent, promptPages, scriptContent (+22 more)

### Community 5 - "package.json"
Cohesion: 0.08
Nodes (23): main(), PureCompiler, author, dependencies, jpeg-js@^0.4.4, mind-ar@^1.2.5, @msgpack/msgpack@^3.1.3, pngjs@^7.0.0 (+15 more)

### Community 8 - "nep-sang-effect.js"
Cohesion: 0.16
Nodes (15): apply(), build(), crookedWindowTexture(), cue(), domPosition(), emitSpark(), glowSprite(), glowTexture() (+7 more)

### Community 10 - "trigger"
Cohesion: 0.22
Nodes (9): loadFromHTML(), loadFromImages(), n, o, trigger(), updateFromHtml(), updateFromImages(), updatePageIndex() (+1 more)

### Community 11 - "p"
Cohesion: 0.25
Nodes (3): p, update(), updateOrientation()

### Community 12 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

## Knowledge Gaps
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `l` connect `l` to `page-flip.browser.js`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Should `l` be split into smaller, more focused modules?**
  _Cohesion score 0.07767722473604827 - nodes in this community are weakly interconnected._
- **Why does `a` connect `a` to `page-flip.browser.js`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Should `a` be split into smaller, more focused modules?**
  _Cohesion score 0.10241545893719807 - nodes in this community are weakly interconnected._
- **Why does `g` connect `a` to `trigger`, `page-flip.browser.js`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Should `render.py` be split into smaller, more focused modules?**
  _Cohesion score 0.0966183574879227 - nodes in this community are weakly interconnected._
- **Should `build-novel-reader.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05855855855855856 - nodes in this community are weakly interconnected._