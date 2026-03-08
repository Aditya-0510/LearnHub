"use client";

import { useState } from "react";

export default function VideoUpload({ lessonId }: { lessonId: number }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const uploadVideo = async () => {
    if (!file) return;

    const token = localStorage.getItem("token");
    const headers = {
          'Content-Type': 'application/json',
          'Authorization': token || '',
    };

    const formData = new FormData();
    formData.append("video", file);

    setLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}/lessons/${lessonId}/video`,
      {
        method: "POST",
        headers,
        body: formData,
      }
    );

    const data = await res.json();

    console.log(data);

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={uploadVideo}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Uploading..." : "Upload Video"}
      </button>
    </div>
  );
}