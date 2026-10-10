import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { AssessmentAttempt } from '../../types';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  ArrowLeft, 
  RotateCcw, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AssessmentResultPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!attemptId) return;
    setLoading(true);

    api.assessments.getAttemptDetails(attemptId)
      .then((res) => {
        if (res.attempt) {
          setAttempt(res.attempt);
          if (res.attempt.passed) {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold">Attempt record not found.</h2>
        <Link to="/student/assessments" className="mt-4 inline-block text-primary-container font-bold">
          ← Back to Assessments
        </Link>
      </div>
    );
  }

  const assessment = attempt.assessmentId as any;
  const timeMinutes = Math.floor((attempt.timeSpentSeconds || 0) / 60);
  const timeSeconds = (attempt.timeSpentSeconds || 0) % 60;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/student/assessments"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-container transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Assessments</span>
        </Link>

        <span className="text-xs text-slate-400">
          Submitted on {new Date(attempt.submittedAt || Date.now()).toLocaleDateString()}
        </span>
      </div>

      {/* Scorecard Hero Banner */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-10 shadow-lg text-center relative overflow-hidden">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4 shadow-2xs">
          {attempt.passed ? (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Assessment Passed Successfully</span>
            </span>
          ) : (
            <span className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Passing Score Not Met</span>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102344]">
          {assessment?.title || 'Assessment Results'}
        </h1>

        {/* Circular Percentage Ring or Big Metric */}
        <div className="my-8 flex justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-36 h-36 -rotate-90 transform">
              <circle cx="72" cy="72" r="60" stroke="#E2E8F0" strokeWidth="10" fill="none" />
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke={attempt.passed ? '#10B981' : '#EF4444'}
                strokeWidth="10"
                fill="none"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * attempt.percentage) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-[#102344]">{attempt.percentage}%</span>
              <span className="text-[11px] font-bold text-slate-400">Score</span>
            </div>
          </div>
        </div>

        {/* Metric stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-surface rounded-2xl border border-slate-200 max-w-2xl mx-auto text-xs">
          <div>
            <span className="text-slate-400 block font-semibold">Correct Answers</span>
            <span className="text-base font-extrabold text-[#102344]">
              {attempt.correctCount} / {attempt.totalQuestions}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Score Points</span>
            <span className="text-base font-extrabold text-[#102344]">
              {attempt.score} / {attempt.totalPoints}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Passing Standard</span>
            <span className="text-base font-extrabold text-[#102344]">{assessment?.passingScore || 70}%</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Time Spent</span>
            <span className="text-base font-extrabold text-[#102344]">
              {timeMinutes}m {timeSeconds}s
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-8 flex flex-wrap justify-center gap-3">
          <Link
            to={`/student/assessments/${assessment?._id}/take`}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#165DCE] hover:bg-[#124cb0] shadow-md transition-all flex items-center gap-2 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Assessment</span>
          </Link>

          <Link
            to="/student/dashboard"
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
          >
            Back to Dashboard
          </Link>
        </div>

      </div>

      {/* Question by Question Review */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-[#102344] px-1">
          Detailed Question Review & Explanations
        </h2>

        <div className="space-y-4">
          {attempt.answers?.map((ans, idx) => {
            const question = ans.questionId as any;
            if (!question) return null;

            return (
              <div
                key={question._id || idx}
                className={`bg-white rounded-2xl border p-6 space-y-4 shadow-xs transition-all ${
                  ans.isCorrect ? 'border-emerald-200' : 'border-rose-200'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                      Q{idx + 1}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Topic: {question.topic}</span>
                  </div>

                  {ans.isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+{question.points || 1} pts)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect (0 pts)
                    </span>
                  )}
                </div>

                <p className="text-sm font-bold text-[#102344] leading-relaxed">
                  {question.text}
                </p>

                {/* Range Question Review */}
                {question.type === 'range' && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-sans">Your Submitted Numerical Answer:</span>
                      <span className={`font-bold px-2.5 py-0.5 rounded-lg ${ans.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {ans.selectedOptionId || '(No answer provided)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                      <span className="font-sans">Acceptable Correct Range:</span>
                      <span className="font-bold text-slate-800">
                        {question.exactAnswer !== undefined && question.exactAnswer !== null
                          ? `${question.exactAnswer} ± ${question.tolerance || 0} [${Number(question.exactAnswer) - Number(question.tolerance || 0)} to ${Number(question.exactAnswer) + Number(question.tolerance || 0)}]`
                          : `[ ${question.rangeMin} — ${question.rangeMax} ]`}
                      </span>
                    </div>
                  </div>
                )}

                {/* Coding Question Review */}
                {question.type === 'coding' && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">Code Evaluation Status:</span>
                      <span className={`font-bold px-2 py-0.5 rounded ${ans.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {ans.isCorrect ? 'All Test Cases Passed' : 'Test Cases Incomplete / Failed'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Options List for MCQ & Case Based */}
                {(question.type === 'mcq' || question.type === 'case_based' || (!question.type && question.options?.length > 0)) && (
                  <div className="space-y-2 pt-1">
                    {question.options?.map((opt: any) => {
                      const isUserChoice = ans.selectedOptionId === opt.id;
                      const isCorrectAnswer = question.correctAnswerId === opt.id;

                      let optStyle = 'border-slate-200 bg-white text-slate-700';
                      if (isCorrectAnswer) {
                        optStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-bold';
                      } else if (isUserChoice && !ans.isCorrect) {
                        optStyle = 'border-rose-500 bg-rose-50/80 text-rose-900 line-through';
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between ${optStyle}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-md bg-white border border-slate-200 font-bold text-[10px] flex items-center justify-center shrink-0">
                              {opt.id.toUpperCase()}
                            </span>
                            <span>{opt.text}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isUserChoice && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                                Your Answer
                              </span>
                            )}
                            {isCorrectAnswer && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800">
                                Correct Key
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Explanation text */}
                {question.explanation && (
                  <div className="mt-3 p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-primary-container block flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" /> Explanation:
                    </span>
                    <p className="leading-relaxed">{question.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
