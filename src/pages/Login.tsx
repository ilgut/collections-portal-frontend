import { type FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

export default function Login() {
    const nav = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5099/api/auth/login', form);
            const token = response.data; 
            localStorage.setItem("authToken", token);

            nav('/');
        } catch (err: any) {
            setError(err.response?.data?.message ?? 'Nie udało się zalogować');
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-wrapper">
                <h2>Logowanie</h2>
                <form onSubmit={submit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input id="email" name="email" type="email" placeholder="Wprowadź email" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Hasło</label>
                        <input id="password" name="password" type="password" placeholder="Wprowadź hasło" value={form.password} onChange={handleChange} required />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="login-button">Zaloguj się</button>
                </form>
                <button onClick={() => nav('/register')} className="login-button">Utwórz konto</button>
            </div>
        </div>
    );
}
