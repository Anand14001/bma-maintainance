import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '../services/ticket.service';

export function useTickets() {
    return useQuery({
        queryKey: ['tickets'],
        queryFn: () => ticketService.getAll()
    });
}

export function useTicket(id) {
    return useQuery({
        queryKey: ['ticket', id],
        queryFn: () => ticketService.getById(id),
        enabled: !!id
    });
}

export function useCreateTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ ticketData, userName }) => ticketService.create(ticketData, userName),
        onSuccess: () => {
            queryClient.invalidateQueries(['tickets']);
        }
    });
}

export function useUpdateTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates, userId, userName }) => {
            // Assuming updates contains status. If it's more complex, we might need a general update method.
            // For now, map to updateStatus if updates is a string or object with status.
            const status = typeof updates === 'string' ? updates : updates.status;
            return ticketService.updateStatus(id, status, userId, userName);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['tickets']);
            queryClient.invalidateQueries(['ticket', data.id]);
        }
    });
}
