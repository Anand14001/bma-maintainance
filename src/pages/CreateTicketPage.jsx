import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { CreateTicketForm } from '../components/tickets/CreateTicketForm';

export default function CreateTicketPage() {
    const navigate = useNavigate();

    const handleSuccess = (newTicket) => {
        navigate(`/tickets/${newTicket.id}`);
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
                    <CreateTicketForm
                        onSuccess={handleSuccess}
                        onCancel={() => navigate('/tickets')}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
