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
import FriendProfile from "./pages/FriendProfile";
import AddWalor from "./pages/AddWalor";
import AcceptInvitation from './pages/AcceptInvitation';
import FriendWalory from "./pages/FriendWalory";
import FriendWaloryPage from "./pages/FriendWalorInfo";

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
                    <Route path="/friendwalor/:id" element={<FriendWaloryPage />} />
                    <Route path="/addwalor" element={<AddWalor />} />
                    <Route path="/friend/:id/friendwalory" element={<FriendWalory />} />
                    <Route path="/AddWalor" element={<AddWalor />} />
                    <Route path="/invitations/accept" element={<AcceptInvitation />} />
                    <Route path="/walor/:id" element={<WalorInfo />} />
                    <Route path="/friend/:id" element={<FriendProfile />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
