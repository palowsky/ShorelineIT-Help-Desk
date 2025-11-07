import React, { useState } from 'react';
// FIX: Import `Ticket` type from `../types`
import { Ticket, TicketCategory, TicketPriority, TicketStatus } from '../types';
import { suggestCategoryAndPriority } from '../services/geminiService';
import XIcon from './icons/XIcon';
import SparklesIcon from './icons/SparklesIcon';

interface NewTicketModalProps {
  onClose: () => void;
  onCreateTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => void;
}

const NewTicketModal: React.FC<NewTicketModalProps> = ({ onClose, onCreateTicket }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Other');
  const [priority, setPriority] = useState<TicketPriority>('Medium');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [error, setError] = useState('');
  
  const categories: TicketCategory[] = ['Hardware', 'Software', 'Network', 'Account', 'Other'];
  const priorities: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !description) {
        setError('Please fill in all required fields.');
        return;
    }
    onCreateTicket({
      subject,
      description,
      status: TicketStatus.Open,
      priority,
      category,
      customer: { name, email },
    });
  };

  const handleSuggest = async () => {
    if (!description) {
        setError('Please enter a description first.');
        return;
    }
    setError('');
    setIsSuggesting(true);
    try {
        const result = await suggestCategoryAndPriority(description);
        if (result.category) {
            setCategory(result.category);
        }
        if (result.priority) {
            setPriority(result.priority);
        }
    } catch (err) {
        console.error("AI suggestion failed:", err);
        setError("Couldn't get AI suggestion. Please select manually.");
    } finally {
        setIsSuggesting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold">Create New Support Ticket</h2>
            <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <XIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div className="p-6 space-y-6">
             {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-gray-50 dark:bg-gray-700"/>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-gray-50 dark:bg-gray-700"/>
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
              <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-gray-50 dark:bg-gray-700"/>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={6} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-gray-50 dark:bg-gray-700"></textarea>
            </div>
            <div className="space-y-2">
                <div className="flex justify-end">
                    <button type="button" onClick={handleSuggest} disabled={isSuggesting} className="inline-flex items-center gap-2 px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSuggesting ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <SparklesIcon className="h-4 w-4" />
                        )}
                        <span>{isSuggesting ? 'Analyzing...' : 'Suggest with AI'}</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value as TicketCategory)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-gray-50 dark:bg-gray-700">
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                        <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-gray-50 dark:bg-gray-700">
                            {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>
            </div>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTicketModal;