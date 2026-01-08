import { create } from "zustand";
import { User, UserStore } from "./type";

export const useUser = create<UserStore>((set) => ({
    user: {
        id: "",
        name: "",
        email: "",
    },
    setUser: (user: User) => set({ user: user })
}))