import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MainPage.css"; // содержит нужные стили .btn и layout

interface Walor {
    id: number;
    name: string;
    photoBase64: string;
}

interface FriendDto {
    id: string;
    userName: string;
    photoBase64?: string;
}

interface FriendProfileDto {
    id: string;
    userName: string;
    bio: string;
    photoBase64?: string;
    items: Walor[];
    categories: any[];
}

const FriendProfile: React.FC = () => {
    const { id } = useParams();
    const nav = useNavigate();

    const [friend, setFriend] = useState<FriendProfileDto>({
        id: "",
        userName: "",
        bio: "",
        photoBase64: "",
        items: [],
        categories: []
    });

    const [friendList, setFriendList] = useState<FriendDto[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        fetch(`http://localhost:5099/api/friends/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setFriend(data))
            .catch(err => console.error("❌ Błąd profilu znajomego:", err));

        fetch(`http://localhost:5099/api/friends/${id}/friends`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setFriendList(data))
            .catch(err => console.error("❌ Błąd listy znajomych znajomego:", err));
    }, [id]);

    return (
        <div className="main-container">
            <button className="btn" style={{ alignSelf: "flex-start", marginBottom: "1rem" }} onClick={() => nav(-1)}>
                ← Wróć
            </button>

            <div className="card profile-section">
                <div className="profile-image" style={{
                    backgroundImage: friend.photoBase64
                        ? `url(data:image/jpeg;base64,${friend.photoBase64})`
                        : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }} />

                <div className="profile-details">
                    <div className="profile-column">
                        <p><strong>Login:</strong> {friend.userName}</p>
                    </div>
                    <div className="profile-column">
                        <p><strong>Liczba kolekcji:</strong> {friend.items?.length || 0}</p>
                        <p><strong>Liczba znajomych:</strong> {friendList?.length || 0}</p>
                    </div>
                </div>

                <div className="profile-extra">
                    <p><strong>Opis:</strong><br />{friend.bio || "Brak opisu"}</p>
                </div>
            </div>

            <div className="content-section">
                <div className="card column friends">
                    <h2>Znajomi</h2>
                    <ul className="item-list friend-list">
                        {friendList.slice(0, 5).map(fr => (
                            <li key={fr.id}>
                                {fr.photoBase64 && (
                                    <img
                                        className="friend-avatar"
                                        src={`data:image/jpeg;base64,${fr.photoBase64}`}
                                        alt={fr.userName}
                                    />
                                )}
                                <span className="friend-name">{fr.userName}</span>
                            </li>
                        ))}
                        {friendList.length === 0 && <li>Brak znajomych do wyświetlenia</li>}
                    </ul>
                    <button className="btn" onClick={() => nav("/Friends")}>więcej</button>
                </div>

                <div className="card column walory">
                    <h2>Walory</h2>
                    <ul className="item-list">
                        {friend.items.slice(0, 3).map(walor => (
                            <li key={walor.id}>
                                <img
                                    className="item-preview"
                                    src={`data:image/jpeg;base64,${walor.photoBase64}`}
                                    alt={walor.name}
                                />
                                <span className="item-name">{walor.name}</span>
                            </li>
                        ))}
                        {friend.items.length === 0 && <li>Brak walorów do wyświetlenia</li>}
                    </ul>
                    <button className="btn" onClick={() => nav(`/friend/${friend.id}/friendwalory`)}>więcej</button>
                </div>
            </div>
        </div>
    );
};

export default FriendProfile;
