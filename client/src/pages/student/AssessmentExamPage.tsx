import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Assessment, Question } from '../../types';
import { SmartCodeEditor } from '../../components/common/SmartCodeEditor';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Bookmark, 
  ArrowLeft, 
  ArrowRight, 
  Send, 
  HelpCircle,
  FileCheck,
  Code2,
  Hash,
  BookOpen,
  Play,
  RotateCcw,
  CheckCircle2,
  Terminal,
  Sparkles
} from 'lucide-react';

export const AssessmentExamPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Separate answer states per question type
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string }>({});
  const [numericAnswers, setNumericAnswers] = useState<{ [questionId: string]: string }>({});
  const [codingAnswers, setCodingAnswers] = useState<{ [questionId: string]: { code: string; language: string } }>({});

  const [reviewFlags, setReviewFlags] = useState<{ [questionId: string]: boolean }>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [totalDurationSeconds, setTotalDurationSeconds] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);

  // LeetCode-Style Testcase & Console States
  const [runningSample, setRunningSample] = useState<boolean>(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState<'testcase' | 'testresult'>('testcase');
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number>(0);
  const [customInputVal, setCustomInputVal] = useState<string>('');
  const [selectedResultCaseIndex, setSelectedResultCaseIndex] = useState<number>(0);
  const [testCaseResults, setTestCaseResults] = useState<{
    overallStatus: string;
    passedTestCases: number;
    totalTestCases: number;
    results: any[];
    averageRuntimeMs?: number;
  } | null>(null);
  const [customRunResult, setCustomRunResult] = useState<{
    output?: string;
    stdout?: string;
    stderr?: string;
    status?: string;
    executionTime?: number;
    isError?: boolean;
    error?: string;
  } | null>(null);

  // Initialize test session
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    api.assessments.start(id)
      .then((res) => {
        if (res.assessment) {
          setAssessment(res.assessment);
          const qList: Question[] = res.assessment.questions || [];
          setQuestions(qList);
          setAttemptId(res.attemptId);

          // In student assessment mode, all answers and code start completely empty
          const initialCodingAnswers: { [questionId: string]: { code: string; language: string } } = {};
          qList.forEach((q) => {
            if (q.type === 'coding') {
              const defaultLang = q.defaultLanguage || (q.allowedLanguages && q.allowedLanguages[0]) || 'python';
              initialCodingAnswers[q._id] = {
                code: '',
                language: defaultLang,
              };
            }
          });
          setCodingAnswers(initialCodingAnswers);

          const durationSec = (res.assessment.durationMinutes || 20) * 60;
          setSecondsRemaining(durationSec);
          setTotalDurationSeconds(durationSec);
        }
      })
      .catch((err) => {
        alert(err.message || 'Could not start assessment');
        navigate('/student/assessments');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // Countdown timer
  useEffect(() => {
    if (secondsRemaining <= 0 || loading || submitting) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining, loading, submitting]);

  // Synchronize console testcases when question changes
  useEffect(() => {
    setTestCaseResults(null);
    setCustomRunResult(null);
    setSelectedCaseIndex(0);
    setSelectedResultCaseIndex(0);
    setActiveConsoleTab('testcase');
    const activeQ = questions[currentIndex];
    if (activeQ?.testCases?.[0]?.input) {
      setCustomInputVal(activeQ.testCases[0].input);
    } else {
      setCustomInputVal('');
    }
  }, [currentIndex, questions]);

  const handleAutoSubmit = () => {
    alert('Time limit reached! Your assessment is submitting automatically.');
    performSubmission();
  };

  // Answer handler for MCQ & Case Based
  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  // Answer handler for Numeric Range
  const handleNumericAnswerChange = (questionId: string, value: string) => {
    setNumericAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Answer handler for Coding Questions
  const handleCodeChange = (questionId: string, code: string) => {
    setCodingAnswers((prev) => ({
      ...prev,
      [questionId]: {
        code,
        language: prev[questionId]?.language || 'python',
      },
    }));
  };

  const handleLanguageChange = (questionId: string, language: string) => {
    setCodingAnswers((prev) => ({
      ...prev,
      [questionId]: {
        code: prev[questionId]?.code || '',
        language,
      },
    }));
  };

  // Run all test cases against code (LeetCode style)
  const handleRunAllTestCases = async (q: Question) => {
    const currentCode = codingAnswers[q._id]?.code || '';
    const currentLang = codingAnswers[q._id]?.language || q.defaultLanguage || 'python';
    const testCasesToRun = q.testCases && q.testCases.length > 0 ? q.testCases : [];

    setRunningSample(true);
    setTestCaseResults(null);
    setCustomRunResult(null);
    setActiveConsoleTab('testresult');

    try {
      if (testCasesToRun.length > 0) {
        const res = await api.code.run({
          language: currentLang,
          code: currentCode,
          testCases: testCasesToRun,
        });
        setTestCaseResults(res);
        setSelectedResultCaseIndex(0);
      } else {
        const res = await api.code.run({
          language: currentLang,
          code: currentCode,
          customInput: customInputVal || '',
        });
        setCustomRunResult(res);
      }
    } catch (err: any) {
      setCustomRunResult({ error: err.message || 'Execution error', isError: true });
    } finally {
      setRunningSample(false);
    }
  };

  // Run custom input (LeetCode style)
  const handleRunCustomInput = async (q: Question) => {
    const currentCode = codingAnswers[q._id]?.code || '';
    const currentLang = codingAnswers[q._id]?.language || q.defaultLanguage || 'python';

    setRunningSample(true);
    setTestCaseResults(null);
    setCustomRunResult(null);
    setActiveConsoleTab('testresult');

    try {
      const res = await api.code.run({
        language: currentLang,
        code: currentCode,
        customInput: customInputVal,
      });
      setCustomRunResult(res);
    } catch (err: any) {
      setCustomRunResult({ error: err.message || 'Execution error', isError: true });
    } finally {
      setRunningSample(false);
    }
  };

  const toggleReviewFlag = (questionId: string) => {
    setReviewFlags((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const isQuestionAnswered = (q: Question) => {
    const qType = q.type || 'mcq';
    if (qType === 'range') {
      return numericAnswers[q._id] !== undefined && numericAnswers[q._id].trim() !== '';
    }
    if (qType === 'coding') {
      return Boolean(codingAnswers[q._id]?.code?.trim());
    }
    return Boolean(selectedAnswers[q._id]);
  };

  const performSubmission = async () => {
    if (!id || submitting) return;
    setSubmitting(true);

    const answersPayload = questions.map((q) => {
      const qType = q.type || 'mcq';
      if (qType === 'range') {
        const val = numericAnswers[q._id];
        return {
          questionId: q._id,
          numericAnswer: val !== undefined && val !== '' ? Number(val) : undefined,
        };
      }
      if (qType === 'coding') {
        return {
          questionId: q._id,
          code: codingAnswers[q._id]?.code || '',
          language: codingAnswers[q._id]?.language || q.defaultLanguage || 'python',
        };
      }
      return {
        questionId: q._id,
        selectedOptionId: selectedAnswers[q._id] || undefined,
      };
    });

    const timeSpent = totalDurationSeconds - secondsRemaining;

    try {
      const res = await api.assessments.submit(id, {
        attemptId: attemptId || undefined,
        answers: answersPayload,
        timeSpentSeconds: timeSpent,
      });

      navigate(`/student/assessments/attempts/${res.attemptId}/result`);
    } catch (err: any) {
      alert(err.message || 'Failed to submit assessment.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Preparing assessment questions...</p>
        </div>
      </div>
    );
  }

  if (!assessment || questions.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">No questions available in this assessment.</h2>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isTimeCritical = secondsRemaining < 180; // under 3 mins

  const answeredCount = questions.filter(isQuestionAnswered).length;
  const unansweredCount = questions.length - answeredCount;

  // Language options for coding questions
  const allowedLanguagesList = currentQuestion?.allowedLanguages && currentQuestion.allowedLanguages.length > 0
    ? currentQuestion.allowedLanguages
    : ['python', 'java', 'cpp', 'javascript'];

  const currentLang = codingAnswers[currentQuestion?._id]?.language || currentQuestion?.defaultLanguage || allowedLanguagesList[0];
  const currentCode = codingAnswers[currentQuestion?._id]?.code || '';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-slate-50 text-slate-900 -m-4 sm:-m-6 lg:-m-8 select-none">
      
      {/* Top Test Navigation Bar */}
      <div className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs z-20">
        <div>
          <h2 className="text-base font-extrabold text-[#102344] truncate max-w-sm sm:max-w-md">
            {assessment.title}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Question {currentIndex + 1} of {questions.length} • {currentQuestion?.topic || 'General'}
          </span>
        </div>

        {/* Timer & Submit Header */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold font-mono transition-colors ${
              isTimeCritical
                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-rose-600' : 'text-blue-600'}`} />
            <span>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={() => setConfirmModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Test</span>
          </button>
        </div>
      </div>

      {/* Main Test Workspace: Question Pane + Question Navigator */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Question Center Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Question Top Metadata & Type Badge */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">
                  Question {currentIndex + 1}
                </span>

                {/* Form-specific format badge */}
                {currentQuestion.type === 'mcq' && (
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Multiple Choice</span>
                  </span>
                )}
                {currentQuestion.type === 'range' && (
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200 flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    <span>Numerical Answer</span>
                  </span>
                )}
                {currentQuestion.type === 'coding' && (
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[11px] font-bold border border-purple-200 flex items-center gap-1">
                    <Code2 className="w-3 h-3" />
                    <span>
                      Code Test (
                      {allowedLanguagesList.length === 1 
                        ? `${allowedLanguagesList[0].toUpperCase()} ONLY`
                        : `${allowedLanguagesList.join(', ').toUpperCase()}`}
                      )
                    </span>
                  </span>
                )}
                {currentQuestion.type === 'case_based' && (
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-200 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    <span>Case Study Scenario</span>
                  </span>
                )}

                <span className="text-xs text-slate-400 font-semibold">{currentQuestion.points || 1} Points</span>
              </div>

              <button
                onClick={() => toggleReviewFlag(currentQuestion._id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  reviewFlags[currentQuestion._id]
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{reviewFlags[currentQuestion._id] ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            {/* CASE STUDY SCENARIO CARD (Coursera Style) */}
            {currentQuestion.type === 'case_based' && currentQuestion.caseStudyText && (
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-xs tracking-wide uppercase">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>{currentQuestion.scenarioTitle || 'Scenario Context'}</span>
                </div>
                <div className="text-xs text-indigo-950 leading-relaxed whitespace-pre-line font-normal">
                  {currentQuestion.caseStudyText}
                </div>
              </div>
            )}

            {/* Question Statement Prompt */}
            <div className="text-base sm:text-lg font-bold text-[#102344] leading-relaxed">
              {currentQuestion.text}
            </div>

            {/* ============================================================== */}
            {/* TYPE 1: MCQ & CASE-BASED RADIO OPTIONS                        */}
            {/* ============================================================== */}
            {(currentQuestion.type === 'mcq' || currentQuestion.type === 'case_based' || !currentQuestion.type) && (
              <div className="space-y-3 pt-2">
                {currentQuestion.options?.map((opt) => {
                  const isSelected = selectedAnswers[currentQuestion._id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(currentQuestion._id, opt.id)}
                      className={`w-full p-4 rounded-2xl text-left text-sm font-semibold transition-all flex items-center gap-4 border cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500/30'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {opt.id.toUpperCase()}
                      </div>
                      <span className="leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ============================================================== */}
            {/* TYPE 2: NUMERICAL RANGE QUESTION (COURSERA STYLE)              */}
            {/* ============================================================== */}
            {currentQuestion.type === 'range' && (
              <div className="p-6 bg-amber-50/50 border border-amber-200 rounded-2xl space-y-4">
                <div className="space-y-1">
                  <label className="font-extrabold text-amber-950 text-xs block flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-amber-700" />
                    <span>Your Numerical Answer</span>
                  </label>
                  <p className="text-[11px] text-amber-800">
                    Enter the calculated numerical value (integer or decimal). No units are needed.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="any"
                    value={numericAnswers[currentQuestion._id] ?? ''}
                    onChange={(e) => handleNumericAnswerChange(currentQuestion._id, e.target.value)}
                    placeholder="e.g. 42.5"
                    className="w-full sm:w-72 h-12 px-4 bg-white border-2 border-amber-300 focus:border-amber-500 rounded-xl text-base font-mono font-bold text-slate-900 focus:outline-none"
                  />
                  {numericAnswers[currentQuestion._id] && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Answer Entered</span>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TYPE 3: CODING QUESTION (RESTRICTED LANGUAGE COMPILER)         */}
            {/* ============================================================== */}
            {currentQuestion.type === 'coding' && (
              <div className="space-y-4 pt-2">
                {/* Language restriction notice & switcher */}
                <div className="p-3.5 bg-purple-50/80 border border-purple-200 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-700" />
                    <span className="text-xs font-bold text-purple-950">
                      Programming Language:
                    </span>
                    {allowedLanguagesList.length === 1 ? (
                      <span className="px-2.5 py-1 rounded-lg bg-purple-200 text-purple-900 font-mono font-extrabold text-xs">
                        {allowedLanguagesList[0].toUpperCase()} (Restricted by Assessment)
                      </span>
                    ) : (
                      <select
                        value={currentLang}
                        onChange={(e) => handleLanguageChange(currentQuestion._id, e.target.value)}
                        className="px-3 py-1 bg-white border border-purple-300 rounded-lg text-xs font-bold text-purple-950"
                      >
                        {allowedLanguagesList.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Top Run Button */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={runningSample}
                      onClick={() => handleRunAllTestCases(currentQuestion)}
                      className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{runningSample ? 'Running Tests...' : 'Run Test Cases'}</span>
                    </button>
                  </div>
                </div>

                {/* Embedded SmartCodeEditor in Dark Theme */}
                <div className="rounded-2xl border border-slate-800 bg-[#0a1020] overflow-hidden shadow-lg">
                  <div className="bg-[#070d1c] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                    <span className="font-mono text-xs font-bold text-slate-200">Solution Editor ({currentLang.toUpperCase()})</span>
                    <span className="text-[11px] text-slate-400">Auto-pairing & indentation enabled</span>
                  </div>
                  <div className="h-80 bg-[#0a1020]">
                    <SmartCodeEditor
                      value={currentCode}
                      onChange={(code) => handleCodeChange(currentQuestion._id, code)}
                      language={currentLang}
                      showLineNumbers={true}
                      placeholder="Write your complete solution here..."
                      className="bg-[#0a1020]"
                    />
                  </div>
                </div>

                {/* LeetCode-Style Testcase & Test Result Console */}
                <div className="rounded-2xl border border-slate-800 bg-[#0a1020] overflow-hidden shadow-lg font-sans">
                  {/* Console Header Bar */}
                  <div className="bg-[#070d1c] px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    {/* Console Mode Tabs */}
                    <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80">
                      <button
                        type="button"
                        onClick={() => setActiveConsoleTab('testcase')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          activeConsoleTab === 'testcase'
                            ? 'bg-slate-800 text-white shadow-xs'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>Testcase</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveConsoleTab('testresult')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          activeConsoleTab === 'testresult'
                            ? 'bg-slate-800 text-white shadow-xs'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Test Result</span>
                        {testCaseResults && (
                          <span
                            className={`w-2 h-2 rounded-full ${
                              testCaseResults.overallStatus === 'Accepted' ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}
                          />
                        )}
                      </button>
                    </div>

                    {/* Quick Run Actions */}
                    <div className="flex items-center gap-2">
                      {selectedCaseIndex === -1 && (
                        <button
                          type="button"
                          disabled={runningSample}
                          onClick={() => handleRunCustomInput(currentQuestion)}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all text-xs"
                        >
                          <Terminal className="w-3.5 h-3.5" />
                          <span>{runningSample ? 'Executing...' : 'Run Custom Input'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={runningSample}
                        onClick={() => handleRunAllTestCases(currentQuestion)}
                        className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all text-xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{runningSample ? 'Running...' : 'Run Test Cases'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Mode 1: Testcase View (Inputs) */}
                  {activeConsoleTab === 'testcase' && (
                    <div className="p-4 space-y-4">
                      {/* Sub-tabs: Case 1, Case 2, ... + Custom Input */}
                      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto">
                        {(currentQuestion.testCases && currentQuestion.testCases.length > 0 ? currentQuestion.testCases : []).map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedCaseIndex(idx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                              selectedCaseIndex === idx
                                ? 'bg-slate-800 text-purple-300 border border-purple-500/30 shadow-xs'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                            }`}
                          >
                            Case {idx + 1}
                          </button>
                        ))}

                        <button
                          type="button"
                          onClick={() => setSelectedCaseIndex(-1)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            selectedCaseIndex === -1
                              ? 'bg-slate-800 text-blue-300 border border-blue-500/30 shadow-xs'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                          }`}
                        >
                          <span>+ Custom Input</span>
                        </button>
                      </div>

                      {/* Display Selected Case Inputs */}
                      {selectedCaseIndex >= 0 && currentQuestion.testCases?.[selectedCaseIndex] && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
                          <div className="p-3.5 bg-[#070d1c] rounded-xl border border-slate-800/80">
                            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-1.5">
                              Sample Input (stdin):
                            </span>
                            <pre className="text-slate-200 whitespace-pre-wrap">
                              {currentQuestion.testCases[selectedCaseIndex].input || '(No Input)'}
                            </pre>
                          </div>
                          <div className="p-3.5 bg-[#070d1c] rounded-xl border border-slate-800/80">
                            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-1.5">
                              Expected Output:
                            </span>
                            <pre className="text-emerald-400 font-bold whitespace-pre-wrap">
                              {currentQuestion.testCases[selectedCaseIndex].expectedOutput}
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* Custom Input Editor */}
                      {selectedCaseIndex === -1 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-bold uppercase tracking-wider text-[10px]">
                              Custom Standard Input (stdin):
                            </span>
                            <span className="text-[11px] text-slate-500">Provide input values for standard input read</span>
                          </div>
                          <textarea
                            value={customInputVal}
                            onChange={(e) => setCustomInputVal(e.target.value)}
                            placeholder="Type custom test input here (e.g. 5, or multiple lines)..."
                            className="w-full h-24 p-3.5 bg-[#070d1c] border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:ring-2 focus:ring-primary-container focus:outline-none resize-none"
                          />
                          <p className="text-[11px] text-slate-500">
                            Type any custom input and click <span className="text-blue-400 font-bold">Run Custom Input</span> above to see your solution's output.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mode 2: Test Result View (LeetCode Style Multiple Outputs) */}
                  {activeConsoleTab === 'testresult' && (
                    <div className="p-4 space-y-4">
                      {/* Loading state */}
                      {runningSample && (
                        <div className="py-10 text-center text-slate-300 text-xs flex items-center justify-center gap-2.5">
                          <span className="animate-spin text-purple-400 text-base font-bold">⟳</span>
                          <span className="font-medium">Evaluating solution against test cases in sandbox runtime...</span>
                        </div>
                      )}

                      {/* Not run yet */}
                      {!testCaseResults && !customRunResult && !runningSample && (
                        <div className="py-8 text-center text-slate-500 text-xs">
                          <span>Click "Run Test Cases" or "Run Custom Input" above to evaluate your code.</span>
                        </div>
                      )}

                      {/* Batch Test Case Results (LeetCode Multi-case style) */}
                      {testCaseResults && !runningSample && (
                        <div className="space-y-4">
                          {/* Overall Verdict Banner */}
                          <div className="flex items-center justify-between p-3.5 rounded-xl border bg-[#070d1c] border-slate-800">
                            <div className="flex items-center gap-3">
                              <span
                                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                                  testCaseResults.overallStatus === 'Accepted'
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                                }`}
                              >
                                {testCaseResults.overallStatus === 'Accepted' ? '✓ Accepted' : '✗ ' + testCaseResults.overallStatus}
                              </span>
                              <span className="text-xs text-slate-300 font-bold">
                                {testCaseResults.passedTestCases} / {testCaseResults.totalTestCases} Test Cases Passed
                              </span>
                            </div>
                            {testCaseResults.averageRuntimeMs !== undefined && (
                              <span className="text-[11px] text-slate-400 font-mono">
                                Runtime: ~{testCaseResults.averageRuntimeMs}ms
                              </span>
                            )}
                          </div>

                          {/* Case Selectors: Case 1, Case 2 */}
                          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto">
                            {testCaseResults.results?.map((res: any, idx: number) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setSelectedResultCaseIndex(idx)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 ${
                                  selectedResultCaseIndex === idx
                                    ? 'bg-slate-800 text-white border border-slate-700 shadow-xs'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                                }`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    res.passed ? 'bg-emerald-400' : 'bg-rose-400'
                                  }`}
                                />
                                <span>Case {res.testCaseIndex}</span>
                              </button>
                            ))}
                          </div>

                          {/* Active Case Result Breakdown */}
                          {testCaseResults.results?.[selectedResultCaseIndex] && (
                            <div className="space-y-3 font-mono text-[11px]">
                              <div className="p-3 bg-[#070d1c] rounded-xl border border-slate-800/80">
                                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-1">
                                  Input (stdin):
                                </span>
                                <pre className="text-slate-200 whitespace-pre-wrap">
                                  {testCaseResults.results[selectedResultCaseIndex].input || '(No Input)'}
                                </pre>
                              </div>

                              <div className="p-3 bg-[#070d1c] rounded-xl border border-slate-800/80">
                                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-1">
                                  Your Output (stdout):
                                </span>
                                <pre
                                  className={
                                    testCaseResults.results[selectedResultCaseIndex].passed
                                      ? 'text-emerald-400 font-bold whitespace-pre-wrap'
                                      : 'text-rose-400 font-bold whitespace-pre-wrap'
                                  }
                                >
                                  {testCaseResults.results[selectedResultCaseIndex].actualOutput || '(No Output)'}
                                </pre>
                              </div>

                              <div className="p-3 bg-[#070d1c] rounded-xl border border-slate-800/80">
                                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-1">
                                  Expected Output:
                                </span>
                                <pre className="text-slate-300 whitespace-pre-wrap">
                                  {testCaseResults.results[selectedResultCaseIndex].expectedOutput}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Custom Input Execution Results */}
                      {customRunResult && !testCaseResults && !runningSample && (
                        <div className="space-y-3 font-mono text-[11px]">
                          <div className="flex items-center justify-between p-3.5 rounded-xl border bg-[#070d1c] border-slate-800">
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                                !customRunResult.isError
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : 'bg-rose-950 text-rose-400 border border-rose-800'
                              }`}
                            >
                              {!customRunResult.isError ? '✓ Execution Succeeded' : '✗ ' + (customRunResult.status || 'Execution Failed')}
                            </span>
                            {customRunResult.executionTime !== undefined && (
                              <span className="text-[11px] text-slate-400 font-mono">
                                Runtime: {customRunResult.executionTime}ms
                              </span>
                            )}
                          </div>

                          {customInputVal && (
                            <div className="p-3 bg-[#070d1c] rounded-xl border border-slate-800/80">
                              <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-1">
                                Custom Input (stdin):
                              </span>
                              <pre className="text-slate-200 whitespace-pre-wrap">{customInputVal}</pre>
                            </div>
                          )}

                          <div className="p-3 bg-[#070d1c] rounded-xl border border-slate-800/80">
                            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider mb-1">
                              Output (stdout):
                            </span>
                            <pre
                              className={
                                !customRunResult.isError
                                  ? 'text-emerald-400 whitespace-pre-wrap'
                                  : 'text-rose-400 whitespace-pre-wrap'
                              }
                            >
                              {customRunResult.output || customRunResult.stdout || '(No Output)'}
                            </pre>
                          </div>

                          {customRunResult.stderr && (
                            <div className="p-3 bg-rose-950/40 border border-rose-900 rounded-xl text-rose-300">
                              <span className="block text-[10px] font-bold uppercase tracking-wider mb-1">
                                Standard Error / Traceback:
                              </span>
                              <pre className="whitespace-pre-wrap">{customRunResult.stderr}</pre>
                            </div>
                          )}

                          {customRunResult.error && (
                            <p className="text-rose-400 text-xs">{customRunResult.error}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Question Controls */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                disabled={currentIndex === 0}
                onClick={() => {
                  setCurrentIndex((prev) => prev - 1);

                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => {
                    setCurrentIndex((prev) => prev + 1);
  
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setConfirmModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span>Finish & Submit</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Right Question Palette (Palette grid 1..N) */}
        <div className="w-72 bg-white border-l border-slate-200 p-5 hidden md:flex flex-col justify-between shrink-0 shadow-lg">
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Question Navigator
            </h3>

            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-500" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-slate-200" />
                <span>Unanswered ({unansweredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-400" />
                <span>Review ({Object.values(reviewFlags).filter(Boolean).length})</span>
              </div>
            </div>

            {/* Grid of question buttons */}
            <div className="grid grid-cols-5 gap-2 pt-2">
              {questions.map((q, idx) => {
                const isAnswered = isQuestionAnswered(q);
                const isCurrent = currentIndex === idx;
                const isMarked = !!reviewFlags[q._id];

                let btnBg = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                if (isCurrent) btnBg = 'bg-blue-600 text-white font-extrabold ring-2 ring-blue-300';
                else if (isMarked) btnBg = 'bg-amber-100 text-amber-800 border border-amber-300 font-bold';
                else if (isAnswered) btnBg = 'bg-emerald-500 text-white font-bold';

                return (
                  <button
                    key={q._id}
                    onClick={() => {
                      setCurrentIndex(idx);
    
                    }}
                    className={`h-9 rounded-xl text-xs flex items-center justify-center transition-all cursor-pointer ${btnBg}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setConfirmModalOpen(true)}
              className="w-full py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 shadow-sm cursor-pointer"
            >
              Submit All Answers
            </button>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#102344]">Submit Assessment?</h3>
              <p className="text-xs text-slate-500">
                You are about to complete and submit your assessment. Once submitted, your score will be authoritative and cannot be revised.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-4 text-center">
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Answered</span>
                <span className="text-xl font-extrabold text-emerald-600">{answeredCount}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Unanswered</span>
                <span className="text-xl font-extrabold text-rose-500">{unansweredCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Return to Test
              </button>
              <button
                onClick={() => {
                  setConfirmModalOpen(false);
                  performSubmission();
                }}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md cursor-pointer"
              >
                {submitting ? 'Submitting...' : 'Yes, Submit Test'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
