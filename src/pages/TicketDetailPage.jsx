import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTicket, useUpdateTicket } from '@/hooks/useTickets';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowLeft, User, Calendar, Tag, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function TicketDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { data: ticket, isLoading } = useTicket(id);
    const updateTicketMutation = useUpdateTicket();

    const [resolutionNote, setResolutionNote] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!ticket) return <div className="p-8">Ticket not found</div>;

    const handleStatusChange = async (newStatus) => {
        if (newStatus === 'Closed' && !resolutionNote) {
            alert('Please provide a resolution note before closing.');
            return;
        }

        setIsUpdating(true);
        try {
            await updateTicketMutation.mutateAsync({
                id: ticket.id,
                updates: {
                    status: newStatus,
                    resolution_notes: newStatus === 'Closed' || newStatus === 'Resolved' ? resolutionNote : undefined
                },
                userId: user.id
            });
            setResolutionNote('');
        } catch (e) {
            console.error(e);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAssignToMe = async () => {
        setIsUpdating(true);
        try {
            await updateTicketMutation.mutateAsync({
                id: ticket.id,
                updates: { assigned_to: user.id },
                userId: user.id
            });
        } catch (e) {
            console.error(e);
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <Button variant="ghost" className="pl-0" onClick={() => navigate('/')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-6">
                        <Card>
                            <CardHeader className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-2xl">{ticket.title}</CardTitle>
                                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                                            <span className="font-mono">{ticket.id}</span>
                                            <span>•</span>
                                            <span>Created by {ticket.created_by_name || 'User'}</span>
                                            <span>•</span>
                                            <span>{format(new Date(ticket.created_at), 'PPP p')}</span>
                                        </div>
                                    </div>
                                    <Badge variant={ticket.status === 'Open' ? 'destructive' : 'secondary'} className="text-base px-3 py-1">
                                        {ticket.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="font-semibold mb-2">Description</h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                    <div className="flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">Category:</span>
                                        <span>{ticket.category}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">Priority:</span>
                                        <span>{ticket.priority}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">Assigned To:</span>
                                        <span>{ticket.assigned_to ? 'Assigned' : 'Unassigned'}</span>
                                        {ticket.assigned_to === user.id && <Badge variant="outline" className="ml-2">Me</Badge>}
                                    </div>
                                </div>

                                {ticket.resolution_notes && (
                                    <div className="bg-green-50 p-4 rounded-md border border-green-100">
                                        <h4 className="font-semibold text-green-800 mb-1">Resolution Notes</h4>
                                        <p className="text-green-700">{ticket.resolution_notes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Activity Log</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    {ticket.activity_log?.map(log => (
                                        <li key={log.id} className="text-sm border-l-2 border-gray-200 pl-4 py-1">
                                            <p className="font-medium text-gray-900">{log.action}</p>
                                            <p className="text-gray-500 text-xs">{format(new Date(log.timestamp), 'PP p')}</p>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="w-full md:w-80 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {!ticket.assigned_to && (
                                    <Button className="w-full" variant="outline" onClick={handleAssignToMe} disabled={isUpdating}>
                                        Assign to Me
                                    </Button>
                                )}

                                {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                                    <>
                                        <Button className="w-full" onClick={() => handleStatusChange('In Progress')} disabled={isUpdating || ticket.status === 'In Progress'}>
                                            Mark In Progress
                                        </Button>
                                        <Button className="w-full" onClick={() => handleStatusChange('Resolved')} disabled={isUpdating} variant="secondary">
                                            Mark Resolved
                                        </Button>
                                    </>
                                )}

                                <div className="pt-4 border-t space-y-2">
                                    <label className="text-sm font-medium">Resolution / Closing Note</label>
                                    <Textarea
                                        placeholder="Required to close..."
                                        value={resolutionNote}
                                        onChange={(e) => setResolutionNote(e.target.value)}
                                    />
                                    <Button
                                        className="w-full"
                                        variant="destructive"
                                        onClick={() => handleStatusChange('Closed')}
                                        disabled={isUpdating || ticket.status === 'Closed'}
                                    >
                                        Close Ticket
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
