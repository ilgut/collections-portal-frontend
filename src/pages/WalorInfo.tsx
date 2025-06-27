import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./WalorInfo.css";

interface Characteristic {
    id: number;
    value: string;
}

interface Walor {
    id: number;
    name: string;
    photoBase64: string;
    characteristics: Characteristic[];
}

const WalorInfo: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [walor, setWalor] = useState<Walor | null>(null);
    const [comment, setComment] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        fetch(`http://localhost:5099/api/items/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => setWalor(data))
            .catch((err) => console.error("Błąd ładowania waloru:", err));
    }, [id]);

    if (!walor) return <p>Ładowanie…</p>;

    return (
        <div className="item-container">
            <div className="item-main">
                <div className="item-info">
                    <h2>{walor.name}</h2>
                    <h3>Cechy:</h3>
                    <ul>
                        {walor.characteristics.map((c) => (
                            <li key={c.id}>{c.value}</li>
                        ))}
                    </ul>
                </div>
                <div className="item-photo">
                    <img
                        src={`data:image/jpeg;base64,${walor.photoBase64}`}
                        alt={walor.name}
                        loading="lazy"
                    />
                </div>
            </div>

            <div className="comment-box">
                <div className="comment-avatar">Z</div>
                <input
                    type="text"
                    placeholder="Wprowadź komentarz"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button disabled>Wyślij</button>
            </div>
        </div>
    );
};

export default WalorInfo;
    