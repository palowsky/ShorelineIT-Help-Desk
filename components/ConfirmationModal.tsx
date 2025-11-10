import React from 'react';
import { useLocalization } from '../context/LocalizationContext';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  const { t } = useLocalization();
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" aria-labelledby="confirm-modal-title" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all">
        <div className="p-6">
          <h2 id="confirm-modal-title" className="text-xl font-bold">{title}</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{message}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-end gap-4 rounded-b-lg">
          <button type="button" onClick={onClose} className="rounded-md border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600">{t('buttons.cancel')}</button>
          <button type="button" onClick={handleConfirm} className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700">{t('users.delete')}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
