import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  Code, 
  HelpCircle, 
  Users, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const PlacementPrepPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dsa' | 'aptitude' | 'hr'>('dsa');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-primary-container text-xs font-bold uppercase tracking-wider">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Placement Readiness Playbook</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102344] tracking-tight">
          Campus Placement Preparation Hub
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
          Everything you need to clear campus screening tests, technical coding rounds, and managerial HR interviews.
        </p>

        {/* Tab switchers */}
        <div className="pt-4 flex items-center gap-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('dsa')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dsa'
                ? 'bg-primary-container text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            DSA 60-Day Roadmap
          </button>
          <button
            onClick={() => setActiveTab('aptitude')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'aptitude'
                ? 'bg-primary-container text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Aptitude & Reasoning Formulas
          </button>
          <button
            onClick={() => setActiveTab('hr')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'hr'
                ? 'bg-primary-container text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            HR & STAR Method Blueprint
          </button>
        </div>
      </div>

      {/* Tab 1: DSA 60-Day Roadmap */}
      {activeTab === 'dsa' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 space-y-4 shadow-xs">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-primary-container text-xs font-bold">
                Phase 1: Days 1 - 20
              </span>
              <h3 className="text-base font-extrabold text-[#102344]">Linear Data Structures</h3>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Arrays & Two Pointers (Floyd's algorithm)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Sliding Window & Prefix Sums</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Strings & KMP Pattern Matching</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Singly & Doubly Linked Lists reversal</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Stacks (Next Greater Element) & Monotonic Queues</li>
              </ul>
              <Link to="/student/problems" className="inline-block text-xs font-bold text-primary-container hover:underline pt-2">
                Solve Phase 1 Problems →
              </Link>
            </div>

            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 space-y-4 shadow-xs">
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
                Phase 2: Days 21 - 40
              </span>
              <h3 className="text-base font-extrabold text-[#102344]">Hierarchical & Non-Linear</h3>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Binary Trees (Inorder, Preorder, Postorder, Level-order)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Binary Search Trees (LCA, Validate BST)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Heaps & Priority Queues (Top K elements)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Graphs (BFS, DFS, Dijkstra, Bellman-Ford)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Disjoint Set Union (Kruskal's MST)</li>
              </ul>
              <Link to="/student/problems" className="inline-block text-xs font-bold text-primary-container hover:underline pt-2">
                Solve Phase 2 Problems →
              </Link>
            </div>

            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 space-y-4 shadow-xs">
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold">
                Phase 3: Days 41 - 60
              </span>
              <h3 className="text-base font-extrabold text-[#102344]">Advanced Algorithms & DP</h3>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> 1D Dynamic Programming (Fibonacci, Climbing Stairs)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> 2D Grid DP & Longest Common Subsequence (LCS)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> 0/1 Knapsack & Subset Sum variations</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Backtracking (N-Queens, Sudoku Solver)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Bit Manipulation & Trie Data Structure</li>
              </ul>
              <Link to="/student/assessments" className="inline-block text-xs font-bold text-primary-container hover:underline pt-2">
                Take DSA Mock Exam →
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Aptitude */}
      {activeTab === 'aptitude' && (
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="text-lg font-extrabold text-[#102344]">Speed Math & Aptitude Formulas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
            <div className="p-4 bg-surface rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-extrabold text-[#102344]">Time, Speed and Distance</h3>
              <p>• Distance = Speed × Time</p>
              <p>• Average Speed = 2xy / (x + y) when distances are equal</p>
              <p>• Relative Speed: Same direction = (u - v); Opposite direction = (u + v)</p>
            </div>

            <div className="p-4 bg-surface rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-extrabold text-[#102344]">Percentages & Profit/Loss</h3>
              <p>• Profit % = (Profit / Cost Price) × 100</p>
              <p>• Discount % = (Discount / Marked Price) × 100</p>
              <p>• Successive Percentage Change = a + b + (ab / 100)</p>
            </div>

            <div className="p-4 bg-surface rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-extrabold text-[#102344]">Time & Work</h3>
              <p>• If A does work in N days, 1 day work = 1 / N</p>
              <p>• (M1 × D1 × H1) / W1 = (M2 × D2 × H2) / W2</p>
              <p>• Pipes & Cisterns: Inflow rate is positive, Leak rate is negative</p>
            </div>

            <div className="p-4 bg-surface rounded-2xl border border-slate-200 space-y-2">
              <h3 className="font-extrabold text-[#102344]">Permutations & Probability</h3>
              <p>• nPr = n! / (n - r)!</p>
              <p>• nCr = n! / [r! × (n - r)!]</p>
              <p>• Probability = Favorable Outcomes / Total Sample Space</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: HR STAR Framework */}
      {activeTab === 'hr' && (
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="text-lg font-extrabold text-[#102344]">The STAR Behavioral Interview Technique</h2>
          <p className="text-xs text-slate-500">
            Top companies like Amazon, Google, and Microsoft evaluate behavioral competencies using structured past experiences.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2">
              <span className="font-extrabold text-primary-container text-sm block">S - Situation</span>
              <p className="text-slate-700 leading-relaxed">
                Describe the specific context, challenge, or project you were working on with clarity.
              </p>
            </div>

            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 space-y-2">
              <span className="font-extrabold text-indigo-700 text-sm block">T - Task</span>
              <p className="text-slate-700 leading-relaxed">
                Explain your personal role, the goal, or the problem that required your immediate intervention.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
              <span className="font-extrabold text-purple-700 text-sm block">A - Action</span>
              <p className="text-slate-700 leading-relaxed">
                Detail the exact steps you took, technical tools chosen, and leadership decisions made.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <span className="font-extrabold text-emerald-700 text-sm block">R - Result</span>
              <p className="text-slate-700 leading-relaxed">
                Conclude with measurable outcomes, latency reductions, percentage improvements, or lessons learned.
              </p>
            </div>
          </div>

          <div className="p-4 bg-surface rounded-2xl border border-slate-200 space-y-2 text-xs">
            <h3 className="font-extrabold text-[#102344]">Example: "Tell me about a time you faced a difficult technical bug."</h3>
            <p className="text-slate-600 leading-relaxed">
              "During our final year project, we had a memory leak in the real-time WebSocket server. Using memory profiling tools, I discovered unclosed database connections. I refactored the connection pool to use auto-closing context managers, reducing server RAM usage by 45% and eliminating crashes."
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
