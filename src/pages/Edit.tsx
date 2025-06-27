import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './Edit.css';

export default function Edit() {
    const navigate = useNavigate();

    const [bio, setBio] = useState('');
    const [photoBase64, setPhotoBase64] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        fetch('http://localhost:5099/api/user/me', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setBio(data.bio || '');
            setPhotoBase64(data.photoBase64 || ''); // <- ключ camelCase
        })
        .catch(err => {
            console.error('❌ Błąd pobierania profilu:', err);
            setError('Nie udało się załadować danych profilu.');
        });
    }, []);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setPhotoBase64(result); // сохраняем как строку base64
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');

        if (!token) {
            setError('Brak tokena autoryzacji!');
            return;
        }

        const payload = {
            bio,
            photoBase64 // <- важно: ключ в camelCase
        };

        console.log('📤 Wysyłanie danych:', payload);

        try {
            const res = await fetch('http://localhost:5099/api/user/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`HTTP ${res.status}: ${text}`);
            }

            console.log('🟢 Zaktualizowano profil');
            navigate('/');
        } catch (err: any) {
            console.error('❌ Błąd zapisu:', err);
            setError(`Nie udało się zapisać: ${err.message}`);
        }
    };

    return (
        <div className="editt-container">
            <div className="editt-box">
                <h2>Edytuj profil</h2>
                <form onSubmit={handleSubmit} className="editt-form">
                    <div className="form-group">
                        <label htmlFor="photo">Załaduj zdjęcie (PNG, JPG)</label>
                        <input
                            id="photo"
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleFileChange}
                        />
                    </div>

                    {photoBase64 && (
                        <div className="form-group">
                            <label>Podgląd zdjęcia:</label>
                            <img
                                src={photoBase64}
                                alt="Preview"
                                style={{ maxWidth: '200px', display: 'block', marginTop: '10px' }}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="bio">Opis</label>
                        <textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            placeholder="Wpisz nowy opis"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>

                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <button type="submit" className="editt-button">Zapisz zmiany</button>
                </form>
                <button onClick={() => navigate('/')} className="editt-button">Wróć</button>
            </div>
        </div>
    );
}
