/**
 * Lumi:REcursion — Recast Scene & Narrative Chunking Engine
 * Splits long narrative responses into natural, scene-coherent chunks
 * to prevent LLM attention dilution, output token truncation, and content loss.
 */

export interface TextChunk {
  text: string;
  divider: string;
}

/**
 * Splits a text into paragraph-based chunks aiming for targetChars per chunk.
 */
export function splitByParagraphs(text: string, targetChars = 6000): TextChunk[] {
  const paragraphs = text.split(/\n\n+/);
  if (paragraphs.length <= 1) {
    return [{ text, divider: '' }];
  }

  const chunks: TextChunk[] = [];
  let current: string[] = [];
  let curLen = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    if (curLen + p.length > targetChars && current.length > 0) {
      chunks.push({ text: current.join('\n\n'), divider: '\n\n' });
      current = [p];
      curLen = p.length;
    } else {
      current.push(p);
      curLen += p.length + 2;
    }
  }

  if (current.length > 0) {
    chunks.push({ text: current.join('\n\n'), divider: '' });
  }

  return chunks;
}

/**
 * Splits long text into scene-aware chunks.
 * 1. Checks for natural scene dividers (horizontal rules like `---` or `***`).
 * 2. If no scene dividers or if any scene exceeds 1.8x targetChars, sub-splits at paragraph boundaries.
 * 3. Short texts (<= targetChars * 1.3) are returned as a single chunk.
 */
export function splitIntoChunks(text: string, targetChars = 6000): TextChunk[] {
  if (!text || text.length <= targetChars * 1.3) {
    return [{ text, divider: '' }];
  }

  // 1. Check for horizontal rules or scene separators (\n\s*---\s*\n)
  const hrRegex = /\n\s*(?:---+|\*\*\*+|___+)\s*\n/g;
  const hrSplits: Array<{ index: number; length: number; match: string }> = [];
  let m: RegExpExecArray | null;

  while ((m = hrRegex.exec(text)) !== null) {
    hrSplits.push({ index: m.index, length: m[0].length, match: m[0] });
  }

  if (hrSplits.length > 0) {
    const rawSceneChunks: TextChunk[] = [];
    let lastIndex = 0;

    for (let i = 0; i < hrSplits.length; i++) {
      const split = hrSplits[i];
      const segment = text.slice(lastIndex, split.index);
      if (segment.trim().length > 0) {
        rawSceneChunks.push({ text: segment, divider: split.match });
      }
      lastIndex = split.index + split.length;
    }

    const finalSegment = text.slice(lastIndex);
    if (finalSegment.trim().length > 0) {
      rawSceneChunks.push({ text: finalSegment, divider: '' });
    }

    // Sub-split any individual scene that is still excessively large (> 1.8x targetChars)
    const refinedChunks: TextChunk[] = [];
    for (const chunk of rawSceneChunks) {
      if (chunk.text.length > targetChars * 1.8) {
        const subChunks = splitByParagraphs(chunk.text, targetChars);
        for (let s = 0; s < subChunks.length; s++) {
          const isLastSub = s === subChunks.length - 1;
          refinedChunks.push({
            text: subChunks[s].text,
            divider: isLastSub ? chunk.divider : subChunks[s].divider
          });
        }
      } else {
        refinedChunks.push(chunk);
      }
    }

    return refinedChunks;
  }

  // 2. Fallback to clean paragraph boundary splitting
  return splitByParagraphs(text, targetChars);
}

/**
 * Reassembles processed chunks back into the complete text verbatim,
 * preserving original scene breaks and paragraph dividers.
 */
export function reassembleChunks(chunks: TextChunk[]): string {
  if (!chunks || chunks.length === 0) return '';
  let result = '';
  for (let i = 0; i < chunks.length; i++) {
    result += chunks[i].text;
    if (i < chunks.length - 1) {
      result += (chunks[i].divider || '\n\n');
    }
  }
  return result;
}
