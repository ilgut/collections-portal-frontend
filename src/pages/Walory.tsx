// src/pages/WaloryPage.tsx
import React from "react";
import "./Walory.css";
import { useNavigate } from "react-router-dom";

const WaloryPage: React.FC = () => {
    const nav = useNavigate();

    // Przykładowe walory (bez logiki filtrowania)
    const sampleWalory = [
        {
            title: "Moneta Polska 1930",
            imgAlt: "Moneta Polska 1930",
            imgSrc: "https://via.placeholder.com/300x180",
            description:
                "Klasyczna moneta okolicznościowa z roku 1930, wybita w srebrze 800‰. Posiada wizerunek orła w koronie oraz ozdobny rewers z inskrypcją „RZECZPOSPOLITA POLSKA”.",
            category: "Monety",
        },
        {
            title: "Marka Poczty 1955",
            imgAlt: "Marka Poczty 1955",
            imgSrc: "https://via.placeholder.com/300x180",
            description:
                "Polska znaczek pocztowy z 1955 roku upamiętniający 210. rocznicę powstania poczty. Grafika przedstawia herb miasta i stylizowaną pocztówkę.",
            category: "Znaczki",
        },
        {
            title: "Banknot 100 Złotych 1924",
            imgAlt: "Banknot 100 Złotych 1924",
            imgSrc: "https://via.placeholder.com/300x180",
            description:
                "Rzadki banknot stuzłotowy z 1924 roku, seria „E”. Na awersie widnieje portret Tadeusza Kościuszki, na rewersie – wizerunek orła i żubrów.",
            category: "Banknoty",
        },
        {
            title: "Medal Powstańczy 1944",
            imgAlt: "Medal Powstańczy 1944",
            imgSrc: "https://via.placeholder.com/300x180",
            description:
                "Medal wręczany weteranom Powstania Warszawskiego. Na awersie napis „PAMIĘCI POLEGŁYM ZA WOLNOŚĆ OJCZYZNY”, na rewersie – godło Polski.",
            category: "Medale",
        },
        {
            title: "Znaczek Fi 1234 1963",
            imgAlt: "Znaczek Fi 1234 1963",
            imgSrc: "https://via.placeholder.com/300x180",
            description:
                "Znaczek filatelistyczny z 1963 roku (Fi 1234), wydany z okazji Olimpiady. Motyw: sportowiec z pochodnią i tło przedstawiające Stadion Dziesięciolecia.",
            category: "Znaczki",
        },
    ];

    // Przykładowe kategorie (hardcoded)
    const categories = [
        "Wszystkie",
        "Monety",
        "Znaczki",
        "Banknoty",
        "Medale",
        "Inne",
    ];

    return (
        <div className="walory-page-container">
            <div className="walory-header">
                <button className="btn back-button" onClick={() => nav(-1)}>
                    ← Wróć
                </button>
                <h1>Wszystkie Walory</h1>
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
                        {sampleWalory.map((walor, idx) => (
                            <div className="walor-card" key={idx}>
                                <button className="btn walor-edit-btn">Edytuj</button>
                                <img
                                    src={walor.imgSrc}
                                    alt={walor.imgAlt}
                                    className="walor-image"
                                />
                                <div className="walor-content">
                                    <h3 className="walor-title">{walor.title}</h3>
                                    <p className="walor-desc">{walor.description}</p>
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
