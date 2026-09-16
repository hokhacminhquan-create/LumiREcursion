/**
 * Lumi:REcursion — Recast Block Protection Engine
 * Isolates and protects metadata, HTML comments (e.g. GABI), extension widgets (CYOA),
 * HTML cards/styling (divs, tables), and trailing JSON state blocks during LLM rewriting.
 * 
 * Guarantees that only actual story prose is sent to the LLM for transformation,
 * while all structured extension data, tags, and layouts are preserved 100% verbatim.
 */

export interface ProtectedContent {
  /** Leading metadata extracted from message (GABI, comments, leading separators) */
  prefix: string;
  /** Trailing metadata extracted from message (CYOA blocks, trailing JSON data, trailing separators) */
  suffix: string;
  /** The clean prose body to be transformed by the LLM, with inline protected blocks replaced by placeholders */
  maskedBody: string;
  /** Original pure body before placeholder replacement */
  originalBody: string;
  /** Mapping of placeholder token (e.g. ⟦LR_PROTECT_0⟧) to its original verbatim text */
  placeholders: Map<string, string>;
  /** Total count of protected elements (prefix, suffix, inline blocks) */
  totalProtectedCount: number;
}

export interface BlockProtectionOptions {
  /** Whether to isolate leading comments/GABI metadata (default true) */
  protectHeaderComments?: boolean;
  /** Whether to isolate trailing JSON and CYOA blocks (default true) */
  protectTrailingBlocks?: boolean;
  /** Whether to protect inline HTML/XML blocks (like divs, tables, style, script) (default true) */
  protectInlineHtml?: boolean;
}

const PLACEHOLDER_PREFIX = '⟦LR_PROTECT_';
const PLACEHOLDER_SUFFIX = '⟧';

/**
 * Finds the matching closing tag taking into account nested tags of the same name.
 * Returns the index right after the closing tag's '>', or -1 if not found.
 */
function findMatchingClosingTag(text: string, startIndex: number, tagName: string): number {
  const openTagPattern = new RegExp(`^<${tagName}(?:[\\s>])`, 'i');
  const closeTagPattern = new RegExp(`^<\\/${tagName}(?:[\\s>])`, 'i');

  let depth = 0;
  let i = startIndex;

  while (i < text.length) {
    if (text[i] === '<') {
      const slice = text.slice(i);
      if (openTagPattern.test(slice)) {
        depth++;
        const tagEnd = text.indexOf('>', i);
        if (tagEnd === -1) return -1;
        i = tagEnd + 1;
        continue;
      } else if (closeTagPattern.test(slice)) {
        depth--;
        const tagEnd = text.indexOf('>', i);
        if (tagEnd === -1) return -1;
        if (depth === 0) {
          return tagEnd + 1;
        }
        i = tagEnd + 1;
        continue;
      }
    }
    i++;
  }

  return -1;
}

/**
 * Checks if a string contains valid JSON object
 */
function tryParseJson(str: string): boolean {
  try {
    const trimmed = str.trim();
    if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) return false;
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts and isolates non-prose metadata, widgets, and inline HTML structures.
 */
export function extractAndProtectBlocks(
  text: string,
  options: BlockProtectionOptions = {}
): ProtectedContent {
  const {
    protectHeaderComments = true,
    protectTrailingBlocks = true,
    protectInlineHtml = true
  } = options;

  let remaining = text;
  let prefix = '';
  let suffix = '';
  const placeholders = new Map<string, string>();
  let blockCounter = 0;

  // 1. EXTRACT PREFIX (Leading comments, GABI blocks, leading separators)
  if (protectHeaderComments) {
    let advanced = true;
    while (advanced) {
      advanced = false;

      // Leading whitespace
      const wsMatch = remaining.match(/^\s+/);
      if (wsMatch) {
        prefix += wsMatch[0];
        remaining = remaining.slice(wsMatch[0].length);
      }

      // Leading paired comment blocks (e.g. <!-- GABI_RESOLVED_START --> ... <!-- GABI_RESOLVED_END -->)
      const pairedStartMatch = remaining.match(/^<!--\s*([A-Za-z0-9_-]+)_START\s*-->/i);
      if (pairedStartMatch) {
        const tagName = pairedStartMatch[1];
        const endTagPattern = new RegExp(`<!--\\s*${tagName}_END\\s*-->`, 'i');
        const endMatch = remaining.match(endTagPattern);
        if (endMatch && endMatch.index !== undefined) {
          const blockEndIndex = endMatch.index + endMatch[0].length;
          prefix += remaining.slice(0, blockEndIndex);
          remaining = remaining.slice(blockEndIndex);
          advanced = true;
          continue;
        }
      }

      // Leading standalone HTML comment (e.g. <!-- ... -->)
      if (remaining.startsWith('<!--')) {
        const commentEnd = remaining.indexOf('-->');
        if (commentEnd !== -1) {
          const commentBlock = remaining.slice(0, commentEnd + 3);
          prefix += commentBlock;
          remaining = remaining.slice(commentEnd + 3);
          advanced = true;
          continue;
        }
      }

      // Leading horizontal rules immediately following header comments (e.g. --- or ***)
      const hrMatch = remaining.match(/^(\s*(?:---+|\*\*\*+|___+)\s*\n+)/);
      if (hrMatch && prefix.length > 0) {
        prefix += hrMatch[0];
        remaining = remaining.slice(hrMatch[0].length);
        advanced = true;
        continue;
      }
    }
  }

  // 2. EXTRACT SUFFIX (Trailing JSON state blocks, CYOA blocks, trailing separators)
  if (protectTrailingBlocks) {
    let advancedSuffix = true;
    while (advancedSuffix) {
      advancedSuffix = false;

      // Check for trailing JSON block (e.g. --- \n { "worldData": ... } \n ---)
      // We look for a balanced JSON block at the end
      const lastCloseBrace = remaining.lastIndexOf('}');
      if (lastCloseBrace !== -1) {
        // Look for trailing separator after the last close brace
        const afterClose = remaining.slice(lastCloseBrace + 1);
        const isTrailingValid = /^\s*(?:(?:---+|\*\*\*+|___+)\s*)?$/.test(afterClose);

        if (isTrailingValid) {
          // Find matching open brace by scanning backwards
          let openBraceIndex = -1;
          let depth = 0;
          for (let i = lastCloseBrace; i >= 0; i--) {
            if (remaining[i] === '}') depth++;
            else if (remaining[i] === '{') {
              depth--;
              if (depth === 0) {
                openBraceIndex = i;
                break;
              }
            }
          }

          if (openBraceIndex !== -1) {
            const jsonCandidate = remaining.slice(openBraceIndex, lastCloseBrace + 1);
            if (tryParseJson(jsonCandidate)) {
              // Found a valid trailing JSON object!
              // Check if there is a preceding separator (e.g. \n---\n or ```json)
              const beforeOpen = remaining.slice(0, openBraceIndex);
              const sepMatch = beforeOpen.match(/(?:\n\s*(?:---+|\*\*\*+|___+|```(?:json)?)\s*\n\s*)$/);
              const cutIndex = sepMatch ? beforeOpen.length - sepMatch[0].length : openBraceIndex;

              const trailingJsonSegment = remaining.slice(cutIndex);
              suffix = trailingJsonSegment + suffix;
              remaining = remaining.slice(0, cutIndex);
              advancedSuffix = true;
              continue;
            }
          }
        }
      }

      // Check for trailing <cyoa-block>...</cyoa-block>
      const cyoaEndTag = '</cyoa-block>';
      const lastCyoaEnd = remaining.lastIndexOf(cyoaEndTag);
      if (lastCyoaEnd !== -1) {
        const afterCyoa = remaining.slice(lastCyoaEnd + cyoaEndTag.length);
        if (/^\s*$/.test(afterCyoa)) {
          // It is indeed at the end!
          const cyoaStartTag = '<cyoa-block>';
          const cyoaStartIndex = remaining.lastIndexOf(cyoaStartTag, lastCyoaEnd);
          if (cyoaStartIndex !== -1) {
            // Check for preceding newline or separator
            const beforeCyoa = remaining.slice(0, cyoaStartIndex);
            const sepMatch = beforeCyoa.match(/(?:\n\s*(?:---+|\*\*\*+|___+)\s*\n\s*)$/);
            const cutIndex = sepMatch ? beforeCyoa.length - sepMatch[0].length : cyoaStartIndex;

            const trailingCyoaSegment = remaining.slice(cutIndex);
            suffix = trailingCyoaSegment + suffix;
            remaining = remaining.slice(0, cutIndex);
            advancedSuffix = true;
            continue;
          }
        }
      }
    }
  }

  const originalBody = remaining;
  let maskedBody = remaining;

  // 3. MASK INLINE ELEMENTS IN BODY (div cards, tables, comments, scripts, styles, custom tags)
  if (protectInlineHtml) {
    let result = '';
    let i = 0;

    while (i < remaining.length) {
      // Check for HTML comments
      if (remaining.startsWith('<!--', i)) {
        const end = remaining.indexOf('-->', i);
        if (end !== -1) {
          const rawBlock = remaining.slice(i, end + 3);
          const placeholder = `${PLACEHOLDER_PREFIX}${blockCounter++}${PLACEHOLDER_SUFFIX}`;
          placeholders.set(placeholder, rawBlock);
          result += placeholder;
          i = end + 3;
          continue;
        }
      }

      // Check for embedded <cyoa-block>
      if (remaining.startsWith('<cyoa-block', i)) {
        const end = remaining.indexOf('</cyoa-block>', i);
        if (end !== -1) {
          const rawBlock = remaining.slice(i, end + '</cyoa-block>'.length);
          const placeholder = `${PLACEHOLDER_PREFIX}${blockCounter++}${PLACEHOLDER_SUFFIX}`;
          placeholders.set(placeholder, rawBlock);
          result += placeholder;
          i = end + '</cyoa-block>'.length;
          continue;
        }
      }

      // Check for <style> or <script>
      const specialTagMatch = remaining.slice(i).match(/^<(style|script|svg|table|details)[\s>]/i);
      if (specialTagMatch) {
        const tagName = specialTagMatch[1].toLowerCase();
        const closeTag = `</${tagName}>`;
        const endIdx = remaining.toLowerCase().indexOf(closeTag, i);
        if (endIdx !== -1) {
          const rawBlock = remaining.slice(i, endIdx + closeTag.length);
          const placeholder = `${PLACEHOLDER_PREFIX}${blockCounter++}${PLACEHOLDER_SUFFIX}`;
          placeholders.set(placeholder, rawBlock);
          result += placeholder;
          i = endIdx + closeTag.length;
          continue;
        }
      }

      // Check for <div> with balanced nesting!
      if (/^<div[\s>]/i.test(remaining.slice(i))) {
        const endIdx = findMatchingClosingTag(remaining, i, 'div');
        if (endIdx !== -1) {
          const rawBlock = remaining.slice(i, endIdx);
          const placeholder = `${PLACEHOLDER_PREFIX}${blockCounter++}${PLACEHOLDER_SUFFIX}`;
          placeholders.set(placeholder, rawBlock);
          result += placeholder;
          i = endIdx;
          continue;
        }
      }

      result += remaining[i];
      i++;
    }

    maskedBody = result;
  }

  const totalProtectedCount =
    (prefix ? 1 : 0) + (suffix ? 1 : 0) + placeholders.size;

  return {
    prefix,
    suffix,
    maskedBody,
    originalBody,
    placeholders,
    totalProtectedCount
  };
}

/**
 * Re-inserts an omitted block if the LLM deleted the placeholder token.
 */
function reinsertOmittedBlock(
  transformed: string,
  originalBody: string,
  placeholder: string,
  originalBlock: string
): string {
  // Find where placeholder was in original body
  const origIndex = originalBody.indexOf(placeholder);
  if (origIndex !== -1) {
    // Look at 30 chars before the placeholder
    const preWindow = originalBody.slice(Math.max(0, origIndex - 40), origIndex).trim();
    if (preWindow.length > 10) {
      // Look for preWindow in transformed text
      const foundIdx = transformed.indexOf(preWindow);
      if (foundIdx !== -1) {
        const insertPos = foundIdx + preWindow.length;
        return `${transformed.slice(0, insertPos)}\n\n${originalBlock}\n\n${transformed.slice(insertPos)}`;
      }
    }
  }

  // Fallback: append at the end of transformed body
  return `${transformed}\n\n${originalBlock}`;
}

/**
 * Restores all protected placeholders, leading prefix metadata, and trailing suffix data.
 */
export function restoreProtectedBlocks(
  transformedBody: string,
  protectedData: ProtectedContent
): string {
  let result = transformedBody;

  // 1. Restore all inline placeholders
  for (const [placeholder, originalBlock] of protectedData.placeholders.entries()) {
    if (result.includes(placeholder)) {
      result = result.split(placeholder).join(originalBlock);
    } else {
      // LLM dropped or altered placeholder token
      result = reinsertOmittedBlock(result, protectedData.maskedBody, placeholder, originalBlock);
    }
  }

  // 2. Re-attach prefix and suffix verbatim
  return `${protectedData.prefix}${result}${protectedData.suffix}`;
}
