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
};

const categoryMap: Record<string, number | null> = {
    Wszystkie: null,
    Monety: 1,
    Znaczki: 2,
    Banknoty: 3,
    Medale: 4,
    Inne: 5
};

const sortOptions = [
    { label: "Alfabetycznie", value: "alfabet" },
    { label: "Data dodania", value: "dataDodania" },
    { label: "Kategoria", value: "kategoria" },
];

const WaloryPage: React.FC = () => {
    const nav = useNavigate();
    const [walory, setWalory] = useState<Walor[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("Wszystkie");
    const [selectedSort, setSelectedSort] = useState<string>("alfabet");

    const fetchWalory = async (category: string, sort: string) => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const categoryId = categoryMap[category];
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

            // 🔽 Сортировка на фронте:
            data = sort === "dataDodania"
                ? [...data].sort((a, b) => {
                    const dateA = new Date((a as any).createdAt || 0).getTime();
                    const dateB = new Date((b as any).createdAt || 0).getTime();
                    return dateB - dateA; // newest first
                })
                : sort === "kategoria"
                ? [...data].sort((a, b) => a.categoryId - b.categoryId)
                : [...data].sort((a, b) => a.name.localeCompare(b.name));

            setWalory(data);
        } catch (err) {
            console.error("❌ Błąd pobierania walorów:", err);
        }
    };

    useEffect(() => {
        fetchWalory(selectedCategory, selectedSort);
    }, [selectedCategory, selectedSort]);

    const handleExport = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Nie jesteś zalogowany!");
            return;
        }

        const categoryId = categoryMap[selectedCategory];
        const queryParams = new URLSearchParams();
        if (categoryId !== null) queryParams.append("categoryId", categoryId.toString());
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

    const categories = Object.keys(categoryMap);

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
                    <h2>Kategorie</h2>
                    <form className="category-form">
                        {categories.map((cat) => (
                            <label key={cat} className="category-label">
                                <input
                                    type="radio"
                                    name="category"
                                    value={cat}
                                    checked={selectedCategory === cat}
                                    onChange={() => setSelectedCategory(cat)}
                                />
                                <span className="category-name">{cat}</span>
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
