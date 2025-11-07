import React from 'react';
import { TicketStatus } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface StatusBadgeProps {
  status: TicketStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { t } = useLocalization();
  const statusStyles: Record<TicketStatus, string> = {
    [TicketStatus.Open]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    [TicketStatus.InProgress]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [TicketStatus.Resolved]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [TicketStatus.Closed]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {t(`statuses.${status}`)}
    </span>
  );
};

export default StatusBadge;