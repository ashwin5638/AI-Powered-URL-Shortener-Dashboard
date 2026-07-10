import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Analytics from "./pages/Analytics/Analytics";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/analytics/:id" element={<Analytics />} />
    </Routes>
  );
}

export default App;
