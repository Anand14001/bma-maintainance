import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { LayoutDashboard, Ticket, LogOut, PlusCircle, Loader2, Users, User, Settings, HelpCircle, BookOpen, FileText, Bug } from 'lucide-react';
import { cn } from '../../lib/utils';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import { CreateTicketForm } from '../tickets/CreateTicketForm';
import { toast } from 'sonner';
import SettingsDialog from '../settings/SettingsDialog';

export default function AppLayout() {
    const { user, logout, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
    const [userMenuAnchor, setUserMenuAnchor] = useState(null);
    const [helpDialogOpen, setHelpDialogOpen] = useState(false);
    const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
    const [settingsInitialTab, setSettingsInitialTab] = useState('general');

    const handleLogout = async () => {
        setUserMenuAnchor(null);
        await logout();
        navigate('/login');
    };

    const handleCreateSuccess = (newTicket) => {
        setIsCreateTicketOpen(false);
        navigate(`/tickets/${newTicket.id}`);
    };

    const handleUserMenuOpen = (event) => {
        setUserMenuAnchor(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchor(null);
    };

    const handleAccountClick = () => {
        handleUserMenuClose();
        setSettingsInitialTab('account');
        setSettingsDialogOpen(true);
    };

    const handleSettingsClick = () => {
        handleUserMenuClose();
        setSettingsInitialTab('general');
        setSettingsDialogOpen(true);
    };

    const handleHelpClick = () => {
        setHelpDialogOpen(true);
    };

    const handleHelpDialogClose = () => {
        setHelpDialogOpen(false);
    };

    const handleHelpCentreClick = () => {
        handleHelpDialogClose();
        toast.info('Help Centre - Coming soon');
    };

    const handleTermsClick = () => {
        handleHelpDialogClose();
        toast.info('Terms and Policies - Coming soon');
    };

    const handleReportBugClick = () => {
        handleHelpDialogClose();
        toast.info('Report Bug - Coming soon');
    };

    const navItems = [
        { href: '/', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/tickets', label: 'Tickets', icon: Ticket },
    ];

    if (user?.role === 'admin') {
        navItems.push({ href: '/users', label: 'Users', icon: Users });
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    return (
        <div className="h-screen bg-slate-50 flex flex-col">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-200 h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">BMA AMC</h1>
                </div>

                <div className="flex items-center gap-2">
                    <div
                        className="flex items-center gap-2 md:hidden mr-2 cursor-pointer hover:bg-slate-100 rounded-full p-1 transition-colors"
                        onClick={handleUserMenuOpen}
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
                            {user.name.charAt(0)}
                        </div>
                    </div>

                    <Button onClick={() => setIsCreateTicketOpen(true)} className="gap-2" size="sm">
                        <PlusCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">New Ticket</span>
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col h-full overflow-y-auto">
                    <nav className="flex-1 p-4 space-y-2 mt-4">
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
                        <div
                            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                            onClick={handleUserMenuOpen}
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                                {user.name.charAt(0)}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate">{user.name}</p>
                                <p className="text-xs text-slate-400 truncate">{user.role}</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0 overflow-y-auto bg-slate-50">
                    <div className="flex-1 p-4 md:p-8">
                        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>

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
                                "text-slate-500 hover:text-slate-900",
                                isActive && "text-slate-900"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isActive && "fill-current")} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>

            {/* User Menu */}
            <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                PaperProps={{
                    className: "mt-2 min-w-[240px]"
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <div className="px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-700">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                    </div>
                </div>

                <MenuItem onClick={handleAccountClick}>
                    <ListItemIcon>
                        <User className="w-4 h-4" />
                    </ListItemIcon>
                    Account
                </MenuItem>
                <MenuItem onClick={handleSettingsClick}>
                    <ListItemIcon>
                        <Settings className="w-4 h-4" />
                    </ListItemIcon>
                    Settings
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleHelpClick}>
                    <ListItemIcon>
                        <HelpCircle className="w-4 h-4" />
                    </ListItemIcon>
                    Help
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout} className="text-red-600">
                    <ListItemIcon>
                        <LogOut className="w-4 h-4 text-red-600" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            {/* Help Dialog */}
            <Dialog
                open={helpDialogOpen}
                onClose={handleHelpDialogClose}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    className: "rounded-lg mx-4"
                }}
            >
                <DialogTitle className="flex items-center justify-between p-6 pb-4">
                    <span className="text-xl font-bold tracking-tight text-slate-900">Help & Support</span>
                    <button
                        onClick={handleHelpDialogClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24" height="24" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className="lucide lucide-x h-5 w-5"
                        >
                            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                        </svg>
                    </button>
                </DialogTitle>
                <DialogContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        <button
                            onClick={handleHelpCentreClick}
                            className="w-full flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors text-left"
                        >
                            <BookOpen className="w-5 h-5 text-slate-600" />
                            <div>
                                <p className="text-sm font-medium text-slate-900">Help Centre</p>
                                <p className="text-xs text-slate-500">Browse articles and guides</p>
                            </div>
                        </button>
                        <button
                            onClick={handleTermsClick}
                            className="w-full flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors text-left"
                        >
                            <FileText className="w-5 h-5 text-slate-600" />
                            <div>
                                <p className="text-sm font-medium text-slate-900">Terms and Policies</p>
                                <p className="text-xs text-slate-500">Read our terms of service</p>
                            </div>
                        </button>
                        <button
                            onClick={handleReportBugClick}
                            className="w-full flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors text-left"
                        >
                            <Bug className="w-5 h-5 text-slate-600" />
                            <div>
                                <p className="text-sm font-medium text-slate-900">Report Bug</p>
                                <p className="text-xs text-slate-500">Let us know about issues</p>
                            </div>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Create Ticket Dialog - MUI Version */}
            <Dialog
                open={isCreateTicketOpen}
                onClose={() => setIsCreateTicketOpen(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    className: "rounded-lg mx-4"
                }}
            >
                <DialogTitle className="flex items-center justify-between p-6 pb-0">
                    <span className="text-xl font-bold tracking-tight text-slate-900">Create New Ticket</span>
                    <button
                        onClick={() => setIsCreateTicketOpen(false)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24" height="24" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className="lucide lucide-x h-5 w-5"
                        >
                            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                        </svg>
                    </button>
                </DialogTitle>
                <DialogContent className="p-6">
                    <div className="mt-2">
                        <CreateTicketForm
                            onSuccess={handleCreateSuccess}
                            onCancel={() => setIsCreateTicketOpen(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Settings Dialog */}
            <SettingsDialog
                open={settingsDialogOpen}
                onClose={() => setSettingsDialogOpen(false)}
                user={user}
                initialTab={settingsInitialTab}
            />
        </div>
    );
}

