import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { useLocalization } from '../context/LocalizationContext';
import XIcon from './icons/XIcon';

interface ChangeAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newAvatarUrl: string) => void;
  currentUser: User;
}

const DEFAULT_AVATAR_URL = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

const ChangeAvatarModal: React.FC<ChangeAvatarModalProps> = ({ isOpen, onClose, onSave, currentUser }) => {
  const { t } = useLocalization();
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar || '');
  const [previewUrl, setPreviewUrl] = useState(currentUser.avatar || DEFAULT_AVATAR_URL);

  useEffect(() => {
    setAvatarUrl(currentUser.avatar || '');
    setPreviewUrl(currentUser.avatar || DEFAULT_AVATAR_URL);
  }, [currentUser.avatar]);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setPreviewUrl(avatarUrl || DEFAULT_AVATAR_URL);
    }, 500); // Debounce image loading

    return () => {
      clearTimeout(handler);
    };
  }, [avatarUrl]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(avatarUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <h2 id="modal-title" className="text-2xl font-bold">{t('header.changeAvatar')}</h2>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <XIcon className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Avatar Image URL</label>
                <input
                  type="url"
                  name="avatarUrl"
                  id="avatarUrl"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/image.png"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Preview</label>
                <div className="mt-2 flex items-center justify-center p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                   <img 
                    src={previewUrl} 
                    alt="Avatar preview" 
                    className="h-24 w-24 rounded-full object-cover" 
                    onError={() => setPreviewUrl(DEFAULT_AVATAR_URL)}
                   />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end gap-4 rounded-b-lg">
            <button type="button" onClick={onClose} className="rounded-md border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600">{t('buttons.cancel')}</button>
            <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700">{t('buttons.saveChanges')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeAvatarModal;
