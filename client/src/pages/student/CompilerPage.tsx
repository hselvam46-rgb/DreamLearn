import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Play, 
  RotateCcw, 
  Trash2, 
  Clock, 
  Copy, 
  Check, 
  Terminal as TerminalIcon,
  Code2,
  Sparkles,
  Command,
  FileCode2
} from 'lucide-react';
import { SmartCodeEditor } from '../../components/common/SmartCodeEditor';

export const CompilerPage: React.FC = () => {
  const location = useLocation();

  // Language starter code templates
  const starterCodes: { [key: string]: string } = {
    python: `# Python 3.14 - DreamLearn Online Compiler
def main():
    print("Welcome to DreamLearn Online Compiler!")
    nums = [1, 2, 3, 4, 5]
    print("Sum of numbers:", sum(nums))

if __name__ == "__main__":
    main()
`,
    cpp: `// C++ (GCC 15) - DreamLearn Online Compiler
#include <iostream>
#include <vector>
#include <numeric>

using namespace std;

int main() {
    cout << "Welcome to DreamLearn C++ Online Compiler!" << endl;
    vector<int> nums = {10, 20, 30, 40, 50};
    int total = accumulate(nums.begin(), nums.end(), 0);
    cout << "Accumulated Total: " << total << endl;
    return 0;
}
`,
    c: `// C (GCC 15) - DreamLearn Online Compiler
#include <stdio.h>

int main() {
    printf("Welcome to DreamLearn C Online Compiler!\\n");
    int a = 15, b = 27;
    printf("Result of %d + %d = %d\\n", a, b, a + b);
    return 0;
}
`,
    java: `// Java (OpenJDK 17) - DreamLearn Online Compiler
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Welcome to DreamLearn Java Online Compiler!");
        List<String> list = Arrays.asList("Arrays", "LinkedLists", "Trees", "Graphs");
        System.out.println("DSA Topics: " + list);
    }
}
`,
    javascript: `// JavaScript (Node.js 24) - DreamLearn Online Compiler
function main() {
    console.log("Welcome to DreamLearn JavaScript Online Compiler!");
    const dsaTopics = ["Stacks", "Queues", "Heaps", "Dynamic Programming"];
    console.log("Topics count:", dsaTopics.length);
    console.log("Joined:", dsaTopics.join(" -> "));
}

main();
`,
  };

  const initialLang = location.state?.initialLanguage || 'python';
  const initialCode = location.state?.initialCode || starterCodes[initialLang];

  const [language, setLanguage] = useState<string>(initialLang);
  const [code, setCode] = useState<string>(initialCode);
  const [customInput, setCustomInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [status, setStatus] = useState<string>('Ready');
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Line count for editor gutter
  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setCode(starterCodes[newLang] || '');
    setOutput('');
    setStatus('Ready');
  };

  const handleRun = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setStatus('Running...');
    setOutput('Executing code in secure sandbox...');

    try {
      const res = await api.code.run({
        language,
        code,
        customInput,
      });

      const finalOutput =
        res.output ??
        res.stdout ??
        (res.stderr ? `Error:\n${res.stderr}` : 'Program completed with no output.');

      setOutput(finalOutput || 'Program completed with no output.');
      setStatus(res.status || (res.isError ? 'Error' : 'Success'));
      setExecutionTime(res.executionTime ?? res.runtime ?? 28);
    } catch (err: any) {
      setOutput(`Execution Error:\n${err.message}`);
      setStatus('Server Error');
    } finally {
      setIsRunning(false);
    }
  };

  // Keyboard shortcut: Ctrl+Enter / Cmd+Enter to run code
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, language, customInput, isRunning]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      
      {/* Top Header & Toolbar */}
      <div className="bg-white rounded-2xl border border-[#E1E8F2] p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        
        {/* Five-Language Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'python', label: 'Python 3', ext: '.py' },
            { id: 'cpp', label: 'C++', ext: '.cpp' },
            { id: 'c', label: 'C', ext: '.c' },
            { id: 'java', label: 'Java', ext: '.java' },
            { id: 'javascript', label: 'JavaScript', ext: '.js' },
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleLanguageChange(lang.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                language === lang.id
                  ? 'bg-[#165DCE] text-white shadow-xs'
                  : 'bg-[#F8F9FE] text-slate-600 hover:bg-slate-100 hover:text-[#102344]'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCode(starterCodes[language] || '')}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Reset code template"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-5 py-2.5 bg-[#165DCE] hover:bg-[#124cb0] text-white rounded-xl text-xs font-extrabold shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70 focus:outline-none focus:ring-4 focus:ring-blue-100"
            title="Run code (Ctrl + Enter)"
          >
            {isRunning ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-white" />
            )}
            <span>Run Code</span>
            <span className="hidden lg:inline text-[10px] font-medium text-blue-200 bg-white/20 px-1.5 py-0.5 rounded">
              Ctrl+Enter
            </span>
          </button>
        </div>

      </div>

      {/* Editor & Terminal Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-13.5rem)] min-h-[520px]">
        
        {/* Left: Code Editor (7 Columns) */}
        <div className="lg:col-span-7 bg-[#0B172E] rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-lg">
          
          {/* Editor Header Bar */}
          <div className="bg-[#071022] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono font-bold text-slate-300 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#165DCE]" />
              main.{language === 'cpp' ? 'cpp' : language === 'c' ? 'c' : language === 'java' ? 'java' : language === 'python' ? 'py' : 'js'}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {lineCount} lines • UTF-8
            </span>
          </div>

          {/* Editor Area with Syntax Highlighting and Gutter */}
          <div className="flex-1 flex overflow-hidden">
            <SmartCodeEditor
              value={code}
              onChange={setCode}
              language={language}
              showLineNumbers={true}
              placeholder="Write your solution here..."
              className="flex-1 w-full"
            />
          </div>
        </div>

        {/* Right: Input & Output Console (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Custom Input Box */}
          <div className="bg-white rounded-2xl border border-[#E1E8F2] p-4 flex flex-col h-40 shadow-xs">
            <span className="text-xs font-extrabold text-[#102344] mb-1.5 flex items-center justify-between">
              <span>Standard Input (stdin)</span>
              <span className="text-[10px] text-slate-400 font-normal">Passed to standard input stream</span>
            </span>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter test inputs here (e.g. 5\n1 2 3 4 5)..."
              className="flex-1 w-full p-2.5 bg-[#F8F9FE] rounded-xl border border-slate-200 font-mono text-xs text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#165DCE]/20 focus:border-[#165DCE]"
            />
          </div>

          {/* Terminal Output Console */}
          <div className="flex-1 bg-[#0B172E] rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-lg">
            
            {/* Console Header */}
            <div className="bg-[#071022] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-slate-200">Terminal Output</span>
              </div>

              <div className="flex items-center gap-3">
                {executionTime !== null && (
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {executionTime}ms
                  </span>
                )}

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    status === 'Success'
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                      : status.includes('Error')
                      ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                      : status === 'Running...'
                      ? 'bg-blue-950/80 text-blue-400 border border-blue-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {status}
                </span>

                <button
                  onClick={() => setOutput('')}
                  className="text-slate-500 hover:text-slate-300 p-1 rounded transition-colors cursor-pointer"
                  title="Clear Output"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Output Display Area */}
            <div className="flex-1 p-4 font-mono text-xs text-slate-200 overflow-y-auto whitespace-pre-wrap leading-relaxed select-text">
              {output ? (
                <div className={status.includes('Error') ? 'text-rose-300 font-mono' : 'text-slate-200'}>
                  {output}
                </div>
              ) : (
                <span className="text-slate-500 italic">
                  Run your code or press Ctrl+Enter to view standard output or execution errors...
                </span>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
