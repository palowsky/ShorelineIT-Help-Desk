import React from 'react';
import { Ticket } from '../types';
import TicketItem from './TicketItem';

interface TicketListProps {
  tickets: Ticket[];
  selectedTicketId?: string | null;
  onSelectTicket: (ticket: Ticket) => void;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, selectedTicketId, onSelectTicket }) => {
  return (
    <div className="bg-white dark:bg-gray-800 h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
        <h2 className="text-lg font-semibold">All Tickets ({tickets.length})</h2>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {tickets.map(ticket => (
          <TicketItem
            key={ticket.id}
            ticket={ticket}
            isSelected={ticket.id === selectedTicketId}
            onSelect={() => onSelectTicket(ticket)}
          />
        ))}
        {tickets.length === 0 && (
            <li className="p-4 text-center text-gray-500">
                No tickets found.
            </li>
        )}
      </ul>
    </div>
  );
};

export default TicketList;
