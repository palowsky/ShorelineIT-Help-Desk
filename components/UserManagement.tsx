import React, { useState, useMemo } from 'react';
import { User, Role } from '../types';
import { useLocalization } from '../context/LocalizationContext';
import PlusIcon from './icons/PlusIcon';
import UserModal from './UserModal';
import ConfirmationModal from './ConfirmationModal';
import TrashIcon from './icons/TrashIcon';

interface UserManagementProps {
  users: User[];
  currentUser: User;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onCreateUser: (name: string, username: string, role: Role, pin: string) => void;
}

const DEFAULT_AVATAR_URL = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

const UserManagement: React.FC<UserManagementProps> = ({ users, currentUser, onUpdateUser, onDeleteUser, onCreateUser }) => {
    const { t } = useLocalization();
    const roles = Object.values(Role);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'resetPin'>('create');
    const [showInactive, setShowInactive] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const filteredUsers = useMemo(() => {
        return users.filter(user => showInactive || user.isActive);
    }, [users, showInactive]);

    const handleRoleChange = (user: User, newRole: Role) => {
        onUpdateUser({ ...user, role: newRole });
    };
    
    const handleToggleActive = (user: User) => {
        onUpdateUser({ ...user, isActive: !user.isActive });
    };

    const handleOpenResetPinModal = (user: User) => {
        setEditingUser(user);
        setModalMode('resetPin');
        setIsModalOpen(true);
    };

    const openDeleteConfirmation = (user: User) => {
        setUserToDelete(user);
        setIsConfirmOpen(true);
    };
    
    const handleDeleteConfirm = () => {
        if (userToDelete) {
            onDeleteUser(userToDelete.id);
        }
        setIsConfirmOpen(false);
        setUserToDelete(null);
    };
    
    const handleOpenCreateModal = () => {
        setEditingUser(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSaveUser = (userData: Partial<User>) => {
        if (modalMode === 'create') {
            onCreateUser(userData.name!, userData.username!, userData.role!, userData.pin!);
        } else if (modalMode === 'resetPin' && editingUser) {
            onUpdateUser({ ...editingUser, pin: userData.pin! });
        }
        handleCloseModal();
    };


    return (
        <div className="p-6 w-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{t('users.title')}</h1>
                <div className="flex items-center gap-4">
                     <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showInactive}
                            onChange={(e) => setShowInactive(e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span>{t('users.showInactive')}</span>
                    </label>
                    <button
                        type="button"
                        onClick={handleOpenCreateModal}
                        className="inline-flex items-center gap-x-2 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                    >
                        <PlusIcon className="h-5 w-5" />
                        {t('users.addUser')}
                    </button>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('users.name')}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('users.role')}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {t('users.actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className={!user.isActive ? 'opacity-60 bg-gray-50 dark:bg-gray-800/50' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full" src={user.avatar || DEFAULT_AVATAR_URL} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">@{user.username} {!user.isActive && `(${t('users.inactive')})`}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user, e.target.value as Role)}
                                        disabled={user.id === currentUser.id || !user.isActive}
                                        className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm disabled:opacity-70 disabled:bg-gray-200 dark:disabled:bg-gray-700"
                                    >
                                        {roles.map(role => (
                                            <option key={role} value={role}>{t(`roles.${role}`)}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => handleToggleActive(user)}
                                            disabled={user.id === currentUser.id}
                                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {user.isActive ? t('users.deactivate') : t('users.reactivate')}
                                        </button>
                                        <button onClick={() => handleOpenResetPinModal(user)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200">
                                            {t('users.resetPin')}
                                        </button>
                                        <button
                                            onClick={() => openDeleteConfirmation(user)}
                                            disabled={user.id === currentUser.id}
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 disabled:opacity-50 disabled:cursor-not-allowed p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                                            title={t('users.delete')}
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                            <span className="sr-only">{t('users.delete')}</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <UserModal
                    user={editingUser}
                    mode={modalMode}
                    onClose={handleCloseModal}
                    onSave={handleSaveUser}
                />
            )}
            {isConfirmOpen && userToDelete && (
                <ConfirmationModal
                    isOpen={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    title={`${t('users.deleteUserTitle')} ${userToDelete.name}`}
                    message={t('users.confirmDelete')}
                />
            )}
        </div>
    );
};

export default UserManagement;