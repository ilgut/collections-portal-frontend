import { api } from './axios';

export interface Credentials { email: string; password: string; }

export const register = (data: Credentials) =>
    api.post<string>('/Account/register', data);

export const login = (data: Credentials) =>
    api.post<string>('/Account/login', data);
