import React, { useState } from 'react';
import { User, Role } from '../types';
import { useLocalization } from '../context/LocalizationContext';
import PlusIcon from './icons/PlusIcon';
import UserModal from './UserModal'; // Import the new modal component

interface UserManagementProps {
  users: User[];
  currentUser: User;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onCreateUser: (name: string, username: string, role: Role, pin: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, currentUser, onUpdateUser, onDeleteUser, onCreateUser }) => {
    const { t } = useLocalization();
    const roles = Object.values(Role);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'resetPin'>('create');

    const handleRoleChange = (user: User, newRole: Role) => {
        onUpdateUser({ ...user, role: newRole });
    };

    const handleOpenResetPinModal = (user: User) => {
        setEditingUser(user);
        setModalMode('resetPin');
        setIsModalOpen(true);
    };

    const handleDelete = (user: User) => {
        if (confirm(t('users.confirmDelete', `Are you sure you want to delete ${user.name}?`))) {
            onDeleteUser(user.id);
        }
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
                <button
                    type="button"
                    onClick={handleOpenCreateModal}
                    className="inline-flex items-center gap-x-2 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                    <PlusIcon className="h-5 w-5" />
                    {t('users.addUser')}
                </button>
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
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user, e.target.value as Role)}
                                        disabled={user.id === currentUser.id}
                                        className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm disabled:opacity-70 disabled:bg-gray-200 dark:disabled:bg-gray-700"
                                    >
                                        {roles.map(role => (
                                            <option key={role} value={role}>{t(`roles.${role}`)}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button onClick={() => handleOpenResetPinModal(user)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200">
                                        {t('users.resetPin')}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user)}
                                        disabled={user.id === currentUser.id}
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {t('users.delete')}
                                    </button>
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
        </div>
    );
};

export default UserManagement;