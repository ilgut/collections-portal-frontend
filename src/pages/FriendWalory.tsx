import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Walory.css";

type Characteristic = {
    id: number;
    value: string;
};

type Walor = {
    id: number;
    name: string;
    categoryId: number;
    photoBase64: string;
    createdAt?: string;
    characteristics: Characteristic[];
};

type Category = {
    id: number;
    name: string;
};

type FriendItemsResponse = {
    items: Walor[];
    categories: Category[];
};

const sortOptions = [
    { label: "A → Z", value: "az" },
    { label: "Z → A", value: "za" },
    { label: "Data: najnowsze", value: "data-desc" },
    { label: "Data: najstarsze", value: "data-asc" },
    { label: "Kategoria", value: "kategoria" },
];

const FriendWalory: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    const [items, setItems] = useState<Walor[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedSort, setSelectedSort] = useState<string>("az");

    useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token || !id) return;

    fetch(`http://localhost:5099/api/friends/${id}/items`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((data: FriendItemsResponse) => {
            console.log("📦 Полученные данные:", data); // ✅ Добавь это
            setItems(data.items);
            setCategories(data.categories);
        })
        .catch((err) => console.error("❌ Ошибка при получении:", err));
}, [id]);


    const getFilteredAndSortedItems = (): Walor[] => {
        let result = [...items];

        if (selectedCategoryId !== null) {
            result = result.filter((item) => item.categoryId === selectedCategoryId);
        }

        switch (selectedSort) {
            case "az":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "za":
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "data-desc":
                result.sort((a, b) => new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime());
                break;
            case "data-asc":
                result.sort((a, b) => new Date(a.createdAt ?? "").getTime() - new Date(b.createdAt ?? "").getTime());
                break;
            case "kategoria":
                result.sort((a, b) => a.categoryId - b.categoryId);
                break;
        }

        return result;
    };

    const filteredItems = getFilteredAndSortedItems();

    return (
        <div className="walory-page-container">
            <div className="walory-header">
                <button className="btn back-button" onClick={() => nav(-1)}>
                    ← Wróć
                </button>
                <h1>Walory znajomego</h1>
            </div>

            <div className="walory-content-wrapper">
                <aside className="sidebar-left">
                    <h2>Kategorie</h2>
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
                        {filteredItems.map((walor) => (
                            <div className="walor-card" key={walor.id}>
                                <button
                                    className="btn walor-edit-btn"
                                    onClick={() => nav(`/friendwalor/${walor.id}?userId=${id}`)}
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
                        {filteredItems.length === 0 && <p>Brak walorów do wyświetlenia.</p>}
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

export default FriendWalory;
