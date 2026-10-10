import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  Code, 
  FileCheck, 
  TrendingUp, 
  ArrowRight, 
  Play, 
  Flame, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Briefcase,
  ChevronRight,
  Terminal,
  Cpu,
  ShieldCheck,
  Building2,
  Check,
  Clock,
  HelpCircle,
  AlertCircle,
  Star,
  Mail,
  MessageSquare,
  Send,
  Phone,
  MapPin
} from 'lucide-react';
import { api } from '../../services/api';
import { Course, Company } from '../../types';
import { CompanyLogo } from '../../components/common/CompanyLogo';
import { SmartCodeEditor } from '../../components/common/SmartCodeEditor';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);


export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbCompanies, setDbCompanies] = useState<Company[]>([]);
  const [dbAssessments, setDbAssessments] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  // Live Mini Compiler Demo State for Landing Page
  const [activeLang, setActiveLang] = useState<'python' | 'java' | 'cpp' | 'javascript'>('python');
  const [sandboxInput, setSandboxInput] = useState<string>("13\n2 7 11 15");
  const [demoCode, setDemoCode] = useState<string>(
    '# Multiple Inputs in Python\nimport sys\n\n# Reads all input tokens across lines or spaces\ntokens = sys.stdin.read().split()\n\nif len(tokens) >= 2:\n    target = int(tokens[0])\n    nums = [int(x) for x in tokens[1:]]\nelif len(tokens) == 1:\n    target = int(tokens[0])\n    nums = [2, 7, 11, 15]\nelse:\n    target = 13\n    nums = [2, 7, 11, 15]\n\nprint(f"Target: {target}")\nprint(f"Array: {nums}")\n\n# Two Sum Algorithm\nseen = {}\nfound = False\nfor i, num in enumerate(nums):\n    diff = target - num\n    if diff in seen:\n        print(f"Output: [{seen[diff]}, {i}]")\n        print(f"Pair: {nums[seen[diff]]} + {num} = {target}")\n        found = True\n        break\n    seen[num] = i\n\nif not found:\n    print(f"No pair found for target {target}")'
  );
  const [executing, setExecuting] = useState(false);
  const [demoOutput, setDemoOutput] = useState<string>('Target: 13\nArray: [2, 7, 11, 15]\nOutput: [0, 2]\nPair: 2 + 11 = 13\n\nExecution Time: 38ms | Status: Success');

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('General Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim() || !contactMessage.trim()) return;
    setContactSubmitting(true);
    setTimeout(() => {
      setContactSubmitting(false);
      setContactSent(true);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setTimeout(() => setContactSent(false), 5000);
    }, 700);
  };

  useEffect(() => {
    api.courses.getPublished()
      .then((res) => {
        if (res.courses) setCourses(res.courses.slice(0, 3));
      })
      .catch((err) => console.warn('Could not load courses on home:', err))
      .finally(() => setLoading(false));

    api.companies.getAll()
      .then((res) => {
        if (res.companies && res.companies.length > 0) {
          setDbCompanies(res.companies);
        }
      })
      .catch((err) => console.warn('Could not load companies on home:', err));

    api.assessments.getPublished()
      .then((res) => {
        if (res.assessments && res.assessments.length > 0) {
          setDbAssessments(res.assessments.slice(0, 3));
        }
      })
      .catch((err) => console.warn('Could not load assessments on home:', err));

    if (isAuthenticated) {
      api.courses.getMyEnrollments()
        .then((res) => {
          if (res.enrollments) setEnrollments(res.enrollments);
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handleLangSwitch = (lang: 'python' | 'java' | 'cpp' | 'javascript') => {
    setActiveLang(lang);
    if (lang === 'python') {
      setDemoCode(
        '# Multiple Inputs in Python\nimport sys\n\n# Reads all input tokens across lines or spaces\ntokens = sys.stdin.read().split()\n\nif len(tokens) >= 2:\n    target = int(tokens[0])\n    nums = [int(x) for x in tokens[1:]]\nelif len(tokens) == 1:\n    target = int(tokens[0])\n    nums = [2, 7, 11, 15]\nelse:\n    target = 13\n    nums = [2, 7, 11, 15]\n\nprint(f"Target: {target}")\nprint(f"Array: {nums}")\n\n# Two Sum Algorithm\nseen = {}\nfound = False\nfor i, num in enumerate(nums):\n    diff = target - num\n    if diff in seen:\n        print(f"Output: [{seen[diff]}, {i}]")\n        print(f"Pair: {nums[seen[diff]]} + {num} = {target}")\n        found = True\n        break\n    seen[num] = i\n\nif not found:\n    print(f"No pair found for target {target}")'
      );
      setDemoOutput('Target: 13\nArray: [2, 7, 11, 15]\nOutput: [0, 2]\nPair: 2 + 11 = 13\n\nExecution Time: 38ms | Status: Success');
    } else if (lang === 'java') {
      setDemoCode(
        '// Multiple Inputs in Java\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Integer> tokens = new ArrayList<>();\n        \n        // Read all space or newline separated integers\n        while (sc.hasNextInt()) {\n            tokens.add(sc.nextInt());\n        }\n        \n        int target = 13;\n        List<Integer> nums = Arrays.asList(2, 7, 11, 15);\n        \n        if (tokens.size() >= 2) {\n            target = tokens.get(0);\n            nums = tokens.subList(1, tokens.size());\n        } else if (tokens.size() == 1) {\n            target = tokens.get(0);\n        }\n        \n        System.out.println("Target: " + target);\n        System.out.println("Array: " + nums);\n        \n        Map<Integer, Integer> map = new HashMap<>();\n        boolean found = false;\n        for (int i = 0; i < nums.size(); i++) {\n            int comp = target - nums.get(i);\n            if (map.containsKey(comp)) {\n                System.out.println("Output: [" + map.get(comp) + ", " + i + "]");\n                System.out.println("Pair: " + nums.get(map.get(comp)) + " + " + nums.get(i) + " = " + target);\n                found = true;\n                break;\n            }\n            map.put(nums.get(i), i);\n        }\n        if (!found) {\n            System.out.println("No pair found for target " + target);\n        }\n    }\n}'
      );
      setDemoOutput('Target: 13\nArray: [2, 7, 11, 15]\nOutput: [0, 2]\nPair: 2 + 11 = 13\n\nExecution Time: 78ms | Status: Success');
    } else if (lang === 'cpp') {
      setDemoCode(
        '// Multiple Inputs in C++\n#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    int val;\n    vector<int> tokens;\n    // Reads integers across lines and spaces\n    while (cin >> val) {\n        tokens.push_back(val);\n    }\n\n    int target = 13;\n    vector<int> nums = {2, 7, 11, 15};\n\n    if (tokens.size() >= 2) {\n        target = tokens[0];\n        nums.assign(tokens.begin() + 1, tokens.end());\n    } else if (tokens.size() == 1) {\n        target = tokens[0];\n    }\n\n    cout << "Target: " << target << endl;\n    cout << "Array size: " << nums.size() << endl;\n\n    unordered_map<int, int> seen;\n    bool found = false;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        int diff = target - nums[i];\n        if (seen.count(diff)) {\n            cout << "Output: [" << seen[diff] << ", " << i << "]" << endl;\n            cout << "Pair: " << nums[seen[diff]] << " + " << nums[i] << " = " << target << endl;\n            found = true;\n            break;\n        }\n        seen[nums[i]] = i;\n    }\n    if (!found) {\n        cout << "No pair found for target " << target << endl;\n    }\n    return 0;\n}'
      );
      setDemoOutput('Target: 13\nArray size: 4\nOutput: [0, 2]\nPair: 2 + 11 = 13\n\nExecution Time: 21ms | Status: Success');
    } else {
      setDemoCode(
        '// Multiple Inputs in JavaScript\nconst fs = require("fs");\n\nconst raw = fs.readFileSync(0, "utf-8").trim();\nconst tokens = raw ? raw.split(/\\s+/).map(Number).filter(n => !isNaN(n)) : [];\n\nlet target = 13;\nlet nums = [2, 7, 11, 15];\n\nif (tokens.length >= 2) {\n  target = tokens[0];\n  nums = tokens.slice(1);\n} else if (tokens.length === 1) {\n  target = tokens[0];\n}\n\nconsole.log(`Target: ${target}`);\nconsole.log(`Array: [${nums.join(", ")}]`);\n\nconst map = new Map();\nlet found = false;\nfor (let i = 0; i < nums.length; i++) {\n  const diff = target - nums[i];\n  if (map.has(diff)) {\n    console.log(`Output: [${map.get(diff)}, ${i}]`);\n    console.log(`Pair: ${nums[map.get(diff)]} + ${nums[i]} = ${target}`);\n    found = true;\n    break;\n  }\n  map.set(nums[i], i);\n}\n\nif (!found) {\n  console.log(`No pair found for target ${target}`);\n}'
      );
      setDemoOutput('Target: 13\nArray: [2, 7, 11, 15]\nOutput: [0, 2]\nPair: 2 + 11 = 13\n\nExecution Time: 29ms | Status: Success');
    }
  };

  const runDemoSandbox = async () => {
    try {
      setExecuting(true);
      const res = await api.code.run({
        language: activeLang,
        code: demoCode,
        customInput: sandboxInput,
      });
      if (res.success && !res.isError) {
        setDemoOutput((res.output || 'Code executed successfully') + `\nExecution Time: ${res.executionTime || 42}ms | Status: ${res.status || 'Success'}`);
      } else {
        setDemoOutput(`Status: ${res.status || 'Execution Error'}\n\n${res.output || res.message || 'Error occurred during execution'}`);
      }
    } catch (err: any) {
      const tokens = sandboxInput.trim() ? sandboxInput.trim().split(/\s+/).map(Number).filter(n => !isNaN(n)) : [];
      let target = 13;
      let nums = [2, 7, 11, 15];
      if (tokens.length >= 2) {
        target = tokens[0];
        nums = tokens.slice(1);
      } else if (tokens.length === 1) {
        target = tokens[0];
      }
      
      const map = new Map<number, number>();
      let sol = `No pair found for target ${target}`;
      for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (map.has(diff)) {
          sol = `Output: [${map.get(diff)}, ${i}]\nPair: ${nums[map.get(diff)!]} + ${nums[i]} = ${target}`;
          break;
        }
        map.set(nums[i], i);
      }
      setDemoOutput(`Target: ${target}\nArray: [${nums.join(', ')}]\n${sol}\n\nExecution Time: 35ms | Status: Success (Simulation - ${activeLang.toUpperCase()})`);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-50/50">
      
      {/* ============================================================ */}
      {/* 1. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section id="hero" className="relative pt-10 pb-16 md:pt-16 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Subtle Crisp Dot Grid Background matching design */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-60 -z-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #94a3b8 1.4px, transparent 1.4px)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />

        {/* Soft Ambient Radial Backgrounds */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline and Actions (Max width 580px) */}
          <div className="lg:col-span-7 space-y-6 max-w-[580px]">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-blue-200/90 shadow-[0_2px_8px_rgba(22,93,206,0.06)] backdrop-blur-xs">
              <svg 
                className="w-3.5 h-3.5 text-[#165dce] shrink-0" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
              </svg>
              <span className="text-[#165dce] font-extrabold text-[11px] sm:text-xs uppercase tracking-wider">
                Placement Preparation Platform
              </span>
            </div>

            {/* Main Headline with Highlighter Accent */}
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] xl:text-[66px] font-black text-[#102344] tracking-tight leading-[1.08]">
              Turn your skills <br />
              into your{' '}
              <span className="relative inline-block text-[#165dce] isolate">
                <span 
                  className="absolute left-[-3px] right-[-4px] bottom-[-4px] sm:bottom-[-6px] h-[38%] bg-[#FEDE76] -z-10 rounded-[3px] pointer-events-none" 
                  aria-hidden="true" 
                />
                dream
              </span> <br />
              <span className="relative inline-block text-[#165dce] isolate">
                <span 
                  className="absolute left-[-3px] right-[-7px] bottom-[-4px] sm:bottom-[-6px] h-[38%] bg-[#FEDE76] -z-10 rounded-[3px] pointer-events-none" 
                  aria-hidden="true" 
                />
                career.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-[510px] leading-relaxed">
              Learn DSA, master programming languages, practice coding, and prepare for placements, all in one platform.
            </p>

            {/* CTA Buttons - High Contrast Start Learning + Outlined Explore Courses */}
            <div className="pt-1 flex flex-wrap items-center gap-4">
              <Link
                to={isAuthenticated ? "/student/dashboard" : "/register"}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-base text-white bg-[#165dce] hover:bg-[#114ab0] shadow-[0_8px_20px_rgba(22,93,206,0.32)] hover:shadow-[0_12px_24px_rgba(22,93,206,0.42)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>

              <button
                onClick={() => {
                  const elem = document.getElementById('courses');
                  elem?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-base text-[#102344] bg-white border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-slate-100 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#102344]" />
                <span>Explore Courses</span>
              </button>
            </div>

            {/* Practice in Language Badges */}
            <div className="pt-2 flex items-center flex-wrap gap-2.5 sm:gap-3 text-slate-500">
              <span className="font-semibold text-xs sm:text-sm text-slate-600">Practice in:</span>
              {[
                { label: 'C', lang: 'cpp' },
                { label: 'Python', lang: 'python' },
                { label: 'Java', lang: 'java' },
                { label: 'JavaScript', lang: 'javascript' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    handleLangSwitch(item.lang as any);
                    document.getElementById('compiler')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/90 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs hover:border-blue-400 hover:text-[#165dce] hover:shadow-xs transition-all cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Visual with soft background & decluttered cards */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            
            {/* Visual Container */}
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-visible">
              
              {/* Soft pale-blue abstract background shape */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#EFF6FF] via-[#DBEAFE]/70 to-[#EFF6FF] rounded-3xl -z-10 shadow-lg border border-blue-100/80" />
              <div className="absolute -inset-2 bg-blue-400/10 rounded-[32px] blur-xl -z-20" />
              
              {/* Student Image: uploaded asset */}
              <img
                src="/student_hero.jpg"
                alt="DreamLearn Successful Student"
                className="w-full h-full object-cover object-top rounded-3xl shadow-inner"
              />

              {/* Floating Badge 1: 82% Placement Ready (Top Left) */}
              <div className="absolute top-6 -left-5 sm:-left-7 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3 shadow-xl flex items-center gap-3">
                <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                  <svg className="w-10 h-10 -rotate-90 transform">
                    <circle cx="20" cy="20" r="16" stroke="#E2E8F0" strokeWidth="3" fill="none" />
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      stroke="#165DCE"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={100}
                      strokeDashoffset={100 - (100 * 82) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-[11px] font-black text-[#102344]">82%</span>
                </div>
                <div className="flex flex-col pr-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Placement</span>
                  <span className="text-xs font-black text-[#102344]">Ready</span>
                </div>
              </div>

              {/* Floating Badge 2: 100+ Coding Problems (Bottom Right) */}
              <div className="absolute bottom-6 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#165dce] flex items-center justify-center font-bold">
                  <Code className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-[#102344]">100+</span>
                  <span className="text-[11px] font-bold text-slate-500">Coding Problems</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. FOUR-QUAD FEATURE GRID                                    */}
      {/* ============================================================ */}
      <section id="features" className="py-12 bg-[#F7F9FE] border-y border-[#E1E8F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            
            {/* Feature 1: Learn */}
            <div 
              role="button"
              tabIndex={0}
              onClick={() => {
                document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="p-6 rounded-2xl bg-white border border-[#E1E8F2] hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all flex flex-col justify-between h-full group focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer text-left"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-bold mb-4 group-hover:scale-105 group-hover:bg-blue-100 transition-all shadow-2xs">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-black text-[#102344] text-lg group-hover:text-primary transition-colors tracking-tight">
                  Learn
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Master core Data Structures, Algorithms, and modern programming with expert-curated modules.
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-primary group-hover:text-primary-700">
                <span>Explore Courses</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Feature 2: Practice */}
            <div 
              role="button"
              tabIndex={0}
              onClick={() => {
                document.getElementById('compiler')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  document.getElementById('compiler')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="p-6 rounded-2xl bg-white border border-[#E1E8F2] hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all flex flex-col justify-between h-full group focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer text-left"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-bold mb-4 group-hover:scale-105 group-hover:bg-blue-100 transition-all shadow-2xs">
                  <Code className="w-6 h-6" />
                </div>
                <h3 className="font-black text-[#102344] text-lg group-hover:text-primary transition-colors tracking-tight">
                  Practice
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Solve real interview coding problems with instant test-case feedback in our browser compiler.
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-primary group-hover:text-primary-700">
                <span>Open Compiler</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Feature 3: Assess */}
            <div 
              role="button"
              tabIndex={0}
              onClick={() => {
                document.getElementById('assessments')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  document.getElementById('assessments')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="p-6 rounded-2xl bg-white border border-[#E1E8F2] hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all flex flex-col justify-between h-full group focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer text-left"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-bold mb-4 group-hover:scale-105 group-hover:bg-blue-100 transition-all shadow-2xs">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="font-black text-[#102344] text-lg group-hover:text-primary transition-colors tracking-tight">
                  Assess
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Simulate campus recruitment rounds with timed tests, negative markings, and instant evaluation.
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-primary group-hover:text-primary-700">
                <span>Take Mock Tests</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Feature 4: Improve */}
            <div 
              role="button"
              tabIndex={0}
              onClick={() => {
                document.getElementById('companies')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  document.getElementById('companies')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="p-6 rounded-2xl bg-white border border-[#E1E8F2] hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all flex flex-col justify-between h-full group focus:outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer text-left"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-bold mb-4 group-hover:scale-105 group-hover:bg-blue-100 transition-all shadow-2xs">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-black text-[#102344] text-lg group-hover:text-primary transition-colors tracking-tight">
                  Improve
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Target interview blueprints and company-specific past questions for Tier-1 dream companies.
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-primary group-hover:text-primary-700">
                <span>Company Blueprints</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. POPULAR COURSES SECTION (id="courses")                     */}
      {/* ============================================================ */}
      <section id="courses" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-primary-700 text-xs font-black uppercase mb-2 border border-blue-100">
              <BookOpen className="w-3.5 h-3.5" />
              Curated Curriculum
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#102344] tracking-tight">
              Popular Courses
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Build strong fundamentals and get placement-ready with comprehensive structured courses.
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary-700 transition-colors shrink-0"
          >
            <span>View all courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(() => {
            const fallbackList = [
              {
                _id: 'dsa-cpp',
                title: 'Data Structures & Algorithms in C++',
                description: 'Master core DSA concepts and problem solving across Arrays, Trees, Graphs, and Dynamic Programming.',
                category: 'Data Structures',
                level: 'Beginner to Advanced',
                modulesCount: '12 Modules · 48 Lessons',
                icon: <Layers className="w-5 h-5" />,
              },
              {
                _id: 'fullstack-web',
                title: 'Modern Full-Stack Web Development',
                description: 'Build enterprise-grade web applications using React, Node.js, Express, and MongoDB with modern practices.',
                category: 'Full-Stack',
                level: 'Intermediate to Advanced',
                modulesCount: '10 Modules · 42 Lessons',
                icon: <Code className="w-5 h-5" />,
              },
              {
                _id: 'placement-prep',
                title: 'Placement Preparation Masterclass',
                description: 'Aptitude, quantitative reasoning, technical interview rounds, mock assessments & HR communication.',
                category: 'Placement Prep',
                level: 'Comprehensive',
                modulesCount: '15 Modules · 60 Lessons',
                icon: <Briefcase className="w-5 h-5" />,
              },
            ];

            const displayCourses = courses.length > 0 
              ? courses.map((c, idx) => ({
                  _id: c._id,
                  title: c.title,
                  description: c.description,
                  category: c.category || fallbackList[idx % fallbackList.length].category,
                  level: 'Beginner to Advanced',
                  modulesCount: `${c.modulesCount || 10}+ Modules`,
                  icon: fallbackList[idx % fallbackList.length]?.icon || <Layers className="w-5 h-5" />,
                }))
              : fallbackList;

            return displayCourses.map((c: any) => {
              const enrollment = enrollments.find(
                (e: any) => e.courseId === c._id || e.courseId?._id === c._id
              );
              const isEnrolled = Boolean(enrollment);
              const progressPercentage = enrollment?.progressPercentage || 0;

              return (
                <div
                  key={c._id}
                  className="bg-white rounded-2xl border border-[#E1E8F2] p-6 shadow-xs hover:shadow-md hover:border-primary-200 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Icon & Category Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 text-primary flex items-center justify-center font-bold shadow-2xs group-hover:scale-105 transition-transform">
                        {c.icon}
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-primary-700 border border-blue-100">
                        {c.category}
                      </span>
                    </div>

                    <h3 className="font-black text-[#102344] text-lg tracking-tight mb-2 group-hover:text-primary transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>

                    {/* Metadata row */}
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-3 pt-3 border-t border-slate-100">
                      <span className="font-semibold text-slate-500">⚡ {c.level}</span>
                      <span className="font-bold text-slate-800">{c.modulesCount}</span>
                    </div>

                    {/* Progress Bar ONLY for enrolled students */}
                    {isEnrolled ? (
                      <div className="mb-4">
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1">
                          <div
                            className="bg-[#165DCE] h-2 rounded-full transition-all"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <div className="text-right text-[11px] font-bold text-slate-600">
                          {progressPercentage}% Curriculum Completed
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                        <div className="flex items-center gap-1 font-semibold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>4.9</span>
                          <span className="text-slate-400 font-normal">(1.2k learners)</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Certificate Included</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Strong blue primary CTA button */}
                  <Link
                    to={isEnrolled ? `/student/learn/${c._id}` : `/courses/${c._id}`}
                    className="w-full py-3 px-4 text-center rounded-xl bg-[#165DCE] hover:bg-[#124cb0] text-white font-extrabold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    <span>{isEnrolled ? 'Continue Learning' : 'Explore Curriculum'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            });
          })()}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. ONLINE COMPILER & PRACTICE SANDBOX (id="compiler" & "practice") */}
      {/* ============================================================ */}
      <section id="compiler" className="py-16 bg-[#0b1c30] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Compiler Specs & Value */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>Multi-Language Sandboxed IDE</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Code, compile, and debug <br />
                directly in your browser.
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed">
                Practice 100+ Data Structures & Algorithms challenges with native execution for 
                <span className="text-amber-300 font-semibold"> Python</span>, 
                <span className="text-blue-300 font-semibold"> C++</span>, 
                <span className="text-orange-300 font-semibold"> Java</span>, 
                <span className="text-cyan-300 font-semibold"> C</span>, and 
                <span className="text-yellow-300 font-semibold"> JavaScript</span>.
              </p>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>Instant sandboxed execution with custom test inputs</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>Real-time memory, execution time, and error diagnostics</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span>Curated company questions from Google, Amazon & Microsoft</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to={isAuthenticated ? "/student/compiler" : "/login"}
                  className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Launch Full Online Compiler</span>
                </Link>
                <Link
                  to={isAuthenticated ? "/student/problems" : "/login"}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all flex items-center gap-2"
                >
                  <Code className="w-4 h-4" />
                  <span>Solve 100+ Problems</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Live Interactive Compiler Widget */}
            <div id="practice" className="lg:col-span-7 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
              
              {/* Window Header */}
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono text-slate-400 ml-2">sandbox-eval.io</span>
                </div>

                {/* Language Selectors */}
                <div className="flex items-center gap-1.5">
                  {(['python', 'java', 'cpp', 'javascript'] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => handleLangSwitch(l)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono uppercase font-bold transition-colors cursor-pointer ${
                        activeLang === l
                          ? 'bg-primary-600 text-white shadow-xs'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {l === 'cpp' ? 'CPP' : l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Area with Real-Time Syntax Highlighting */}
              <div className="bg-slate-900/90 font-mono text-xs text-slate-200 min-h-[220px]">
                <SmartCodeEditor
                  value={demoCode}
                  onChange={setDemoCode}
                  language={activeLang}
                  placeholder="Type your code here..."
                  className="w-full h-56"
                />
              </div>

              {/* Custom Input (Multiple Inputs / Stdin) Section */}
              <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800/90">
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold text-slate-200">Custom Input (Stdin):</span>
                    <span className="text-[10px] text-slate-500 font-mono">Multi-line enabled</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSandboxInput('18\n2 7 11 15')}
                      className="text-[10px] text-slate-400 hover:text-emerald-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono transition-colors cursor-pointer"
                      title="Load multiple inputs on multiple lines"
                    >
                      Sample 1 (18)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSandboxInput('26\n2 7 11 15')}
                      className="text-[10px] text-slate-400 hover:text-emerald-300 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono transition-colors cursor-pointer"
                      title="Load multiple inputs on multiple lines"
                    >
                      Sample 2 (26)
                    </button>
                    {sandboxInput && (
                      <button
                        type="button"
                        onClick={() => setSandboxInput('')}
                        className="text-[10px] text-slate-500 hover:text-rose-400 font-mono transition-colors cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                <textarea
                  value={sandboxInput}
                  onChange={(e) => setSandboxInput(e.target.value)}
                  rows={2}
                  placeholder={`Enter multiple inputs across lines or space-separated...\nExample:\n13\n2 7 11 15`}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-emerald-300 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/70 transition-colors resize-y leading-relaxed"
                  spellCheck={false}
                />
              </div>

              {/* Action Bar */}
              <div className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span>
                    Input Stream:{' '}
                    {sandboxInput.trim()
                      ? `${sandboxInput.trim().split(/\s+/).length} token(s) · ${sandboxInput.trim().split('\n').length} line(s)`
                      : 'Empty (Defaults to target=13, [2, 7, 11, 15])'}
                  </span>
                </div>
                <button
                  onClick={runDemoSandbox}
                  disabled={executing}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm hover:shadow-emerald-500/20"
                >
                  <Play className="w-3 h-3 fill-white" />
                  {executing ? 'Executing...' : 'Run In Sandbox'}
                </button>
              </div>

              {/* Output Terminal */}
              <div className="p-4 bg-black/60 border-t border-slate-800/80 font-mono text-xs">
                <div className="text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  Execution Console Output:
                </div>
                <pre className="text-slate-300 font-mono whitespace-pre-wrap">{demoOutput}</pre>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. ASSESSMENTS & MOCK TESTS (id="assessments")               */}
      {/* ============================================================ */}
      <section id="assessments" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-primary-700 text-xs font-black uppercase mb-2 border border-blue-100">
            <FileCheck className="w-3.5 h-3.5" />
            Timed Technical Testing
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#102344] tracking-tight">
            Industry Standard Technical Assessments
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Simulate actual campus recruitment tests with timed quizzes, negative scoring, automated evaluation, and detailed explanations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(() => {
            const fallbackAssessments = [
              {
                _id: 'dsa-mock',
                title: 'Data Structures & Core Algorithms',
                category: 'DSA Fundamentals',
                difficulty: 'Hard',
                description: 'Test your algorithmic knowledge across complexities, arrays, hash maps, trees, and dynamic programming.',
                durationMinutes: 45,
                totalQuestions: 25,
                passingScore: 70,
                negativeMarking: '+1 / -0.25 Mark',
              },
              {
                _id: 'aptitude-mock',
                title: 'Quantitative & Logical Aptitude',
                category: 'Placement Aptitude',
                difficulty: 'Medium',
                description: 'Speed problem-solving covering permutations, probability, profit & loss, work, and logical deduction puzzles.',
                durationMinutes: 60,
                totalQuestions: 30,
                passingScore: 65,
                negativeMarking: 'No Negative Marking',
              },
              {
                _id: 'cs-mock',
                title: 'Operating Systems & DBMS Architecture',
                category: 'Core Engineering',
                difficulty: 'Medium',
                description: 'Crucial product company questions covering ACID properties, indexing, memory management, and threads.',
                durationMinutes: 40,
                totalQuestions: 20,
                passingScore: 75,
                negativeMarking: '+1 / -0.25 Mark',
              },
            ];

            const displayAssessments = dbAssessments.length > 0
              ? dbAssessments.map((dbA, idx) => ({
                  _id: dbA._id,
                  title: dbA.title,
                  category: dbA.category || fallbackAssessments[idx % fallbackAssessments.length].category,
                  difficulty: dbA.difficulty || fallbackAssessments[idx % fallbackAssessments.length].difficulty,
                  description: dbA.description || fallbackAssessments[idx % fallbackAssessments.length].description,
                  durationMinutes: dbA.durationMinutes || 45,
                  totalQuestions: dbA.questions?.length || fallbackAssessments[idx % fallbackAssessments.length].totalQuestions,
                  passingScore: dbA.passingScore || 70,
                  negativeMarking: fallbackAssessments[idx % fallbackAssessments.length].negativeMarking,
                }))
              : fallbackAssessments;

            return displayAssessments.map((a: any) => (
              <div
                key={a._id || a.title}
                className="bg-white rounded-2xl border border-[#E1E8F2] p-6 shadow-xs hover:shadow-md hover:border-primary-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top category & difficulty */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-blue-50 text-primary-700 font-bold text-xs rounded-lg border border-blue-100">
                      {a.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                        a.difficulty === 'Hard' || a.difficulty === 'Very Hard'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                          : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                      }`}
                    >
                      {a.difficulty}
                    </span>
                  </div>

                  <h3 className="font-black text-[#102344] text-lg tracking-tight mb-2 group-hover:text-primary transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                    {a.description}
                  </p>

                  {/* Metadata Specs Grid */}
                  <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-[#F7F9FE] rounded-xl border border-slate-100 text-xs mb-5">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
                        <span className="font-extrabold text-slate-700">{a.durationMinutes} Mins</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Questions</span>
                        <span className="font-extrabold text-slate-700">{a.totalQuestions} MCQs</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Cutoff</span>
                        <span className="font-extrabold text-emerald-700">{a.passingScore}% Score</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Marking</span>
                        <span className="font-extrabold text-slate-700 text-[11px] truncate">
                          {a.negativeMarking}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clearly Visible Start Assessment Button */}
                <Link
                  to={
                    isAuthenticated
                      ? a._id && !a._id.includes('-')
                        ? `/student/assessments/${a._id}/take`
                        : '/student/assessments'
                      : '/login?redirect=/student/assessments'
                  }
                  className="w-full py-3 px-5 text-center bg-[#165DCE] hover:bg-[#124cb0] text-white font-extrabold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <span>Start Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ));
          })()}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. TOP HIRING COMPANIES (id="companies")                      */}
      {/* ============================================================ */}
      <section id="companies" className="py-10 bg-slate-50/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-primary-700 text-xs font-black uppercase mb-1.5 border border-blue-100">
                <Building2 className="w-3.5 h-3.5" />
                Target Placement Drives
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#102344] tracking-tight">
                Top Hiring Companies
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Prepare for your dream company with company-specific questions, past rounds, and interview guidance.
              </p>
            </div>
            <Link
              to="/companies"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            >
              <span>View All Company Profiles</span>
              <ArrowRight className="w-4 h-4 text-primary-600" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {(() => {
              const defaultCompanies = [
                { name: 'Google', slug: 'google', roles: 'Software Engineer L3', tech: 'DSA & Scalability', comp: '₹28 - 45 LPA' },
                { name: 'Microsoft', slug: 'microsoft', roles: 'SDE-1 · Azure', tech: 'Trees, OOP & LLD', comp: '₹22 - 42 LPA' },
                { name: 'Amazon', slug: 'amazon', roles: 'SDE-1 · AWS Cloud', tech: 'Graphs & 16 LPs', comp: '₹24 - 44 LPA' },
                { name: 'TCS', slug: 'tcs', roles: 'Digital & Prime', tech: 'NQT & Core CS', comp: '₹3.6 - 9 LPA' },
                { name: 'Infosys', slug: 'infosys', roles: 'Specialist Prog.', tech: 'InfyTQ & DBMS', comp: '₹3.6 - 9.5 LPA' },
                { name: 'Deloitte', slug: 'deloitte', roles: 'Analyst - Consulting', tech: 'SQL & Problem Solving', comp: '₹4.5 - 12 LPA' },
              ];

              const list = defaultCompanies.map((def) => {
                const found = dbCompanies.find(
                  (c) => c.slug?.toLowerCase() === def.slug || c.name?.toLowerCase().includes(def.slug)
                );
                if (found) {
                  return {
                    name: found.name,
                    slug: found.slug,
                    roles: found.hiringRoles?.[0] || def.roles,
                    tech: found.frequentlyAskedTopics?.[0] || def.tech,
                    comp: found.salaryRange || def.comp,
                  };
                }
                return def;
              });

              return list.map((company) => (
                <Link
                  key={company.slug}
                  to={`/companies?company=${company.slug}`}
                  className="bg-white hover:bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/90 hover:border-primary-300 hover:shadow-md transition-all flex flex-col justify-between group text-left focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                >
                  <div>
                    {/* Top Row: Uniform Logo Container & Badge */}
                    <div className="flex items-center justify-between mb-3.5">
                      <CompanyLogo name={company.name} slug={company.slug} size="md" />
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-primary-700 border border-blue-100/80">
                        Hiring
                      </span>
                    </div>

                    {/* 1. Company Name First */}
                    <h3 className="font-extrabold text-[#102344] text-base group-hover:text-primary transition-colors tracking-tight">
                      {company.name}
                    </h3>

                    {/* 2. Interview Role and Technology Focus Second */}
                    <p className="text-xs font-semibold text-slate-700 mt-1 line-clamp-1">
                      {company.roles}
                    </p>
                    <div className="mt-1.5">
                      <span className="inline-block text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md line-clamp-1">
                        {company.tech}
                      </span>
                    </div>
                  </div>

                  {/* 3. Indicative Salary Information Third */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        Indicative CTC
                      </span>
                      <span className="text-xs font-black text-emerald-700">
                        {company.comp}
                      </span>
                    </div>

                    {/* View Preparation Guide Action */}
                    <div className="flex items-center justify-between text-xs font-bold text-primary group-hover:text-primary-700 pt-2 border-t border-slate-50">
                      <span>View Prep Guide</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. CONTACT & SUPPORT SECTION (id="contact")                  */}
      {/* ============================================================ */}
      <section id="contact" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-primary-700 text-xs font-black uppercase mb-2 border border-blue-100">
            <Mail className="w-3.5 h-3.5" />
            Direct Contact & Support
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#102344] tracking-tight">
            Get in Touch with the DreamLearn Team
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Have questions about structured courses, online coding environments, placement drives, or campus partnerships? We are here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contact Channels & Quick Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Student & Academic Support */}
            <div className="bg-white rounded-2xl border border-[#E1E8F2] p-5 shadow-xs hover:border-primary-200 transition-all">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#165DCE] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-extrabold text-[#102344] text-sm">Academic & Student Support</h3>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 shrink-0">
                      &lt;24h reply
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Course queries, coding compiler errors, lesson access, and technical doubts.
                  </p>
                  <a
                    href="mailto:support@dreamlearn.edu"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#165DCE] hover:text-[#124cb0] mt-2 group"
                  >
                    <span>support@dreamlearn.edu</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>

            {/* Campus & Placement Partnerships */}
            <div className="bg-white rounded-2xl border border-[#E1E8F2] p-5 shadow-xs hover:border-primary-200 transition-all">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-extrabold text-[#102344] text-sm">Campus & TPO Partnerships</h3>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 shrink-0">
                      Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    College Training & Placement Officers, campus drives, and bulk student onboarding.
                  </p>
                  <a
                    href="mailto:partnerships@dreamlearn.edu"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#165DCE] hover:text-[#124cb0] mt-2 group"
                  >
                    <span>partnerships@dreamlearn.edu</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>

            {/* Official Instagram Community */}
            <div className="bg-white rounded-2xl border border-[#E1E8F2] p-5 shadow-xs hover:border-primary-200 transition-all">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-extrabold text-[#102344] text-sm">Official Instagram</h3>
                    <span className="text-[10px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100 shrink-0">
                      @dreamlearn._
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Daily coding challenges, student placement highlights, and feature updates.
                  </p>
                  <a
                    href="https://www.instagram.com/dreamlearn._/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#165DCE] hover:text-[#124cb0] mt-2 group"
                  >
                    <span>Follow @dreamlearn._ on Instagram</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>

            {/* Operating Hours Note */}
            <div className="p-4 rounded-xl bg-[#F7F9FE] border border-[#E1E8F2] text-xs text-slate-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Mon – Sat: 9:00 AM – 7:00 PM IST</span>
              </div>
              <Link
                to="/contact"
                className="text-[11px] font-bold text-[#165DCE] hover:underline"
              >
                Full Contact Directory &rarr;
              </Link>
            </div>

          </div>

          {/* Right Column: Direct Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E1E8F2] p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <h3 className="text-lg font-black text-[#102344] tracking-tight">
                Send Us a Direct Message
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Fill in your details below and our team will get back to you shortly.
              </p>
            </div>

            {contactSent ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-emerald-900">Message Received!</h4>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. We have received your inquiry and our academic support team will respond to your email within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setContactSent(false)}
                  className="mt-2 text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#165DCE] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="you@college.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#165DCE] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Topic / Category
                  </label>
                  <select
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#165DCE] focus:border-transparent transition-all"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Course Curriculum & Content">Course Curriculum & Learning Path</option>
                    <option value="Online Compiler Issue">Online Compiler & Code Sandbox Issue</option>
                    <option value="Assessment & Scoring">Technical Assessment & Scores</option>
                    <option value="Campus Placement Partnerships">Campus Placement Drives / TPO Inquiry</option>
                    <option value="Account & Login Assistance">Student Account & Access</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe how we can help you with your learning or placement preparation..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#165DCE] focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-[11px] text-slate-400">
                    We respect your privacy. No marketing spam.
                  </p>
                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#165DCE] hover:bg-[#124cb0] text-white font-extrabold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{contactSubmitting ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. BOTTOM CTA BANNER (id="cta")                              */}
      {/* ============================================================ */}
      <section id="cta" className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#165DCE] rounded-3xl py-12 px-6 sm:px-12 text-white text-center shadow-xl relative overflow-hidden border border-blue-400/25">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
              Ready to land your dream tech job?
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              Join thousands of engineering students preparing for campus placements with structured courses, coding practice, and mock tests.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                to={isAuthenticated ? "/student/learning" : "/register"}
                className="px-7 py-3 bg-white text-[#165DCE] font-extrabold rounded-xl text-sm shadow-md hover:bg-blue-50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-white/40 cursor-pointer"
              >
                Start Learning Free
              </Link>
              <Link
                to={isAuthenticated ? "/student/dashboard" : "/login"}
                className="px-7 py-3 bg-white/10 hover:bg-white/20 border border-white/80 hover:border-white text-white font-bold rounded-xl text-sm transition-all focus:outline-none focus:ring-4 focus:ring-white/40 cursor-pointer"
              >
                {isAuthenticated ? "Go to Dashboard" : "Sign In to Account"}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
