import React, { useState, FormEvent, useEffect } from 'react';
import { TicketCategory, TicketPriority, User, Role } from '../types';
import XIcon from './icons/XIcon';
import SparklesIcon from './icons/SparklesIcon';
import { suggestCategoryAndPriority } from '../services/geminiService';
import { useLocalization } from '../context/LocalizationContext';

interface NewTicketModalProps {
  currentUser: User;
  onClose: () => void;
  onAddTicket: (ticketData: {
    subject: string;
    description: string;
    customerName: string;
    priority: TicketPriority;
    category: TicketCategory;
  }) => void;
}

const ticketCategories: TicketCategory[] = ['Hardware', 'Software', 'Network', 'Account', 'Other'];
const ticketPriorities: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical'];

const NewTicketModal: React.FC<NewTicketModalProps> = ({ onClose, onAddTicket, currentUser }) => {
  const { t } = useLocalization();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Other');
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [error, setError] = useState('');
  
  const isCustomer = currentUser.role === Role.User;

  useEffect(() => {
    if (isCustomer) {
      setCustomerName(currentUser.name);
    }
  }, [currentUser, isCustomer]);


  const handleSuggest = async () => {
    if (!description) {
      setError(t('newTicketModal.errorDescription'));
      return;
    }
    setError('');
    setIsSuggesting(true);
    try {
      const suggestions = await suggestCategoryAndPriority(description);
      if (suggestions.category) {
        setCategory(suggestions.category);
      }
      if (suggestions.priority) {
        setPriority(suggestions.priority);
      }
    } catch (err) {
      setError(t('newTicketModal.errorAISuggest'));
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!subject || !description || !customerName) {
        setError(t('newTicketModal.errorRequiredFields'));
        return;
    }
    onAddTicket({ subject, description, customerName, category, priority });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl transform transition-all">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-bold">{t('newTicketModal.title')}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('newTicketModal.customerName')}</label>
                <input type="text" name="customerName" id="customerName" value={customerName} onChange={e => setCustomerName(e.target.value)} required disabled={isCustomer} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-70 disabled:bg-gray-200 dark:disabled:bg-gray-700 sm:text-sm"/>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('newTicketModal.subject')}</label>
              <input type="text" name="subject" id="subject" value={subject} onChange={e => setSubject(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm"/>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('newTicketModal.description')}</label>
              <textarea id="description" name="description" rows={4} value={description} onChange={e => setDescription(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm"></textarea>
            </div>
            <div className="flex items-end gap-4">
              <div className="flex-grow">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('newTicketModal.category')}</label>
                <select id="category" name="category" value={category} onChange={e => setCategory(e.target.value as TicketCategory)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm">
                  {ticketCategories.map(cat => <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>)}
                </select>
              </div>
              <div className="flex-grow">
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('newTicketModal.priority')}</label>
                <select id="priority" name="priority" value={priority} onChange={e => setPriority(e.target.value as TicketPriority)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm">
                  {ticketPriorities.map(prio => <option key={prio} value={prio}>{t(`priorities.${prio}`)}</option>)}
                </select>
              </div>
              <button type="button" onClick={handleSuggest} disabled={isSuggesting} className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50">
                <SparklesIcon className="h-5 w-5" />
                {isSuggesting ? t('newTicketModal.suggesting') : t('newTicketModal.aiSuggest')}
              </button>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            
            <div className="pt-4 flex justify-end gap-4">
              <button type="button" onClick={onClose} className="rounded-md border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600">{t('buttons.cancel')}</button>
              <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700">{t('buttons.createTicket')}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTicketModal;