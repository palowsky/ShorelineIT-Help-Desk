
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import { Ticket, User, TicketStatus, TicketPriority, TicketCategory } from './types';

// Mock Data
const users = {
  customer1: { id: 'user-1', name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?u=alice' },
  customer2: { id: 'user-2', name: 'Bob Williams', avatar: 'https://i.pravatar.cc/150?u=bob' },
  agent: { id: 'agent-1', name: 'Charlie Brown (Agent)', avatar: 'https://i.pravatar.cc/150?u=charlie' },
};

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
    comments: [
      {
        id: 'comment-1',
        author: users.agent,
        content: 'Hi Alice, I am looking into this issue for you. Have you tried connecting to the main "Office-Secure" network?',
        createdAt: '2023-10-27T10:05:00Z',
      },
    ],
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
  },
];


function App() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [currentUser] = useState<User>(users.agent);

  const addTicket = (ticketData: {
      subject: string;
      description: string;
      customerName: string;
      customerEmail: string;
      priority: TicketPriority;
      category: TicketCategory;
  }) => {
    const newCustomer: User = {
      id: `user-${Date.now()}`,
      name: ticketData.customerName,
      avatar: `https://i.pravatar.cc/150?u=${ticketData.customerEmail}`
    };
    
    const newTicket: Ticket = {
      id: `TICKET-${Math.floor(Math.random() * 10000)}`,
      subject: ticketData.subject,
      description: ticketData.description,
      customer: newCustomer,
      agent: currentUser,
      status: TicketStatus.Open,
      priority: ticketData.priority,
      category: ticketData.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };
    setTickets(prevTickets => [newTicket, ...prevTickets]);
  };

  const updateTicket = (updatedTicket: Ticket) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === updatedTicket.id ? { ...updatedTicket, updatedAt: new Date().toISOString() } : ticket
      )
    );
  };
  
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
       <Dashboard
        tickets={tickets}
        currentUser={currentUser}
        onAddTicket={addTicket}
        onUpdateTicket={updateTicket}
      />
    </div>
  );
}

export default App;
