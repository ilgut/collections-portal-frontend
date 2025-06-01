// src/pages/Register.tsx
import { type FormEvent, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
    const { register } = useAuth();
    const nav = useNavigate();
    const [form, setForm] = useState({ email: '', password: '', name: '', surname: '' });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await register(form);
            nav('/login');     
        } catch (err: any) {
            setError(err.response?.data ?? 'Wystąpił błąd');
        }
    };

    return (
    <div className="register-container">
        <div className="register-box">
            <h2>Załóż konto</h2>
            <form onSubmit={submit} className="register-form">
                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Wprowadź e-mail"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Hasło</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Wprowadź hasło"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="name">Imie</label>
                    <input
                        id="name"
                        name="name"
                        type="name"
                        placeholder="Wprowadź imie"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="surname">Nazwisko</label>
                    <input
                        id="surname"
                        name="surname"
                        type="surname"
                        placeholder="Wprowadź nazwisko"
                        value={form.surname}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="register-button">
                    Utwórz konto
                </button>
            </form>
            <button
                onClick={() => nav('/login')}
                className="register-button">
                Wróć
            </button>
        </div>
    </div>
    );
}
