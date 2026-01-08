import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

export default function DeleteAccountDialog({ open, onClose }) {
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirmText !== 'DELETE') {
            toast.error('Please type DELETE to confirm');
            return;
        }

        setIsDeleting(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('Account deletion - Coming soon');
            onClose();
            setConfirmText('');
        } catch (error) {
            toast.error('Failed to delete account');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleClose = () => {
        setConfirmText('');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                className: "rounded-lg mx-4"
            }}
        >
            <DialogTitle className="flex items-center gap-3 p-6 pb-4">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Delete Account</h3>
                    <p className="text-sm text-slate-500">This action cannot be undone</p>
                </div>
            </DialogTitle>
            <DialogContent className="p-6 pt-0">
                <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800">
                            <strong>Warning:</strong> Deleting your account will permanently remove all your data, including:
                        </p>
                        <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
                            <li>All tickets and comments</li>
                            <li>Profile information</li>
                            <li>Activity history</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmDelete">
                            Type <span className="font-mono font-bold">DELETE</span> to confirm
                        </Label>
                        <Input
                            id="confirmDelete"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="DELETE"
                            className="font-mono"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1"
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="flex-1"
                            disabled={confirmText !== 'DELETE' || isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Account'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
