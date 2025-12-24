export const MOCK_USERS = [
    { id: 'u1', name: 'Admin User', email: 'admin@bma.com', role: 'admin', password: 'password' },
    { id: 'u2', name: 'Committee Member 1', email: 'member1@bma.com', role: 'committee_member', password: 'password' },
]

export const MOCK_TICKETS = [
    {
        id: 'TKT-001',
        title: 'Broken Light in Kitchen',
        description: 'The main tube light in the kitchen is flickering and causing issues.',
        category: 'Kitchen',
        type: 'Maintenance',
        priority: 'High',
        status: 'Open',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        created_by: 'u2',
        activity_log: [
            { id: 'a1', action: 'Created Ticket', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), user_id: 'u2' }
        ]
    },
    {
        id: 'TKT-002',
        title: 'Canteen cleanliness',
        description: 'Tables are not being wiped properly after lunch hours.',
        category: 'Canteen',
        type: 'Complaint',
        priority: 'Medium',
        status: 'In Progress',
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        created_by: 'u1',
        assigned_to: 'u2',
        activity_log: [
            { id: 'a2', action: 'Created Ticket', timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), user_id: 'u1' },
            { id: 'a3', action: 'Assigned to Committee Member 1', timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), user_id: 'u1' }
        ]
    }
]
