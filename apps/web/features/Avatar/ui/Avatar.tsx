"use client";
import { useUser } from "../../../shared";


export default function Avatar() {
    const user = useUser((state) => state.user);

    return (
        <div className="w-10 h-10 rounded-full bg-gray-200">
            {user.name && 
            <div className="w-10 h-10 rounded-full bg-gray-200">
                <span className="text-sm font-bold">{user.name.charAt(0)}</span>
            </div>}
        </div>
    )
}