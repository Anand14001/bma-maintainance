import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { Loader2, Lock, Check, X } from 'lucide-react';
import LinearProgress from '@mui/material/LinearProgress';

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function GeneralSection({ user }) {
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: profileErrors, isDirty } } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
        }
    });

    const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors }, watch, reset: resetPassword } = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const newPassword = watch('newPassword', '');

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };
        let strength = 0;
        if (password.length >= 6) strength += 25;
        if (password.length >= 10) strength += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
        if (/\d/.test(password)) strength += 12.5;
        if (/[^a-zA-Z\d]/.test(password)) strength += 12.5;

        if (strength < 40) return { strength, label: 'Weak', color: 'error' };
        if (strength < 70) return { strength, label: 'Fair', color: 'warning' };
        return { strength, label: 'Strong', color: 'success' };
    };

    const passwordStrength = getPasswordStrength(newPassword);

    const onUpdateProfile = async (data) => {
        setIsUpdatingProfile(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const onUpdatePassword = async (data) => {
        setIsUpdatingPassword(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Password updated successfully');
            resetPassword();
        } catch (error) {
            toast.error('Failed to update password');
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Update Profile */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                {...registerProfile('name')}
                                placeholder="Enter your name"
                            />
                            {profileErrors.name && (
                                <p className="text-xs text-red-500">{profileErrors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="bg-slate-50"
                                />
                                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                            </div>
                            <p className="text-xs text-slate-500">Email cannot be changed</p>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button
                                type="submit"
                                disabled={!isDirty || isUpdatingProfile}
                            >
                                {isUpdatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmitPassword(onUpdatePassword)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                {...registerPassword('currentPassword')}
                                placeholder="Enter current password"
                            />
                            {passwordErrors.currentPassword && (
                                <p className="text-xs text-red-500">{passwordErrors.currentPassword.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                {...registerPassword('newPassword')}
                                placeholder="Enter new password"
                            />
                            {passwordErrors.newPassword && (
                                <p className="text-xs text-red-500">{passwordErrors.newPassword.message}</p>
                            )}

                            {newPassword && (
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500">Password strength:</span>
                                        <span className={`font-medium ${passwordStrength.color === 'error' ? 'text-red-600' :
                                                passwordStrength.color === 'warning' ? 'text-orange-600' :
                                                    'text-green-600'
                                            }`}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <LinearProgress
                                        variant="determinate"
                                        value={passwordStrength.strength}
                                        color={passwordStrength.color}
                                        sx={{ height: 4, borderRadius: 2 }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                {...registerPassword('confirmPassword')}
                                placeholder="Confirm new password"
                            />
                            {passwordErrors.confirmPassword && (
                                <p className="text-xs text-red-500">{passwordErrors.confirmPassword.message}</p>
                            )}
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button
                                type="submit"
                                disabled={isUpdatingPassword}
                            >
                                {isUpdatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Password
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
