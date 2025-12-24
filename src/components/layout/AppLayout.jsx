import React from 'react';
import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { LayoutDashboard, Ticket, LogOut, PlusCircle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AppLayout() {
    const { user, logout, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/tickets', label: 'Tickets', icon: Ticket },
    ];

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col sticky top-0 h-screen overflow-y-auto">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold tracking-tight">BMA Maintainance</h1>
                    <p className="text-xs text-slate-400 mt-1">Committee Portal</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                                    isActive
                                        ? "bg-slate-800 text-white font-medium"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-3 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-slate-400 truncate">{user.role}</p>
                        </div>
                    </div>
                    <Button
                        variant="destructive"
                        className="w-full justify-start gap-2"
                        size="sm"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
                <header className="bg-white border-b border-slate-200 h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 gap-4">
                    <h2 className="text-lg font-semibold text-slate-800 flex-1 truncate">
                        {navItems.find(i => i.href === location.pathname)?.label || 'Overview'}
                    </h2>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 md:hidden mr-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
                                {user.name.charAt(0)}
                            </div>
                        </div>

                        <Button onClick={() => navigate('/tickets/new')} className="gap-2" size="sm">
                            <PlusCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">New Ticket</span>
                        </Button>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
                        <Outlet />
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex justify-around items-center h-16 pb-safe">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1",
                                isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isActive && "fill-current")} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
                <button
                    onClick={handleLogout}
                    className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-500 hover:text-red-600"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Log out</span>
                </button>
            </div>
        </div>
    );
}
