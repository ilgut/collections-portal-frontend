// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import MainPage from "./pages/MainPage";
import { AuthProvider } from "@/auth/AuthContext";
import Navbar from '@/pages/Navbar';
import Edit from "./pages/Edit";
import Walory from "./pages/Walory";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/edit" element={<Edit />} />
                    <Route path="/walory" element={<Walory />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
