import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Course, Module, Lesson } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Star, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  FileText, 
  Code, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Video,
  ExternalLink
} from 'lucide-react';

const formatVideoEmbedUrl = (url?: string): string => {
  if (!url) return '';
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  return url;
};

export const CourseDetailPage: React.FC = () => {
  const params = useParams<{ slug?: string; id?: string }>();
  const identifier = params.slug || params.id;
  const navigate = useNavigate();
  const { isAuthenticated, isStudent } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [curriculum, setCurriculum] = useState<Module[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [openModules, setOpenModules] = useState<{ [key: string]: boolean }>({});
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    if (!identifier) return;
    setLoading(true);
    api.courses.getDetails(identifier)
      .then((res) => {
        if (res.course) {
          setCourse(res.course);
          setCurriculum(res.curriculum || []);
          setIsEnrolled(res.isEnrolled || false);
          // Open first module by default
          if (res.curriculum && res.curriculum.length > 0) {
            setOpenModules({ [res.curriculum[0]._id]: true });
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [identifier]);

  const toggleModule = (modId: string) => {
    setOpenModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!course) return;

    setEnrolling(true);
    try {
      await api.courses.enroll(course._id);
      setIsEnrolled(true);
      navigate(`/student/courses/${course._id}/learn`);
    } catch (err: any) {
      alert(err.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-[#102344]">Course not found</h2>
        <p className="text-sm text-slate-500 mt-2">The course you are looking for might have been moved or unpublished.</p>
        <Link to="/courses" className="mt-4 inline-block px-4 py-2 bg-primary-container text-white text-xs font-bold rounded-lg">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-16 bg-surface">
      
      {/* Top Banner */}
      <section className="bg-gradient-to-b from-[#EFF4FF] to-surface border-b border-[#E2E8F0] pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-primary-container border border-blue-200">
                  {course.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-600 border border-slate-200">
                  {course.difficulty}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#102344] tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-base text-[#64748B] max-w-2xl leading-relaxed">
                {course.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5 text-amber-600 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {course.rating.toFixed(1)} rating ({course.ratingCount} reviews)
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary-container" />
                  {course.enrolledCount.toLocaleString()} enrolled
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary-container" />
                  {course.duration}
                </span>
              </div>

              {/* Instructor snippet */}
              <div className="pt-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container text-white font-bold flex items-center justify-center overflow-hidden">
                  {course.instructor.avatar ? (
                    <img src={course.instructor.avatar} alt={course.instructor.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{course.instructor.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#102344]">{course.instructor.name}</p>
                  <p className="text-[11px] text-slate-500">{course.instructor.title}</p>
                </div>
              </div>
            </div>

            {/* Right Card / Enrollment Box */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xl space-y-5">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-md group">
                  {showVideoModal && course.videoUrl ? (
                    <iframe
                      src={formatVideoEmbedUrl(course.videoUrl)}
                      title={course.title}
                      className="w-full h-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      {course.videoUrl && (
                        <button
                          type="button"
                          onClick={() => setShowVideoModal(true)}
                          className="absolute inset-0 bg-black/40 hover:bg-black/30 flex items-center justify-center transition-colors cursor-pointer group"
                        >
                          <div className="w-14 h-14 rounded-full bg-white/95 text-blue-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-current ml-0.5" />
                          </div>
                          <span className="absolute bottom-3 px-3 py-1 bg-black/70 text-white text-[11px] font-bold rounded-lg backdrop-blur-xs flex items-center gap-1.5">
                            <Video className="w-3.5 h-3.5 text-purple-400" /> Watch Course Preview Video
                          </span>
                        </button>
                      )}
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  {isEnrolled ? (
                    <Link
                      to={`/student/courses/${course._id}/learn`}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <span>Continue Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full py-3.5 bg-primary-container hover:bg-[#104AA8] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      {enrolling ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Enroll for Free</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}

                  <p className="text-center text-[11px] text-slate-500">
                    Full lifetime access • Certificate on completion • 100% Free for students
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Content: Outcomes, Overview & Curriculum */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-10">
            
            {/* Learning Outcomes */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8">
              <h2 className="text-xl font-extrabold text-[#102344] mb-4">What you will learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {course.learningOutcomes?.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-700 leading-relaxed font-medium">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8">
              <h2 className="text-xl font-extrabold text-[#102344] mb-3">Course Description</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {course.description}
              </p>

              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-[#102344] mb-2">Prerequisites:</h3>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                    {course.prerequisites.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Course PDF Notes & Study Materials */}
            {course.pdfNotes && course.pdfNotes.length > 0 && (
              <div className="bg-white rounded-2xl border border-amber-200/80 p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#102344] flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-600" />
                      <span>Downloadable PDF Notes & Handouts</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Enrolled students receive complimentary access to all lecture slides, formula sheets, and study materials.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-extrabold border border-amber-200">
                    {course.pdfNotes.length} PDF Documents
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {course.pdfNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-amber-300 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                            {note.fileSize || 'PDF'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">Doc #{idx + 1}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{note.title}</h4>
                        {note.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-2">{note.description}</p>
                        )}
                      </div>

                      <a
                        href={note.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View / Download PDF</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum Accordion */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-[#102344]">Course Curriculum</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {curriculum.length} modules • {curriculum.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} lessons
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {curriculum.map((mod, idx) => {
                  const isOpen = !!openModules[mod._id];
                  return (
                    <div key={mod._id} className="border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleModule(mod._id)}
                        className="w-full p-4 bg-surface hover:bg-slate-100/70 flex items-center justify-between transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-md bg-blue-100 text-primary-container text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="text-sm font-bold text-[#102344] block">{mod.title}</span>
                            {mod.description && (
                              <span className="text-xs text-slate-500 block">{mod.description}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-slate-400 font-medium">
                            {mod.lessons?.length || 0} lessons
                          </span>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="divide-y divide-slate-100 bg-white">
                          {mod.lessons?.map((lesson) => (
                            <div key={lesson._id} className="p-3.5 px-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                              <div className="flex items-center gap-3">
                                {lesson.contentType === 'video' ? (
                                  <Play className="w-4 h-4 text-primary-container" />
                                ) : lesson.contentType === 'code' ? (
                                  <Code className="w-4 h-4 text-primary-container" />
                                ) : (
                                  <FileText className="w-4 h-4 text-primary-container" />
                                )}
                                <span className="text-xs font-medium text-slate-700">{lesson.title}</span>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-[11px] text-slate-400 font-medium">{lesson.durationMinutes} mins</span>
                                {lesson.isPreview && (
                                  <button
                                    onClick={() => setPreviewLesson(lesson)}
                                    className="px-2 py-0.5 text-[10px] font-bold text-primary-container bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                                  >
                                    Preview
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Instructor Sidebar Bio */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">About the Instructor</h3>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-primary-container text-white font-bold text-lg flex items-center justify-center overflow-hidden">
                  {course.instructor.avatar ? (
                    <img src={course.instructor.avatar} alt={course.instructor.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{course.instructor.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#102344]">{course.instructor.name}</h4>
                  <p className="text-xs text-slate-500">{course.instructor.title}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {course.instructor.bio}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Free Lesson Preview Modal */}
      {previewLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-[#102344]">Preview: {previewLesson.title}</h3>
              <button
                onClick={() => setPreviewLesson(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-700 leading-relaxed">
              <p>{previewLesson.description}</p>
              {previewLesson.contentText && (
                <div className="p-4 bg-surface rounded-xl border border-slate-200 font-mono text-xs whitespace-pre-wrap">
                  {previewLesson.contentText}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Free Lesson Preview</span>
              <button
                onClick={handleEnroll}
                className="px-4 py-2 bg-primary-container text-white text-xs font-bold rounded-lg hover:bg-[#104AA8]"
              >
                Enroll to access full course
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
