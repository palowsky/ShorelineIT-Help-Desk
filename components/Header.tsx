
import React from 'react';
import PlusIcon from './icons/PlusIcon';

interface HeaderProps {
  onNewTicket: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewTicket }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">ZenDesk Support</h1>
          </div>
          <div className="flex items-center">
            <button
              onClick={onNewTicket}
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>New Ticket</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
