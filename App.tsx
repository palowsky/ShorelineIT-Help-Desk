import React, { useState, useMemo, useEffect } from 'react';
import { Ticket, TicketStatus, TicketPriority } from './types';
import Header from './components/Header';
import TicketList from './components/TicketList';
import TicketDetails from './components/TicketDetails';
import NewTicketModal from './components/NewTicketModal';

// Mock data for initial state
const initialTickets: Ticket[] = [
  {
    id: 'T20240729-001',
    subject: 'Cannot connect to company VPN',
    description: 'I\'ve been trying to connect to the VPN from home for the last hour but it keeps failing with an authentication error. My password is correct as I can log into my email. I have restarted my computer and the router.',
    status: TicketStatus.Open,
    priority: 'High',
    category: 'Network',
    createdAt: new Date('2024-07-29T09:05:00Z'),
    updatedAt: new Date('2024-07-29T09:05:00Z'),
    customer: { name: 'Alice Johnson', email: 'alice.j@example.com' },
    history: [
      { user: 'Alice Johnson', action: 'Ticket created', timestamp: new Date('2024-07-29T09:05:00Z') }
    ]
  },
  {
    id: 'T20240728-003',
    subject: 'Laptop screen is flickering',
    description: 'My laptop screen started flickering this morning. It happens intermittently. It\'s a Dell Latitude 7420.',
    status: TicketStatus.InProgress,
    priority: 'Medium',
    category: 'Hardware',
    createdAt: new Date('2024-07-28T14:30:00Z'),
    updatedAt: new Date('2024-07-29T11:20:00Z'),
    customer: { name: 'Bob Williams', email: 'bob.w@example.com' },
    history: [
      { user: 'Bob Williams', action: 'Ticket created', timestamp: new Date('2024-07-28T14:30:00Z') },
      { user: 'Support Team', action: 'Assigned to tech John Smith', timestamp: new Date('2024-07-29T11:20:00Z') }
    ]
  },
  {
    id: 'T20240727-002',
    subject: 'Request for Adobe Photoshop license',
    description: 'Hi, I need a license for Adobe Photoshop for a new design project. My manager, Sarah, has approved this.',
    status: TicketStatus.Resolved,
    priority: 'Low',
    category: 'Software',
    createdAt: new Date('2024-07-27T11:00:00Z'),
    updatedAt: new Date('2024-07-28T16:45:00Z'),
    customer: { name: 'Charlie Brown', email: 'charlie.b@example.com' },
    history: [
      { user: 'Charlie Brown', action: 'Ticket created', timestamp: new Date('2024-07-27T11:00:00Z') },
      { user: 'Support Team', action: 'License provisioned and details sent.', timestamp: new Date('2024-07-28T16:45:00Z') }
    ]
  },
];

const LOCAL_STORAGE_KEY = 'itSupportTickets';


const App: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const storedTickets = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedTickets) {
        return JSON.parse(storedTickets).map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
          history: t.history.map((h: any) => ({ ...h, timestamp: new Date(h.timestamp) }))
        }));
      }
    } catch (error) {
      console.error("Failed to parse tickets from localStorage", error);
    }
    return initialTickets;
  });
  
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [prioritySortOrder, setPrioritySortOrder] = useState<'default' | 'high-to-low' | 'low-to-high'>('default');

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tickets));
    } catch (error) {
      console.error("Failed to save tickets to localStorage", error);
    }
  }, [tickets]);


  const handleCreateTicket = (newTicket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => {
    const ticket: Ticket = {
      ...newTicket,
      id: `T${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}-${(tickets.length + 1).toString().padStart(3, '0')}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      history: [{ user: newTicket.customer.name, action: 'Ticket created', timestamp: new Date() }]
    };
    setTickets(prevTickets => [ticket, ...prevTickets]);
    setIsModalOpen(false);
  };
  
  const handleUpdateTicket = (updatedTicket: Ticket) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
    setSelectedTicket(updatedTicket);
  };

  const filteredTickets = useMemo(() => {
    const priorityValues: Record<TicketPriority, number> = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 };

    return tickets
      .filter(ticket => statusFilter === 'All' || ticket.status === statusFilter)
      .filter(ticket => 
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        // Primary sort: by priority
        if (prioritySortOrder !== 'default') {
          const priorityA = priorityValues[a.priority];
          const priorityB = priorityValues[b.priority];
          if (priorityA !== priorityB) {
            return prioritySortOrder === 'high-to-low' ? priorityB - priorityA : priorityA - priorityB;
          }
        }
        
        // Secondary sort: by creation date
        if (sortOrder === 'newest') {
          return b.createdAt.getTime() - a.createdAt.getTime();
        }
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
  }, [tickets, searchTerm, statusFilter, sortOrder, prioritySortOrder]);

  const onTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  }

  const onBackToList = () => {
    setSelectedTicket(null);
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header onNewTicket={() => setIsModalOpen(true)} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {selectedTicket ? (
          <TicketDetails
            ticket={selectedTicket}
            onBack={onBackToList}
            onUpdateTicket={handleUpdateTicket}
          />
        ) : (
          <TicketList
            tickets={filteredTickets}
            onTicketSelect={onTicketSelect}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            prioritySortOrder={prioritySortOrder}
            setPrioritySortOrder={setPrioritySortOrder}
          />
        )}
      </main>
      {isModalOpen && (
        <NewTicketModal
          onClose={() => setIsModalOpen(false)}
          onCreateTicket={handleCreateTicket}
        />
      )}
    </div>
  );
};

export default App;