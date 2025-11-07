import React, { useState } from 'react';
import PlusIcon from './icons/PlusIcon';
import GlobeAltIcon from './icons/GlobeAltIcon';
import { useLocalization } from '../context/LocalizationContext';

interface HeaderProps {
  onNewTicket: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewTicket }) => {
  const { t, setLocale, locale } = useLocalization();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  
  const handleLocaleChange = (newLocale: 'en' | 'es') => {
    setLocale(newLocale);
    setIsLangDropdownOpen(false);
  }

  return (
    <header className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold">{t('header.title')}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="inline-flex items-center gap-x-2 rounded-md px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <GlobeAltIcon className="h-5 w-5" />
              <span>{locale.toUpperCase()}</span>
            </button>
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <button
                    onClick={() => handleLocaleChange('en')}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLocaleChange('es')}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Español
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onNewTicket}
            className="inline-flex items-center gap-x-2 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <PlusIcon className="h-5 w-5" />
            {t('header.newTicket')}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;