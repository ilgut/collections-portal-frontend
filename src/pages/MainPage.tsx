import React, { useEffect, useState } from "react";
import "./MainPage.css";
import { useNavigate } from "react-router-dom";

interface Walor {
    id: number;
    name: string;
    photoBase64: string;
}

interface UserProfile {
    id: string;
    userName: string;
    email: string;
    bio: string;
    photoBase64: string;
}

interface FriendDto {
    id: string;
    userName: string;
    email: string;
    photoBase64?: string;
}

const Main: React.FC = () => {
    const nav = useNavigate();
    const [walory, setWalory] = useState<Walor[]>([]);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [friends, setFriends] = useState<FriendDto[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        fetch("http://localhost:5099/api/items", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => setWalory(data))
            .catch((err) => console.error("❌ Błąd pobierania walorów:", err));

        fetch("http://localhost:5099/api/user/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => setUser(data))
            .catch((err) => console.error("❌ Błąd pobierania profilu:", err));

        fetch("http://localhost:5099/api/friends", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => setFriends(data))
            .catch((err) => console.error("❌ Błąd pobierania znajomych:", err));
    }, []);

    return (
        <div className="main-container">
            <div className="card profile-section">
                <button className="btn edit-button" onClick={() => nav("/Edit")}>
                    Edytuj
                </button>

                <div className="profile-image" style={{
                    backgroundImage: user?.photoBase64
                        ? `url(data:image/jpeg;base64,${user.photoBase64})`
                        : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }} />

                <div className="profile-details">
                    <div className="profile-column">
                        <p><strong>Login:</strong> {user?.userName || "..."}</p>
                        <p><strong>Email:</strong> {user?.email || "..."}</p>
                    </div>
                    <div className="profile-column">
                        <p><strong>Liczba kolekcji:</strong> {walory.length}</p>
                        <p><strong>Liczba znajomych:</strong> {friends.length}</p>
                    </div>
                </div>

                <div className="profile-extra">
                    <p><strong>Opis:</strong><br />{user?.bio || "Brak opisu"}</p>
                </div>
            </div>

            <div className="content-section">
                <div className="card column friends">
                <h2>Znajomi</h2>
                <ul className="item-list friend-list">
                    {friends.slice(0, 5).map(friend => (
                        <li key={friend.id}>
                            {friend.photoBase64 && (
                                <img
                                    className="friend-avatar"
                                    src={`data:image/jpeg;base64,${friend.photoBase64}`}
                                    alt={friend.userName}
                                />
                            )}
                            <div className="friend-info">
                                <span className="friend-name">{friend.userName}</span>
                            </div>
                        </li>
                    ))}
                    {friends.length === 0 && <li>Brak znajomych do wyświetlenia</li>}
                </ul>

                <button className="btn" onClick={() => nav("/Friends")}>
                    więcej
                </button>
                </div>

                <div className="card column walory">
                    <h2>Walory</h2>
                    <ul className="item-list">
                        {walory.map(walor => (
                            <li key={walor.id}>
                                <img
                                    className="item-preview"
                                    src={`data:image/jpeg;base64,${walor.photoBase64}`}
                                    alt={walor.name}
                                />
                                <span className="item-name">{walor.name}</span>
                            </li>
                        ))}
                        {walory.length === 0 && <li>Brak walorów do wyświetlenia</li>}
                    </ul>
                    <button className="btn" onClick={() => nav("/Walory")}>
                        więcej
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Main;
