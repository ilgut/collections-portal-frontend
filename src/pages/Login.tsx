// src/pages/Login.tsx
import {type FormEvent, useState } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const { login } = useAuth();
    const nav = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await login(form);
            nav('/');            // np. dashboard kolekcji
        } catch (err: any) {
            setError(err.response?.data ?? 'Wystąpił błąd');
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-20">
            <h1 className="text-2xl font-bold mb-6">Logowanie</h1>
            <form onSubmit={submit} className="space-y-4">
                <input
                    className="input block w-full"
                    name="email"
                    type="email"
                    placeholder="e-mail"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    className="input block w-full"
                    name="password"
                    type="password"
                    placeholder="hasło"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                {error && <p className="text-red-600">{error}</p>}
                <button className="btn w-full" type="submit">
                    Zaloguj
                </button>
            </form>
        </div>
    );
}
