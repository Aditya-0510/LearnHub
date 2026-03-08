"use client";
import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Course } from "../../types";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  content: string;
}

export default function LessonViewerPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const router = useRouter();
  const { role, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [error, setError] = useState("");

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;

      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: token || "" };

        // 1. Fetch Course details (for title) - Optional, but nice
        // Actually, let's just fetch lessons. API checks enrollment.

        // Fetch Lessons
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/lessons`,
          { headers },
        );

        if (res.status === 403 || res.status === 404) {
          setError("You are not enrolled in this course or it doesn't exist.");
          setLoading(false);
          return;
        }

        if (!res.ok) throw new Error("Failed to load lessons");

        const data = await res.json();
        const sortedLessons = data.lessons || [];
        // Ideally sorting by ID or an order field. Assuming ID for now.

        setLessons(sortedLessons);
        if (sortedLessons.length > 0) {
          setCurrentLesson(sortedLessons[0]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load content.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, isAuthenticated]);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!currentLesson) return;

      try {
        setVideoLoading(true);

        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/lessons/${currentLesson.id}/video`,
          {
            headers: { Authorization: token || "" },
          },
        );

        if (res.ok) {
          const data = await res.json();
          setVideoUrl(data.videoUrl);
        } else {
          setVideoUrl(null);
        }
      } catch (err) {
        console.error(err);
        setVideoUrl(null);
      } finally {
        setVideoLoading(false);
      }
    };

    fetchVideo();
  }, [currentLesson, courseId]);

  if (!isAuthenticated) {
    if (typeof window !== "undefined") router.push("/auth/login");
    return null;
  }

  if (loading)
    return (
      <div className="min-h-screen flex text-center justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cornflower-blue-600"></div>
      </div>
    );

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <p className="text-red-600 text-lg font-medium mb-4">{error}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-cornflower-blue-600 text-white px-6 py-2 rounded-lg hover:bg-cornflower-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      {/* Sidebar - Lesson List */}
      <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col overflow-y-auto hidden md:flex">
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-gray-500 hover:text-cornflower-blue-600 mb-2 flex items-center"
          >
            &larr; Back to Dashboard
          </button>
          <h2 className="text-lg font-bold text-gray-900">Course Content</h2>
        </div>
        <div className="flex-1 p-4 space-y-2">
          {lessons.map((lesson, idx) => (
            <button
              key={lesson.id}
              onClick={() => setCurrentLesson(lesson)}
              className={`w-full text-left p-3 rounded-lg text-sm flex items-center gap-2 ${
                currentLesson?.id === lesson.id
                  ? "bg-cornflower-blue-100 text-cornflower-blue-900 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-gray-400 w-6">
                {(idx + 1).toString().padStart(2, "0")}
              </span>

              <span className="flex-1">{lesson.title}</span>

              {currentLesson?.id === lesson.id && (
                <PlayCircle size={18} className="text-cornflower-blue-600 animate-pulse" />
              )}
            </button>
          ))}
          {lessons.length === 0 && (
            <p className="text-xs text-gray-400 p-2">No lessons available.</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 lg:p-12">
        {currentLesson ? (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
              {currentLesson.title}
            </h1>

            {/* Video Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
              {/* Video */}
              <div className="aspect-video bg-black">
                {videoLoading ? (
                  <div className="flex items-center justify-center h-full text-white">
                    Loading video...
                  </div>
                ) : videoUrl ? (
                  <video
                    key={videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  >
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Video not available
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
              <div className="prose prose-blue max-w-none text-gray-800">
                {currentLesson.content.split("\n").map((line, i) => (
                  <p key={i} className="mb-4 whitespace-pre-wrap">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a lesson to start learning
          </div>
        )}

        <div className="flex justify-between mt-12 pt-6 border-t border-gray-100">
          <button
            onClick={() => {
              const index = lessons.findIndex(
                (l) => l.id === currentLesson?.id,
              );
              if (index > 0) setCurrentLesson(lessons[index - 1]);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
          >
            <ChevronLeft size={18} />
            Previous Lesson
          </button>

          <button
            onClick={() => {
              const index = lessons.findIndex(
                (l) => l.id === currentLesson?.id,
              );
              if (index < lessons.length - 1)
                setCurrentLesson(lessons[index + 1]);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-cornflower-blue-600 text-white rounded-lg hover:bg-cornflower-blue-700 text-sm"
          >
            Next Lesson
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
