import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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

interface Comment {
    id: number;
    authorId: string;
    authorUserName: string;
    text: string;
    createdAt: string;
}

interface UserProfile {
    photoBase64?: string;
    userName: string;
}

const FriendWalorInfo: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get("userId");

    const [walor, setWalor] = useState<Walor | null>(null);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<Comment[]>([]);
    const [userMap, setUserMap] = useState<Record<string, UserProfile>>({});
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate();

    useEffect(() => {
    console.log("🧪 token:", token);
    console.log("🧪 id:", id);
    console.log("🧪 userId:", userId);

    if (!token || !id || !userId) return;

    const url = `http://localhost:5099/api/items/${id}?userId=${userId}`;
    console.log("🔍 Запрос к API:", url);

    fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then(setWalor)
        .catch((err) => console.error("Błąd ładowania waloru:", err));


    fetch(`http://localhost:5099/api/items/${id}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
    })
        .then((res) => res.json())
        .then(async (data: Comment[]) => {
            setComments(data);

            const uniqueAuthorIds = [...new Set(data.map(c => c.authorId))];
            const newUserMap: Record<string, UserProfile> = {};

            for (const authorId of uniqueAuthorIds) {
                if (!userMap[authorId]) {
                    try {
                        const res = await fetch(`http://localhost:5099/api/user/${authorId}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        const profile = await res.json();
                        newUserMap[authorId] = {
                            userName: profile.userName,
                            photoBase64: profile.photoBase64,
                        };
                    } catch {
                        newUserMap[authorId] = { userName: "Nieznany", photoBase64: "" };
                    }
                }
            }

            setUserMap(prev => ({ ...prev, ...newUserMap }));
        });
}, [id, userId]);


    const handleSendComment = async () => {
        if (!comment.trim() || !id || !token) return;

        try {
            await fetch(`http://localhost:5099/api/items/${id}/comments`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: comment }),
            });

            setComment("");

            const res = await fetch(`http://localhost:5099/api/items/${id}/comments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const updatedComments = await res.json();
            setComments(updatedComments);
        } catch (err) {
            console.error("Błąd dodawania komentarza:", err);
        }
    };

    if (!walor) return <p>Ładowanie…</p>;

    return (
        <div className="item-container">
            <button
                onClick={() => navigate(-1)}
                style={{
                    alignSelf: "flex-start",
                    marginBottom: "16px",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#1877f2",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                ← Wróć
            </button>
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

            <div className="comments-list">
                <h3>Komentarze</h3>
                {comments.map((com) => {
                    const author = userMap[com.authorId];
                    return (
                        <div className="comment-item" key={com.id}>
                            <div className="comment-avatar">
                                {author?.photoBase64 ? (
                                    <img
                                        src={`data:image/jpeg;base64,${author.photoBase64}`}
                                        alt={author.userName}
                                    />
                                ) : (
                                    author?.userName?.charAt(0) || "?"
                                )}
                            </div>
                            <div className="comment-content">
                                <strong>{author?.userName || com.authorUserName}</strong>
                                <span className="comment-date">
                                    {new Date(com.createdAt).toLocaleString()}
                                </span>
                                <p>{com.text}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="comment-box">
                <div className="comment-avatar">✍️</div>
                <input
                    type="text"
                    placeholder="Wprowadź komentarz"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button onClick={handleSendComment} disabled={!comment.trim()}>
                    Wyślij
                </button>
            </div>
        </div>
    );
};

export default FriendWalorInfo;
