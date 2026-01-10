import React, { useState } from "react";
import { Film, Upload, Play, X, Plus, Trash2 } from "lucide-react";

type Asset = {
  id: string;
  name: string;
  url: string;
  type: "video" | "audio" | "image";
};

export default function Page11() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [timeline, setTimeline] = useState<Asset[]>([]);
  const [preview, setPreview] = useState<Asset | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const uploaded: Asset[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video")
        ? "video"
        : file.type.startsWith("audio")
        ? "audio"
        : "image",
    }));

    setAssets((prev) => [...prev, ...uploaded]);
  };

  const addToTimeline = (asset: Asset) => {
    setTimeline((prev) => [...prev, asset]);
  };

  const removeFromTimeline = (id: string) => {
    setTimeline((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-black text-purple-400 mb-6">
        EDITOR SUITE — TIMELINE
      </h1>

      {/* UPLOAD */}
      <label className="block mb-6 cursor-pointer">
        <input
          type="file"
          multiple
          accept="video/*,audio/*,image/*"
          hidden
          onChange={handleUpload}
        />
        <div className="flex items-center gap-3 px-6 py-4 bg-purple-700 hover:bg-purple-600 rounded-xl font-bold">
          <Upload /> Upload Media
        </div>
      </label>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* MEDIA LIBRARY */}
        <div className="bg-purple-900/30 border border-purple-700 rounded-xl p-4">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Film /> Media Library
          </h2>

          {assets.length === 0 && (
            <p className="text-gray-400 text-sm">No assets yet</p>
          )}

          <div className="space-y-2">
            {assets.map((a) => (
              <div
                key={a.id}
                className="flex justify-between items-center bg-black/50 border border-purple-600 rounded p-2"
              >
                <span className="truncate text-sm">{a.name}</span>
                <button
                  onClick={() => addToTimeline(a)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  <Plus />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* PREVIEW */}
        <div className="bg-black border border-purple-700 rounded-xl p-4 flex items-center justify-center">
          {preview && preview.type === "video" ? (
            <video src={preview.url} controls autoPlay className="w-full" />
          ) : (
            <p className="text-purple-400">Preview Window</p>
          )}
        </div>

        {/* TIMELINE */}
        <div className="bg-purple-900/30 border border-purple-700 rounded-xl p-4">
          <h2 className="font-bold mb-4">Timeline</h2>

          {timeline.length === 0 && (
            <p className="text-gray-400 text-sm">Add clips to timeline</p>
          )}

          <div className="space-y-2">
            {timeline.map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-center bg-black/50 border border-purple-600 rounded p-2"
              >
                <button
                  onClick={() => setPreview(t)}
                  className="flex items-center gap-2 text-sm"
                >
                  <Play className="w-4 h-4 text-purple-400" />
                  {t.name}
                </button>
                <button
                  onClick={() => removeFromTimeline(t.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  <Trash2 />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL PREVIEW */}
      {preview && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
          <div className="bg-black border border-purple-700 rounded-xl p-4 max-w-4xl w-full">
            <div className="flex justify-between mb-2">
              <h3 className="font-bold">{preview.name}</h3>
              <button onClick={() => setPreview(null)}>
                <X />
              </button>
            </div>
            {preview.type === "video" && (
              <video src={preview.url} controls autoPlay className="w-full" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
