import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { CodingProblem, CodeSubmission } from '../../types';
import { 
  Play, 
  Send, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowLeft, 
  Check, 
  Terminal, 
  Code2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SmartCodeEditor } from '../../components/common/SmartCodeEditor';

export const ProblemWorkspacePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [problem, setProblem] = useState<CodingProblem | null>(null);
  const [previousSubmissions, setPreviousSubmissions] = useState<CodeSubmission[]>([]);
  const [language, setLanguage] = useState<string>('python');
  const [code, setCode] = useState<string>('');
  const [activeLeftTab, setActiveLeftTab] = useState<'description' | 'submissions'>('description');
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    api.code.getProblemDetails(slug)
      .then((res) => {
        if (res.problem) {
          setProblem(res.problem);
          setPreviousSubmissions(res.previousSubmissions || []);
          const defaultLang = 'python';
          setLanguage(defaultLang);
          setCode(res.problem.starterCode?.[defaultLang] || '');
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (problem?.starterCode?.[newLang as keyof typeof problem.starterCode]) {
      setCode(problem.starterCode[newLang as keyof typeof problem.starterCode] || '');
    }
  };

  const handleRunCode = async () => {
    if (!slug || evaluating) return;
    setEvaluating(true);
    setEvalResult({ status: 'Running test cases...' });

    try {
      const res = await api.code.run({
        language,
        code,
        customInput: problem?.sampleTestCases?.[0]?.input || '',
      });

      const actual = (res.output || '').trim();
      const expected = (problem?.sampleTestCases?.[0]?.expectedOutput || '').trim();
      const passed = !res.isError && actual === expected;

      setEvalResult({
        overallStatus: passed ? 'Passed Sample Test Case' : 'Sample Test Case Failed',
        results: [
          {
            testCaseIndex: 1,
            input: problem?.sampleTestCases?.[0]?.input,
            expectedOutput: expected,
            actualOutput: actual,
            passed,
            executionTime: res.executionTime,
          },
        ],
      });
    } catch (err: any) {
      setEvalResult({ overallStatus: 'Error', error: err.message });
    } finally {
      setEvaluating(false);
    }
  };

  const handleSubmitSolution = async () => {
    if (!slug || evaluating) return;
    setEvaluating(true);
    setEvalResult({ status: 'Evaluating all test cases on backend...' });

    try {
      const res = await api.code.submitProblem(slug, { language, code });
      setEvalResult(res.evalResult);
      if (res.evalResult?.overallStatus === 'Accepted') {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      }

      if (res.submission) {
        setPreviousSubmissions((prev) => [res.submission, ...prev]);
      }
    } catch (err: any) {
      setEvalResult({ overallStatus: 'Submission Error', error: err.message });
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">Problem not found.</h2>
        <Link to="/student/problems" className="mt-4 inline-block text-primary-container font-bold">
          ← Back to Problems
        </Link>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background -m-4 sm:-m-6 lg:-m-8">
      
      {/* Top Header Bar */}
      <div className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to="/student/problems"
            className="p-1.5 rounded-lg text-slate-500 hover:text-[#102344] hover:bg-slate-100"
            title="Back to Problems"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-4 w-px bg-slate-200" />
          <h2 className="text-sm font-bold text-[#102344]">{problem.title}</h2>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              problem.difficulty === 'Easy'
                ? 'bg-emerald-50 text-emerald-700'
                : problem.difficulty === 'Medium'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {problem.difficulty}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunCode}
            disabled={evaluating}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <Play className="w-3.5 h-3.5 fill-slate-700" />
            <span>Run Sample</span>
          </button>

          <button
            onClick={handleSubmitSolution}
            disabled={evaluating}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            {evaluating ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Submit Solution</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid (50 / 50 Desktop) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Pane: Description & Submissions */}
        <div className="lg:col-span-5 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden">
          
          {/* Tabs */}
          <div className="flex items-center border-b border-slate-200 px-4 pt-2">
            <button
              onClick={() => setActiveLeftTab('description')}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                activeLeftTab === 'description'
                  ? 'border-primary-container text-primary-container'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveLeftTab('submissions')}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                activeLeftTab === 'submissions'
                  ? 'border-primary-container text-primary-container'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Submissions ({previousSubmissions.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700 leading-relaxed">
            {activeLeftTab === 'description' ? (
              <>
                <div className="space-y-3">
                  <h1 className="text-xl font-extrabold text-[#102344]">{problem.title}</h1>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                    {problem.description}
                  </p>
                </div>

                {/* Examples */}
                {problem.examples?.map((ex, idx) => (
                  <div key={idx} className="p-4 bg-surface rounded-2xl border border-slate-200 space-y-2">
                    <span className="font-bold text-[#102344] block">Example {idx + 1}:</span>
                    <div className="font-mono text-[11px] bg-white p-2.5 rounded-xl border border-slate-200 space-y-1">
                      <p><span className="text-slate-400 font-semibold">Input: </span>{ex.input}</p>
                      <p><span className="text-slate-400 font-semibold">Output: </span>{ex.output}</p>
                      {ex.explanation && (
                        <p className="text-slate-500"><span className="text-slate-400 font-semibold">Explanation: </span>{ex.explanation}</p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Constraints */}
                {problem.constraints && problem.constraints.length > 0 && (
                  <div className="space-y-2">
                    <span className="font-bold text-[#102344] block">Constraints:</span>
                    <ul className="list-disc list-inside font-mono text-[11px] text-slate-600 space-y-1">
                      {problem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-3">
                <span className="font-bold text-[#102344] block">Past Submissions</span>
                {previousSubmissions.length === 0 ? (
                  <p className="text-slate-400 italic">No submissions yet for this problem.</p>
                ) : (
                  previousSubmissions.map((sub) => (
                    <div
                      key={sub._id}
                      className="p-3 bg-surface rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span
                          className={`font-bold block ${
                            sub.status === 'Accepted' ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {sub.status}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(sub.submittedAt).toLocaleTimeString()} • {sub.language.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {sub.runtimeMs}ms
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Code Editor + Test Results */}
        <div className="lg:col-span-7 flex flex-col h-full bg-[#0b1c30] overflow-hidden">
          
          {/* Language Selector Toolbar */}
          <div className="bg-[#071322] px-4 py-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {['python', 'cpp', 'c', 'java', 'javascript'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    language === lang
                      ? 'bg-primary-container text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                if (problem.starterCode?.[language as keyof typeof problem.starterCode]) {
                  setCode(problem.starterCode[language as keyof typeof problem.starterCode] || '');
                }
              }}
              className="text-slate-400 hover:text-slate-200 p-1"
              title="Reset starter template"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Editor Area with Syntax Highlighting & Line Numbers */}
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

          {/* Test Case Evaluation Bottom Drawer */}
          {evalResult && (
            <div className="h-44 bg-[#071322] border-t border-slate-800 p-4 overflow-y-auto space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                    evalResult.overallStatus === 'Accepted' || evalResult.overallStatus?.includes('Passed')
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {evalResult.overallStatus || 'Result'}
                </span>

                <button
                  onClick={() => setEvalResult(null)}
                  className="text-slate-400 hover:text-slate-200 text-xs"
                >
                  Close
                </button>
              </div>

              {evalResult.results?.map((r: any, i: number) => (
                <div
                  key={i}
                  className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1 text-[11px]"
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-300">Test Case {r.testCaseIndex}</span>
                    <span className={r.passed ? 'text-emerald-400' : 'text-rose-400'}>
                      {r.passed ? '✓ Passed' : '✗ Failed'}
                    </span>
                  </div>
                  <p className="text-slate-400">Input: <span className="text-slate-200">{r.input}</span></p>
                  <p className="text-slate-400">Expected: <span className="text-slate-200">{r.expectedOutput}</span></p>
                  <p className="text-slate-400">Actual: <span className="text-slate-200">{r.actualOutput}</span></p>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
