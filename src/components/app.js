import { h } from "preact";
import { Router } from "preact-router";
import { useState } from "preact/hooks";
import Auth from "../context/auth";
import Login from "../routes/login";
import Return from "../routes/return";
import Search from "../routes/search";

export default function App() {
  const [token, setToken] = useState("");

  return (
    <div id="app">
      <Auth.Provider value={{ token, setToken }}>
        <Router>
          <Search path="/" />
          <Login path="/login" />
          <Return path="/return" />
        </Router>
      </Auth.Provider>
    </div>
  );
}
