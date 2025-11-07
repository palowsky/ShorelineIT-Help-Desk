import React from 'react';
import { Ticket } from '../types';
import StatusBadge from './StatusBadge';
import ChevronRightIcon from './icons/ChevronRightIcon';
import { useLocalization } from '../context/LocalizationContext';

interface TicketItemProps {
  ticket: Ticket;
  isSelected: boolean;
  onSelect: () => void;
}

const TicketItem: React.FC<TicketItemProps> = ({ ticket, isSelected, onSelect }) => {
  const { id, subject, customer, status, updatedAt } = ticket;
  const { locale } = useLocalization();
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    return new Intl.DateTimeFormat(locale, options).format(new Date(dateString));
  };
  
  return (
    <li
      onClick={onSelect}
      className={`group flex cursor-pointer items-center justify-between p-4 transition-all duration-200 ease-in-out ${
        isSelected
          ? 'border-l-4 border-primary-500 bg-primary-100 dark:bg-primary-900/50'
          : 'border-l-4 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50'
      }`}
    >
      <div className="min-w-0 flex-grow pr-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-grow pr-4">
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">{id}</p>
            <h3 className="truncate font-semibold text-gray-800 dark:text-gray-200">{subject}</h3>
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">{customer.name}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <StatusBadge status={status} />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{formatDate(updatedAt)}</p>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0">
        <ChevronRightIcon
          className={`h-5 w-5 text-gray-400 transition-opacity duration-200 ${
            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        />
      </div>
    </li>
  );
};

export default TicketItem;