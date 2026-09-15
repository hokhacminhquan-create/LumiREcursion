# Lumi:REcursion 🧠

**Lumi:REcursion** is a native Lumiverse Spindle scene reasoning layer, ported and elevated from SillyTavern's [Recursion](https://github.com/) extension.

It analyzes recent context before the main LLM writes, tracks active turn cards (motives, constraints, consequences, subtext, environment, items, secrets, and open threads), and injects a focused, inspectable prompt packet into the generation context.

---

## ⚡ Supercharged for Lumiverse: Parallel Card Calling

In SillyTavern, card evaluations often suffered from sequential network latency ($O(N \times \text{latency})$).
In **Lumi:REcursion**, the backend leverages Lumiverse's Bun environment and `Promise.all` concurrency:

- **Segmented Mode**: Evaluates all active scene cards **in parallel**. Total card reasoning time is bounded by the slowest single card ($O(\max(\text{latency}))$), dramatically slashing turn preparation time.
- **Fused Mode**: Compresses the active scene deck into a single structured schema bundle for high-reasoning models (DeepSeek, Claude, Qwen, GPT-4o).
- **Zero Interruption Checkpointing**: When regenerating or swiping, identical context hash immediately reuses cached card states without redundant model calls.

---

## 🃏 11 Canonical Scene Card Families

1. **Scene Frame**: Location/situation, immediate beat direction, hard boundary constraints.
2. **Active Cast**: Present characters, observable conditions, injuries, speaker roles.
3. **Character Motivation**: Observable goals, social/tactical pressures, visible hesitation/posture.
4. **Relationship**: Social tension, promises, debts, leverage, speech constraints.
5. **Social Subtext**: Humor, irony, veiled pressure, invitation vs. boundary, status/face.
6. **Scene Constraints**: Hard physical limits, spatial access, contradiction traps, timeline sequence.
7. **Knowledge & Secrets**: Concealed facts, who knows/suspects, premature reveal boundaries.
8. **Clocks & Consequences**: Time pressure, countdowns, delayed consequences, escalation triggers.
9. **Environment**: Spatial layout, sensory textures (sound, lighting, weather), hazards/cover.
10. **Possessions & Items**: Held/carried items, accessibility/control, affordances and risks.
11. **Open Threads**: Unresolved questions, pending promises/actions, looming pressures.

---

## 🎛️ Operator Controls

- **Auto Mode**: Prepares scene reasoning automatically on every turn.
- **Manual Mode**: Arms reasoning on-demand via the **🎯 Arm** button or quick chat toggle.
- **Card Selection States**:
  - `Off`: Skipped for this turn.
  - `Active`: Included in the card reasoning pool.
  - `Priority`: Guaranteed inclusion in the turn hand before normal cards.
- **Story Form Guardrails**: Selectable POV (First, Second, Third, Auto) and Tense (Past, Present, Auto).
- **Prompt Footprint**: `Compact` (4 cards), `Normal` (6 cards), `Rich` (10 cards).
- **Hero Pixel Array**: Live visual status grid (Cyan = running, Green = completed, Purple = cached, Amber = fallback, Red = error).
- **Last Brief Inspector**: Expandable hand viewer showing generated card directives, evidence citations, token estimates, and one-click prompt packet copying.

---

## 🛠️ Build & Development

```bash
# Build both backend & frontend
bun run build

# Sync built assets directly to Lumiverse
bun run sync
```
