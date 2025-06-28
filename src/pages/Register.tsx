import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

export default function Register() {
    const nav = useNavigate();

    const [form, setForm] = useState({
        username: '',
        email: '',
        bio: '',
        photoBase64: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            // удаляем "data:image/png;base64,..."
            const base64 = result.split(',')[1];
            setForm(prev => ({ ...prev, photoBase64: base64 }));
        };
        reader.readAsDataURL(file);
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setError('Hasła nie są takie same');
            return;
        }

        try {
            console.log("Wysyłane dane:", form);

            const response = await axios.post('http://localhost:5099/api/auth/register', {
                username: form.username,
                email: form.email,
                password: form.password,
                confirmPassword: form.password,
                bio: form.bio,
                photoBase64: form.photoBase64,
            });

            const token = response.data.token;
            localStorage.setItem('authToken', token);
            nav('/');
        } catch (err: any) {
            console.error("Rejestracja error:", err.response?.data || err);
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
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="bio">Opis użytkownika</label>
                        <input
                            id="bio"
                            name="bio"
                            type="text"
                            value={form.bio}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="photo">Zdjęcie profilowe</label>
                        <input
                            id="photo"
                            name="photo"
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleFileChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Hasło</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Powtórz hasło</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="register-button">Utwórz konto</button>
                </form>

                <button onClick={() => nav('/login')} className="register-button">Wróć</button>
            </div>
        </div>
    );
}
