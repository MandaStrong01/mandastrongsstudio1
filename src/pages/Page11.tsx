import { Link } from "react-router-dom";

export default function Page11() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-black mb-6 text-purple-400">
        EDITOR SUITE
      </h1>

      <p className="text-gray-300 mb-10">
        Timeline, preview, and export will live here.
      </p>

      <div className="flex gap-6">
        <Link
          to="/media"
          className="px-6 py-3 border border-purple-600 rounded-lg"
        >
          Back to Media
        </Link>

        <Link
          to="/"
          className="px-6 py-3 bg-purple-700 rounded-lg font-bold"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
