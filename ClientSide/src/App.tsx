import { BrowserRouter, Route, Routes } from "react-router-dom"
import NavbarPage from "./components/Navbar"
import Home from "./pages/Home"
import Dashboard from "./components/Dashboard"


function App() {

  const user = localStorage.getItem('user');

  return (
    <>
    <BrowserRouter>
      <NavbarPage userdata={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/settings" element={<div>Settings Page</div>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App