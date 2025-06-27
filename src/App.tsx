// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import MainPage from "./pages/MainPage";
import { AuthProvider } from "@/auth/AuthContext";
import Navbar from '@/pages/Navbar';
import Edit from "./pages/Edit";
import Walory from "./pages/Walory";
import WalorInfo from "./pages/WalorInfo";
import Friends from "./pages/Friends";

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
                    <Route path="/friends" element={<Friends />} />
                    <Route path="/walory" element={<Walory />} />
                    <Route path="/walor/:id" element={<WalorInfo />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
