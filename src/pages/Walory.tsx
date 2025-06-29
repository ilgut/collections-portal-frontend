import React, { useEffect, useState } from "react";
import "./Walory.css";
import { useNavigate } from "react-router-dom";

type Characteristic = {
    id: number;
    value: string;
};

type Walor = {
    id: number;
    name: string;
    categoryId: number;
    photoBase64: string;
    characteristics: Characteristic[];
    createdAt?: string;
};

type Category = {
    id: number;
    name: string;
    ownerId: string;
};

type User = {
    id: string;
};

const sortOptions = [
    { label: "A → Z", value: "az" },
    { label: "Z → A", value: "za" },
    { label: "Data: najnowsze", value: "data-desc" },
    { label: "Data: najstarsze", value: "data-asc" },
    { label: "Kategoria", value: "kategoria" },
];

const WaloryPage: React.FC = () => {
    const nav = useNavigate();
    const [walory, setWalory] = useState<Walor[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedSort, setSelectedSort] = useState<string>("az");

    // Pobierz kategorie (należące do użytkownika)
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        fetch("http://localhost:5099/api/category", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then((data: Category[]) => {
                setCategories(data);
            })
            .catch(err => console.error("❌ Błąd pobierania kategorii:", err));
    }, []);

    // Pobierz walory z filtrem
    const fetchWalory = async (categoryId: number | null, sort: string) => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const queryParams = new URLSearchParams();
        if (categoryId !== null) queryParams.append("categoryId", categoryId.toString());

        const url = `http://localhost:5099/api/items?${queryParams.toString()}`;

        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Błąd pobierania danych");

            let data: Walor[] = await response.json();

            // Sortowanie
            data = [...data];
            switch (sort) {
                case "az":
                    data.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case "za":
                    data.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case "data-desc":
                    data.sort((a, b) => new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime());
                    break;
                case "data-asc":
                    data.sort((a, b) => new Date(a.createdAt ?? "").getTime() - new Date(b.createdAt ?? "").getTime());
                    break;
                case "kategoria":
                    data.sort((a, b) => a.categoryId - b.categoryId);
                    break;
                default:
                    break;
            }

            setWalory(data);
        } catch (err) {
            console.error("❌ Błąd pobierania walorów:", err);
        }
    };

    useEffect(() => {
        fetchWalory(selectedCategoryId, selectedSort);
    }, [selectedCategoryId, selectedSort]);

    const handleExport = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Nie jesteś zalogowany!");
            return;
        }

        const queryParams = new URLSearchParams();
        if (selectedCategoryId !== null) queryParams.append("categoryId", selectedCategoryId.toString());
        if (selectedSort) queryParams.append("sort", selectedSort);

        const url = `http://localhost:5099/api/items/export/xlsx?${queryParams.toString()}`;

        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Błąd eksportu.");

            const blob = await response.blob();
            const urlBlob = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = urlBlob;
            a.download = `walory-${new Date().toISOString().slice(0, 10)}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(urlBlob);
        } catch (error) {
            console.error("❌ Błąd eksportu:", error);
            alert("Wystąpił problem przy eksporcie.");
        }
    };

    return (
        <div className="walory-page-container">
            <div className="walory-header">
                <button className="btn back-button" onClick={() => nav(-1)}>
                    ← Wróć
                </button>
                <h1>Wszystkie Walory</h1>
                <div style={{ display: "flex", gap: "12px" }}>
                    <button className="btn add-button" onClick={() => nav("/AddWalor")}>
                        + Dodaj walor
                    </button>
                    <button className="btn add-button" onClick={handleExport}>
                        ⬇️ Eksportuj do Excel
                    </button>
                </div>
            </div>

            <div className="walory-content-wrapper">
                <aside className="sidebar-left">
                    <h2>Kategorie użytkownika</h2>
                    <form className="category-form">
                        <label className="category-label">
                            <input
                                type="radio"
                                name="category"
                                value="wszystkie"
                                checked={selectedCategoryId === null}
                                onChange={() => setSelectedCategoryId(null)}
                            />
                            <span className="category-name">Wszystkie</span>
                        </label>
                        {categories.map((cat) => (
                            <label key={cat.id} className="category-label">
                                <input
                                    type="radio"
                                    name="category"
                                    value={cat.id}
                                    checked={selectedCategoryId === cat.id}
                                    onChange={() => setSelectedCategoryId(cat.id)}
                                />
                                <span className="category-name">{cat.name}</span>
                            </label>
                        ))}
                    </form>
                </aside>

                <main className="main-content">
                    <div className="walory-list-container">
                        {walory.map((walor) => (
                            <div className="walor-card" key={walor.id}>
                                <button
                                    className="btn walor-edit-btn"
                                    onClick={() => nav(`/walor/${walor.id}`)}
                                >
                                    Więcej
                                </button>
                                <img
                                    src={`data:image/jpeg;base64,${walor.photoBase64}`}
                                    alt={walor.name}
                                    className="walor-image"
                                />
                                <div className="walor-content">
                                    <h3 className="walor-title">{walor.name}</h3>
                                    <p className="walor-desc">
                                        {walor.characteristics.map((c) => c.value).join(", ")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                <aside className="sidebar-right">
                    <h2>Sortuj Walory</h2>
                    <div className="sort-controls">
                        {sortOptions.map(({ label, value }) => (
                            <label key={value}>
                                <input
                                    type="radio"
                                    name="sort"
                                    value={value}
                                    checked={selectedSort === value}
                                    onChange={() => setSelectedSort(value)}
                                />
                                <span>{label}</span>
                            </label>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default WaloryPage;
