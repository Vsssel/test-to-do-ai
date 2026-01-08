export interface User {
    id: string;
    name: string;
    email: string;
}

export interface UserStore {
    user: User;
    setUser: (user: User) => void;
}