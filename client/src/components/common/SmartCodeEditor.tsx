import React, { useRef, useEffect, useMemo } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import { handleSmartCodeKeyDown } from '../../utils/codeEditorUtils';

export interface SmartCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  className?: string;
  showLineNumbers?: boolean;
  rows?: number;
  readOnly?: boolean;
}

const normalizeLanguage = (lang?: string): string => {
  if (!lang) return 'python';
  const l = lang.toLowerCase();
  if (l === 'py' || l === 'python' || l === 'python3') return 'python';
  if (l === 'js' || l === 'javascript' || l === 'node') return 'javascript';
  if (l === 'java') return 'java';
  if (l === 'cpp' || l === 'c++') return 'cpp';
  if (l === 'c') return 'c';
  return 'python';
};

export const SmartCodeEditor: React.FC<SmartCodeEditorProps> = ({
  value,
  onChange,
  language = 'python',
  placeholder = 'Type your code here...',
  className = '',
  showLineNumbers = false,
  rows,
  readOnly = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const normalizedLang = normalizeLanguage(language);

  // Generate syntax-highlighted HTML using Prism
  const highlightedCode = useMemo(() => {
    const prismGrammar = Prism.languages[normalizedLang] || Prism.languages.javascript;
    try {
      const codeToHighlight = value ? value : '';
      return Prism.highlight(codeToHighlight, prismGrammar, normalizedLang);
    } catch {
      return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  }, [value, normalizedLang]);

  // Synchronize scroll between textarea, syntax pre layer, and line number gutter
  const handleScroll = () => {
    if (!textareaRef.current) return;
    const { scrollTop, scrollLeft } = textareaRef.current;
    if (preRef.current) {
      preRef.current.scrollTop = scrollTop;
      preRef.current.scrollLeft = scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = scrollTop;
    }
  };

  useEffect(() => {
    handleScroll();
  }, [value]);

  const lines = value ? value.split('\n') : [''];
  const lineCount = lines.length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  return (
    <div className={`relative flex w-full h-full font-mono text-xs overflow-hidden bg-[#0a1020] text-slate-200 ${className}`}>
      {/* Optional Line Numbers Gutter */}
      {showLineNumbers && (
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="w-11 py-4 pr-3 pl-2 bg-[#060b17] text-slate-500 font-mono text-xs select-none text-right border-r border-slate-800/90 overflow-hidden shrink-0 pointer-events-none"
        >
          {lineNumbers.map((num) => (
            <div key={num} className="leading-relaxed">
              {num}
            </div>
          ))}
        </div>
      )}

      {/* Editor Body: Overlay Container */}
      <div className="relative flex-1 w-full h-full min-h-[140px] overflow-hidden bg-[#0a1020]">
        {/* Layer 1: Syntax-Highlighted Render Layer (behind textarea) */}
        <pre
          ref={preRef}
          aria-hidden="true"
          className="smart-code-highlight absolute inset-0 p-4 m-0 overflow-hidden pointer-events-none whitespace-pre font-mono text-xs leading-relaxed text-slate-200 tab-size-4 select-none"
          dangerouslySetInnerHTML={{ __html: (highlightedCode || '') + (value.endsWith('\n') ? '<br /> ' : '') }}
        />

        {/* Layer 2: Transparent Interactive Textarea (for cursor, typing, smart keys, selection) */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => handleSmartCodeKeyDown(e, value, onChange)}
          onScroll={handleScroll}
          rows={rows}
          readOnly={readOnly}
          placeholder={placeholder}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="absolute inset-0 p-4 m-0 w-full h-full bg-transparent text-transparent caret-[#38bdf8] placeholder:text-slate-500 focus:outline-none whitespace-pre font-mono text-xs leading-relaxed resize-none overflow-auto selection:bg-[#2563eb]/40 selection:text-transparent"
        />
      </div>
    </div>
  );
};
