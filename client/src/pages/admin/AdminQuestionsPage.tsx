import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Question } from '../../types';
import { 
  PlusCircle, 
  Trash2, 
  Edit, 
  HelpCircle, 
  Search, 
  CheckCircle2, 
  Code2, 
  Hash, 
  BookOpen, 
  FileText, 
  Check, 
  Plus, 
  X, 
  Sliders, 
  Sparkles,
  Terminal,
  ShieldAlert
} from 'lucide-react';

type QuestionType = 'mcq' | 'coding' | 'range' | 'case_based';

interface OptionItem {
  id: string;
  text: string;
}

interface TestCaseItem {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

const SUPPORTED_LANGUAGES = [
  { id: 'python', label: 'Python 3', ext: 'py' },
  { id: 'java', label: 'Java', ext: 'java' },
  { id: 'cpp', label: 'C++', ext: 'cpp' },
  { id: 'javascript', label: 'JavaScript (Node.js)', ext: 'js' },
];

export const AdminQuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [topic, setTopic] = useState('All');
  const [typeFilter, setTypeFilter] = useState<'All' | QuestionType>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);

  // Form Fields
  const [qType, setQType] = useState<QuestionType>('mcq');
  const [text, setText] = useState('');
  const [formTopic, setFormTopic] = useState('Data Structures');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [points, setPoints] = useState<number>(2);
  const [explanation, setExplanation] = useState('');

  // MCQ / Case Study Options & Correct Answer Position
  const [options, setOptions] = useState<OptionItem[]>([
    { id: 'a', text: '' },
    { id: 'b', text: '' },
    { id: 'c', text: '' },
    { id: 'd', text: '' },
  ]);
  const [correctAnswerId, setCorrectAnswerId] = useState<string>('a');

  // Case Study Scenario Fields
  const [scenarioTitle, setScenarioTitle] = useState('');
  const [caseStudyText, setCaseStudyText] = useState('');

  // Range Question Fields
  const [rangeMode, setRangeMode] = useState<'interval' | 'tolerance'>('interval');
  const [rangeMin, setRangeMin] = useState<string>('');
  const [rangeMax, setRangeMax] = useState<string>('');
  const [exactAnswer, setExactAnswer] = useState<string>('');
  const [tolerance, setTolerance] = useState<string>('0');

  // Coding Question Fields
  const [allowedLanguages, setAllowedLanguages] = useState<string[]>(['python']);
  const [defaultLanguage, setDefaultLanguage] = useState<string>('python');
  const [starterCode, setStarterCode] = useState<string>('def solve(n):\n    # Write your solution here\n    pass');
  const [testCases, setTestCases] = useState<TestCaseItem[]>([
    { input: '5', expectedOutput: '25', isHidden: false },
    { input: '10', expectedOutput: '100', isHidden: true },
  ]);

  const fetchQuestions = () => {
    setLoading(true);
    api.admin.getQuestions({
      search: search || undefined,
      topic: topic !== 'All' ? topic : undefined,
      difficulty: difficultyFilter !== 'All' ? difficultyFilter : undefined,
    })
      .then((res) => {
        if (res.questions) setQuestions(res.questions);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuestions();
  }, [topic, difficultyFilter]);

  const handleOpenCreate = () => {
    setEditQuestion(null);
    setQType('mcq');
    setText('');
    setFormTopic('Data Structures');
    setDifficulty('Medium');
    setPoints(2);
    setExplanation('');

    setOptions([
      { id: 'a', text: '' },
      { id: 'b', text: '' },
      { id: 'c', text: '' },
      { id: 'd', text: '' },
    ]);
    setCorrectAnswerId('a');

    setScenarioTitle('');
    setCaseStudyText('');

    setRangeMode('interval');
    setRangeMin('');
    setRangeMax('');
    setExactAnswer('');
    setTolerance('0');

    setAllowedLanguages(['python']);
    setDefaultLanguage('python');
    setStarterCode('def solve(n):\n    # Write your solution here\n    pass');
    setTestCases([
      { input: '5', expectedOutput: '25', isHidden: false },
      { input: '10', expectedOutput: '100', isHidden: true },
    ]);

    setModalOpen(true);
  };

  const handleOpenEdit = (q: Question) => {
    setEditQuestion(q);
    const resolvedType = (q.type as QuestionType) || 'mcq';
    setQType(resolvedType);
    setText(q.text || '');
    setFormTopic(q.topic || 'General');
    setDifficulty(q.difficulty || 'Medium');
    setPoints(q.points || 2);
    setExplanation(q.explanation || '');

    // Options
    if (q.options && q.options.length > 0) {
      setOptions(q.options.map(o => ({ id: o.id, text: o.text })));
      setCorrectAnswerId(q.correctAnswerId || q.options[0].id);
    } else {
      setOptions([
        { id: 'a', text: '' },
        { id: 'b', text: '' },
      ]);
      setCorrectAnswerId('a');
    }

    // Case Study
    setScenarioTitle(q.scenarioTitle || '');
    setCaseStudyText(q.caseStudyText || '');

    // Range
    if (q.exactAnswer !== undefined && q.exactAnswer !== null) {
      setRangeMode('tolerance');
      setExactAnswer(String(q.exactAnswer));
      setTolerance(String(q.tolerance || 0));
      setRangeMin('');
      setRangeMax('');
    } else {
      setRangeMode('interval');
      setRangeMin(q.rangeMin !== undefined && q.rangeMin !== null ? String(q.rangeMin) : '');
      setRangeMax(q.rangeMax !== undefined && q.rangeMax !== null ? String(q.rangeMax) : '');
      setExactAnswer('');
      setTolerance('0');
    }

    // Coding
    setAllowedLanguages(q.allowedLanguages && q.allowedLanguages.length > 0 ? q.allowedLanguages : ['python']);
    setDefaultLanguage(q.defaultLanguage || 'python');
    setStarterCode(q.starterCode || '');
    setTestCases(
      q.testCases && q.testCases.length > 0
        ? q.testCases.map(tc => ({ input: tc.input || '', expectedOutput: tc.expectedOutput || '', isHidden: !!tc.isHidden }))
        : [{ input: '', expectedOutput: '', isHidden: false }]
    );

    setModalOpen(true);
  };

  // Option handlers (MCQ / Case Study)
  const handleAddOption = () => {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const nextChar = letters[options.length % letters.length];
    const newId = `${nextChar}${options.length >= 26 ? options.length : ''}`;
    setOptions([...options, { id: newId, text: '' }]);
  };

  const handleRemoveOption = (indexToRemove: number) => {
    if (options.length <= 2) {
      alert('A multiple choice question requires at least 2 options.');
      return;
    }
    const removedId = options[indexToRemove].id;
    const filtered = options.filter((_, idx) => idx !== indexToRemove);
    setOptions(filtered);
    if (correctAnswerId === removedId) {
      setCorrectAnswerId(filtered[0].id);
    }
  };

  const handleOptionChange = (idx: number, newText: string) => {
    const updated = [...options];
    updated[idx].text = newText;
    setOptions(updated);
  };

  // Test Case handlers (Coding)
  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '', isHidden: false }]);
  };

  const handleRemoveTestCase = (indexToRemove: number) => {
    if (testCases.length <= 1) {
      alert('A coding test requires at least 1 test case.');
      return;
    }
    setTestCases(testCases.filter((_, idx) => idx !== indexToRemove));
  };

  const handleTestCaseChange = (index: number, field: keyof TestCaseItem, value: any) => {
    const updated = [...testCases];
    updated[index] = { ...updated[index], [field]: value };
    setTestCases(updated);
  };

  // Language preset selection helper
  const handleSelectLanguagePreset = (preset: 'python_only' | 'java_only' | 'cpp_only' | 'javascript_only' | 'all') => {
    if (preset === 'python_only') {
      setAllowedLanguages(['python']);
      setDefaultLanguage('python');
      if (!starterCode || starterCode.includes('public class') || starterCode.includes('#include')) {
        setStarterCode('def solve(n):\n    # Write Python 3 solution here\n    pass');
      }
    } else if (preset === 'java_only') {
      setAllowedLanguages(['java']);
      setDefaultLanguage('java');
      setStarterCode('import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write Java solution here\n    }\n}');
    } else if (preset === 'cpp_only') {
      setAllowedLanguages(['cpp']);
      setDefaultLanguage('cpp');
      setStarterCode('#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write C++ solution here\n    return 0;\n}');
    } else if (preset === 'javascript_only') {
      setAllowedLanguages(['javascript']);
      setDefaultLanguage('javascript');
      setStarterCode('const fs = require("fs");\n\nfunction solve() {\n    // Write JavaScript solution here\n}\nsolve();');
    } else if (preset === 'all') {
      setAllowedLanguages(['python', 'java', 'cpp', 'javascript']);
      setDefaultLanguage('python');
    }
  };

  const toggleLanguageOption = (langId: string) => {
    let next: string[];
    if (allowedLanguages.includes(langId)) {
      if (allowedLanguages.length === 1) {
        alert('At least one language must be permitted.');
        return;
      }
      next = allowedLanguages.filter(l => l !== langId);
    } else {
      next = [...allowedLanguages, langId];
    }
    setAllowedLanguages(next);
    if (!next.includes(defaultLanguage)) {
      setDefaultLanguage(next[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      alert('Question statement is required.');
      return;
    }

    const payload: any = {
      text: text.trim(),
      topic: formTopic.trim() || 'General',
      difficulty,
      type: qType,
      points: Number(points) || 1,
      explanation: explanation.trim(),
    };

    if (qType === 'mcq' || qType === 'case_based') {
      const validOptions = options.map((opt, i) => ({
        id: opt.id || String.fromCharCode(97 + i),
        text: opt.text.trim(),
      }));

      if (validOptions.some(o => !o.text)) {
        alert('All option choices must have text.');
        return;
      }

      if (!correctAnswerId) {
        alert('Please position and choose the correct answer option.');
        return;
      }

      payload.options = validOptions;
      payload.correctAnswerId = correctAnswerId;

      if (qType === 'case_based') {
        if (!caseStudyText.trim()) {
          alert('Please provide the case study scenario background text.');
          return;
        }
        payload.scenarioTitle = scenarioTitle.trim() || 'Case Scenario';
        payload.caseStudyText = caseStudyText.trim();
      }
    } else if (qType === 'range') {
      if (rangeMode === 'interval') {
        if (rangeMin === '' || rangeMax === '') {
          alert('Please enter both Minimum and Maximum values for the acceptable range.');
          return;
        }
        const minVal = parseFloat(rangeMin);
        const maxVal = parseFloat(rangeMax);
        if (isNaN(minVal) || isNaN(maxVal) || minVal > maxVal) {
          alert('Invalid range: Minimum must be less than or equal to Maximum.');
          return;
        }
        payload.rangeMin = minVal;
        payload.rangeMax = maxVal;
        payload.exactAnswer = undefined;
        payload.tolerance = 0;
      } else {
        if (exactAnswer === '') {
          alert('Please provide the exact target numerical answer.');
          return;
        }
        const exact = parseFloat(exactAnswer);
        const tol = parseFloat(tolerance || '0');
        if (isNaN(exact) || isNaN(tol) || tol < 0) {
          alert('Please provide a valid exact number and non-negative tolerance.');
          return;
        }
        payload.exactAnswer = exact;
        payload.tolerance = tol;
        payload.rangeMin = exact - tol;
        payload.rangeMax = exact + tol;
      }
    } else if (qType === 'coding') {
      if (allowedLanguages.length === 0) {
        alert('Please permit at least one programming language.');
        return;
      }
      if (testCases.length === 0 || testCases.some(tc => !tc.expectedOutput.trim())) {
        alert('Each coding question requires at least one test case with an expected output.');
        return;
      }
      payload.allowedLanguages = allowedLanguages;
      payload.defaultLanguage = defaultLanguage;
      payload.starterCode = starterCode;
      payload.testCases = testCases.map(tc => ({
        input: tc.input || '',
        expectedOutput: tc.expectedOutput.trim(),
        isHidden: !!tc.isHidden,
      }));
    }

    try {
      if (editQuestion) {
        await api.admin.updateQuestion(editQuestion._id, payload);
      } else {
        await api.admin.createQuestion(payload);
      }
      setModalOpen(false);
      fetchQuestions();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.admin.deleteQuestion(id);
      fetchQuestions();
    } catch (err: any) {
      alert(err.message || 'Failed to delete question');
    }
  };

  // Dynamic Topic Discovery
  const baseTopics = ['All', 'Data Structures', 'Algorithms', 'Core CS', 'Aptitude'];
  const dynamicTopics = Array.from(new Set(questions.map((q) => q.topic).filter(Boolean)));
  const allTopics = ['All', ...Array.from(new Set([...baseTopics.filter((t) => t !== 'All'), ...dynamicTopics]))];

  // Filter questions on client side for type
  const filteredQuestions = questions.filter(q => {
    if (typeFilter !== 'All' && (q.type || 'mcq') !== typeFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Question Bank</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
              Coursera-Grade Assessment Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Author versatile questions: standard MCQs, restricted-language code tests (e.g. Python only), 
            Coursera numerical range questions, and real-world scenario case studies.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-[#165DCE] hover:bg-[#124cb0] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Question</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchQuestions();
            }}
            className="relative flex-1 min-w-[260px]"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value === '' && search !== '') {
                  api.admin.getQuestions({
                    topic: topic !== 'All' ? topic : undefined,
                    difficulty: difficultyFilter !== 'All' ? difficultyFilter : undefined,
                  }).then((res) => {
                    if (res.questions) setQuestions(res.questions);
                  });
                }
              }}
              placeholder="Search questions by text or topic..."
              className="w-full h-10 pl-10 pr-24 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  api.admin.getQuestions({
                    topic: topic !== 'All' ? topic : undefined,
                    difficulty: difficultyFilter !== 'All' ? difficultyFilter : undefined,
                  }).then((res) => {
                    if (res.questions) setQuestions(res.questions);
                  });
                }}
                className="absolute right-16 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[11px] font-bold cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400">Difficulty:</span>
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficultyFilter(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  difficultyFilter === d ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Question Type Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-400 mr-1">Question Type:</span>
            {[
              { id: 'All', label: 'All Types' },
              { id: 'mcq', label: 'MCQ Choice', icon: CheckCircle2 },
              { id: 'coding', label: 'Code Test', icon: Code2 },
              { id: 'range', label: 'Numeric Range', icon: Hash },
              { id: 'case_based', label: 'Case Study', icon: BookOpen },
            ].map((t) => {
              const Icon = t.icon;
              const active = typeFilter === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTypeFilter(t.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Topic Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-400">Topic:</span>
            {allTopics.map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  topic === t ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Questions Stack */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Loading questions from Question Bank...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No questions found matching your filter</h3>
          <p className="text-xs text-slate-500">Try adjusting your filters or add a new question to the Question Bank.</p>
          <div className="flex items-center justify-center gap-3 pt-2">
            {(search || topic !== 'All' || typeFilter !== 'All' || difficultyFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearch('');
                  setTopic('All');
                  setTypeFilter('All');
                  setDifficultyFilter('All');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 cursor-pointer"
            >
              Add First Question
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const qTypeLabel = q.type || 'mcq';
            return (
              <div key={q._id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs hover:border-slate-300 transition-all">
                {/* Card Top Header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>

                    {/* Question Type Tag */}
                    {qTypeLabel === 'mcq' && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-extrabold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>MCQ Choice</span>
                      </span>
                    )}
                    {qTypeLabel === 'coding' && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-extrabold flex items-center gap-1">
                        <Code2 className="w-3 h-3" />
                        <span>
                          Code Test (
                          {q.allowedLanguages?.length === 1
                            ? `${q.allowedLanguages[0].toUpperCase()} ONLY`
                            : `${q.allowedLanguages?.join(', ').toUpperCase() || 'ANY'}`}
                          )
                        </span>
                      </span>
                    )}
                    {qTypeLabel === 'range' && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-extrabold flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        <span>
                          {q.exactAnswer !== undefined && q.exactAnswer !== null
                            ? `Range [${q.exactAnswer} ± ${q.tolerance || 0}]`
                            : `Range [${q.rangeMin} — ${q.rangeMax}]`}
                        </span>
                      </span>
                    )}
                    {qTypeLabel === 'case_based' && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-extrabold flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>Case Study Scenario</span>
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-bold">
                      {q.topic}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      q.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700' :
                      q.difficulty === 'Hard' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {q.difficulty}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{q.points || 1} Points</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(q)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 cursor-pointer"
                      title="Edit Question"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 rounded hover:bg-rose-50 cursor-pointer"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Case Study Context if applicable */}
                {qTypeLabel === 'case_based' && q.caseStudyText && (
                  <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-200/80 space-y-1">
                    <div className="text-[11px] font-extrabold text-indigo-900 uppercase tracking-wide flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{q.scenarioTitle || 'Scenario Passage'}</span>
                    </div>
                    <p className="text-xs text-indigo-950 font-normal leading-relaxed line-clamp-3">
                      {q.caseStudyText}
                    </p>
                  </div>
                )}

                {/* Question Statement */}
                <p className="text-sm font-bold text-slate-900 leading-relaxed">{q.text}</p>

                {/* Options Preview for MCQ / Case Study */}
                {(qTypeLabel === 'mcq' || qTypeLabel === 'case_based') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options?.map((opt) => {
                      const isCorrect = opt.id === q.correctAnswerId;
                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded text-[11px] border font-bold flex items-center justify-center shrink-0 ${
                              isCorrect ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-300 text-slate-600'
                            }`}>
                              {opt.id.toUpperCase()}
                            </span>
                            <span className="leading-snug">{opt.text}</span>
                          </div>
                          {isCorrect && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold shrink-0">
                              Correct Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Numeric Range Preview */}
                {qTypeLabel === 'range' && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-amber-600" />
                      <span className="font-bold text-amber-900">
                        Acceptable Answer Range:
                      </span>
                      <span className="font-mono font-extrabold text-amber-950 bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                        {q.exactAnswer !== undefined && q.exactAnswer !== null
                          ? `${q.exactAnswer} ± ${q.tolerance || 0} (Accepts ${Number(q.exactAnswer) - Number(q.tolerance || 0)} to ${Number(q.exactAnswer) + Number(q.tolerance || 0)})`
                          : `[ ${q.rangeMin} to ${q.rangeMax} ]`}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-800">
                      Evaluated server-side
                    </span>
                  </div>
                )}

                {/* Code Test Preview */}
                {qTypeLabel === 'coding' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-purple-600" />
                        <span className="font-bold text-slate-700">Permitted Languages:</span>
                        <div className="flex gap-1">
                          {q.allowedLanguages?.map(lang => (
                            <span key={lang} className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">
                              {lang.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 font-medium text-xs">
                        {q.testCases?.length || 0} Test Cases ({q.testCases?.filter(t => t.isHidden).length || 0} Hidden)
                      </span>
                    </div>

                    {q.starterCode && (
                      <div className="bg-[#0f172a] text-slate-200 p-3 rounded-xl font-mono text-[11px] overflow-x-auto max-h-24">
                        <pre>{q.starterCode}</pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Explanation */}
                {q.explanation && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-700">Explanation: </span>
                    {q.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Authoring & Edit Modal (Coursera-Grade) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto text-xs">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {editQuestion ? 'Edit Question' : 'Author New Assessment Question'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Choose the question format and define authoritative grading criteria.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Question Type Selector Tabs */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block text-xs">Question Format / Evaluation Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'mcq', label: 'Multiple Choice', desc: 'Single select radio options', icon: CheckCircle2 },
                    { id: 'coding', label: 'Code Test', desc: 'Restricted language compiler', icon: Code2 },
                    { id: 'range', label: 'Numeric Range', desc: 'Coursera exact/range tolerance', icon: Hash },
                    { id: 'case_based', label: 'Case Study', desc: 'Scenario passage + question', icon: BookOpen },
                  ].map((item) => {
                    const active = qType === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setQType(item.id as QuestionType)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          active
                            ? 'bg-blue-50/80 border-blue-600 text-blue-900 ring-2 ring-blue-500/20'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                          {active && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </div>
                        <span className="font-extrabold text-xs block">{item.label}</span>
                        <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Case Study Specific Header (if case_based) */}
              {qType === 'case_based' && (
                <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-700" />
                    <span className="font-extrabold text-indigo-950 text-xs">Case Study Context / Scenario</span>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-indigo-900 block text-[11px]">Scenario Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Case Study: Microservices Fault Tolerance at Netflix"
                      value={scenarioTitle}
                      onChange={(e) => setScenarioTitle(e.target.value)}
                      className="w-full h-9 px-3 bg-white border border-indigo-200 rounded-xl text-xs text-indigo-950"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-indigo-900 block text-[11px]">Scenario Passage / System Description</label>
                    <textarea
                      rows={4}
                      placeholder="Describe the real-world business context, data parameters, architectural diagrams description..."
                      value={caseStudyText}
                      onChange={(e) => setCaseStudyText(e.target.value)}
                      className="w-full p-3 bg-white border border-indigo-200 rounded-xl text-xs text-indigo-950"
                    />
                  </div>
                </div>
              )}

              {/* General Question Statement */}
              <div className="space-y-1">
                <label className="font-bold text-slate-900 block">
                  {qType === 'case_based' ? 'Follow-Up Question Statement' : 'Question Statement / Problem Prompt'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={
                    qType === 'range'
                      ? 'e.g. Calculate the throughput in Megabits per second when transmission delay is 20ms and packet size is 1500 bytes.'
                      : qType === 'coding'
                      ? 'e.g. Implement a function to return the square of each element in a given list.'
                      : 'Enter problem question statement...'
                  }
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Topic, Difficulty, Points Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-900 block">Topic / Domain</label>
                  <input
                    type="text"
                    required
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    placeholder="e.g. Algorithms, Data Structures"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900 block">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900 block">Points</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              {/* ============================================================== */}
              {/* TYPE 1 & 4: MCQ & CASE BASED OPTIONS WITH CORRECT POSITION     */}
              {/* ============================================================== */}
              {(qType === 'mcq' || qType === 'case_based') && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-bold text-slate-900 block text-xs">
                        Answer Options & Correct Answer Position
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Click the radio checkmark on the option that represents the correct answer key.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Option</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {options.map((opt, idx) => {
                      const isCorrect = correctAnswerId === opt.id;
                      return (
                        <div
                          key={opt.id}
                          className={`flex items-center gap-2 p-2 rounded-2xl border transition-all ${
                            isCorrect
                              ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          {/* Radio Button to Position / Set Correct Answer */}
                          <button
                            type="button"
                            onClick={() => setCorrectAnswerId(opt.id)}
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer transition-all ${
                              isCorrect
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-white text-slate-500 border border-slate-300 hover:border-emerald-500 hover:text-emerald-600'
                            }`}
                            title="Click to set this as the correct answer"
                          >
                            {isCorrect ? <Check className="w-4 h-4" /> : opt.id.toUpperCase()}
                          </button>

                          {/* Option Text Input */}
                          <input
                            type="text"
                            required
                            placeholder={`Enter text for Option ${opt.id.toUpperCase()}...`}
                            value={opt.text}
                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                            className={`flex-1 h-9 px-3 bg-white border rounded-xl text-xs ${
                              isCorrect ? 'border-emerald-300 font-semibold text-emerald-950' : 'border-slate-200 text-slate-800'
                            }`}
                          />

                          {/* Correct badge indicator */}
                          {isCorrect && (
                            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-extrabold shrink-0">
                              CORRECT
                            </span>
                          )}

                          {/* Delete option button */}
                          {options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(idx)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                              title="Delete this option"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TYPE 2: NUMERIC RANGE QUESTION (COURSERA STYLE)                */}
              {/* ============================================================== */}
              {qType === 'range' && (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-amber-950 text-xs flex items-center gap-1.5">
                        <Hash className="w-4 h-4 text-amber-700" />
                        <span>Coursera-Style Numerical Answer Rules</span>
                      </span>
                      <p className="text-[11px] text-amber-800">
                        Students enter a numeric value into a box. Answer is evaluated server-side against an acceptable range.
                      </p>
                    </div>

                    {/* Mode switcher */}
                    <div className="flex bg-amber-100 p-1 rounded-xl text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setRangeMode('interval')}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          rangeMode === 'interval' ? 'bg-white text-amber-900 shadow-xs' : 'text-amber-700'
                        }`}
                      >
                        Range Interval [Min, Max]
                      </button>
                      <button
                        type="button"
                        onClick={() => setRangeMode('tolerance')}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          rangeMode === 'tolerance' ? 'bg-white text-amber-900 shadow-xs' : 'text-amber-700'
                        }`}
                      >
                        Target Value ± Tolerance
                      </button>
                    </div>
                  </div>

                  {rangeMode === 'interval' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-amber-900 block text-[11px]">Minimum Acceptable Value</label>
                        <input
                          type="number"
                          step="any"
                          required
                          placeholder="e.g. 10.0"
                          value={rangeMin}
                          onChange={(e) => setRangeMin(e.target.value)}
                          className="w-full h-10 px-3 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-amber-900 block text-[11px]">Maximum Acceptable Value</label>
                        <input
                          type="number"
                          step="any"
                          required
                          placeholder="e.g. 25.0"
                          value={rangeMax}
                          onChange={(e) => setRangeMax(e.target.value)}
                          className="w-full h-10 px-3 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-amber-900 block text-[11px]">Exact Target Answer</label>
                        <input
                          type="number"
                          step="any"
                          required
                          placeholder="e.g. 42.5"
                          value={exactAnswer}
                          onChange={(e) => setExactAnswer(e.target.value)}
                          className="w-full h-10 px-3 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-amber-900 block text-[11px]">Tolerance (±)</label>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          placeholder="e.g. 0.5 (accepts 42.0 to 43.0)"
                          value={tolerance}
                          onChange={(e) => setTolerance(e.target.value)}
                          className="w-full h-10 px-3 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold"
                        />
                      </div>
                    </div>
                  )}

                  {/* Range evaluation preview */}
                  <div className="p-3 bg-white/80 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      <strong>Grading Rule:</strong> Any student response {rangeMode === 'interval' && rangeMin && rangeMax ? (
                        <>between <strong className="font-mono">{rangeMin}</strong> and <strong className="font-mono">{rangeMax}</strong> (inclusive)</>
                      ) : rangeMode === 'tolerance' && exactAnswer ? (
                        <>between <strong className="font-mono">{Number(exactAnswer) - Number(tolerance || 0)}</strong> and <strong className="font-mono">{Number(exactAnswer) + Number(tolerance || 0)}</strong></>
                      ) : (
                        'satisfying the bounds'
                      )} will be graded as 100% correct.
                    </span>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TYPE 3: CODE TEST (RESTRICTED LANGUAGE & TEST CASES)           */}
              {/* ============================================================== */}
              {qType === 'coding' && (
                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-4">
                  <div className="space-y-1">
                    <span className="font-extrabold text-purple-950 text-xs flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-purple-700" />
                      <span>Code Test & Language Restriction (Coursera Style)</span>
                    </span>
                    <p className="text-[11px] text-purple-800">
                      Restrict student solutions to specific programming languages (e.g. "Only Python", "Only Java") or permit multiple.
                    </p>
                  </div>

                  {/* Language Quick Presets */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-purple-900 block text-[11px]">Quick Language Restrictions</label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleSelectLanguagePreset('python_only')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          allowedLanguages.length === 1 && allowedLanguages[0] === 'python'
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-white border border-purple-200 text-purple-900 hover:bg-purple-100'
                        }`}
                      >
                        🐍 Only Python 3
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectLanguagePreset('java_only')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          allowedLanguages.length === 1 && allowedLanguages[0] === 'java'
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-white border border-purple-200 text-purple-900 hover:bg-purple-100'
                        }`}
                      >
                        ☕ Only Java
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectLanguagePreset('cpp_only')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          allowedLanguages.length === 1 && allowedLanguages[0] === 'cpp'
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-white border border-purple-200 text-purple-900 hover:bg-purple-100'
                        }`}
                      >
                        ⚡ Only C++
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectLanguagePreset('javascript_only')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          allowedLanguages.length === 1 && allowedLanguages[0] === 'javascript'
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-white border border-purple-200 text-purple-900 hover:bg-purple-100'
                        }`}
                      >
                        🟨 Only JavaScript
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectLanguagePreset('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          allowedLanguages.length === 4
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-white border border-purple-200 text-purple-900 hover:bg-purple-100'
                        }`}
                      >
                        🌐 All Supported Languages
                      </button>
                    </div>
                  </div>

                  {/* Individual Checkboxes for Allowed Languages */}
                  <div className="space-y-1">
                    <label className="font-bold text-purple-900 block text-[11px]">Permitted Languages Checkbox</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SUPPORTED_LANGUAGES.map((lang) => {
                        const checked = allowedLanguages.includes(lang.id);
                        return (
                          <label
                            key={lang.id}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                              checked ? 'bg-white border-purple-400 font-bold text-purple-950' : 'bg-purple-50/50 border-purple-200 text-purple-800'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleLanguageOption(lang.id)}
                              className="rounded text-purple-600 focus:ring-purple-500"
                            />
                            <span>{lang.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Default Language & Starter Code */}
                  <div className="space-y-1">
                    <label className="font-bold text-purple-900 block text-[11px]">Starter Solution Template / Code</label>
                    <textarea
                      rows={5}
                      value={starterCode}
                      onChange={(e) => setStarterCode(e.target.value)}
                      placeholder="Write default starter code function template..."
                      className="w-full p-3 bg-[#0d1424] text-emerald-400 font-mono text-xs rounded-xl border border-purple-300 focus:outline-none"
                    />
                  </div>

                  {/* Test Cases Builder */}
                  <div className="space-y-3 pt-2 border-t border-purple-200/80">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-bold text-purple-950 block text-xs">
                          Test Cases & Hidden Evaluation Cases
                        </label>
                        <p className="text-[11px] text-purple-800">
                          Hidden test cases are evaluated on the backend and concealed from students.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddTestCase}
                        className="px-3 py-1.5 bg-purple-600 text-white hover:bg-purple-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Test Case</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {testCases.map((tc, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white rounded-xl border border-purple-200 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-purple-900 text-[11px]">
                              Test Case #{idx + 1}
                            </span>
                            
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-slate-700">
                                <input
                                  type="checkbox"
                                  checked={tc.isHidden}
                                  onChange={(e) => handleTestCaseChange(idx, 'isHidden', e.target.checked)}
                                  className="rounded text-purple-600"
                                />
                                <span className={tc.isHidden ? 'text-amber-700 font-extrabold' : ''}>
                                  {tc.isHidden ? '🔒 Hidden (Grading only)' : '👁️ Sample (Visible to student)'}
                                </span>
                              </label>

                              {testCases.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTestCase(idx)}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Input (Stdin)</span>
                              <input
                                type="text"
                                placeholder="e.g. 5"
                                value={tc.input}
                                onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)}
                                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Expected Output (Stdout)</span>
                              <input
                                type="text"
                                required
                                placeholder="e.g. 25"
                                value={tc.expectedOutput}
                                onChange={(e) => handleTestCaseChange(idx, 'expectedOutput', e.target.value)}
                                className="w-full h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-emerald-700"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Explanation (Shown post-submission) */}
              <div className="space-y-1">
                <label className="font-bold text-slate-900 block">Explanation / Solution Notes (Shown in Post-Exam Review)</label>
                <textarea
                  rows={2}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explain why this answer or algorithm is optimal..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#165DCE] hover:bg-[#124cb0] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editQuestion ? 'Update Question' : 'Save Question to Bank'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
