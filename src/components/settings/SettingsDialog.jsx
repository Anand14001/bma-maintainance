import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { User, Palette, Shield } from 'lucide-react';
import { useMediaQuery } from '@mui/material';
import GeneralSection from './GeneralSection';
import AppearanceSection from './AppearanceSection';
import AccountSection from './AccountSection';

export default function SettingsDialog({ open, onClose, user, initialTab = 'general' }) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const isMobile = useMediaQuery('(max-width:900px)');

    const tabs = [
        { id: 'general', label: 'General', icon: User },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'account', label: 'Account', icon: Shield }
    ];

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleClose = () => {
        setActiveTab(initialTab);
        onClose();
    };

    // Update active tab when initialTab prop changes
    React.useEffect(() => {
        if (open) {
            setActiveTab(initialTab);
        }
    }, [open, initialTab]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullScreen={isMobile}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                className: "rounded-lg",
                sx: { height: isMobile ? '100%' : '85vh', maxHeight: '900px' }
            }}
        >
            <DialogTitle className="flex items-center justify-between p-6 pb-4 border-b border-slate-200">
                <span className="text-2xl font-bold tracking-tight text-slate-900">Settings</span>
                <button
                    onClick={handleClose}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="h-5 w-5"
                    >
                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                    </svg>
                </button>
            </DialogTitle>

            <DialogContent className="p-0" sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
                {/* Desktop Sidebar / Mobile Tabs */}
                {isMobile ? (
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            '& .MuiTab-root': {
                                minHeight: 60,
                                textTransform: 'none',
                                fontSize: '0.875rem',
                                fontWeight: 500
                            }
                        }}
                    >
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <Tab
                                    key={tab.id}
                                    value={tab.id}
                                    label={tab.label}
                                    icon={<Icon className="w-5 h-5" />}
                                    iconPosition="top"
                                />
                            );
                        })}
                    </Tabs>
                ) : (
                    <div className="w-64 border-r border-slate-200 bg-slate-50">
                        <List className="p-4">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <ListItem key={tab.id} disablePadding className="mb-1">
                                        <ListItemButton
                                            selected={isActive}
                                            onClick={() => setActiveTab(tab.id)}
                                            sx={{
                                                borderRadius: 2,
                                                '&.Mui-selected': {
                                                    backgroundColor: 'rgb(241 245 249)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgb(226 232 240)'
                                                    }
                                                }
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <Icon className={`w-5 h-5 ${isActive ? 'text-slate-900' : 'text-slate-500'}`} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={tab.label}
                                                primaryTypographyProps={{
                                                    fontSize: '0.875rem',
                                                    fontWeight: isActive ? 600 : 500,
                                                    color: isActive ? 'rgb(15 23 42)' : 'rgb(100 116 139)'
                                                }}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        {activeTab === 'general' && <GeneralSection user={user} />}
                        {activeTab === 'appearance' && <AppearanceSection />}
                        {activeTab === 'account' && <AccountSection user={user} onClose={handleClose} />}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
