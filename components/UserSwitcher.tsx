import React, { useState } from 'react';
import { User, Role } from '../types';
import { useLocalization } from '../context/LocalizationContext';
import ArrowRightOnRectangleIcon from './icons/ArrowRightOnRectangleIcon';
import PhotoIcon from './icons/PhotoIcon';

interface UserSwitcherProps {
    currentUser: User;
    onLogout: () => void;
    onChangeAvatar: (newAvatarUrl: string) => void;
}

const UserSwitcher: React.FC<UserSwitcherProps> = ({ currentUser, onLogout, onChangeAvatar }) => {
    const { t } = useLocalization();
    const [isOpen, setIsOpen] = useState(false);

    const getRoleName = (role: Role) => {
        switch(role) {
            case Role.Admin: return t('roles.admin');
            case Role.Agent: return t('roles.agent');
            case Role.User: return t('roles.user');
            default: return '';
        }
    }

    const handleChangeAvatarClick = () => {
        const newAvatarUrl = prompt("Enter new avatar image URL:");
        if (newAvatarUrl) {
            onChangeAvatar(newAvatarUrl);
        }
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-x-2 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <img src={currentUser.avatar} alt={currentUser.name} className="h-8 w-8 rounded-full" />
                <div>
                    <p className="text-sm font-semibold text-left">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-left">{getRoleName(currentUser.role)}</p>
                </div>
            </button>
            {isOpen && (
                 <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1 divide-y divide-gray-100 dark:divide-gray-700">
                         <div className="px-1 py-1">
                             <button
                                onClick={handleChangeAvatarClick}
                                className="flex w-full items-center gap-x-3 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                            >
                                <PhotoIcon className="h-5 w-5" />
                                <span>{t('header.changeAvatar')}</span>
                            </button>
                        </div>
                         <div className="px-1 py-1">
                            <button
                                onClick={onLogout}
                                className="flex w-full items-center gap-x-3 px-4 py-2 text-left text-sm text-red-700 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                            >
                                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                <span>{t('header.logout')}</span>
                            </button>
                        </div>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default UserSwitcher;