import React from 'react';
import { Ticket, TicketStatus } from '../types';
import TicketItem from './TicketItem';

interface TicketListProps {
  tickets: Ticket[];
  onTicketSelect: (ticket: Ticket) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: TicketStatus | 'All';
  setStatusFilter: (status: TicketStatus | 'All') => void;
  sortOrder: 'newest' | 'oldest';
  setSortOrder: (order: 'newest' | 'oldest') => void;
  prioritySortOrder: 'default' | 'high-to-low' | 'low-to-high';
  setPrioritySortOrder: (order: 'default' | 'high-to-low' | 'low-to-high') => void;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, onTicketSelect, searchTerm, setSearchTerm, statusFilter, setStatusFilter, sortOrder, setSortOrder, prioritySortOrder, setPrioritySortOrder }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by ID, subject, or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'All')}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="All">All Statuses</option>
              {Object.values(TicketStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={prioritySortOrder}
              onChange={(e) => setPrioritySortOrder(e.target.value as 'default' | 'high-to-low' | 'low-to-high')}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              aria-label="Sort tickets by priority"
            >
              <option value="default">Sort by Priority</option>
              <option value="high-to-low">Priority: High to Low</option>
              <option value="low-to-high">Priority: Low to High</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              aria-label="Sort tickets by creation date"
            >
              <option value="newest">Date: Newest</option>
              <option value="oldest">Date: Oldest</option>
            </select>
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {tickets.length > 0 ? (
          tickets.map(ticket => (
            <TicketItem key={ticket.id} ticket={ticket} onTicketSelect={onTicketSelect} />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <h3 className="text-xl font-medium">No tickets found</h3>
            <p className="mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketList;