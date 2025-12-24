import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '@/services/ticketService';

export function useTickets() {
    return useQuery({
        queryKey: ['tickets'],
        queryFn: ticketService.getTickets
    });
}

export function useTicket(id) {
    return useQuery({
        queryKey: ['ticket', id],
        queryFn: () => ticketService.getTicketById(id),
        enabled: !!id
    });
}

export function useCreateTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ticketService.createTicket,
        onSuccess: () => {
            queryClient.invalidateQueries(['tickets']);
        }
    });
}

export function useUpdateTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates, userId }) => ticketService.updateTicket(id, updates, userId),
        onSuccess: (data) => {
            queryClient.invalidateQueries(['tickets']);
            queryClient.invalidateQueries(['ticket', data.id]);
        }
    });
}
