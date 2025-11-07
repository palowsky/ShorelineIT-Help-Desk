import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import TicketList from './components/TicketList';
import TicketDetails from './components/TicketDetails';
import NewTicketModal from './components/NewTicketModal';
import Dashboard from './components/Dashboard';
import { Ticket, User, TicketStatus, TicketPriority, TicketCategory, Role } from './types';
import { useLocalization } from './context/LocalizationContext';

// Mock Data
const users: { [key: string]: User } = {
  admin: { id: 'admin-1', name: 'Diana Prince (Admin)', avatar: 'https://i.pravatar.cc/150?u=diana', role: Role.Admin },
  agent: { id: 'agent-1', name: 'Charlie Brown (Agent)', avatar: 'https://i.pravatar.cc/150?u=charlie', role: Role.Agent },
  customer1: { id: 'user-1', name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?u=alice', role: Role.User },
  customer2: { id: 'user-2', name: 'Bob Williams', avatar: 'https://i.pravatar.cc/150?u=bob', role: Role.User },
};

const allUsers = Object.values(users);
const technicians = allUsers.filter(u => u.role === Role.Admin || u.role === Role.Agent);

const initialTickets: Ticket[] = [
  {
    id: 'TICKET-1234',
    subject: 'Cannot connect to the office Wi-Fi',
    description: 'My laptop is unable to connect to the "Office-Guest" Wi-Fi network. I have tried restarting my machine and forgetting the network, but it still fails to connect. Other devices seem to be working fine.',
    customer: users.customer1,
    agent: users.agent,
    status: TicketStatus.Open,
    priority: 'High',
    category: 'Network',
    createdAt: '2023-10-27T10:00:00Z',
    updatedAt: '2023-10-27T10:05:00Z',
    comments: [],
    isArchived: false,
  },
  {
    id: 'TICKET-5678',
    subject: 'Software installation request for "SuperDesign Pro"',
    description: 'I need to have "SuperDesign Pro" installed on my workstation for a new project. My machine is a Dell Precision Tower 5820. Please let me know if you need any more information.',
    customer: users.customer2,
    agent: users.agent,
    status: TicketStatus.InProgress,
    priority: 'Medium',
    category: 'Software',
    createdAt: '2023-10-26T14:30:00Z',
    updatedAt: '2023-10-27T09:15:00Z',
    comments: [],
    isArchived: false,
  },
    {
    id: 'TICKET-9101',
    subject: 'Printer is out of toner',
    description: 'The main office printer on the 3rd floor is displaying a "Toner Low" message and is refusing to print. We need a replacement toner cartridge for model X-5500.',
    customer: users.customer1,
    status: TicketStatus.Open,
    priority: 'Low',
    category: 'Hardware',
    createdAt: '2023-10-28T11:00:00Z',
    updatedAt: '2023-10-28T11:00:00Z',
    comments: [],
    isArchived: false,
  },
];


function App() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [currentUser, setCurrentUser] = useState<User>(users.admin);
  const [showArchived, setShowArchived] = useState(false);
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(false);
  const [view, setView] = useState<'tickets' | 'dashboard'>('tickets');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<{ type: string; value: string } | null>(null);
  const { t } = useLocalization();
  
  const addTicket = (ticketData: {
      subject: string;
      description: string;
      customerName: string;
      customerEmail: string;
      priority: TicketPriority;
      category: TicketCategory;
  }) => {
    const newCustomer: User = (currentUser.role === Role.User) ? currentUser : {
      id: `user-${Date.now()}`,
      name: ticketData.customerName,
      avatar: `https://i.pravatar.cc/150?u=${ticketData.customerEmail}`,
      role: Role.User,
    };
    
    const newTicket: Ticket = {
      id: `TICKET-${Math.floor(Math.random() * 10000)}`,
      subject: ticketData.subject,
      description: ticketData.description,
      customer: newCustomer,
      status: TicketStatus.Open,
      priority: ticketData.priority,
      category: ticketData.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      isArchived: false,
    };
    setTickets(prevTickets => [newTicket, ...prevTickets]);
  };

  const updateTicket = (updatedTicket: Ticket) => {
    const ticketWithTimestamp = { ...updatedTicket, updatedAt: new Date().toISOString() };
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketWithTimestamp.id ? ticketWithTimestamp : ticket
      )
    );

    if (selectedTicket && selectedTicket.id === ticketWithTimestamp.id) {
        setSelectedTicket(ticketWithTimestamp);
    }
  };
  
  const handleFilterFromDashboard = (type: 'priority' | 'category' | 'status', value: string) => {
    setActiveFilter({ type, value });
    setView('tickets');
  };
  
  const handleClearFilter = () => {
    setActiveFilter(null);
  };

  const displayedTickets = useMemo(() => {
    const ticketsForRole = currentUser.role === Role.User
        ? tickets.filter(ticket => ticket.customer.id === currentUser.id)
        : tickets;
    
    let filteredTickets = ticketsForRole.filter(ticket => !!ticket.isArchived === showArchived);

    if (showUnassignedOnly) {
        filteredTickets = filteredTickets.filter(ticket => !ticket.agent);
    }
    
    if (activeFilter) {
      filteredTickets = filteredTickets.filter(ticket => {
        const key = activeFilter.type as keyof Ticket;
        // FIX: Corrected typo from 'activeiver' to 'activeFilter'.
        return ticket[key] === activeFilter.value;
      });
    }


    return filteredTickets;
  }, [tickets, currentUser, showArchived, showUnassignedOnly, activeFilter]);

  useEffect(() => {
    if (selectedTicket && !displayedTickets.find(t => t.id === selectedTicket.id)) {
        setSelectedTicket(displayedTickets[0] || null);
    } else if (!selectedTicket && displayedTickets.length > 0) {
        setSelectedTicket(displayedTickets[0]);
    }
  }, [displayedTickets, selectedTicket]);
  
  useEffect(() => {
    if (currentUser.role !== Role.Admin && view === 'dashboard') {
        setView('tickets');
    }
    setSelectedTicket(displayedTickets[0] || null);
    setActiveFilter(null); // Clear filters when switching user
  }, [currentUser]);

  return (
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header
        onNewTicket={() => setIsModalOpen(true)}
        currentUser={currentUser}
        users={allUsers}
        onSetCurrentUser={setCurrentUser}
        view={view}
        onSetView={setView}
      />
      <div className="flex flex-grow overflow-hidden">
        {view === 'dashboard' && currentUser.role === Role.Admin ? (
            <Dashboard tickets={tickets} onApplyFilter={handleFilterFromDashboard}/>
        ) : (
            <>
                <div className="w-1/3 flex-shrink-0 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
                    <TicketList
                        tickets={displayedTickets}
                        selectedTicketId={selectedTicket?.id}
                        onSelectTicket={setSelectedTicket}
                        showArchived={showArchived}
                        onSetShowArchived={setShowArchived}
                        currentUser={currentUser}
                        showUnassignedOnly={showUnassignedOnly}
                        onSetShowUnassignedOnly={setShowUnassignedOnly}
                        activeFilter={activeFilter}
                        onClearFilter={handleClearFilter}
                    />
                </div>
                <div className="flex-grow overflow-y-auto">
                    {selectedTicket ? (
                        <TicketDetails
                            key={selectedTicket.id}
                            ticket={selectedTicket}
                            currentUser={currentUser}
                            onUpdateTicket={updateTicket}
                            technicians={technicians}
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-gray-500">{t('dashboard.selectTicket')}</p>
                        </div>
                    )}
                </div>
            </>
        )}
      </div>
      {isModalOpen && (
        <NewTicketModal
          onClose={() => setIsModalOpen(false)}
          onAddTicket={addTicket}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

export default App;