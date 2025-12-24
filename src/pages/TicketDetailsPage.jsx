import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketService } from '../services/ticket.service';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { ArrowLeft, Send, Clock, User } from 'lucide-react';

export default function TicketDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const loadTicket = async () => {
            try {
                const data = await ticketService.getById(id);
                setTicket(data);
            } catch (error) {
                console.error('Error:', error);
                navigate('/tickets');
            } finally {
                setLoading(false);
            }
        };
        loadTicket();
    }, [id, navigate]);

    const handleStatusChange = async (newStatus) => {
        try {
            const updated = await ticketService.updateStatus(ticket.id, newStatus, user.id);
            setTicket(updated);
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setSending(true);
        try {
            const updated = await ticketService.addComment(ticket.id, comment, user.id);
            setTicket(updated);
            setComment('');
        } catch (error) {
            console.error('Failed to add comment:', error);
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading details...</div>;
    if (!ticket) return null;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <Button variant="ghost" className="pl-0 gap-2 text-slate-500" onClick={() => navigate('/tickets')}>
                <ArrowLeft className="w-4 h-4" /> Back to Tickets
            </Button>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{ticket.id}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                        ${ticket.status === 'Open' ? 'bg-red-50 text-red-700' :
                                                ticket.status === 'In Progress' ? 'bg-blue-50 text-blue-700' :
                                                    'bg-green-50 text-green-700'}`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <CardTitle className="text-2xl pt-2">{ticket.title}</CardTitle>
                                </div>
                            </div>
                            <div className="flex gap-6 text-sm text-slate-500 border-t border-slate-100 pt-4">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>Created by User</span>
                                    {/* Ideally fetch user name from a user service or store creator name in ticket */}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{new Date(ticket.created_at).toLocaleString()}</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-slate max-w-none">
                                <h4 className="text-sm font-semibold text-slate-900 mb-2">Description</h4>
                                <p className="text-slate-600 whitespace-pre-wrap">{ticket.description}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity / Comments */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Activity & Comments</h3>

                        <Card>
                            <CardContent className="p-4">
                                <form onSubmit={handleAddComment} className="space-y-4">
                                    <Textarea
                                        placeholder="Add a comment or update..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={sending || !comment.trim()} className="gap-2">
                                            <Send className="w-4 h-4" /> Post Comment
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            {ticket.activity_log.map((log) => (
                                <div key={log.id} className="flex gap-4 p-4 bg-white rounded-lg border border-slate-200">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-medium text-slate-900">
                                                {log.user_id === user.id ? 'You' : 'User'}
                                                <span className="font-normal text-slate-500"> {log.action.toLowerCase()}</span>
                                            </p>
                                            <span className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        {log.details && (
                                            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md mt-2">{log.details}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-xs text-slate-500 mb-2">Change Status</p>
                            <div className="grid grid-cols-1 gap-2">
                                <Button
                                    variant={ticket.status === 'Open' ? 'default' : 'outline'}
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => handleStatusChange('Open')}
                                >
                                    Mark as Open
                                </Button>
                                <Button
                                    variant={ticket.status === 'In Progress' ? 'default' : 'outline'}
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => handleStatusChange('In Progress')}
                                >
                                    Mark as In Progress
                                </Button>
                                <Button
                                    variant={ticket.status === 'Resolved' ? 'default' : 'outline'}
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => handleStatusChange('Resolved')}
                                >
                                    Mark as Resolved
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium uppercase tracking-wider text-slate-500">Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-xs text-slate-500 block">Category</span>
                                <span className="text-sm font-medium">{ticket.category}</span>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 block">Type</span>
                                <span className="text-sm font-medium">{ticket.type}</span>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 block">Priority</span>
                                <span className={`text-sm font-medium ${ticket.priority === 'High' ? 'text-red-600' : 'text-slate-900'
                                    }`}>{ticket.priority}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
