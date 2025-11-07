
import React from 'react';
import { Ticket } from '../types';
import StatusBadge from './StatusBadge';

interface TicketItemProps {
  ticket: Ticket;
  onTicketSelect: (ticket: Ticket) => void;
}

const TicketItem: React.FC<TicketItemProps> = ({ ticket, onTicketSelect }) => {
  const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  }

  return (
    <div
      onClick={() => onTicketSelect(ticket)}
      className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-200"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary-600 dark:text-primary-400 truncate">{ticket.id}</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white truncate mt-1">{ticket.subject}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            By {ticket.customer.name} &middot; Last updated {timeSince(ticket.updatedAt)}
          </p>
        </div>
        <div className="flex sm:flex-col items-end sm:items-center justify-between sm:justify-center gap-2 sm:w-32">
          <StatusBadge status={ticket.status} />
          <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-0 sm:mt-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">{ticket.priority}</div>
        </div>
      </div>
    </div>
  );
};

export default TicketItem;
