import React from "react";
import "./MainPage.css";

const Main: React.FC = () => {
    return (
        <div className="main-container">
            <div className="card profile-section">
                <div className="profile-image"></div>
                <div className="profile-details">
                    <p>
                        <strong>Imię:</strong> Test Test
                    </p>
                    <p>
                        <strong>Email:</strong> example@polsl.pl
                    </p>
                </div>
                <button className="btn edit-button">Edytuj</button>
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
                        <li>Moneta Polska 1930</li>
                        <li>Marka Poczty 1955</li>
                    </ul>
                    <button className="btn">więcej</button>
                </div>
            </div>
        </div>
    );
};

export default Main;