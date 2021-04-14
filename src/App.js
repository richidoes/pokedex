import React from "react";
import Navbar from "./components/Navbar";

import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="container mt-3">
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
