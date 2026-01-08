import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../services/ticket.service';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { AlertCircle, CheckCircle2, Clock, Ticket, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0
    });
    const [recentTickets, setRecentTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const tickets = await ticketService.getAll();
                setStats({
                    total: tickets.length,
                    open: tickets.filter(t => t.status === 'Open').length,
                    inProgress: tickets.filter(t => t.status === 'In Progress').length,
                    resolved: tickets.filter(t => t.status === 'Resolved').length
                });
                setRecentTickets(tickets.slice(0, 5));
            } catch (error) {
                console.error('Failed to load dashboard data', error);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                        <Ticket className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-xl md:text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-slate-500">All time tickets</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                        <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-xl md:text-2xl font-bold text-red-600">{stats.open}</div>
                        <p className="text-xs text-slate-500">Requires attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <Clock className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-xl md:text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                        <p className="text-xs text-slate-500">Currently being worked on</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
                        <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-xl md:text-2xl font-bold text-green-600">{stats.resolved}</div>
                        <p className="text-xs text-slate-500">Completed tickets</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid gap-4 md:grid-cols-1">
                <Card className="col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6">
                        <CardTitle className="text-lg md:text-xl">Recent Tickets</CardTitle>
                        <Link to="/tickets" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium px-2 py-1 -mr-2 rounded-md active:bg-blue-50">
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0 md:p-6 md:pt-0">
                        <div className="divide-y divide-slate-100">
                            {recentTickets.map(ticket => (
                                <Link
                                    to={`/tickets/${ticket.id}`}
                                    key={ticket.id}
                                    className="flex items-center justify-between p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                                >
                                    <div className="space-y-1 min-w-0 pr-4">
                                        <p className="text-sm font-medium leading-none truncate">{ticket.title}</p>
                                        <p className="text-xs text-slate-500 truncate">{ticket.category} • {new Date(ticket.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className={`shrink-0 px-2 py-1 rounded-full text-[10px] md:text-xs font-medium 
                    ${ticket.status === 'Open' ? 'bg-red-100 text-red-700' :
                                            ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                                'bg-green-100 text-green-700'}`}>
                                        {ticket.status}
                                    </div>
                                </Link>
                            ))}
                            {recentTickets.length === 0 && (
                                <p className="text-sm text-slate-500 text-center py-4">No tickets found.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
