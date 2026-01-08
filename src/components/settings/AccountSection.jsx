import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Mail, Calendar, Shield, CheckCircle, AlertCircle, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DeleteAccountDialog from './DeleteAccountDialog';
import { authService } from '../../services/auth.service';
import { auth } from '../../lib/firebase';

export default function AccountSection({ user, onClose }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isSendingVerification, setIsSendingVerification] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    // Real-time email verification status
    useEffect(() => {
        // Initial check
        const currentUser = auth.currentUser;
        if (currentUser) {
            setIsEmailVerified(currentUser.emailVerified);
        }

        // Listen for auth state changes
        const unsubscribe = authService.onAuthStateChanged((user) => {
            if (user) {
                setIsEmailVerified(user.emailVerified);
            }
        });

        // Polling mechanism to check verification status
        let pollInterval;
        if (currentUser && !currentUser.emailVerified) {
            pollInterval = setInterval(async () => {
                await auth.currentUser?.reload();
                const verified = auth.currentUser?.emailVerified || false;
                setIsEmailVerified(verified);
                if (verified) {
                    clearInterval(pollInterval);
                    toast.success('Email verified successfully!');
                }
            }, 3000); // Check every 3 seconds
        }

        return () => {
            unsubscribe();
            if (pollInterval) clearInterval(pollInterval);
        };
    }, []);

    const handleSendVerification = async () => {
        setIsSendingVerification(true);
        try {
            await authService.sendVerificationEmail();
            toast.success('Verification email sent to ' + user.email);
        } catch (error) {
            if (error.message.includes('already verified')) {
                toast.info('Your email is already verified');
            } else {
                toast.error('Failed to send verification email: ' + error.message);
            }
        } finally {
            setIsSendingVerification(false);
        }
    };

    const handleLogout = async () => {
        onClose();
        await logout();
        navigate('/login');
        toast.success('Logged out successfully');
    };

    return (
        <div className="space-y-6">
            {/* Account Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Account Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-700">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg text-slate-900">{user?.name}</h3>
                                <p className="text-sm text-slate-500">{user?.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Role</p>
                                    <p className="text-sm font-medium text-slate-900 capitalize">{user?.role || 'User'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Member Since</p>
                                    <p className="text-sm font-medium text-slate-900">
                                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            year: 'numeric'
                                        }) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Email Verification */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Email Verification</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isEmailVerified ? 'bg-green-50' : 'bg-orange-50'
                                }`}>
                                {isEmailVerified ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-orange-600" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900">
                                    {isEmailVerified ? 'Email Verified' : 'Email Not Verified'}
                                </p>
                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                        {!isEmailVerified && (
                            <Button
                                size="sm"
                                onClick={handleSendVerification}
                                disabled={isSendingVerification}
                                className="w-full sm:w-auto flex-shrink-0"
                            >
                                {isSendingVerification ? 'Sending...' : 'Send Verification'}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button
                        variant="outline"
                        className="w-full sm:w-auto justify-start gap-2"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
                <CardHeader>
                    <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <p className="text-sm text-slate-600">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <Button
                            variant="destructive"
                            className="w-full sm:w-auto justify-start gap-2"
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <DeleteAccountDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            />
        </div>
    );
}
