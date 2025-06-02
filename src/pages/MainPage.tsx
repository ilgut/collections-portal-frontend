import React from "react";
import "./MainPage.css";
import { useNavigate } from "react-router-dom";

const Main: React.FC = () => {
    const nav = useNavigate();

    return (
        <div className="main-container">
            <div className="card profile-section">
                <button 
                    className="btn edit-button" 
                    onClick={() => nav("/Edit")}
                >
                    Edytuj
                </button>

                <div className="profile-image"></div>

                <div className="profile-details">
                    <div className="profile-column">
                        <p><strong>Imię:</strong> Test Test</p>
                        <p><strong>Email:</strong> example@polsl.pl</p>
                        <p><strong>Telefon:</strong> +48 123 456 789</p>
                    </div>
                    <div className="profile-column">
                        <p><strong>Liczba kolekcji:</strong> 5</p>
                        <p><strong>Liczba znajomych:</strong> 12</p>
                        <p><strong>Miasto:</strong> Gliwice</p>
                    </div>
                </div>

                <div className="profile-extra">
                    <p>
                        <strong>Opis:</strong><br />
                        Cześć! Nazywam się Test Test i jestem zapalonym kolekcjonerem monet i znaczków pocztowych z całego świata. 
                        Interesuję się historią, numizmatyką i podróżami. Moim celem jest stworzenie jednej z największych prywatnych kolekcji w Polsce. 
                        Uwielbiam dzielić się swoją pasją z innymi i chętnie nawiązuję nowe znajomości z kolekcjonerami z różnych zakątków świata.
                    </p>
                    <p><strong>Ranga:</strong> Ekspert</p>
                </div>
            </div>

            <div className="content-section">
                <div className="card column friends">
                    <h2>Znajomi</h2>
                    <ul className="item-list">
                        <li>Pierwszy Znajomy</li>
                        <li>Drugi Znajomy</li>
                    </ul>
                    <button className="btn">więcej</button>
                </div>

                <div className="card column walory">
                    <h2>Walory</h2>
                    <ul className="item-list">
                        <li>
                            <div className="item-preview" />
                            <span className="item-name">Moneta Polska 5 zł, 1930</span>
                        </li>
                        <li>
                            <div className="item-preview" />
                            <span className="item-name">Znaczek Poczty, 1955</span>
                        </li>
                    </ul>
                    <button 
                        className="btn"
                        onClick={() => nav("/Walory")}
                        >
                        więcej
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Main;
