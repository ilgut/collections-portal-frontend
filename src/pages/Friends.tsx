import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Friends.css';

interface FriendDto {
    id: string;
    userName: string;
    email: string;
}

export default function Friends() {
    const [friends, setFriends] = useState<FriendDto[]>([]);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteError, setInviteError] = useState('');
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;
        fetch('http://localhost:5099/api/friends', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(setFriends)
            .catch(() => setError('Nie udało się pobrać znajomych.'));
    }, []);

    const handleInvite = () => setShowModal(true);

    const handleSendInvite = async () => {
        setInviteError('');
        if (!inviteEmail) {
            setInviteError('Wprowadź adres e-mail.');
            return;
        }

        const response = await fetch('http://localhost:5099/api/invitations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(inviteEmail)
        });

        if (response.ok) {
            setShowModal(false);
            setInviteEmail('');
        } else {
            const data = await response.json();
            setInviteError(data.message || 'Nie udało się wysłać zaproszenia.');
        }
    };

    return (
        <div className="friends-container">
            <div className="friends-box">
                <div className="friends-header">
                    <h2>Znajomi</h2>
                    <button onClick={handleInvite} className="invite-button">Zaproś znajomego</button>
                </div>

                {error && <div className="error">{error}</div>}

                {friends.map(f => (
                    <div className="friend-card" key={f.id}>
                        <div className="friend-main">
                            <span className="friend-name">{f.userName}</span>
                            <button onClick={() => handleProfile(f.id)} className="profile-button">
                                Profil
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Wyślij zaproszenie</h3>
                        <input
                            type="email"
                            placeholder="Email znajomego"
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                        />
                        {inviteError && <div className="error">{inviteError}</div>}
                        <div className="modal-buttons">
                            <button onClick={handleSendInvite} className="invite-button">Wyślij</button>
                            <button onClick={() => setShowModal(false)}>Anuluj</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    function handleProfile(id: string) {
        navigate(`/friend/${id}`);
    }
}
