import React, { useState } from 'react';
import { User, Role } from '../types';
import UserCircleIcon from './icons/UserCircleIcon';
import { useLocalization } from '../context/LocalizationContext';

interface UserSwitcherProps {
    currentUser: User;
    users: User[];
    onSetCurrentUser: (user: User) => void;
}

const UserSwitcher: React.FC<UserSwitcherProps> = ({ currentUser, users, onSetCurrentUser }) => {
    const { t } = useLocalization();
    const [isOpen, setIsOpen] = useState(false);

    const handleSelectUser = (user: User) => {
        onSetCurrentUser(user);
        setIsOpen(false);
    }

    const getRoleName = (role: Role) => {
        switch(role) {
            case Role.Admin: return t('roles.admin');
            case Role.Agent: return t('roles.agent');
            case Role.User: return t('roles.user');
            default: return '';
        }
    }

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
                 <div className="absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                        {users.map(user => (
                             <button
                                key={user.id}
                                onClick={() => handleSelectUser(user)}
                                className="flex w-full items-center gap-x-3 px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                                <div>
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{getRoleName(user.role)}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                 </div>
            )}
        </div>
    );
};

export default UserSwitcher;