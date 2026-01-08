"use client";

import Link from "next/link";
import { Avatar } from "../../../features";
import { useUser } from "../../../shared";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
    const user = useUser((state) => state.user);

    return (
    <header className="flex items-center p-3 bg-gray-100 justify-between">
        <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold">Task Management System</h1>
            <nav>
                <ul className="flex gap-4">
                    <li><Link href="/workspaces">Workspaces</Link></li>
                </ul>
            </nav>
        </div>
        <div  className="flex items-center gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button type="button" className="flex items-center gap-3">
                        <Avatar />
                        <span className="text-sm font-bold">{user.name}</span>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/logout">Logout</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </header>
  );
}