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

const WaloryPage: React.FC = () => {
    const nav = useNavigate();
    const [walory, setWalory] = useState<Walor[]>([]);

    useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("🔑 TOKEN:", token);

    fetch("http://localhost:5099/api/items", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("🟢 Otrzymane dane:", data);
            setWalory(data);
        })
        .catch((err) => console.error("❌ Błąd pobierania walorów:", err));
    }, []);


    const categories = ["Wszystkie", "Monety", "Znaczki", "Banknoty", "Medale", "Inne"];

    return (
        <div className="walory-page-container">
            <div className="walory-header">
                <button className="btn back-button" onClick={() => nav(-1)}>
                    ← Wróć
                </button>
                <h1>Wszystkie Walory</h1>
                <button className="btn add-button" onClick={() => nav("/AddWalor")}>
                    + Dodaj walor
                </button>
            </div>


            <div className="walory-content-wrapper">
                <aside className="sidebar-left">
                    <h2>Kategorie</h2>
                    <form className="category-form">
                        {categories.map((cat, idx) => (
                            <label key={idx} className="category-label">
                                <input
                                    type="radio"
                                    name="category"
                                    value={cat}
                                    defaultChecked={cat === "Wszystkie"}
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
                                <button className="btn walor-edit-btn" onClick={() => nav(`/walor/${walor.id}`)}>Więcej</button>
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
                        <label>
                            <input type="radio" name="sort" value="alfabet" defaultChecked />
                            <span>Alfabetycznie</span>
                        </label>
                        <label>
                            <input type="radio" name="sort" value="dataDodania" />
                            <span>Data dodania</span>
                        </label>
                        <label>
                            <input type="radio" name="sort" value="kategoria" />
                            <span>Kategoria</span>
                        </label>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default WaloryPage;
