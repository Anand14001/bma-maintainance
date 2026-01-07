import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authService } from '../services/auth.service';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { toast } from 'sonner';
import { Loader2, Plus, UserX, UserCheck, Mail, Calendar, Shield } from 'lucide-react';
import {
    Select,
    SelectItem,
} from "../components/ui/select"

// MUI Imports
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const createUserSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.string().min(1, "Role is required"),
});

export default function UsersPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [open, setOpen] = useState(false);

    // Status Filter State (active, pending, inactive)
    const [statusFilter, setStatusFilter] = useState('active');

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(createUserSchema),
        defaultValues: { role: 'resident' }
    });

    const fetchUsers = async () => {
        try {
            const data = await authService.getAllUsers();
            // Sort by Created At desc
            data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const onCreateUser = async (data) => {
        setIsCreating(true);
        try {
            await authService.createUser(data.email, data.password, data.name, data.role);
            toast.success(`User ${data.name} created successfully`);
            reset();
            setOpen(false); // Close dialog
            fetchUsers();
        } catch (error) {
            console.error(error);
            toast.error("Failed to create user: " + error.message);
        } finally {
            setIsCreating(false);
        }
    };

    const handleUpdateStatus = async (userToUpdate, newStatus) => {
        if (userToUpdate.id === currentUser.uid) {
            return toast.error("You cannot change your own status");
        }
        try {
            await authService.updateUserStatus(userToUpdate.id, newStatus);
            toast.success(`User status updated to ${newStatus}`);
            // Optimistic update
            setUsers(users.map(u => u.id === userToUpdate.id ? { ...u, status: newStatus, isActive: newStatus === 'active' } : u));
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        if (userId === currentUser.uid) {
            return toast.error("You cannot change your own role");
        }
        try {
            await authService.updateUserRole(userId, newRole);
            toast.success("Role updated successfully");
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            toast.error("Failed to update role");
        }
    };

    // Filter users based on active tab
    const filteredUsers = users.filter(user => {
        // Normalize status if missing
        const userStatus = user.status || (user.isActive === false ? 'inactive' : 'active');
        return userStatus === statusFilter;
    });

    // Reusable Status Badge
    const StatusBadge = ({ status, isActive }) => {
        const currentStatus = status || (isActive !== false ? 'active' : 'inactive');
        const styles = {
            active: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20',
            pending: 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20',
            inactive: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
        };
        const labels = { active: 'Active', pending: 'Pending Approval', inactive: 'Inactive' };

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[currentStatus] || styles.inactive}`}>
                {labels[currentStatus] || 'Unknown'}
            </span>
        );
    };

    // Reusable Actions Component
    const UserActions = ({ user }) => {
        if (user.id === currentUser.uid) return null;

        return (
            <div className="flex justify-end gap-2">
                {statusFilter === 'pending' && (
                    <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                        onClick={() => handleUpdateStatus(user, 'active')}
                    >
                        <UserCheck className="w-4 h-4 mr-1" /> Approve
                    </Button>
                )}
                {statusFilter === 'active' && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto"
                        onClick={() => handleUpdateStatus(user, 'inactive')}
                    >
                        <UserX className="w-4 h-4 mr-1" /> Deactivate
                    </Button>
                )}
                {statusFilter === 'inactive' && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 w-full sm:w-auto"
                        onClick={() => handleUpdateStatus(user, 'active')}
                    >
                        <UserCheck className="w-4 h-4 mr-1" /> Activate
                    </Button>
                )}
            </div>
        );
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-500" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                    <p className="text-slate-500">Manage access and roles for all users.</p>
                </div>

                <Button onClick={() => setOpen(true)} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" /> Add User
                </Button>

                {/* MUI Dialog Integration */}
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    fullWidth
                    maxWidth="sm"
                    PaperProps={{
                        className: "rounded-lg mx-4"
                    }}
                >
                    <DialogTitle className="flex items-center justify-between p-6 pb-0">
                        <span className="text-xl font-bold tracking-tight text-slate-900">Create New User</span>
                        <button
                            onClick={() => setOpen(false)}
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
                        <form onSubmit={handleSubmit(onCreateUser)} className="space-y-4 mt-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" {...register('name')} placeholder="John Doe" />
                                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" {...register('email')} placeholder="john@example.com" />
                                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" {...register('password')} placeholder="••••••" />
                                    {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select
                                        onValueChange={(val) => setValue('role', val)}
                                        defaultValue="resident"
                                        placeholder="Select role"
                                    >
                                        <SelectItem value="resident">Resident</SelectItem>
                                        <SelectItem value="committee_member">Committee Member</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </Select>
                                    {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isCreating} className="w-full">
                                    {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Create User
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Tabs for filtering */}
            <div className="border-b border-slate-200">
                <Tabs
                    value={statusFilter}
                    onChange={(e, val) => setStatusFilter(val)}
                    textColor="primary"
                    indicatorColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    aria-label="user status tabs"
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 500,
                            minWidth: 100,
                        }
                    }}
                >
                    <Tab label="Active Users" value="active" />
                    <Tab label="Pending Approval" value="pending" />
                    <Tab label="Inactive Users" value="inactive" />
                </Tabs>
            </div>

            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-4">
                {filteredUsers.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        No {statusFilter === 'pending' ? 'pending' : statusFilter} users found.
                    </div>
                ) : filteredUsers.map((user) => (
                    <Card key={user.id} className="overflow-hidden">
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                        {user.name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900">{user.name}</div>
                                        <div className="text-sm text-slate-500 flex items-center gap-1">
                                            <Mail className="w-3 h-3" /> {user.email}
                                        </div>
                                    </div>
                                </div>
                                <StatusBadge status={user.status} isActive={user.isActive} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-slate-500 flex items-center gap-1 mb-1">
                                        <Shield className="w-3 h-3" /> Role
                                    </div>
                                    <Select
                                        defaultValue={user.role}
                                        onValueChange={(val) => handleRoleChange(user.id, val)}
                                        disabled={user.id === currentUser.uid || user.status === 'inactive' || (!user.status && user.isActive === false)}
                                        className="h-8 text-xs w-full"
                                    >
                                        <SelectItem value="resident">Resident</SelectItem>
                                        <SelectItem value="committee_member">Member</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </Select>
                                </div>
                                <div>
                                    <div className="text-slate-500 flex items-center gap-1 mb-1">
                                        <Calendar className="w-3 h-3" /> Joined
                                    </div>
                                    <div className="flex items-center h-8">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100">
                                <UserActions user={user} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Account Created</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                    No {statusFilter === 'pending' ? 'pending' : statusFilter} users found.
                                </td>
                            </tr>
                        ) : filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                            {user.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Select
                                        defaultValue={user.role}
                                        onValueChange={(val) => handleRoleChange(user.id, val)}
                                        disabled={user.id === currentUser.uid || user.status === 'inactive' || (!user.status && user.isActive === false)}
                                        className="h-8 text-xs"
                                    >
                                        <SelectItem value="resident">Resident</SelectItem>
                                        <SelectItem value="committee_member">Committee Member</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </Select>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={user.status} isActive={user.isActive} />
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <UserActions user={user} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
