import "./App.css";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Products from "./components/Products";
import InsertProduct from "./components/InsertProduct";
import UpdateProduct from "./components/UpdateProduct";
import Profile from "./components/Profile";
import Login from "./components/Login";
import { clearSession } from "./api";
import { useState } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("tib_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        {!user ? (
          <Login onLogin={setUser} />
        ) : (
          <>
            <Navbar
              title="Tomorrow is Better"
              user={user}
              onLogout={logout}
            ></Navbar>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/insertproduct" element={<InsertProduct />} />
              <Route path="/updateproduct/:id" element={<UpdateProduct />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
