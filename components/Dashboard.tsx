
import React, { useState } from 'react';
import { Ticket, User, TicketPriority, TicketCategory } from '../types';
import Header from './Header';
import TicketList from './TicketList';
import TicketDetails from './TicketDetails';
import NewTicketModal from './NewTicketModal';

interface DashboardProps {
  tickets: Ticket[];
  currentUser: User;
  onAddTicket: (ticketData: {
      subject: string;
      description: string;
      customerName: string;
      customerEmail: string;
      priority: TicketPriority;
      category: TicketCategory;
  }) => void;
  onUpdateTicket: (ticket: Ticket) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tickets, currentUser, onAddTicket, onUpdateTicket }) => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(tickets[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  return (
    <div className="flex h-screen flex-col">
      <Header onNewTicket={() => setIsModalOpen(true)} />
      <div className="flex flex-grow overflow-hidden">
        <div className="w-1/3 flex-shrink-0 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
          <TicketList
            tickets={tickets}
            selectedTicketId={selectedTicket?.id}
            onSelectTicket={handleSelectTicket}
          />
        </div>
        <div className="flex-grow overflow-y-auto">
          {selectedTicket ? (
            <TicketDetails
              key={selectedTicket.id} // Re-mount when ticket changes
              ticket={selectedTicket}
              currentUser={currentUser}
              onUpdateTicket={onUpdateTicket}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">Select a ticket to view details</p>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <NewTicketModal
          onClose={() => setIsModalOpen(false)}
          onAddTicket={onAddTicket}
        />
      )}
    </div>
  );
};

export default Dashboard;
