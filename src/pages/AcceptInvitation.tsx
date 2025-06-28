import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function AcceptInvitation() {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('Trwa przetwarzanie zaproszenia...');
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const authToken = localStorage.getItem('authToken');

        console.log('Token z URL:', token);
        console.log('Auth token:', authToken);

        if (!token || !authToken) {
            setMessage('Brakuje tokena lub użytkownik nie jest zalogowany.');
            return;
        }

        console.log('>>> Wysyłam zapytanie do backendu:');
        console.log(`http://localhost:5099/api/invitations/accept?token=${token}`);


        fetch(`http://localhost:5099/api/invitations/accept?token=${token}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
            .then(async res => {
                if (res.ok) {
                    setMessage('Zaproszenie zaakceptowane! Przekierowanie...');
                    setTimeout(() => navigate('/friends'), 2000);
                } else {
                    const data = await res.json();
                    setMessage(data.message || 'Wystąpił błąd przy akceptacji.');
                }
            })
            .catch(() => setMessage('Wystąpił błąd połączenia z serwerem.'));
    }, [searchParams, navigate]);

    return (
        <div style={{ padding: '2rem', textAlign: 'center', fontSize: '18px' }}>
            {message}
        </div>
    );
}
