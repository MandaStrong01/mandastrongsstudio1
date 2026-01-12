import { Link } from "react-router-dom";

export default function Page1() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10">
      <h1 className="text-5xl font-black mb-6 text-purple-400">
        MANDASTRONG STUDIO
      </h1>
      <p className="text-lg text-gray-300 mb-10 text-center max-w-xl">
        Build full-length movies using AI, media tools, and your original vision.
      </p>

      <div className="flex gap-6">
        <Link
          to="/media"
          className="px-8 py-4 bg-purple-700 rounded-xl font-bold"
        >
          Open Media Library
        </Link>

        <Link
          to="/editor"
          className="px-8 py-4 border border-purple-600 rounded-xl font-bold"
        >
          Open Editor Suite
        </Link>
      </div>
    </div>
  );
}
