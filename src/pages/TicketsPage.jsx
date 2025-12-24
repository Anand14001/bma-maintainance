import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../services/ticket.service';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Search, Filter } from 'lucide-react';

export default function TicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const data = await ticketService.getAll({ status: filterStatus });
                setTickets(data);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, [filterStatus]);

    const filteredTickets = tickets.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Tickets</h2>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search tickets by ID, title or description..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    {['All', 'Open', 'In Progress', 'Resolved'].map((status) => (
                        <Button
                            key={status}
                            variant={filterStatus === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilterStatus(status)}
                            className="flex-1 sm:flex-none"
                        >
                            {status}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Ticket List */}
            {loading ? (
                <div className="text-center py-10 text-slate-500">Loading tickets...</div>
            ) : (
                <div className="grid gap-4">
                    {filteredTickets.map((ticket) => (
                        <Link key={ticket.id} to={`/tickets/${ticket.id}`}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{ticket.id}</span>
                                                <h3 className="font-semibold text-lg">{ticket.title}</h3>
                                            </div>
                                            <p className="text-sm text-slate-500 line-clamp-1">{ticket.description}</p>
                                            <div className="flex gap-4 text-xs text-slate-400 pt-1">
                                                <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>{ticket.category}</span>
                                                <span>•</span>
                                                <span className={
                                                    ticket.priority === 'High' ? 'text-red-500 font-medium' :
                                                        ticket.priority === 'Medium' ? 'text-orange-500' : 'text-blue-500'
                                                }>{ticket.priority} Priority</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium 
                        ${ticket.status === 'Open' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                    ticket.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                        'bg-green-50 text-green-700 border border-green-100'}`}>
                                                {ticket.status}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}

                    {filteredTickets.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
                            <p className="text-slate-500">No tickets found matching your criteria.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
