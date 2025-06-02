import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './Edit.css';

export default function Edit() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        name: '',
        surname: '',
        phone: '',
        city: '',
        description: '',
        rank: ''
    });

    useEffect(() => {
        const data = localStorage.getItem('profile');
        if (data) {
            setForm(JSON.parse(data));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        localStorage.setItem('profile', JSON.stringify(form));
        navigate('/');
    };

    return (
        <div className="editt-container">
            <div className="editt-box">
                <h2>Edytuj profil</h2>
                <form onSubmit={handleSubmit} className="editt-form">
                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Wpisz nowe dane"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Imię</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Wpisz nowe dane"
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
                            type="text"
                            placeholder="Wpisz nowe dane"
                            value={form.surname}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Telefon</label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="Wpisz nowe dane"
                            value={form.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">Miasto</label>
                        <input
                            id="city"
                            name="city"
                            type="text"
                            placeholder="Wpisz nowe dane"
                            value={form.city}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Opis</label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            placeholder="Wpisz nowe dane"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="rank">Ranga</label>
                        <input
                            id="rank"
                            name="rank"
                            type="text"
                            placeholder="Wpisz nowe dane"
                            value={form.rank}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="editt-button">Zapisz zmiany</button>
                </form>
                <button onClick={() => navigate('/')} className="editt-button">
                    Wróć
                </button>
            </div>
        </div>
    );
}
