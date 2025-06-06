import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";
import AgriFoodQuestionario from "./App";
import AdminPanel from "./AdminPanel";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<AgriFoodQuestionario />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
