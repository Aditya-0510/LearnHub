"use client";
import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Course } from "@/app/types";
import { Input, TextArea } from "../../../components/FormElements";
import { ChevronDown } from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  content: string;
  videoKey?: string;
}

export default function ManageCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const router = useRouter();
  const { role, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonVideos, setLessonVideos] = useState<{ [key: number]: string }>(
    {},
  );

  const [uploadingVideo, setUploadingVideo] = useState<number | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [openLesson, setOpenLesson] = useState<number | null>(null);

  // Lesson Form State
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [submittingLesson, setSubmittingLesson] = useState(false);

  const toggleLesson = (lessonId: number) => {
    setOpenLesson((prev) => (prev === lessonId ? null : lessonId));
  };

  const fetchCourseData = async () => {
    try {
       setLoading(true);

      const token = localStorage.getItem("token");
      const headers = { Authorization: token || "" };

      // Fetch Course
      const courseRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`,
        { headers },
      );
      if (courseRes.ok) {
        const data = await courseRes.json();
        setCourse(data.course);
      } else {
        throw new Error("Failed to fetch course");
      }

      // Fetch Lessons
      const lessonsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/lessons`,
        { headers },
      );
      if (lessonsRes.ok) {
        const data = await lessonsRes.json();
        const lessonsList = data.lessons || [];
        setLessons(data.lessons || []);

        for (const lesson of lessonsList) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/lessons/${lesson.id}/video`,
            { headers },
          );

          if (res.ok) {
            const videoData = await res.json();

            setLessonVideos((prev) => ({
              ...prev,
              [lesson.id]: videoData.videoUrl,
            }));
          }
        }
      }
    } catch (error) {
      console.error(error);
      // alert('Error loading course data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && role === "INSTRUCTOR") {
      fetchCourseData();
    } else if (!isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, role, courseId]);

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingLesson(true);

    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: token || "",
      };
      const body = JSON.stringify({
        title: lessonTitle,
        content: lessonContent,
      });

      let res;
      if (editingLessonId) {
        // Update existing lesson
        res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/lessons/${editingLessonId}`,
          {
            method: "PUT",
            headers,
            body,
          },
        );
      } else {
        // Create new lesson
        res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/lessons`,
          {
            method: "POST",
            headers,
            body,
          },
        );
      }

      if (res.ok) {
        resetForm();
        fetchCourseData(); // Refresh list
      } else {
        alert(`Failed to ${editingLessonId ? "update" : "add"} lesson`);
      }
    } catch (error) {
      console.error(error);
      alert("Error saving lesson");
    } finally {
      setSubmittingLesson(false);
    }
  };

  const uploadVideo = async (lessonId: number, formData: FormData) => {
    try {
      setUploadingVideo(lessonId);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/lessons/${lessonId}/video`,
        {
          method: "POST",
          headers: {
            Authorization: token || "",
          },
          body: formData,
        },
      );

      if (!res.ok) {
        alert("Upload failed");
        return;
      }

      const data = await res.json();

      // 🔹 Update UI instantly
      setLessonVideos((prev) => ({
        ...prev,
        [lessonId]: data.videoUrl,
      }));
    } catch (err) {
      console.error(err);
      alert("Upload error");
    } finally {
      setUploadingVideo(null);
    }
  };

  const startEditing = (lesson: Lesson) => {
    setEditingLessonId(lesson.id);
    setLessonTitle(lesson.title);
    setLessonContent(lesson.content);
    setShowLessonForm(true);
  };

  const resetForm = () => {
    setLessonTitle("");
    setLessonContent("");
    setEditingLessonId(null);
    setShowLessonForm(false);
  };

  const deleteVideo = async (lessonId: number) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/lessons/${lessonId}/video`,
      {
        method: "DELETE",
        headers: { Authorization: token || "" },
      },
    );

    if (res.ok) {
      setLessonVideos((prev) => {
        const updated = { ...prev };
        delete updated[lessonId];
        return updated;
      });
    }
  };

  if (!isAuthenticated || role !== "INSTRUCTOR") {
    return <div className="p-8 text-center">Access Restricted</div>;
  }

  if (loading) return <div className="p-12 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cornflower-blue-600"></div></div>
  if (!course) return <div className="p-12 text-center">Course not found</div>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {course.title}
          </h1>
          <p className="text-gray-500">Manage Course Content</p>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-cornflower-blue-600 font-medium hover:underline"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar / Course Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-cornflower-blue-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Course Details
            </h2>
            <div className="mb-4">
              <span className="text-sm text-gray-500 uppercase font-semibold">
                Description
              </span>
              <p className="text-gray-700 mt-1">{course.description}</p>
            </div>
          </div>
        </div>

        {/* Main Content / Lessons */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-cornflower-blue-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Lessons ({lessons.length})
              </h2>
              <button
                onClick={() => {
                  if (showLessonForm) resetForm();
                  else setShowLessonForm(true);
                }}
                className="bg-cornflower-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-cornflower-blue-700 transition-colors"
              >
                {showLessonForm ? "Cancel" : "Add New Lesson"}
              </button>
            </div>

            {showLessonForm && (
              <form
                onSubmit={handleLessonSubmit}
                className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200"
              >
                <h3 className="text-md font-bold text-gray-900 mb-4">
                  {editingLessonId ? "Edit Lesson" : "New Lesson"}
                </h3>
                <Input
                  label="Title"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  required
                />
                <TextArea
                  label="Content"
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  required
                  placeholder="Enter lesson content here (Markdown supported)..."
                />
                <div className="flex justify-end space-x-2">
                  {editingLessonId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={submittingLesson}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {submittingLesson
                      ? "Saving..."
                      : editingLessonId
                        ? "Update Lesson"
                        : "Save Lesson"}
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {lessons.length === 0 ? (
                <p className="text-gray-500 italic">No lessons yet.</p>
              ) : (
                lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="p-5 bg-gray-50 rounded-lg border border-gray-200 space-y-4"
                  >
                    {/* Row 1: Lesson title */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-gray-500">
                            #{index + 1}
                          </span>

                          <span className="font-semibold text-gray-900">
                            {lesson.title}
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm mt-1">
                          {lesson.content}
                        </p>
                      </div>

                      <button
                        onClick={() => startEditing(lesson)}
                        className="text-cornflower-blue-600 hover:text-cornflower-blue-800 font-medium text-sm"
                      >
                        Edit
                      </button>
                    </div>

                    {/* Row 2: Video Section */}

                    {lessonVideos[lesson.id] ? (
                      <div className="space-y-3">
                        <button
                          onClick={() => toggleLesson(lesson.id)}
                          className="flex items-center gap-2 text-cornflower-blue-600 font-medium text-sm hover:text-cornflower-blue-800"
                        >
                          <ChevronDown
                            size={18}
                            className={`transition-transform ${
                              openLesson === lesson.id ? "rotate-180" : ""
                            }`}
                          />
                          {openLesson === lesson.id
                            ? "Hide Video"
                            : "Show Video"}
                        </button>

                        {openLesson === lesson.id && (
                          <div className="space-y-3">
                            <video
                              controls
                              className="w-full rounded-lg border"
                            >
                              <source
                                src={lessonVideos[lesson.id]}
                                type="video/mp4"
                              />
                            </video>
                            <div className="flex gap-3">
                              <label
                                htmlFor={`replace-video-${lesson.id}`}
                                className="bg-cornflower-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
                              >
                                Replace Video
                              </label>

                              <input
                                id={`replace-video-${lesson.id}`}
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;

                                  const formData = new FormData();
                                  formData.append("video", file);

                                  uploadVideo(lesson.id, formData);
                                }}
                              />

                              <button
                                onClick={() => deleteVideo(lesson.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                              >
                                Delete Video
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <input
                          id={`upload-video-${lesson.id}`}
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const formData = new FormData();
                            formData.append("video", file);

                            uploadVideo(lesson.id, formData);
                          }}
                        />
                        <label
                          htmlFor={`upload-video-${lesson.id}`}
                          className="bg-cornflower-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-cornflower-blue-700 transition"
                        >
                          Select Video
                        </label>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
