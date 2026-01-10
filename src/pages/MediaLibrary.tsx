import { useState } from "react";
import { Link } from "react-router-dom";

export default function MediaLibrary() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-black mb-6 text-purple-400">
        MEDIA LIBRARY
      </h1>

      <input
        type="file"
        multiple
        className="mb-6"
        onChange={(e) => {
          if (e.target.files) {
            setFiles([...files, ...Array.from(e.target.files)]);
          }
        }}
      />

      {files.length === 0 && (
        <p className="text-gray-400">No assets yet.</p>
      )}

      <ul className="space-y-2 mb-10">
        {files.map((file, i) => (
          <li key={i} className="text-sm text-purple-300">
            {file.name}
          </li>
        ))}
      </ul>

      <Link
        to="/editor"
        className="px-8 py-4 bg-purple-700 rounded-xl font-bold"
      >
        Open Video Studio
      </Link>
    </div>
  );
}
