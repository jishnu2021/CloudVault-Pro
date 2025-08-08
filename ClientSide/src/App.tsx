import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useState, useEffect } from "react"
import NavbarPage from "./components/Navbar"
import Home from "./pages/Home"
import Dashboard from "./components/Dashboard"

function App() {
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Safely access localStorage only on client-side
    try {
      const userData = localStorage.getItem('user');
      setUser(userData);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Show loading spinner while checking user data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <NavbarPage userdata={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/settings" element={<div>Settings Page</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App