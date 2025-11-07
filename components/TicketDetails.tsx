
import React, { useState } from 'react';
import { Ticket, TicketStatus, TicketPriority, TicketHistory } from '../types';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import StatusBadge from './StatusBadge';

interface TicketDetailsProps {
  ticket: Ticket;
  onBack: () => void;
  onUpdateTicket: (updatedTicket: Ticket) => void;
}

const TicketDetails: React.FC<TicketDetailsProps> = ({ ticket, onBack, onUpdateTicket }) => {
  const [currentStatus, setCurrentStatus] = useState<TicketStatus>(ticket.status);
  const [currentPriority, setCurrentPriority] = useState<TicketPriority>(ticket.priority);
  const [newComment, setNewComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    
    const changes: string[] = [];
    if (currentStatus !== ticket.status) {
      changes.push(`Status changed from ${ticket.status} to ${currentStatus}`);
    }
    if (currentPriority !== ticket.priority) {
      changes.push(`Priority changed from ${ticket.priority} to ${currentPriority}`);
    }
    
    let newHistory: TicketHistory[] = [...ticket.history];

    if (changes.length > 0) {
      newHistory.push({
        user: 'Support Team', // Assuming updates are by support
        action: changes.join(', '),
        timestamp: new Date(),
      });
    }

    if (newComment.trim()) {
      newHistory.push({
        user: 'Support Team',
        action: 'Comment added',
        comment: newComment.trim(),
        timestamp: new Date(),
      });
    }

    const updatedTicket: Ticket = {
      ...ticket,
      status: currentStatus,
      priority: currentPriority,
      updatedAt: new Date(),
      history: newHistory,
    };
    
    onUpdateTicket(updatedTicket);
    setNewComment('');
    setIsSaving(false);
  };

  const hasChanges = currentStatus !== ticket.status || currentPriority !== ticket.priority || newComment.trim() !== '';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-fade-in">
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <p className="text-sm font-medium text-primary-600 dark:text-primary-400">{ticket.id}</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{ticket.subject}</h2>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row">
        <div className="flex-grow p-4 sm:p-6 space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Description</h3>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md border border-gray-200 dark:border-gray-700">{ticket.description}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">History</h3>
            <div className="space-y-6 border-l-2 border-gray-200 dark:border-gray-600 ml-2 pl-6">
              {ticket.history.map((item, index) => (
                <div key={index} className="relative">
                   <div className="absolute -left-[1.8rem] top-1.5 h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-500 ring-4 ring-white dark:ring-gray-800"></div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{item.user} <span className="font-normal text-sm text-gray-500 dark:text-gray-400">&middot; {formatDate(item.timestamp)}</span></p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{item.action}</p>
                  {item.comment && <p className="mt-2 text-sm bg-gray-100 dark:bg-gray-700/80 p-3 rounded-md border border-gray-200 dark:border-gray-600">{item.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-gray-800/50">
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Customer</h4>
            <p className="text-gray-900 dark:text-gray-100">{ticket.customer.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{ticket.customer.email}</p>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <StatusBadge status={currentStatus} />
          </div>
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
            <p className="text-gray-900 dark:text-gray-100">{currentPriority}</p>
          </div>
           <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Category</h4>
            <p className="mt-1 text-gray-900 dark:text-gray-100">{ticket.category}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">Timestamps</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Created: {formatDate(ticket.createdAt)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Updated: {formatDate(ticket.updatedAt)}</p>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
             <div>
                <label htmlFor="status-update" className="font-semibold text-gray-700 dark:text-gray-300">Update Status</label>
                 <select id="status-update" value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value as TicketStatus)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700">
                    {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
             </div>
             <div>
                <label htmlFor="priority-update" className="font-semibold text-gray-700 dark:text-gray-300">Update Priority</label>
                 <select id="priority-update" value={currentPriority} onChange={(e) => setCurrentPriority(e.target.value as TicketPriority)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700">
                    {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p} value={p}>{p}</option>)}
                 </select>
             </div>
             <div>
                <label htmlFor="comment" className="font-semibold text-gray-700 dark:text-gray-300">Add Comment</label>
                <textarea id="comment" rows={4} value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add an internal note or reply..." className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-700" />
             </div>
            <button onClick={handleSaveChanges} disabled={!hasChanges || isSaving} className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
