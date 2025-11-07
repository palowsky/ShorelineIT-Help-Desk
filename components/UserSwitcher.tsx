import React from 'react';
import UserCircleIcon from './icons/UserCircleIcon';
import { useLocalization } from '../context/LocalizationContext';

const UserSwitcher: React.FC = () => {
    const { t } = useLocalization();
    return (
        <div className="flex items-center gap-x-2">
            <UserCircleIcon className="h-8 w-8 text-gray-400" />
            <div>
                <p className="text-sm font-semibold">Charlie Brown</p>
                <p className="text-xs text-gray-500">{t('roles.agent')}</p>
            </div>
        </div>
    );
};

export default UserSwitcher;