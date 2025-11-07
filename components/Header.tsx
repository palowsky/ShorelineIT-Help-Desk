
import React from 'react';
import PlusIcon from './icons/PlusIcon';

interface HeaderProps {
  onNewTicket: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewTicket }) => {
  return (
    <header className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold">Support Desk</h1>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            onClick={onNewTicket}
            className="inline-flex items-center gap-x-2 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <PlusIcon className="h-5 w-5" />
            New Ticket
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
