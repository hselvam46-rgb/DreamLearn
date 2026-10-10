import React from 'react';

export interface SmartKeyOptions {
  tabSize?: number;
  enablePairs?: boolean;
  enableAutoIndent?: boolean;
}

const PAIRS: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '"': '"',
  "'": "'",
  '`': '`',
};

const CLOSING_CHARS = new Set([')', ']', '}', '"', "'", '`']);

/**
 * Smart keyboard handler for code textareas mimicking LeetCode & VS Code:
 * - Auto-closing brackets & quotes with cursor in middle
 * - Wrap selected text in brackets/quotes
 * - Skip over matching closing characters
 * - Smart backspace deletes matching empty pair
 * - Tab key indents (Shift+Tab unindents)
 * - Enter key maintains indent, increases indent after '{', '[', '(', ':',
 *   and splits '{|}' into a formatted 3-line block.
 */
export const handleSmartCodeKeyDown = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  code: string,
  setCode: (newCode: string) => void,
  options: SmartKeyOptions = {}
): boolean => {
  const { tabSize = 4, enablePairs = true, enableAutoIndent = true } = options;
  const textarea = e.currentTarget;
  const { selectionStart, selectionEnd, value } = textarea;
  const indentStr = ' '.repeat(tabSize);

  // Helper to update textarea value & selection position smoothly
  const applyUpdate = (
    newValue: string,
    newCursorStart: number,
    newCursorEnd: number = newCursorStart
  ) => {
    e.preventDefault();
    setCode(newValue);

    // Apply selection on the actual DOM element after React finishes render cycle
    requestAnimationFrame(() => {
      textarea.selectionStart = newCursorStart;
      textarea.selectionEnd = newCursorEnd;
    });
  };

  // 1. TAB & SHIFT+TAB
  if (e.key === 'Tab') {
    // If Shift + Tab: unindent
    if (e.shiftKey) {
      const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
      const lineEnd = value.indexOf('\n', selectionEnd);
      const effectiveEnd = lineEnd === -1 ? value.length : lineEnd;

      const lines = value.substring(lineStart, effectiveEnd).split('\n');
      let removedTotal = 0;
      let firstLineRemoved = 0;

      const newLines = lines.map((line, idx) => {
        let spacesToRemove = 0;
        if (line.startsWith(indentStr)) {
          spacesToRemove = tabSize;
        } else if (line.startsWith('\t')) {
          spacesToRemove = 1;
        } else {
          // Remove up to tabSize leading spaces
          const match = line.match(/^ +/);
          if (match) {
            spacesToRemove = Math.min(match[0].length, tabSize);
          }
        }

        if (idx === 0) firstLineRemoved = spacesToRemove;
        removedTotal += spacesToRemove;
        return line.substring(spacesToRemove);
      });

      const updatedText =
        value.substring(0, lineStart) + newLines.join('\n') + value.substring(effectiveEnd);

      const newStart = Math.max(lineStart, selectionStart - firstLineRemoved);
      const newEnd = Math.max(newStart, selectionEnd - removedTotal);
      applyUpdate(updatedText, newStart, newEnd);
      return true;
    }

    // Normal Tab
    if (selectionStart !== selectionEnd) {
      // Multi-line indent
      const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
      const lineEnd = value.indexOf('\n', selectionEnd);
      const effectiveEnd = lineEnd === -1 ? value.length : lineEnd;

      const lines = value.substring(lineStart, effectiveEnd).split('\n');
      const indented = lines.map((line) => indentStr + line).join('\n');
      const updatedText =
        value.substring(0, lineStart) + indented + value.substring(effectiveEnd);

      const newStart = selectionStart + tabSize;
      const newEnd = selectionEnd + tabSize * lines.length;
      applyUpdate(updatedText, newStart, newEnd);
      return true;
    }

    // Single cursor tab: insert 4 spaces
    const updated = value.slice(0, selectionStart) + indentStr + value.slice(selectionEnd);
    applyUpdate(updated, selectionStart + tabSize);
    return true;
  }

  // 2. BACKSPACE: Smart pair deletion
  if (e.key === 'Backspace' && enablePairs) {
    if (selectionStart === selectionEnd && selectionStart > 0) {
      const prev = value[selectionStart - 1];
      const next = value[selectionStart];
      if (PAIRS[prev] && PAIRS[prev] === next) {
        // Delete both the opening and closing character
        const updated = value.slice(0, selectionStart - 1) + value.slice(selectionStart + 1);
        applyUpdate(updated, selectionStart - 1);
        return true;
      }
    }
  }

  // 3. ENTER: Smart indentation & brace split
  if (e.key === 'Enter' && enableAutoIndent && !e.ctrlKey && !e.metaKey && !e.altKey) {
    const lastNewline = value.lastIndexOf('\n', selectionStart - 1);
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
    const currentLine = value.substring(lineStart, selectionStart);

    // Extract leading whitespace
    const match = currentLine.match(/^[ \t]*/);
    const currentIndent = match ? match[0] : '';

    const prevChar = value[selectionStart - 1];
    const nextChar = value[selectionStart];

    // Case 3a: Cursor is directly between matching pairs { | }, [ | ], ( | )
    if (
      (prevChar === '{' && nextChar === '}') ||
      (prevChar === '[' && nextChar === ']') ||
      (prevChar === '(' && nextChar === ')')
    ) {
      const extraIndent = indentStr;
      const insertion = '\n' + currentIndent + extraIndent + '\n' + currentIndent;
      const updated = value.slice(0, selectionStart) + insertion + value.slice(selectionEnd);
      const targetPos = selectionStart + 1 + currentIndent.length + extraIndent.length;
      applyUpdate(updated, targetPos);
      return true;
    }

    // Case 3b: Line opens a block ({, [, (, :)
    const trimmedLine = currentLine.trim();
    const lastNonSpace = trimmedLine[trimmedLine.length - 1];
    if (lastNonSpace === '{' || lastNonSpace === '[' || lastNonSpace === '(' || lastNonSpace === ':') {
      const insertion = '\n' + currentIndent + indentStr;
      const updated = value.slice(0, selectionStart) + insertion + value.slice(selectionEnd);
      applyUpdate(updated, selectionStart + insertion.length);
      return true;
    }

    // Case 3c: Regular enter with persistent indentation
    const insertion = '\n' + currentIndent;
    const updated = value.slice(0, selectionStart) + insertion + value.slice(selectionEnd);
    applyUpdate(updated, selectionStart + insertion.length);
    return true;
  }

  // 4. AUTO-CLOSING PAIRS & SKIP OVER
  if (enablePairs && !e.ctrlKey && !e.metaKey && !e.altKey) {
    // 4a. Skip over if typing closing character right before an existing one
    if (
      selectionStart === selectionEnd &&
      CLOSING_CHARS.has(e.key) &&
      value[selectionStart] === e.key
    ) {
      // For quotes, check if we're closing or opening
      if (e.key === '"' || e.key === "'" || e.key === '`') {
        const prev = value[selectionStart - 1];
        if (prev !== '\\') {
          e.preventDefault();
          requestAnimationFrame(() => {
            textarea.selectionStart = selectionStart + 1;
            textarea.selectionEnd = selectionStart + 1;
          });
          return true;
        }
      } else {
        e.preventDefault();
        requestAnimationFrame(() => {
          textarea.selectionStart = selectionStart + 1;
          textarea.selectionEnd = selectionStart + 1;
        });
        return true;
      }
    }

    // 4b. Wrap selection with pairs
    if (selectionStart !== selectionEnd && PAIRS[e.key]) {
      const open = e.key;
      const close = PAIRS[e.key];
      const selected = value.substring(selectionStart, selectionEnd);
      const updated = value.slice(0, selectionStart) + open + selected + close + value.slice(selectionEnd);
      applyUpdate(updated, selectionStart + 1, selectionEnd + 1);
      return true;
    }

    // 4c. Insert pair when typing opening character
    if (selectionStart === selectionEnd && PAIRS[e.key]) {
      const open = e.key;
      const close = PAIRS[e.key];
      const updated = value.slice(0, selectionStart) + open + close + value.slice(selectionEnd);
      applyUpdate(updated, selectionStart + 1);
      return true;
    }
  }

  return false;
};
