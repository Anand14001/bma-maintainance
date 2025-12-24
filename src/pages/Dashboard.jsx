import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets } from '@/hooks/useTickets';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const { data: tickets, isLoading } = useTickets();
    const navigate = useNavigate();

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    const openTickets = tickets?.filter(t => t.status === 'Open').length || 0;
    const inProgressTickets = tickets?.filter(t => t.status === 'In Progress').length || 0;
    const closedTickets = tickets?.filter(t => ['Resolved', 'Closed'].includes(t.status)).length || 0;

    const myPendingTickets = tickets?.filter(t => t.assigned_to === user?.id && t.status !== 'Closed' && t.status !== 'Resolved') || [];

    const handleExport = () => {
        if (!tickets || tickets.length === 0) return;

        const headers = ['ID', 'Title', 'Category', 'Priority', 'Status', 'Created By', 'Assigned To', 'Created At'];
        const csvContent = [
            headers.join(','),
            ...tickets.map(t => [
                t.id,
                `"${t.title.replace(/"/g, '""')}"`,
                t.category,
                t.priority,
                t.status,
                t.created_by,
                t.assigned_to || '',
                new Date(t.created_at).toLocaleDateString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'bma_tickets_export.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">BMA Maintenance</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{user?.name}</span>
                    <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
                </div>
            </nav>

            <div className="p-8 max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <div className="space-x-4">
                        <Button variant="outline" onClick={handleExport}>Export CSV</Button>
                        <Button onClick={() => navigate('/tickets/new')}>Log New Ticket</Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate('/tickets?status=Open')}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{openTickets}</div>
                            <p className="text-xs text-muted-foreground">+ from last month (mock)</p>
                        </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate('/tickets?status=In Progress')}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{inProgressTickets}</div>
                        </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate('/tickets')}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Resolved/Closed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{closedTickets}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest tickets created.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {tickets?.slice(0, 5).map(ticket => (
                                    <div key={ticket.id} className="flex items-center justify-between border-b pb-2 last:border-0 hover:bg-gray-50 p-2 rounded cursor-pointer" onClick={() => navigate(`/ tickets / ${ticket.id} `)}>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{ticket.title || ticket.description.substring(0, 30)}...</p>
                                            <p className="text-xs text-muted-foreground">{ticket.category} • {format(new Date(ticket.created_at), 'MMM d, yyyy')}</p>
                                        </div>
                                        <Badge variant={ticket.status === 'Open' ? 'destructive' : 'secondary'}>{ticket.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Assigned to Me</CardTitle>
                            <CardDescription>Tickets requiring your attention.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {myPendingTickets.length === 0 ? <p className="text-sm text-gray-500">No pending tickets.</p> :
                                    myPendingTickets.map(ticket => (
                                        <div key={ticket.id} className="flex items-center justify-between border-b pb-2 last:border-0 hover:bg-gray-50 p-2 rounded cursor-pointer" onClick={() => navigate(`/ tickets / ${ticket.id} `)}>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{ticket.title}</p>
                                                <p className="text-xs text-muted-foreground">{ticket.priority}</p>
                                            </div>
                                            <Badge variant="outline">{ticket.status}</Badge>
                                        </div>
                                    ))
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
