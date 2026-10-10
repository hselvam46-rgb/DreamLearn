import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Course, Module, Lesson } from '../../types';
import { 
  PlusCircle, 
  Trash2, 
  Edit, 
  ArrowLeft, 
  Play, 
  FileText, 
  Code, 
  Layers, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';

export const AdminCurriculumPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [curriculum, setCurriculum] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editModule, setEditModule] = useState<Module | null>(null);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDesc, setModuleDesc] = useState('');

  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [lessonData, setLessonData] = useState({
    title: '',
    description: '',
    contentType: 'article' as 'article' | 'video' | 'code' | 'pdf',
    contentText: '',
    videoUrl: '',
    pdfUrl: '',
    codeSnippet: '',
    codeLanguage: 'cpp',
    durationMinutes: 15,
    isPreview: false,
  });

  const fetchCurriculum = () => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      api.courses.getDetails(id),
      api.courses.getCurriculum(id),
    ])
      .then(([cRes, curRes]) => {
        if (cRes.course) setCourse(cRes.course);
        if (curRes.curriculum) setCurriculum(curRes.curriculum);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCurriculum();
  }, [id]);

  // Module Submit
  const handleModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      if (editModule) {
        await api.admin.updateModule(editModule._id, { title: moduleTitle, description: moduleDesc });
      } else {
        await api.admin.createModule(id, { title: moduleTitle, description: moduleDesc });
      }
      setModuleModalOpen(false);
      fetchCurriculum();
    } catch (err: any) {
      alert(err.message || 'Module operation failed');
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module and all its lessons?')) return;
    try {
      await api.admin.deleteModule(moduleId);
      fetchCurriculum();
    } catch (err: any) {
      alert(err.message || 'Failed to delete module');
    }
  };

  // Lesson Submit
  const handleOpenAddLesson = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setEditLesson(null);
    setLessonData({
      title: '',
      description: '',
      contentType: 'article',
      contentText: '',
      videoUrl: '',
      pdfUrl: '',
      codeSnippet: '',
      codeLanguage: 'cpp',
      durationMinutes: 15,
      isPreview: false,
    });
    setLessonModalOpen(true);
  };

  const handleOpenEditLesson = (lesson: Lesson) => {
    setActiveModuleId(lesson.moduleId);
    setEditLesson(lesson);
    setLessonData({
      title: lesson.title,
      description: lesson.description || '',
      contentType: lesson.contentType as any,
      contentText: lesson.contentText || '',
      videoUrl: lesson.videoUrl || '',
      pdfUrl: lesson.pdfUrl || '',
      codeSnippet: lesson.codeSnippet || '',
      codeLanguage: lesson.codeLanguage || 'cpp',
      durationMinutes: lesson.durationMinutes || 15,
      isPreview: lesson.isPreview || false,
    });
    setLessonModalOpen(true);
  };

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !activeModuleId) return;

    try {
      if (editLesson) {
        await api.admin.updateLesson(editLesson._id, lessonData);
      } else {
        await api.admin.createLesson(id, activeModuleId, lessonData);
      }
      setLessonModalOpen(false);
      fetchCurriculum();
    } catch (err: any) {
      alert(err.message || 'Lesson operation failed');
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Delete this lesson?')) return;
    try {
      await api.admin.deleteLesson(lessonId);
      fetchCurriculum();
    } catch (err: any) {
      alert(err.message || 'Failed to delete lesson');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Top Breadcrumb & Action */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <Link
            to="/admin/courses"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Courses</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Curriculum Builder: {course?.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize modules, arrange lessons, and provide code snippets without changing codebase.
          </p>
        </div>

        <button
          onClick={() => {
            setEditModule(null);
            setModuleTitle('');
            setModuleDesc('');
            setModuleModalOpen(true);
          }}
          className="px-5 py-2.5 bg-[#165DCE] hover:bg-[#124cb0] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Module</span>
        </button>
      </div>

      {/* Curriculum Module Stack */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : curriculum.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-3">
          <Layers className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No curriculum modules yet</h3>
          <p className="text-xs text-slate-500">Click 'Add New Module' above to begin building lessons.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {curriculum.map((mod, modIdx) => (
            <div key={mod._id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              
              {/* Module Header Bar */}
              <div className="p-5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-primary-container text-xs font-extrabold flex items-center justify-center">
                    {modIdx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{mod.title}</h3>
                    {mod.description && <p className="text-xs text-slate-500">{mod.description}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenAddLesson(mod._id)}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:border-primary-container text-primary-container rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Lesson</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditModule(mod);
                      setModuleTitle(mod.title);
                      setModuleDesc(mod.description || '');
                      setModuleModalOpen(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg"
                    title="Edit Module"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteModule(mod._id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Delete Module"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Lessons Sub-list */}
              <div className="p-4 divide-y divide-slate-100">
                {(!mod.lessons || mod.lessons.length === 0) ? (
                  <p className="py-4 text-center text-xs text-slate-400 italic">No lessons in this module yet.</p>
                ) : (
                  mod.lessons.map((lesson) => (
                    <div key={lesson._id} className="py-3 px-2 flex items-center justify-between text-xs hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="flex items-center gap-3">
                        {lesson.contentType === 'video' ? (
                          <Play className="w-4 h-4 text-purple-600" />
                        ) : lesson.contentType === 'pdf' ? (
                          <FileText className="w-4 h-4 text-amber-600" />
                        ) : lesson.contentType === 'code' ? (
                          <Code className="w-4 h-4 text-blue-600" />
                        ) : (
                          <FileText className="w-4 h-4 text-slate-500" />
                        )}
                        <div>
                          <span className="font-bold text-slate-900 block">{lesson.title}</span>
                          <span className="text-[11px] text-slate-400">
                            {lesson.durationMinutes} mins • {lesson.contentType}
                            {lesson.isPreview && ' • Free Preview'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditLesson(lesson)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 rounded"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson._id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Module Modal */}
      {moduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900">
              {editModule ? 'Edit Module' : 'Create Curriculum Module'}
            </h3>

            <form onSubmit={handleModuleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-900 block">Module Title</label>
                <input
                  type="text"
                  required
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  placeholder="e.g. Module 1: Algorithmic Foundations"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900 block">Module Description</label>
                <textarea
                  rows={2}
                  value={moduleDesc}
                  onChange={(e) => setModuleDesc(e.target.value)}
                  placeholder="Overview of this module's objectives..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModuleModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#165DCE] hover:bg-[#124cb0] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {lessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-extrabold text-slate-900">
              {editLesson ? 'Edit Lesson' : 'Add New Lesson'}
            </h3>

            <form onSubmit={handleLessonSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-900 block">Lesson Title</label>
                <input
                  type="text"
                  required
                  value={lessonData.title}
                  onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                  placeholder="e.g. 1.1 Introduction to Time Complexity"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-900 block">Content Type</label>
                  <select
                    value={lessonData.contentType}
                    onChange={(e) => setLessonData({ ...lessonData, contentType: e.target.value as any })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="article">Article / Reading Notes</option>
                    <option value="video">Video Lecture (Embed / URL)</option>
                    <option value="pdf">PDF Lecture Notes / Slides Document</option>
                    <option value="code">Code Walkthrough / Compiler</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900 block">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={lessonData.durationMinutes}
                    onChange={(e) => setLessonData({ ...lessonData, durationMinutes: Number(e.target.value) })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Video URL Input */}
              {(lessonData.contentType === 'video' || lessonData.videoUrl) && (
                <div className="space-y-1 p-3 bg-purple-50/70 border border-purple-200 rounded-xl">
                  <label className="font-bold text-purple-950 block">Video URL (YouTube, Vimeo, MP4)</label>
                  <input
                    type="url"
                    value={lessonData.videoUrl}
                    onChange={(e) => setLessonData({ ...lessonData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full h-9 px-3 bg-white border border-purple-300 rounded-lg text-xs font-mono"
                  />
                </div>
              )}

              {/* PDF Document URL Input */}
              {(lessonData.contentType === 'pdf' || lessonData.pdfUrl) && (
                <div className="space-y-1 p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <label className="font-bold text-amber-950 block">PDF Notes / Slides Document URL</label>
                  <input
                    type="url"
                    value={lessonData.pdfUrl}
                    onChange={(e) => setLessonData({ ...lessonData, pdfUrl: e.target.value })}
                    placeholder="https://example.com/lecture-notes.pdf"
                    className="w-full h-9 px-3 bg-white border border-amber-300 rounded-lg text-xs font-mono"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-slate-900 block">Lesson Content (Markdown / Article Notes)</label>
                <textarea
                  rows={3}
                  value={lessonData.contentText}
                  onChange={(e) => setLessonData({ ...lessonData, contentText: e.target.value })}
                  placeholder="Detailed instructional notes, summary, and links..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-900 block">Code Snippet (Optional)</label>
                <textarea
                  rows={3}
                  value={lessonData.codeSnippet}
                  onChange={(e) => setLessonData({ ...lessonData, codeSnippet: e.target.value })}
                  placeholder="// Paste sample code here..."
                  className="w-full p-3 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="preview-check"
                  checked={lessonData.isPreview}
                  onChange={(e) => setLessonData({ ...lessonData, isPreview: e.target.checked })}
                  className="w-4 h-4 rounded text-primary-container"
                />
                <label htmlFor="preview-check" className="font-semibold text-slate-700 cursor-pointer">
                  Mark as Free Preview lesson (Accessible to non-enrolled visitors)
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setLessonModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#165DCE] hover:bg-[#124cb0] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
