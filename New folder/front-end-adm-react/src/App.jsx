import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/login/Login";
import { Loader } from "./pages/loader/Loader";
import { useState } from "react";
import { Dashboard } from "./pages/dashboard/Dashboard";

function App() {
  const [login, setLogin] = useState(false);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setLogin={setLogin} />} />
        <Route path="/dashboard" element={<Loader login={login} />} />
        <Route path="/dev" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
