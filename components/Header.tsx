import React, { useState } from 'react';
import PlusIcon from './icons/PlusIcon';
import GlobeAltIcon from './icons/GlobeAltIcon';
import ChartPieIcon from './icons/ChartPieIcon';
import UsersIcon from './icons/UsersIcon';
import Cog6ToothIcon from './icons/Cog6ToothIcon';
import UserSwitcher from './UserSwitcher';
import { useLocalization } from '../context/LocalizationContext';
import { User, Role, BrandingSettings } from '../types';

interface HeaderProps {
  onNewTicket: () => void;
  currentUser: User;
  onLogout: () => void;
  view: 'tickets' | 'dashboard' | 'users' | 'settings';
  onSetView: (view: 'tickets' | 'dashboard' | 'users' | 'settings') => void;
  onOpenAvatarModal: () => void;
  branding: BrandingSettings;
}

const Header: React.FC<HeaderProps> = ({ onNewTicket, currentUser, onLogout, view, onSetView, onOpenAvatarModal, branding }) => {
  const { t, setLocale, locale } = useLocalization();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  
  const handleLocaleChange = (newLocale: 'en' | 'es') => {
    setLocale(newLocale);
    setIsLangDropdownOpen(false);
  }

  return (
    <header className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onSetView('tickets')}
            title={branding.companyName}
          >
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt={branding.companyName} className="h-10 w-auto" />
            ) : (
              <h1 className="text-xl font-semibold">{branding.companyName}</h1>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {currentUser.role === Role.Admin && (
            <>
              <button
                type="button"
                onClick={() => onSetView('dashboard')}
                title={t('header.dashboard')}
                className={`inline-flex items-center gap-x-2 rounded-md px-3 py-2 text-sm font-semibold ${
                  view === 'dashboard'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <ChartPieIcon className="h-5 w-5" />
                <span className="hidden md:inline">{t('header.dashboard')}</span>
              </button>
              <button
                type="button"
                onClick={() => onSetView('users')}
                 title={t('header.manageUsers')}
                className={`inline-flex items-center gap-x-2 rounded-md px-3 py-2 text-sm font-semibold ${
                  view === 'users'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <UsersIcon className="h-5 w-5" />
                <span className="hidden md:inline">{t('header.manageUsers')}</span>
              </button>
               <button
                type="button"
                onClick={() => onSetView('settings')}
                 title={t('header.settings')}
                className={`inline-flex items-center gap-x-2 rounded-md px-3 py-2 text-sm font-semibold ${
                  view === 'settings'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Cog6ToothIcon className="h-5 w-5" />
                 <span className="hidden md:inline">{t('header.settings')}</span>
              </button>
            </>
          )}

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="inline-flex items-center gap-x-2 rounded-md px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <GlobeAltIcon className="h-5 w-5" />
              <span className="hidden sm:inline">{locale.toUpperCase()}</span>
            </button>
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                  <button onClick={() => handleLocaleChange('en')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">English</button>
                  <button onClick={() => handleLocaleChange('es')} className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Español</button>
                </div>
              </div>
            )}
          </div>
          <UserSwitcher currentUser={currentUser} onLogout={onLogout} onOpenAvatarModal={onOpenAvatarModal} />
          <button
            type="button"
            onClick={onNewTicket}
            className="inline-flex items-center gap-x-2 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="hidden sm:inline">{t('header.newTicket')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;