import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ticketService } from '../services/ticket.service';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';

const ticketSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    category: z.string().min(1, "Please select a category"),
    type: z.string().min(1, "Please select a type"),
    priority: z.string().min(1, "Please select a priority"),
});

export default function CreateTicketPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(ticketSchema),
        defaultValues: {
            priority: 'Medium',
            type: 'Maintenance'
        }
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const newTicket = await ticketService.create({
                ...data,
                created_by: user.id
            });
            navigate(`/tickets/${newTicket.id}`);
        } catch (error) {
            console.error('Failed to create ticket:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Button variant="ghost" className="pl-0 gap-2 text-slate-500" onClick={() => navigate('/tickets')}>
                <ArrowLeft className="w-4 h-4" /> Back to List
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Create New Ticket</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        <div className="space-y-2">
                            <Label htmlFor="title">Title / Subject</Label>
                            <Input id="title" placeholder="e.g. Water leakage in Block A" {...register('title')} />
                            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <select
                                    id="category"
                                    className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                                    {...register('category')}
                                >
                                    <option value="">Select Category...</option>
                                    <option value="Plumbing">Plumbing</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="Carpentry">Carpentry</option>
                                    <option value="Cleaning">Cleaning</option>
                                    <option value="Security">Security</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <select
                                    id="type"
                                    className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                                    {...register('type')}
                                >
                                    <option value="Maintenance">Maintenance Request</option>
                                    <option value="Complaint">Complaint</option>
                                </select>
                                {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <select
                                id="priority"
                                className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                                {...register('priority')}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                            {errors.priority && <p className="text-xs text-red-500">{errors.priority.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the issue in detail..."
                                className="min-h-[120px]"
                                {...register('description')}
                            />
                            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                        </div>

                        <div className="pt-4 flex gap-4 justify-end">
                            <Button type="button" variant="ghost" onClick={() => navigate('/tickets')}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : 'Create Ticket'}
                            </Button>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
