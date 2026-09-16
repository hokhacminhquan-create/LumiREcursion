/**
 * Lumi:REcursion — Universal Recast Block Protection Engine
 * Isolates and protects ANY metadata, HTML comments (e.g. GABI), custom extension widgets
 * (known or unknown future tags), HTML cards/layouts, code blocks, and trailing state blocks.
 * 
 * Operates universally without needing hardcoded tag names:
 * 1. Universal Prefix Isolation: Leading comments (paired or standalone), frontmatter, header metadata.
 * 2. Universal Suffix Isolation: Trailing custom widgets (any tag name), trailing JSON/YAML, code fences.
 * 3. Universal Inline Protection: Fenced code blocks, comments, custom elements (any tag with hyphen),
 *    styled tags (any tag with attributes), structural HTML tags, and unknown custom XML tags.
 * 4. Resilient Restoration: Exact token replacement, mutation-tolerant bracket matching, and context
 *    anchored re-insertion fallback if a model ever drops a token.
 */

export interface ProtectedContent {
  /** Leading metadata extracted from message (GABI, comments, frontmatter, leading separators) */
  prefix: string;
  /** Trailing metadata extracted from message (trailing widgets, trailing JSON/YAML state data, separators) */
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
  /** Whether to isolate trailing JSON and widgets (default true) */
  protectTrailingBlocks?: boolean;
  /** Whether to protect inline HTML/XML blocks and code fences (default true) */
  protectInlineHtml?: boolean;
}

export const PLACEHOLDER_PREFIX = '⟦LR_PROTECT_';
export const PLACEHOLDER_SUFFIX = '⟧';

/**
 * Known HTML void elements that cannot have child nodes or closing tags.
 */
const VOID_HTML_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

/**
 * Standard inline prose formatting tags without structural layout significance.
 * If these have NO attributes, they can be treated as standard prose emphasis.
 * If they have ANY attributes (e.g. class, style, id), they are protected.
 */
const INLINE_PROSE_TAGS = new Set([
  'b', 'i', 'em', 'strong', 's', 'u', 'strike', 'del', 'mark',
  'sub', 'sup', 'small', 'q', 'abbr', 'cite', 'dfn', 'time'
]);

/**
 * Escapes regex special characters in a string.
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Scans a tag header from startIndex (starting at '<') until matching '>'
 * taking quotes into account (e.g. `<tag attr=">">`).
 */
function scanTagHeader(text: string, startIndex: number): { fullHeader: string; tagName: string; isSelfClosing: boolean; endIndex: number } | null {
  if (text[startIndex] !== '<') return null;

  const match = text.slice(startIndex).match(/^<([a-zA-Z][a-zA-Z0-9_-]*)/);
  if (!match) return null;

  const tagName = match[1];
  let inQuote: '"' | "'" | null = null;
  let i = startIndex + match[0].length;

  while (i < text.length) {
    const ch = text[i];
    if (inQuote) {
      if (ch === inQuote) {
        inQuote = null;
      }
    } else {
      if (ch === '"' || ch === "'") {
        inQuote = ch;
      } else if (ch === '>') {
        const fullHeader = text.slice(startIndex, i + 1);
        const isSelfClosing = fullHeader.trim().endsWith('/>') || VOID_HTML_TAGS.has(tagName.toLowerCase());
        return {
          fullHeader,
          tagName,
          isSelfClosing,
          endIndex: i + 1
        };
      }
    }
    i++;
  }

  return null;
}

/**
 * Finds the matching closing tag taking into account nested tags of the same name.
 * Handles self-closing and void tags gracefully.
 */
function findBalancedClosingTag(text: string, startIndex: number, tagName: string): number {
  const openTagRegex = new RegExp(`^<${escapeRegex(tagName)}(?:[\\s>/])`, 'i');
  const closeTagRegex = new RegExp(`^<\\/${escapeRegex(tagName)}(?:[\\s>])`, 'i');

  let depth = 0;
  let i = startIndex;

  while (i < text.length) {
    if (text[i] === '<') {
      const slice = text.slice(i);

      // Check if closing tag
      if (closeTagRegex.test(slice)) {
        depth--;
        const tagEnd = text.indexOf('>', i);
        if (tagEnd === -1) return -1;
        if (depth === 0) {
          return tagEnd + 1;
        }
        i = tagEnd + 1;
        continue;
      }

      // Check if opening tag
      if (openTagRegex.test(slice)) {
        const header = scanTagHeader(text, i);
        if (header) {
          if (header.isSelfClosing) {
            if (i === startIndex) {
              return header.endIndex;
            }
            i = header.endIndex;
            continue;
          }

          depth++;
          i = header.endIndex;
          continue;
        }
      }
    }
    i++;
  }

  return -1;
}

/**
 * Determines whether an opening tag should be protected from LLM rewriting.
 * Universal rule: Protect ANY tag that is:
 * 1. A custom element (has hyphen, e.g. `<cyoa-block>`, `<inventory-hud>`)
 * 2. Has attributes (e.g. `style=`, `class=`, `id=`, etc.)
 * 3. Is a void HTML tag (e.g. `<img>`, `<hr>`)
 * 4. Is not in the tiny list of basic unstyled inline formatting tags (b, i, em, strong, s, u, mark).
 */
function shouldProtectTag(tagName: string, fullTagHeader: string, isSelfClosing: boolean): boolean {
  const lowerTag = tagName.toLowerCase();

  // 1. Custom element (Web Components specification requires hyphen)
  if (tagName.includes('-')) return true;

  // 2. Void tag
  if (VOID_HTML_TAGS.has(lowerTag) || isSelfClosing) return true;

  // 3. Has attributes (any attribute = formatting, class, state, or event handlers)
  const afterName = fullTagHeader.slice(1 + tagName.length).replace(/>$/, '').trim();
  if (afterName.length > 0 && afterName !== '/') {
    // If it has attributes or parameters, always protect!
    return true;
  }

  // 4. Any tag that is NOT a trivial inline typography tag
  if (!INLINE_PROSE_TAGS.has(lowerTag)) {
    return true;
  }

  // Pure inline prose tag without attributes (e.g. `<i>`, `<b>`, `<em>`)
  return false;
}

/**
 * Checks if a string contains a valid JSON object or array.
 */
function tryParseJson(str: string): boolean {
  try {
    const trimmed = str.trim();
    if (!((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']')))) {
      return false;
    }
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts and isolates all non-prose metadata, widgets, and inline HTML structures.
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

  // 1. UNIVERSAL PREFIX EXTRACTION (Leading comments, GABI, frontmatter, leading separators)
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

      // Leading paired comment blocks (e.g. <!-- (NAME)_START --> ... <!-- (NAME)_END -->)
      const pairedStartMatch = remaining.match(/^<!--\s*([A-Za-z0-9_-]+)(?:_START|_BEGIN)\s*-->/i);
      if (pairedStartMatch) {
        const tagName = pairedStartMatch[1];
        const endTagPattern = new RegExp(`<!--\\s*${escapeRegex(tagName)}(?:_END|_STOP)\\s*-->`, 'i');
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

      // Leading horizontal rules immediately following comments (e.g. --- or ***)
      const hrMatch = remaining.match(/^(\s*(?:---+|\*\*\*+|___+)\s*\n+)/);
      if (hrMatch && prefix.length > 0) {
        prefix += hrMatch[0];
        remaining = remaining.slice(hrMatch[0].length);
        advanced = true;
        continue;
      }
    }
  }

  // 2. UNIVERSAL SUFFIX EXTRACTION (Trailing JSON, YAML, code blocks, custom widgets of ANY tag name)
  if (protectTrailingBlocks) {
    let advancedSuffix = true;
    while (advancedSuffix) {
      advancedSuffix = false;

      // Check for trailing standalone horizontal rules at end of remaining
      const trailingHrMatch = remaining.match(/(?:\n\s*(?:---+|\*\*\*+|___+)\s*)+$/);
      if (trailingHrMatch && trailingHrMatch.index !== undefined && trailingHrMatch.index > 0) {
        suffix = remaining.slice(trailingHrMatch.index) + suffix;
        remaining = remaining.slice(0, trailingHrMatch.index);
        advancedSuffix = true;
        continue;
      }

      // Check for trailing JSON state block (e.g. --- \n { ... } \n ---)
      const lastCloseBrace = remaining.lastIndexOf('}');
      if (lastCloseBrace !== -1) {
        const afterClose = remaining.slice(lastCloseBrace + 1);
        const isTrailingValid = /^\s*(?:(?:---+|\*\*\*+|___+)\s*)?$/.test(afterClose);

        if (isTrailingValid) {
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

      // Check for trailing fenced code blocks (```yaml, ```json, etc. at the very end)
      const codeFenceMatch = remaining.match(/(?:\n\s*(?:---+|\*\*\*+|___+)\s*\n\s*)?```[a-zA-Z0-9_-]*\s*\n[\s\S]*?\n```\s*$/);
      if (codeFenceMatch && codeFenceMatch.index !== undefined) {
        suffix = remaining.slice(codeFenceMatch.index) + suffix;
        remaining = remaining.slice(0, codeFenceMatch.index);
        advancedSuffix = true;
        continue;
      }

      // Check for trailing XML / HTML tag (ANY tag name! e.g. </future-choice-dock>, </cyoa-block>, etc.)
      const trailingCloseTagMatch = remaining.match(/<\/([a-zA-Z][a-zA-Z0-9_-]*)>\s*(?:\n\s*(?:---+|\*\*\*+|___+)\s*)?$/);
      if (trailingCloseTagMatch && trailingCloseTagMatch.index !== undefined) {
        const tagName = trailingCloseTagMatch[1];
        const openTagPattern = new RegExp(`<${escapeRegex(tagName)}(?:[\\s>/])`, 'i');

        // Scan backwards for the matching opening tag
        let searchIndex = trailingCloseTagMatch.index;
        let foundStartIndex = -1;

        while (searchIndex >= 0) {
          const prevOpen = remaining.lastIndexOf('<' + tagName, searchIndex);
          if (prevOpen === -1) {
            // Case-insensitive check if exact case didn't match
            const sliceBefore = remaining.slice(0, searchIndex);
            const matches = [...sliceBefore.matchAll(new RegExp(`<${escapeRegex(tagName)}(?:[\\s>/])`, 'gi'))];
            if (matches.length > 0) {
              const lastM = matches[matches.length - 1];
              if (lastM.index !== undefined) {
                // Verify balanced end
                const balancedEnd = findBalancedClosingTag(remaining, lastM.index, tagName);
                if (balancedEnd >= trailingCloseTagMatch.index) {
                  foundStartIndex = lastM.index;
                }
              }
            }
            break;
          }

          const balancedEnd = findBalancedClosingTag(remaining, prevOpen, tagName);
          if (balancedEnd >= trailingCloseTagMatch.index) {
            foundStartIndex = prevOpen;
            break;
          }
          searchIndex = prevOpen - 1;
        }

        if (foundStartIndex !== -1) {
          // Check for preceding separator
          const beforeTag = remaining.slice(0, foundStartIndex);
          const sepMatch = beforeTag.match(/(?:\n\s*(?:---+|\*\*\*+|___+)\s*\n\s*)$/);
          const cutIndex = sepMatch ? beforeTag.length - sepMatch[0].length : foundStartIndex;

          const trailingWidgetSegment = remaining.slice(cutIndex);
          suffix = trailingWidgetSegment + suffix;
          remaining = remaining.slice(0, cutIndex);
          advancedSuffix = true;
          continue;
        }
      }
    }
  }

  const originalBody = remaining;
  let maskedBody = remaining;

  // 3. UNIVERSAL INLINE TAG & BLOCK PROTECTION IN PROSE BODY
  if (protectInlineHtml) {
    let result = '';
    let i = 0;

    while (i < remaining.length) {
      // 3a. Fenced Code Blocks (```lang ... ```)
      if (remaining.startsWith('```', i)) {
        const endFence = remaining.indexOf('```', i + 3);
        if (endFence !== -1) {
          let blockEnd = endFence + 3;
          if (remaining[blockEnd] === '\n') blockEnd++;
          else if (remaining.slice(blockEnd, blockEnd + 2) === '\r\n') blockEnd += 2;

          const rawBlock = remaining.slice(i, blockEnd);
          const placeholder = `${PLACEHOLDER_PREFIX}${blockCounter++}${PLACEHOLDER_SUFFIX}`;
          placeholders.set(placeholder, rawBlock);
          result += placeholder;
          i = blockEnd;
          continue;
        }
      }

      // 3b. HTML Comments (<!-- ... -->)
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

      // 3c. Universal HTML / XML Tag Scanner (ANY tag name)
      if (remaining[i] === '<' && remaining[i + 1] !== '/' && remaining[i + 1] !== '!' && remaining[i + 1] !== '?') {
        const header = scanTagHeader(remaining, i);
        if (header && shouldProtectTag(header.tagName, header.fullHeader, header.isSelfClosing)) {
          if (header.isSelfClosing) {
            // Self-closing void tag
            const rawBlock = remaining.slice(i, header.endIndex);
            const placeholder = `${PLACEHOLDER_PREFIX}${blockCounter++}${PLACEHOLDER_SUFFIX}`;
            placeholders.set(placeholder, rawBlock);
            result += placeholder;
            i = header.endIndex;
            continue;
          }

          // Container tag with matching closing tag
          const endIdx = findBalancedClosingTag(remaining, i, header.tagName);
          if (endIdx !== -1) {
            const rawBlock = remaining.slice(i, endIdx);
            const placeholder = `${PLACEHOLDER_PREFIX}${blockCounter++}${PLACEHOLDER_SUFFIX}`;
            placeholders.set(placeholder, rawBlock);
            result += placeholder;
            i = endIdx;
            continue;
          }
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
 * Uses contextual anchor matching before and after the placeholder in the original text.
 */
function reinsertOmittedBlock(
  transformed: string,
  maskedBody: string,
  placeholder: string,
  originalBlock: string
): string {
  // 1. Check if the placeholder was slightly mutated by LLM brackets (e.g. [[...]], <...>, [...])
  const bareIdMatch = placeholder.match(/\d+/);
  if (bareIdMatch) {
    const id = bareIdMatch[0];
    const mutationPattern = new RegExp(`(?:\\[\\[|\\[|<|⟦|\\()\\s*LR_PROTECT_${id}\\s*(?:\\]\\]|\\]|>|⟧|\\))`, 'g');
    if (mutationPattern.test(transformed)) {
      return transformed.replace(mutationPattern, originalBlock);
    }
  }

  // 2. Context anchor matching: Find surrounding text in maskedBody
  const origIndex = maskedBody.indexOf(placeholder);
  if (origIndex !== -1) {
    // Look backwards up to 50 characters for an anchor string
    const preSlice = maskedBody.slice(Math.max(0, origIndex - 50), origIndex).trim();
    if (preSlice.length >= 8) {
      // Find the best matching anchor in transformed text
      const anchorPos = transformed.indexOf(preSlice);
      if (anchorPos !== -1) {
        const insertPos = anchorPos + preSlice.length;
        return `${transformed.slice(0, insertPos)}\n\n${originalBlock}\n\n${transformed.slice(insertPos)}`;
      }
    }

    // Look forwards up to 50 characters for an anchor string
    const afterSlice = maskedBody.slice(origIndex + placeholder.length, Math.min(maskedBody.length, origIndex + placeholder.length + 50)).trim();
    if (afterSlice.length >= 8) {
      const anchorPos = transformed.indexOf(afterSlice);
      if (anchorPos !== -1) {
        return `${transformed.slice(0, anchorPos)}\n\n${originalBlock}\n\n${transformed.slice(anchorPos)}`;
      }
    }
  }

  // 3. Fallback: Append before end of transformed body
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
      // LLM dropped or mutated placeholder token — use resilient recovery
      result = reinsertOmittedBlock(result, protectedData.maskedBody, placeholder, originalBlock);
    }
  }

  // 2. Re-attach prefix and suffix verbatim
  return `${protectedData.prefix}${result}${protectedData.suffix}`;
}
