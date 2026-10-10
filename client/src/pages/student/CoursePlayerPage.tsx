import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Course, Module, Lesson } from '../../types';
import { 
  CheckCircle, 
  Circle, 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  FileText, 
  Code, 
  Menu, 
  X, 
  Terminal,
  ExternalLink,
  Award,
  Download,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

const formatVideoEmbedUrl = (url?: string): string => {
  if (!url) return '';
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
};

export const CoursePlayerPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [curriculum, setCurriculum] = useState<Module[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'syllabus' | 'notes'>('syllabus');
  const [savingProgress, setSavingProgress] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);

    Promise.all([
      api.courses.getDetails(courseId),
      api.courses.getCourseProgress(courseId),
    ])
      .then(([courseRes, progressRes]) => {
        if (courseRes.course) {
          setCourse(courseRes.course);
          setCurriculum(courseRes.curriculum || []);
          if (progressRes.completedLessonIds) {
            setCompletedLessonIds(progressRes.completedLessonIds);
          }

          // Pick active lesson: first uncompleted or first available
          const allLessons = (courseRes.curriculum || []).flatMap((m: Module) => m.lessons || []);
          const firstUncompleted = allLessons.find((l: Lesson) => !(progressRes.completedLessonIds || []).includes(l._id));
          setCurrentLesson(firstUncompleted || allLessons[0] || null);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [courseId]);

  const allLessons = curriculum.flatMap((m) => m.lessons || []);
  const currentIndex = allLessons.findIndex((l) => l._id === currentLesson?._id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const isCurrentCompleted = currentLesson ? completedLessonIds.includes(currentLesson._id) : false;

  const handleToggleComplete = async () => {
    if (!currentLesson || savingProgress) return;
    setSavingProgress(true);

    const willBeCompleted = !isCurrentCompleted;
    try {
      const res = await api.courses.toggleLesson(currentLesson._id, willBeCompleted);
      if (willBeCompleted) {
        setCompletedLessonIds((prev) => [...prev, currentLesson._id]);
        if (res.progressPercentage >= 100) {
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        }
      } else {
        setCompletedLessonIds((prev) => prev.filter((id) => id !== currentLesson._id));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update progress');
    } finally {
      setSavingProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">Course not found</h2>
        <Link to="/student/my-learning" className="mt-4 inline-block text-primary-container font-bold">
          ← Back to My Learning
        </Link>
      </div>
    );
  }

  const completionPercentage = allLessons.length > 0
    ? Math.round((completedLessonIds.length / allLessons.length) * 100)
    : 0;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background text-on-surface -m-4 sm:-m-6 lg:-m-8">
      
      {/* Top Learning Navigation Bar */}
      <div className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Link
            to="/student/my-learning"
            className="p-1.5 rounded-lg text-slate-500 hover:text-[#102344] hover:bg-slate-100"
            title="Back to My Learning"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-4 w-px bg-slate-200" />
          <h2 className="text-sm font-bold text-[#102344] truncate max-w-xs sm:max-w-md">
            {course.title}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">
              {completionPercentage}% Complete
            </span>
            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span className="hidden sm:inline">Curriculum</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Content Area + Curriculum Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left/Center Lesson Viewer */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 max-w-4xl mx-auto w-full">
          {currentLesson ? (
            <div className="space-y-6">
              
              {/* Lesson Header */}
              <div className="space-y-2 border-b border-slate-200 pb-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#165DCE]">
                    Lesson {currentLesson.order} • {currentLesson.durationMinutes} mins
                  </span>

                  <button
                    onClick={handleToggleComplete}
                    disabled={savingProgress}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isCurrentCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-[#165DCE] text-white hover:bg-[#124cb0] shadow-xs'
                    }`}
                  >
                    {isCurrentCompleted ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4" />
                        <span>Mark Complete</span>
                      </>
                    )}
                  </button>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102344]">
                  {currentLesson.title}
                </h1>
                {currentLesson.description && (
                  <p className="text-sm text-slate-500">{currentLesson.description}</p>
                )}
              </div>

              {/* Video Player if videoUrl exists */}
              {currentLesson.videoUrl && (
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                  <iframe
                    src={formatVideoEmbedUrl(currentLesson.videoUrl)}
                    title={currentLesson.title}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              )}

              {/* PDF Document Viewer if lesson has pdfUrl or is contentType === 'pdf' */}
              {(currentLesson.contentType === 'pdf' || currentLesson.pdfUrl) && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span className="font-bold text-slate-800 text-xs">Lesson Lecture PDF Notes & Slides</span>
                    </div>
                    {currentLesson.pdfUrl && (
                      <a
                        href={currentLesson.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 shadow-2xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Full Screen</span>
                      </a>
                    )}
                  </div>
                  <div className="h-[520px] w-full bg-slate-100">
                    <iframe
                      src={currentLesson.pdfUrl}
                      title="Lesson PDF"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}

              {/* Markdown / Article Text Content */}
              {currentLesson.contentText && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm whitespace-pre-line shadow-xs">
                  {currentLesson.contentText}
                </div>
              )}

              {/* Code Snippet & Interactive IDE Bridge */}
              {currentLesson.codeSnippet && (
                <div className="bg-[#0f172a] rounded-2xl overflow-hidden shadow-lg border border-slate-800">
                  <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                    <span className="font-mono font-bold text-amber-400">
                      {currentLesson.codeLanguage || 'cpp'}
                    </span>
                    <Link
                      to="/student/compiler"
                      target="_blank"
                      rel="noopener noreferrer"
                      state={{ initialCode: currentLesson.codeSnippet, initialLanguage: currentLesson.codeLanguage || 'cpp' }}
                      className="px-2.5 py-1 bg-[#165DCE] hover:bg-[#124cb0] text-white rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Open in Online Compiler</span>
                      <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                    </Link>
                  </div>
                  <pre className="p-5 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                    <code>{currentLesson.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Bottom Pagination Controls */}
              <div className="pt-8 border-t border-slate-200 flex items-center justify-between">
                {prevLesson ? (
                  <button
                    onClick={() => setCurrentLesson(prevLesson)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous Lesson</span>
                  </button>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <button
                    onClick={() => setCurrentLesson(nextLesson)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#165DCE] hover:bg-[#124cb0] flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Next Lesson</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      Course Completed!
                    </span>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-slate-500">
              Select a lesson from the curriculum sidebar to begin.
            </div>
          )}
        </div>

        {/* Right Collapsible Curriculum Drawer */}
        {sidebarOpen && (
          <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shrink-0 shadow-lg">
            {/* Tab Header: Syllabus vs PDF Notes */}
            <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center gap-1">
              <button
                onClick={() => setSidebarTab('syllabus')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                  sidebarTab === 'syllabus'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Syllabus ({allLessons.length})
              </button>
              <button
                onClick={() => setSidebarTab('notes')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  sidebarTab === 'notes'
                    ? 'bg-white text-amber-800 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>PDF Notes ({course.pdfNotes?.length || 0})</span>
              </button>
            </div>

            {sidebarTab === 'notes' ? (
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50/50">
                {!course.pdfNotes || course.pdfNotes.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p>No PDF notes attached to this course yet.</p>
                  </div>
                ) : (
                  course.pdfNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2 hover:border-amber-300 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-slate-900 leading-snug">{note.title}</span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-extrabold shrink-0">
                          {note.fileSize || 'PDF'}
                        </span>
                      </div>
                      {note.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-2">{note.description}</p>
                      )}
                      <a
                        href={note.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-lg text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Note PDF</span>
                      </a>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {curriculum.map((mod, modIdx) => (
                <div key={mod._id} className="p-3">
                  <span className="text-xs font-extrabold text-[#102344] block mb-2 px-2">
                    {modIdx + 1}. {mod.title}
                  </span>

                  <div className="space-y-1">
                    {mod.lessons?.map((lesson) => {
                      const isCompleted = completedLessonIds.includes(lesson._id);
                      const isCurrent = currentLesson?._id === lesson._id;

                      return (
                        <button
                          key={lesson._id}
                          onClick={() => setCurrentLesson(lesson)}
                          className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center gap-2.5 ${
                            isCurrent
                              ? 'bg-blue-50 text-[#165DCE] font-extrabold border-l-4 border-[#165DCE] pl-2'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                          )}
                          <span className="truncate flex-1">{lesson.title}</span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {lesson.durationMinutes}m
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      </div>

    </div>
  );
};
