import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Course, CoursePdfNote } from '../../types';
import { 
  PlusCircle, 
  BookOpen, 
  Search, 
  Layers, 
  Trash2, 
  Edit, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Video,
  FileText,
  Play,
  Download,
  Plus,
  Sparkles,
  Eye,
  Film,
  FileCheck,
  Check,
  X
} from 'lucide-react';

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

export const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);

  // Quick video preview modal
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  // Form states for Create/Edit Course
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'Data Structures',
    topic: 'C++ & Algorithms',
    difficulty: 'Beginner to Advanced' as 'Beginner' | 'Intermediate' | 'Advanced' | 'Beginner to Advanced',
    duration: '10 weeks',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=0IAPZzGSbME',
    pdfNotes: [
      {
        title: 'Complete Course Syllabus & Roadmap',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        description: 'Comprehensive week-by-week curriculum and placement preparation blueprint.',
        fileSize: '1.8 MB',
      },
      {
        title: 'Masterclass Lecture Notes & Handouts',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        description: 'Core concepts, annotated diagrams, and complexity analysis cheat sheets.',
        fileSize: '3.4 MB',
      },
    ] as CoursePdfNote[],
    learningOutcomes: 'Master Core Algorithmic Techniques\nAnalyze Big O Time & Space Complexities\nAce Product Company Technical Rounds',
    prerequisites: 'Basic Programming Fundamentals\nCuriosity to solve engineering challenges',
    instructorName: 'Prof. Raghav Sharma',
    instructorTitle: 'Lead Technical Educator & Former FAANG Staff Engineer',
    status: 'Published' as 'Draft' | 'Published' | 'Unpublished' | 'Archived',
  });

  const fetchCourses = () => {
    setLoading(true);
    api.admin.getCourses({
      search: search || undefined,
      status: statusFilter !== 'All' ? statusFilter : undefined,
    })
      .then((res) => {
        if (res.courses) setCourses(res.courses);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, [statusFilter]);

  const handleOpenCreate = () => {
    setEditCourse(null);
    setActiveStep(1);
    setFormData({
      title: '',
      shortDescription: '',
      description: '',
      category: 'Data Structures',
      topic: 'C++ & Algorithms',
      difficulty: 'Beginner to Advanced',
      duration: '10 weeks',
      thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=0IAPZzGSbME',
      pdfNotes: [
        {
          title: 'Complete Course Syllabus & Roadmap',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          description: 'Comprehensive curriculum and interview preparation blueprint.',
          fileSize: '1.8 MB',
        },
        {
          title: 'Lecture Notes & Algorithmic Cheat Sheets',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          description: 'Formulas, time complexities, and key coding interview patterns.',
          fileSize: '3.4 MB',
        },
      ],
      learningOutcomes: 'Master Core Algorithmic Techniques\nBuild High-Scale Data Structures\nCrack Top Tech Placement Interviews',
      prerequisites: 'Basic programming familiarity\nCollege standing or self-taught developer',
      instructorName: 'DreamLearn Faculty',
      instructorTitle: 'Lead Technical Instructor',
      status: 'Published',
    });
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (c: Course) => {
    setEditCourse(c);
    setActiveStep(1);
    setFormData({
      title: c.title,
      shortDescription: c.shortDescription,
      description: c.description,
      category: c.category,
      topic: c.topic,
      difficulty: c.difficulty,
      duration: c.duration,
      thumbnail: c.thumbnail,
      videoUrl: c.videoUrl || '',
      pdfNotes: c.pdfNotes && c.pdfNotes.length > 0 ? c.pdfNotes : [],
      learningOutcomes: (c.learningOutcomes || []).join('\n'),
      prerequisites: (c.prerequisites || []).join('\n'),
      instructorName: c.instructor?.name || 'DreamLearn Faculty',
      instructorTitle: c.instructor?.title || 'Instructor',
      status: c.status,
    });
    setCreateModalOpen(true);
  };

  // PDF Notes Handlers
  const handleAddPdfNote = () => {
    setFormData((prev) => ({
      ...prev,
      pdfNotes: [
        ...prev.pdfNotes,
        {
          title: `Lecture Notes Part ${prev.pdfNotes.length + 1}`,
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          description: 'Official lecture handout and revision document.',
          fileSize: '2.5 MB',
        },
      ],
    }));
  };

  const handleUpdatePdfNote = (index: number, field: keyof CoursePdfNote, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.pdfNotes];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, pdfNotes: updated };
    });
  };

  const handleRemovePdfNote = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pdfNotes: prev.pdfNotes.filter((_, idx) => idx !== index),
    }));
  };

  const handleAddQuickPdfTemplate = (templateName: string, defaultDesc: string, size: string) => {
    setFormData((prev) => ({
      ...prev,
      pdfNotes: [
        ...prev.pdfNotes,
        {
          title: templateName,
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          description: defaultDesc,
          fileSize: size,
        },
      ],
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Course title is required.');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      shortDescription: formData.shortDescription.trim(),
      description: formData.description.trim(),
      category: formData.category,
      topic: formData.topic.trim() || 'Tech',
      difficulty: formData.difficulty,
      duration: formData.duration,
      thumbnail: formData.thumbnail.trim(),
      videoUrl: formData.videoUrl.trim(),
      pdfNotes: formData.pdfNotes.filter((p) => p.title.trim() && p.url.trim()),
      learningOutcomes: formData.learningOutcomes.split('\n').map((s) => s.trim()).filter(Boolean),
      prerequisites: formData.prerequisites.split('\n').map((s) => s.trim()).filter(Boolean),
      instructor: {
        name: formData.instructorName.trim() || 'DreamLearn Faculty',
        title: formData.instructorTitle.trim() || 'Lead Educator',
      },
      status: formData.status,
    };

    try {
      if (editCourse) {
        await api.admin.updateCourse(editCourse._id, payload);
      } else {
        await api.admin.createCourse(payload);
      }
      setCreateModalOpen(false);
      fetchCourses();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleStatusChange = async (courseId: string, newStatus: string) => {
    try {
      await api.admin.setCourseStatus(courseId, newStatus);
      fetchCourses();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      await api.admin.deleteCourse(id);
      setDeleteConfirmId(null);
      fetchCourses();
    } catch (err: any) {
      alert(err.message || 'Failed to delete course');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Course Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
              Video & PDF Notes Enabled
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Create and maintain interactive courses with video lectures, downloadable PDF notes, curriculum modules, and placement tracks.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-[#165DCE] hover:bg-[#124cb0] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchCourses();
          }}
          className="relative flex-1 min-w-[280px]"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses by title, category, or topic..."
            className="w-full h-10 pl-10 pr-20 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-400">Status:</span>
          {['All', 'Published', 'Draft', 'Unpublished', 'Archived'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === s ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Table */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-slate-500">Loading courses...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3.5 px-6">Course</th>
                  <th className="py-3.5 px-6">Media & Materials</th>
                  <th className="py-3.5 px-6">Curriculum</th>
                  <th className="py-3.5 px-6">Enrolled</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {courses.map((course) => {
                  const hasVideo = !!course.videoUrl;
                  const pdfCount = course.pdfNotes?.length || 0;

                  return (
                    <tr key={course._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={course.thumbnail}
                            alt=""
                            className="w-12 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate max-w-xs sm:max-w-sm">
                              {course.title}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100">
                                {course.category}
                              </span>
                              <span className="text-[11px] text-slate-400">• {course.difficulty}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Video & PDF Notes Badges */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 flex-wrap">
                          {hasVideo ? (
                            <button
                              type="button"
                              onClick={() => setPreviewVideoUrl(course.videoUrl || null)}
                              className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              title="Watch Course Intro Video"
                            >
                              <Video className="w-3 h-3 text-purple-600" />
                              <span>Intro Video</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No video</span>
                          )}

                          {pdfCount > 0 ? (
                            <span
                              className="px-2 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-bold flex items-center gap-1"
                              title={`${pdfCount} PDF Notes attached`}
                            >
                              <FileText className="w-3 h-3 text-amber-600" />
                              <span>{pdfCount} PDF Note{pdfCount > 1 ? 's' : ''}</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">No notes</span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-600">
                        <span className="font-bold text-slate-900">{course.modulesCount || 0}</span> modules •{' '}
                        <span className="font-bold text-slate-900">{course.lessonsCount || 0}</span> lessons
                      </td>

                      <td className="py-4 px-6 font-bold text-slate-900">
                        {course.enrollmentsCount || course.enrolledCount || 0}
                      </td>

                      <td className="py-4 px-6">
                        <select
                          value={course.status}
                          onChange={(e) => handleStatusChange(course._id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer ${
                            course.status === 'Published'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : course.status === 'Draft'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          <option value="Draft">Draft</option>
                          <option value="Published">Published</option>
                          <option value="Unpublished">Unpublished</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/courses/${course._id}/curriculum`}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-[#165DCE] hover:text-white rounded-lg text-xs font-bold text-[#102344] transition-colors flex items-center gap-1"
                            title="Manage Modules & Lessons"
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Curriculum</span>
                          </Link>

                          <button
                            onClick={() => handleOpenEdit(course)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                            title="Edit Course Details, Video & PDF Notes"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(course._id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Delete Course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Video Quick Preview Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 rounded-3xl max-w-3xl w-full p-5 space-y-3 shadow-2xl border border-slate-700">
            <div className="flex items-center justify-between text-white pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-400" />
                <span className="font-extrabold text-xs">Course Promotional & Intro Video</span>
              </div>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
              <iframe
                src={formatVideoEmbedUrl(previewVideoUrl)}
                title="Course Intro Video"
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Confirm Course Deletion</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to permanently delete this course and all associated modules and lessons? This action cannot be undone.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCourse(deleteConfirmId)}
                className="px-5 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 shadow-sm cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5-Step Course Creation & Editing Suite */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header & Interactive 5-Step Wizard Navigation */}
            <div className="space-y-3 pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editCourse ? 'Edit Course & Course Materials' : `Create New Course (Step ${activeStep} of 5)`}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Configure curriculum details, intro video streams, and downloadable PDF study notes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 5-Step Tabs / Pills */}
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {[
                  { step: 1, label: '1. Overview', icon: BookOpen },
                  { step: 2, label: '2. Video & Media', icon: Film },
                  { step: 3, label: '3. PDF Notes', icon: FileText },
                  { step: 4, label: '4. Outcomes', icon: Sparkles },
                  { step: 5, label: '5. Launch', icon: FileCheck },
                ].map((item) => {
                  const active = activeStep === item.step;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.step}
                      type="button"
                      onClick={() => setActiveStep(item.step)}
                      className={`py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                        active
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              {/* ============================================================== */}
              {/* STEP 1: GENERAL INFO                                           */}
              {/* ============================================================== */}
              {activeStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-900 block">Course Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Data Structures & Algorithms Masterclass"
                      className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-900 block">Short Description</label>
                    <input
                      type="text"
                      required
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="A crisp one-sentence summary shown on course catalog cards"
                      className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-900 block">Full Description / Syllabus Summary</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Comprehensive course syllabus, key milestones, and targeted interview topics..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-900 block">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                      >
                        <option value="Data Structures">Data Structures</option>
                        <option value="Programming Languages">Programming Languages</option>
                        <option value="Placement Preparation">Placement Preparation</option>
                        <option value="Core CS">Core CS</option>
                        <option value="Web Development">Web Development</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-900 block">Difficulty</label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Beginner to Advanced">Beginner to Advanced</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-900 block">Publication Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold"
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="Unpublished">Unpublished</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 2: VIDEO & MEDIA                                          */}
              {/* ============================================================== */}
              {activeStep === 2 && (
                <div className="space-y-5">
                  <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-purple-950 font-extrabold">
                      <Video className="w-4 h-4 text-purple-700" />
                      <span>Course Promotional & Intro Video</span>
                    </div>
                    <p className="text-[11px] text-purple-800">
                      Add a video overview to give prospective students a preview of what they will learn. Supports YouTube, Vimeo, or direct MP4 streams.
                    </p>

                    <div className="space-y-1">
                      <label className="font-bold text-purple-900 block text-[11px]">Video Embed / Watch URL</label>
                      <input
                        type="url"
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="e.g. https://www.youtube.com/watch?v=0IAPZzGSbME"
                        className="w-full h-10 px-3.5 bg-white border border-purple-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-xs"
                      />
                    </div>

                    {/* Live Video Preview Box */}
                    {formData.videoUrl && (
                      <div className="space-y-1.5 pt-2">
                        <span className="font-bold text-purple-900 text-[10px] block uppercase tracking-wide">
                          Live Video Player Preview:
                        </span>
                        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 shadow-sm border border-purple-200">
                          <iframe
                            src={formatVideoEmbedUrl(formData.videoUrl)}
                            title="Course Video Preview"
                            className="w-full h-full"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail & Duration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-900 block">Thumbnail Image URL</label>
                      <input
                        type="url"
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs"
                      />
                      {formData.thumbnail && (
                        <div className="mt-2 w-32 h-20 rounded-xl overflow-hidden border border-slate-200">
                          <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-900 block">Estimated Course Duration</label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="e.g. 10 weeks, 35 hours"
                        className="w-full h-10 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 3: PDF NOTES & MATERIALS                                 */}
              {/* ============================================================== */}
              {activeStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="font-extrabold text-slate-900 text-xs block flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-amber-600" />
                        <span>Downloadable PDF Notes & Study Materials ({formData.pdfNotes.length})</span>
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Students can access, view, and download these PDF documents throughout their learning journey.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddPdfNote}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add PDF Note</span>
                    </button>
                  </div>

                  {/* Quick Add Preset Templates */}
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                    <span className="font-bold text-amber-900 text-[10px] uppercase tracking-wide block">
                      ⚡ Quick Add Note Templates:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddQuickPdfTemplate('DSA Quick Formula Cheat Sheet (PDF)', 'Essential asymptotic formulas, tree properties, and graph templates.', '1.4 MB')}
                        className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg text-[11px] font-bold cursor-pointer"
                      >
                        + Cheat Sheet PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddQuickPdfTemplate('Full Masterclass Lecture Slides (PDF)', 'Complete lecture presentation slides and annotated diagrams.', '5.2 MB')}
                        className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg text-[11px] font-bold cursor-pointer"
                      >
                        + Lecture Slides PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddQuickPdfTemplate('Top 100 Placement Interview Questions (PDF)', 'Handpicked problems asked at Microsoft, Amazon, Google with hints.', '2.9 MB')}
                        className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg text-[11px] font-bold cursor-pointer"
                      >
                        + Interview Questions PDF
                      </button>
                    </div>
                  </div>

                  {/* List of PDF Notes */}
                  {formData.pdfNotes.length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                      <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-slate-500 font-semibold text-xs">No PDF notes added yet.</p>
                      <button
                        type="button"
                        onClick={handleAddPdfNote}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
                      >
                        Add First PDF Note
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.pdfNotes.map((note, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 hover:border-slate-300 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 text-[10px] flex items-center justify-center font-bold">
                                {idx + 1}
                              </span>
                              <span>PDF Note #{idx + 1}</span>
                            </span>

                            <div className="flex items-center gap-2">
                              {note.url && (
                                <a
                                  href={note.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-bold flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>Test PDF Link</span>
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemovePdfNote(idx)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded"
                                title="Remove this note"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div className="sm:col-span-2 space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 block">Note / Resource Title</span>
                              <input
                                type="text"
                                required
                                value={note.title}
                                onChange={(e) => handleUpdatePdfNote(idx, 'title', e.target.value)}
                                placeholder="e.g. Module 1: Graph Theory Handout"
                                className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 font-semibold"
                              />
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-slate-400 block">File Size / Label</span>
                              <input
                                type="text"
                                value={note.fileSize || 'PDF'}
                                onChange={(e) => handleUpdatePdfNote(idx, 'fileSize', e.target.value)}
                                placeholder="e.g. 2.4 MB"
                                className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-mono"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 block">PDF Document Direct URL</span>
                            <input
                              type="url"
                              required
                              value={note.url}
                              onChange={(e) => handleUpdatePdfNote(idx, 'url', e.target.value)}
                              placeholder="https://example.com/notes.pdf"
                              className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 block">Brief Description (Optional)</span>
                            <input
                              type="text"
                              value={note.description || ''}
                              onChange={(e) => handleUpdatePdfNote(idx, 'description', e.target.value)}
                              placeholder="Key highlights covered in this document..."
                              className="w-full h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 4: OUTCOMES & INSTRUCTOR                                  */}
              {/* ============================================================== */}
              {activeStep === 4 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-900 block">Learning Outcomes (One per line)</label>
                    <textarea
                      rows={3}
                      value={formData.learningOutcomes}
                      onChange={(e) => setFormData({ ...formData, learningOutcomes: e.target.value })}
                      placeholder="Master Tree Traversals&#10;Solve Dynamic Programming"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-[11px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-900 block">Prerequisites (One per line)</label>
                    <textarea
                      rows={2}
                      value={formData.prerequisites}
                      onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                      placeholder="Basic programming knowledge&#10;Familiarity with arrays and loops"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-[11px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-900 block">Instructor Name</label>
                      <input
                        type="text"
                        value={formData.instructorName}
                        onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                        placeholder="Prof. Raghav Sharma"
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-900 block">Instructor Title / Role</label>
                      <input
                        type="text"
                        value={formData.instructorTitle}
                        onChange={(e) => setFormData({ ...formData, instructorTitle: e.target.value })}
                        placeholder="Lead Technical Instructor"
                        className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 5: REVIEW & LAUNCH                                        */}
              {/* ============================================================== */}
              {activeStep === 5 && (
                <div className="space-y-4">
                  <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-3">
                    <span className="font-extrabold text-blue-950 text-xs block flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-blue-600" />
                      <span>Ready to Save & Publish Course</span>
                    </span>
                    <p className="text-[11px] text-blue-900">
                      Review course assets below. You can update syllabus modules and individual lessons anytime from the Curriculum manager.
                    </p>

                    <div className="bg-white rounded-xl p-4 border border-blue-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold text-slate-900">{formData.title || '(Untitled Course)'}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {formData.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{formData.shortDescription}</p>

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100">{formData.category}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100">{formData.difficulty}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100">{formData.duration}</span>
                        {formData.videoUrl && (
                          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 flex items-center gap-1 font-bold">
                            <Video className="w-3 h-3" /> Intro Video Linked
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1 font-bold">
                          <FileText className="w-3 h-3" /> {formData.pdfNotes.length} PDF Notes Ready
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Navigation Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                {activeStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStep((prev) => prev - 1)}
                    className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                )}

                <div className="flex items-center gap-2">
                  {activeStep < 5 ? (
                    <button
                      type="button"
                      onClick={() => setActiveStep((prev) => prev + 1)}
                      className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Next Step</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>{editCourse ? 'Save Changes' : 'Create & Publish Course'}</span>
                    </button>
                  )}
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
