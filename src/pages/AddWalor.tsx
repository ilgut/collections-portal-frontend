import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

interface Category {
    id: number;
    name: string;
}

export default function AddWalor() {
    const nav = useNavigate();

    const [form, setForm] = useState({
        name: '',
        categoryId: 0,
        photoBase64: '',
        characteristics: [{ id: 0, value: '' }],
    });

    const [error, setError] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryInput, setCategoryInput] = useState('');
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        axios.get('http://localhost:5099/api/category', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setCategories(res.data);
                setFilteredCategories(res.data);
            })
            .catch(err => console.error("Błąd pobierania kategorii:", err));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            setForm(prev => ({ ...prev, photoBase64: base64 }));
        };
        reader.readAsDataURL(file);
    };

    const handleCharacteristicChange = (index: number, value: string) => {
        const updated = [...form.characteristics];
        updated[index].value = value;
        setForm(prev => ({ ...prev, characteristics: updated }));
    };

    const addCharacteristic = () => {
        setForm(prev => ({
            ...prev,
            characteristics: [
                ...prev.characteristics,
                { id: prev.characteristics.length, value: '' }
            ]
        }));
    };

    const removeCharacteristic = (index: number) => {
        const updated = form.characteristics.filter((_, i) => i !== index);
        setForm(prev => ({
            ...prev,
            characteristics: updated.map((c, i) => ({ ...c, id: i }))
        }));
    };

    const handleCategoryInput = (value: string) => {
        setCategoryInput(value);
        const filtered = categories.filter(cat =>
            cat.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCategories(filtered);
        setShowDropdown(value.trim().length > 0);
    };

    const selectCategory = (cat: Category) => {
        setForm(prev => ({ ...prev, categoryId: cat.id }));
        setCategoryInput(cat.name);
        setShowDropdown(false);
    };

    const createCategory = async () => {
        const token = localStorage.getItem("authToken");
        try {
            const res = await axios.post('http://localhost:5099/api/category', {
                name: categoryInput
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const newCat = res.data;
            setCategories(prev => [...prev, newCat]);
            setForm(prev => ({ ...prev, categoryId: newCat.id }));
            setCategoryInput(newCat.name);
            setFilteredCategories([]);
            setShowDropdown(false);
        } catch (err) {
            console.error("Błąd tworzenia kategorii:", err);
        }
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("authToken");

            await axios.post('http://localhost:5099/api/items', form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            nav('/walory');
        } catch (err: any) {
            console.error("Błąd dodawania walora:", err.response?.data || err);
            setError(err.response?.data?.message ?? 'Nie udało się dodać walora');
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Dodaj nowy walor</h2>
                <form onSubmit={submit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="name">Nazwa walora</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ position: 'relative' }}>
                        <label htmlFor="category">Kategoria</label>
                        <input
                            id="category"
                            type="text"
                            value={categoryInput}
                            onChange={(e) => handleCategoryInput(e.target.value)}
                            placeholder="Wpisz kategorię"
                            required
                            autoComplete="off"
                            onFocus={() => setShowDropdown(categoryInput.trim().length > 0)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                        />
                        {showDropdown && filteredCategories.length > 0 && (
                            <ul className="category-dropdown">
                                {filteredCategories.map(cat => (
                                    <li key={cat.id} onClick={() => selectCategory(cat)}>
                                        {cat.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {showDropdown && categoryInput &&
                            !filteredCategories.some(c => c.name.toLowerCase() === categoryInput.toLowerCase()) && (
                                <button type="button" className="register-button" onClick={createCategory}>
                                    + Dodaj kategorię "{categoryInput}"
                                </button>
                            )}
                    </div>

                    <div className="form-group">
                        <label>Cechy walora</label>
                        {form.characteristics.map((char, index) => (
                            <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center", width: "100%" }}>
                                <input
                                    type="text"
                                    value={char.value}
                                    onChange={(e) => handleCharacteristicChange(index, e.target.value)}
                                    required
                                    placeholder={`Cecha #${index + 1}`}
                                    style={{ flex: 1 }}
                                />
                                {form.characteristics.length > 1 && (
                                    <button type="button" onClick={() => removeCharacteristic(index)} style={{ padding: "4px 10px" }}>
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addCharacteristic} className="register-button">
                            + Dodaj cechę
                        </button>
                    </div>

                    <div className="form-group">
                        <label htmlFor="photo">Zdjęcie walora</label>
                        <input
                            id="photo"
                            name="photo"
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleFileChange}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="register-button">Dodaj walor</button>
                    <button type="button" className="register-button" onClick={() => nav(-1)}>Wróć</button>
                </form>
            </div>
        </div>
    );
}
