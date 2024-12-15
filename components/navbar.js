'use client';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut, Settings, Bell } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const navItems = [
    { name: "Dashboard", href: "/dashboard", auth: true },
    { name: "Logements", href: "/dashboard/properties", auth: true },
    { name: "SCI", href: "/dashboard/companies", auth: true },
    { name: "Documents", href: "/dashboard/documents", auth: true },
    { name: "Contact", href: "/contact", auth: false },
  ];

  const filteredNavItems = navItems.filter(
    item => !item.auth || (item.auth && session)
  );

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bell className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 w-2 h-2 p-0" />
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src={session?.user?.image} />
            <AvatarFallback>{getInitials(session?.user?.name)}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="fixed w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg z-50 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              EasyRent
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  {item.name}
                </Link>
              ))}
              {!session && !isLoading && (
                <Button variant="outline" className="ml-4" onClick={handleSignIn}>
                  Se connecter
                </Button>
              )}
              {session && <UserMenu />}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {session && <UserMenu />}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 ml-4 rounded-md text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-zinc-900">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {!session && !isLoading && (
              <Button variant="outline" className="w-full mt-4" onClick={handleSignIn}>
                Se connecter
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
