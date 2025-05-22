import { createContext, useContext, useState, type ReactNode } from 'react';
import { login, register, type Credentials } from '@/api/auth.service';

interface AuthState {
    token: string | null;
    login: (c: Credentials) => Promise<void>;
    register: (c: Credentials) => Promise<void>;
    logout: () => void;
}

const AuthCtx = createContext<AuthState>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem('token')
    );

    const handleAuth = async (
        fn: (c: Credentials) => Promise<{ data: string }>,
        credentials: Credentials
    ) => {
        const { data } = await fn(credentials);   // backend zwraca token jako plain text
        localStorage.setItem('token', data);
        setToken(data);
    };

    return (
        <AuthCtx.Provider
            value={{
                token,
                login: (c) => handleAuth(login, c),
                register: (c) => handleAuth(register, c),
                logout: () => {
                    localStorage.removeItem('token');
                    setToken(null);
                },
            }}
        >
            {children}
        </AuthCtx.Provider>
    );
};

export const useAuth = () => useContext(AuthCtx);
