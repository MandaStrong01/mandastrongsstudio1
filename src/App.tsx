import { HashRouter, Routes, Route } from "react-router-dom";

import Page1 from "./pages/Page1";
import MediaLibrary from "./pages/MediaLibrary";
import Page11 from "./pages/Page11";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Page1 />} />
        <Route path="/media" element={<MediaLibrary />} />
        <Route path="/editor" element={<Page11 />} />
      </Routes>
    </HashRouter>
  );
}
