/**
 * Lumi:REcursion — Word-Level Myers Diff Engine
 * Adapted from SillyTavern Recast diffViewer.js for Lumiverse
 */

import type { RecastDiffStep } from './types';

export function escapeHtml(str: string | null | undefined): string {
  if (str === null || str === undefined) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function tokenize(text: string): string[] {
  return text.split(/(\s+)/);
}

interface DiffOp {
  type: 'equal' | 'delete' | 'insert';
  v: string;
}

const MAX_DIFF_TOKENS = 50000;

function myersDiff(oldTokens: string[], newTokens: string[]): DiffOp[] | null {
  const oldLength = oldTokens.length;
  const newLength = newTokens.length;
  const maxTotalLength = oldLength + newLength;
  const furthestPaths = new Int32Array(2 * maxTotalLength + 1);
  const pathHistory: Int32Array[] = [];

  furthestPaths[maxTotalLength + 1] = 0;

  for (let editDepth = 0; editDepth <= maxTotalLength; editDepth++) {
    if (editDepth > 10000) return null;

    pathHistory.push(furthestPaths.slice(maxTotalLength - editDepth, maxTotalLength + editDepth + 1));

    for (let diagonal = -editDepth; diagonal <= editDepth; diagonal += 2) {
      let oldPos: number;
      const goDown =
        diagonal === -editDepth ||
        (diagonal !== editDepth && furthestPaths[maxTotalLength + diagonal - 1] < furthestPaths[maxTotalLength + diagonal + 1]);

      if (goDown) {
        oldPos = furthestPaths[maxTotalLength + diagonal + 1];
      } else {
        oldPos = furthestPaths[maxTotalLength + diagonal - 1] + 1;
      }

      let newPos = oldPos - diagonal;

      while (oldPos < oldLength && newPos < newLength && oldTokens[oldPos] === newTokens[newPos]) {
        oldPos++;
        newPos++;
      }

      furthestPaths[maxTotalLength + diagonal] = oldPos;

      if (oldPos >= oldLength && newPos >= newLength) {
        const ops: DiffOp[] = [];
        let currOldPos = oldLength;
        let currNewPos = newLength;

        for (let step = editDepth; step > 0; step--) {
          const historyArray = pathHistory[step];
          const currDiagonal = currOldPos - currNewPos;
          const histIndex = step + currDiagonal;

          const wentDown =
            currDiagonal === -step ||
            (currDiagonal !== step && historyArray[histIndex - 1] < historyArray[histIndex + 1]);

          let startX: number;
          if (wentDown) {
            startX = historyArray[histIndex + 1];
          } else {
            startX = historyArray[histIndex - 1] + 1;
          }
          const startY = startX - currDiagonal;

          while (currOldPos > startX && currNewPos > startY && currOldPos > 0 && currNewPos > 0) {
            ops.unshift({ type: 'equal', v: oldTokens[currOldPos - 1] });
            currOldPos--;
            currNewPos--;
          }

          if (wentDown) {
            if (currNewPos > 0) {
              ops.unshift({ type: 'insert', v: newTokens[currNewPos - 1] });
              currNewPos--;
            }
          } else {
            if (currOldPos > 0) {
              ops.unshift({ type: 'delete', v: oldTokens[currOldPos - 1] });
              currOldPos--;
            }
          }
        }

        while (currOldPos > 0 && currNewPos > 0) {
          ops.unshift({ type: 'equal', v: oldTokens[currOldPos - 1] });
          currOldPos--;
          currNewPos--;
        }
        while (currOldPos > 0) {
          ops.unshift({ type: 'delete', v: oldTokens[currOldPos - 1] });
          currOldPos--;
        }
        while (currNewPos > 0) {
          ops.unshift({ type: 'insert', v: newTokens[currNewPos - 1] });
          currNewPos--;
        }
        return ops;
      }
    }
  }
  return [];
}

export function computeWordDiff(oldText: string, newText: string): { oldHtml: string; newHtml: string } {
  const a = tokenize(oldText);
  const b = tokenize(newText);

  if (a.length > MAX_DIFF_TOKENS || b.length > MAX_DIFF_TOKENS) {
    return { oldHtml: escapeHtml(oldText), newHtml: escapeHtml(newText) };
  }

  // Strip common prefix
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) {
    start++;
  }

  // Strip common suffix
  let endA = a.length - 1;
  let endB = b.length - 1;
  while (endA >= start && endB >= start && a[endA] === b[endB]) {
    endA--;
    endB--;
  }

  const subA = a.slice(start, endA + 1);
  const subB = b.slice(start, endB + 1);

  let ops = myersDiff(subA, subB);
  if (!ops) {
    ops = [
      ...subA.map((v) => ({ type: 'delete' as const, v })),
      ...subB.map((v) => ({ type: 'insert' as const, v }))
    ];
  }

  const fullOps: DiffOp[] = [
    ...a.slice(0, start).map((v) => ({ type: 'equal' as const, v })),
    ...ops,
    ...a.slice(endA + 1).map((v) => ({ type: 'equal' as const, v }))
  ];

  let oldHtml = '';
  let newHtml = '';

  for (const op of fullOps) {
    if (op.v === undefined || op.v === null) continue;
    const v = escapeHtml(op.v);
    if (op.type === 'equal') {
      oldHtml += v;
      newHtml += v;
    } else if (op.type === 'delete') {
      oldHtml += `<del class="rc-del">${v}</del>`;
    } else {
      newHtml += `<ins class="rc-ins">${v}</ins>`;
    }
  }

  return { oldHtml, newHtml };
}

/**
 * Builds comparison steps from pass snapshots.
 * snapshots: [originalText, afterPass1, afterPass2, ..., finalText]
 * passNames: ["Pass1Name", "Pass2Name", ...]
 */
export function buildSteps(snapshots: string[], passNames: string[]): RecastDiffStep[] {
  if (!snapshots || snapshots.length === 0) return [];

  const safeSnapshots = snapshots.length === 1 ? [snapshots[0], snapshots[0]] : snapshots;
  const getPassName = (i: number) => (passNames && passNames[i - 1] ? passNames[i - 1] : undefined);
  const steps: RecastDiffStep[] = [];

  // Step 0: full diff — original vs final
  steps.push({
    oldText: safeSnapshots[0],
    newText: safeSnapshots[safeSnapshots.length - 1],
    oldLabel: 'Original',
    newLabel: 'Final Recast',
    caption: 'Full Pipeline Diff'
  });

  // Steps 1..N: incremental diffs between consecutive passes
  for (let i = 0; i < safeSnapshots.length - 1; i++) {
    steps.push({
      oldText: safeSnapshots[i],
      newText: safeSnapshots[i + 1],
      oldLabel: i === 0 ? 'Original' : `Pass ${i}`,
      newLabel: `Pass ${i + 1}`,
      caption: i === 0 ? 'Original → Pass 1' : `Pass ${i} → Pass ${i + 1}`,
      passName: getPassName(i + 1)
    });
  }

  return steps;
}
