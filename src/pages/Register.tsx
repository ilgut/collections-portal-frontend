import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

export default function Register() {
    const nav = useNavigate();
    const [form, setForm] = useState({
        username: '',
        email: '',
        data: '',
        foto: '', // zawiera base64 string
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setForm(prev => ({ ...prev, foto: result }));
        };
        reader.readAsDataURL(file); // konwertuje obraz do base64
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setError('Hasła nie są takie same');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5099/api/auth/register', {
                username: form.username,
                email: form.email,
                data: form.data,
                foto: form.foto, // base64
                password: form.password,
                confirmPassword: form.password,
            });

            const token = response.data.token;
            localStorage.setItem('authToken', token);
            nav('/');
        } catch (err: any) {
            setError(err.response?.data?.message ?? 'Nie udało się zarejestrować');
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Załóż konto</h2>
                <form onSubmit={submit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="username">Nazwa użytkownika</label>
                        <input id="username" name="username" type="text" value={form.username} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="data">Opis użytkownika</label>
                        <input id="data" name="data" type="text" value={form.data} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="foto">Zdjęcie profilowe</label>
                        <input id="foto" name="foto" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Hasło</label>
                        <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Powtórz hasło</label>
                        <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="register-button">Utwórz konto</button>
                </form>
                <button onClick={() => nav('/login')} className="register-button">Wróć</button>
            </div>
        </div>
    );
}
