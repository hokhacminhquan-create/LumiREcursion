# Lumi:REcursion 🧠

**Lumi:REcursion** is a native Lumiverse Spindle scene reasoning layer, ported and elevated from SillyTavern's [Recursion](https://github.com/) extension.

It analyzes recent context before the main LLM writes, tracks active turn cards (motives, constraints, consequences, subtext, environment, items, secrets, and open threads), and injects a focused, inspectable prompt packet into the generation context.

---

## ⚡ Supercharged for Lumiverse: Parallel Card Calling

In SillyTavern, card evaluations often suffered from sequential network latency ($O(N \times \text{latency})$).
In **Lumi:REcursion**, the backend leverages Lumiverse's Bun environment and `Promise.all` concurrency:

- **Segmented Mode**: Evaluates all active scene cards **in parallel**. Total card reasoning time is bounded by the slowest single card ($O(\max(\text{latency})))$, dramatically slashing turn preparation time.
- **Fused Mode**: Compresses the active scene deck into a single structured schema bundle for high-reasoning models (DeepSeek, Claude, Qwen, GPT-4o).
- **Zero Interruption Checkpointing**: When regenerating or swiping, identical context hash immediately reuses cached card states without redundant model calls.

---

## 🎛️ 3 Selectable Card Source Modes

Instead of hardcoding card families inside inaccessible worker source, Lumi:REcursion provides 3 flexible source modes:

### 📖 Option A: World Book Mode
- **Why it's great**:
  - Cards are stored as native entries inside a Lumiverse World Book (`Lumi:REcursion Cards`).
  - Each card family is an independent entry with comment, keys, priority, and structured JSON content.
  - Both human users and AI assistants (like Mousepad 🐭) can view, edit, reorder, delete, or add entries natively through Lumiverse's World Book UI or Spindle APIs!
  - 1-click **"Sync / Create Book"** creates the world book with all 11 canonical card families and attaches it to your active character.

### 👤 Option B: Character Extension Payload Mode
- **Why it's great**:
  - Card definitions are stored directly inside `character.extensions.lumi_recursion` on the character card itself.
  - Scene reasoning rules stay permanently bound to the character card across chats.
  - Assistant personas and macros in chat can read/write directly to `character.extensions` via `set`!
  - 1-click **"Initialize / Reset Cards"** writes the canonical cards into the character card.

### 🃏 Local Decks Mode
- The classic standalone deck system stored inside the extension (`decks.json`).
- Lets you create, duplicate, edit, and delete custom decks with category accordions and 3-state card cycling (`Off` → `Active` → `Priority`).

---

## 🃏 11 Canonical Scene Card Families

1. **Scene Frame**: Location/situation, immediate beat direction, hard boundary constraints.
2. **Active Cast**: Present characters, observable conditions, injuries, speaking and listening roles.
3. **Character Motivation**: Observable goals, social/tactical pressures, visible hesitation/posture.
4. **Relationship**: Social tension, promises, debts, leverage, speech constraints.
5. **Social Subtext**: Humor, irony, veiled pressure, invitation vs. boundary, status and face-saving.
6. **Scene Constraints**: Hard physical limits, spatial access, contradiction traps, timeline sequence.
7. **Knowledge & Secrets**: Concealed facts, who knows/suspects, premature reveal boundaries.
8. **Clocks & Consequences**: Time pressure, countdowns, delayed consequences, escalation triggers.
9. **Environment**: Spatial layout, sensory textures (sound, lighting, weather), hazards and cover.
10. **Possessions & Items**: Held/carried items, location and control, affordances and risks.
11. **Open Threads**: Unresolved questions, pending promises/actions, looming pressures.

---

## ✨ Recast Post-Processing Pipeline

Integrated directly from SillyTavern's **Recast** post-processing suite, Lumi:REcursion now delivers an end-to-end reasoning and refinement lifecycle: **Pre-Turn Scene Reasoning + Post-Generation Prose Recasting**.

After the assistant message lands, Recast runs an automated or manual multi-pass transformation pipeline:

### 🎯 4 Canonical Recast Passes:
1. **⛓️ Grounding** (`pass_grounding`): Roots prose in the setting's physics and rules, inserting missing reaction beats between sudden transitions.
2. **✅ Character Behavior Validator** (`pass_validator`): Ensures voice matches example dialogue and personality traits, eliminating out-of-character stiffness or transactional slop.
3. **✒️ Prose Rhythm** (`pass_prose`): Refines sentence variation, converts telling into showing, and cuts wordy filler without touching plot or dialogue.
4. **🔨 Repetition Hammer** (`pass_repetitionhammer`): Eliminates word echoes, repetitive loops, and tired catchphrases.

### 🔍 Interactive Word-Level Diff Modal & Settlement Modes:
- **Interactive Diff Review Modal**: Powered by a fast Myers word-level diff algorithm. Displays `<ins>` and `<del>` highlights with step navigation across all intermediate pass snapshots, plus a live editor to tweak the final text before accepting.
- **Auto-Replace In-Place**: Instantly patches the chat message with the recast prose.
- **Auto-Add as Swipe**: Preserves the original message and appends the transformed prose as a new swipe candidate.
- **1-Click "Recast Latest Message"**: Test and refine any assistant message directly from the drawer tab on demand.

---

## 🛠️ Build & Development

```bash
# Build both backend & frontend
bun run build

# Sync built assets directly to Lumiverse
bun run sync
```
