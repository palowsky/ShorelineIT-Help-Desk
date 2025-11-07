import React from 'react';
import { Ticket, User, Role } from '../types';
import TicketItem from './TicketItem';
import { useLocalization } from '../context/LocalizationContext';
import XIcon from './icons/XIcon';

interface TicketListProps {
  tickets: Ticket[];
  selectedTicketId?: string | null;
  onSelectTicket: (ticket: Ticket) => void;
  showArchived: boolean;
  onSetShowArchived: (show: boolean) => void;
  currentUser: User;
  showUnassignedOnly: boolean;
  onSetShowUnassignedOnly: (show: boolean) => void;
  activeFilter: { type: string; value: string } | null;
  onClearFilter: () => void;
}

const TicketList: React.FC<TicketListProps> = ({ 
  tickets, 
  selectedTicketId, 
  onSelectTicket, 
  showArchived, 
  onSetShowArchived,
  currentUser,
  showUnassignedOnly,
  onSetShowUnassignedOnly,
  activeFilter,
  onClearFilter
}) => {
  const { t } = useLocalization();
  const isPrivilegedUser = currentUser.role === Role.Admin || currentUser.role === Role.Agent;

  const getFilterDisplayValue = (type: string, value: string) => {
    const translationKey = `${type}s.${value}`; // e.g., statuses.Open, priorities.High
    return t(translationKey, value); // Fallback to raw value if not found
  }

  return (
    <div className="bg-white dark:bg-gray-800 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h2 className="text-lg font-semibold">{showArchived ? t('ticketList.archivedTitle') : t('ticketList.title')} ({tickets.length})</h2>
        <div className="mt-2 flex flex-col space-y-1">
            <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                <input
                    type="checkbox"
                    checked={showArchived}
                    onChange={(e) => onSetShowArchived(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
                />
                <span>{t('ticketList.showArchived')}</span>
            </label>
            {isPrivilegedUser && (
                <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showUnassignedOnly}
                        onChange={(e) => onSetShowUnassignedOnly(e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span>{t('ticketList.showUnassigned')}</span>
                </label>
            )}
        </div>
      </div>
      {activeFilter && (
        <div className="p-3 bg-primary-100 dark:bg-primary-900/50 flex items-center justify-between text-sm border-b border-primary-200 dark:border-primary-800 flex-shrink-0">
            <p className="font-semibold text-primary-800 dark:text-primary-200">
              <span className="text-gray-600 dark:text-gray-400">{t(`ticketList.filterTypes.${activeFilter.type}`)}: </span>
              {getFilterDisplayValue(activeFilter.type, activeFilter.value)}
            </p>
            <button onClick={onClearFilter} className="flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline">
              <XIcon className="h-3 w-3" />
              {t('ticketList.clearFilter')}
            </button>
        </div>
      )}
      <ul className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto">
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
                {t('ticketList.noTickets')}
            </li>
        )}
      </ul>
    </div>
  );
};

export default TicketList;