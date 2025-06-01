import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="navbar-logo">Kolekcjoner</div>
            <div className="navbar-links">
                <button className="nav-button" onClick={() => navigate('/')}>
                    Strona główna
                </button>
                <button className="nav-button" onClick={() => navigate('/login')}>
                    Zaloguj się
                </button>
            </div>
        </nav>
    );
}
