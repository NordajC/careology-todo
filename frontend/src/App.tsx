import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
// import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import { PrivateRoute } from "./components/PrivateRoute"


function App() {
  return (
    // 1. BrowserRouter wraps the entire routing system
    <BrowserRouter>
      {/* 2. Routes acts like a switchboard, looking for the matching Route */}
      <Routes>
        {/* 3. Route links a specific URL path to a specific Component */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        
        {/* private dashboard route */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Catch-all route: if the user types a random URL, send them back to the dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App