import React, { useState, useEffect, FormEvent } from 'react';
import { User, Role } from '../types';
import { useLocalization } from '../context/LocalizationContext';
import XIcon from './icons/XIcon';

interface UserModalProps {
  user: User | null; // null for create, a User object for editing
  mode: 'create' | 'resetPin';
  onClose: () => void;
  onSave: (userData: Partial<User>) => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, mode, onClose, onSave }) => {
  const { t } = useLocalization();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    role: Role.User,
    pin: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'resetPin' && user) {
      setFormData({ name: user.name, username: user.username, role: user.role, pin: '' });
    } else {
      setFormData({ name: '', username: '', role: Role.User, pin: '' });
    }
  }, [user, mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'create' && (!formData.name || !formData.username)) {
      setError(t('userModal.errorRequired'));
      return;
    }

    if (!/^\d{4}$/.test(formData.pin)) {
      setError(t('userModal.errorPinFormat'));
      return;
    }
    
    onSave(formData);
  };

  const isCreateMode = mode === 'create';
  const roles = Object.values(Role);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-bold">
                {isCreateMode ? t('userModal.createUserTitle') : `${t('userModal.resetPinTitle')} ${user?.name}`}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('userModal.nameLabel')}</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required disabled={!isCreateMode} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-70 disabled:bg-gray-200 dark:disabled:bg-gray-700 sm:text-sm"/>
            </div>
             <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('userModal.usernameLabel')}</label>
              <input type="text" name="username" id="username" value={formData.username} onChange={handleInputChange} required disabled={!isCreateMode} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-70 disabled:bg-gray-200 dark:disabled:bg-gray-700 sm:text-sm"/>
            </div>
             {isCreateMode && (
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('userModal.roleLabel')}</label>
                    <select id="role" name="role" value={formData.role} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm">
                        {roles.map(role => <option key={role} value={role}>{t(`roles.${role}`)}</option>)}
                    </select>
                </div>
            )}
             <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('userModal.pinLabel')}</label>
              <input type="password" name="pin" id="pin" value={formData.pin} onChange={handleInputChange} required maxLength={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm"/>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            
            <div className="pt-4 flex justify-end gap-4">
              <button type="button" onClick={onClose} className="rounded-md border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600">{t('buttons.cancel')}</button>
              <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700">
                {isCreateMode ? t('userModal.saveUser') : t('userModal.updatePin')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserModal;