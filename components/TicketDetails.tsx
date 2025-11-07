import React, { useState, useEffect } from 'react';
import { Ticket, User, TicketStatus, TicketPriority, TicketCategory, Comment } from '../types';
import StatusBadge from './StatusBadge';
import PencilIcon from './icons/PencilIcon';
import { useLocalization } from '../context/LocalizationContext';

interface TicketDetailsProps {
    ticket: Ticket;
    currentUser: User;
    onUpdateTicket: (ticket: Ticket) => void;
}

const ticketStatuses = Object.values(TicketStatus);
const ticketCategories: TicketCategory[] = ['Hardware', 'Software', 'Network', 'Account', 'Other'];
const ticketPriorities: TicketPriority[] = ['Low', 'Medium', 'High', 'Critical'];

const TicketDetails: React.FC<TicketDetailsProps> = ({ ticket, currentUser, onUpdateTicket }) => {
    const { t, locale } = useLocalization();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...ticket });
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        setEditData({ ...ticket });
        setIsEditing(false);
        setNewComment('');
    }, [ticket]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString(locale, {
            year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit'
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onUpdateTicket(editData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData({ ...ticket });
        setIsEditing(false);
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        const comment: Comment = {
            id: `comment-${Date.now()}`,
            author: currentUser,
            content: newComment,
            createdAt: new Date().toISOString(),
        };
        onUpdateTicket({ ...ticket, comments: [...ticket.comments, comment] });
        setNewComment('');
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex-shrink-0">
                <div className="flex items-start justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold">{ticket.id}</p>
                        {isEditing ? (
                            <input
                                type="text"
                                name="subject"
                                value={editData.subject}
                                onChange={handleInputChange}
                                className="text-2xl font-bold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-primary-500 w-full"
                            />
                        ) : (
                            <h1 className="text-2xl font-bold">{ticket.subject}</h1>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <StatusBadge status={ticket.status} />
                        <button onClick={() => setIsEditing(!isEditing)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                            <PencilIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                    {/* Customer Info */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('ticketDetails.customer')}</h3>
                        <p className="mt-1 text-sm">{ticket.customer.name}</p>
                    </div>
                     {/* Agent Info */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('ticketDetails.agent')}</h3>
                        <p className="mt-1 text-sm">{ticket.agent?.name || t('ticketDetails.unassigned')}</p>
                    </div>
                     {/* Created Date */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('ticketDetails.created')}</h3>
                        <p className="mt-1 text-sm">{formatDate(ticket.createdAt)}</p>
                    </div>

                    {/* Category */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('ticketDetails.category')}</h3>
                        {isEditing ? (
                             <select name="category" value={editData.category} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm">
                                {ticketCategories.map(cat => <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>)}
                            </select>
                        ) : <p className="mt-1 text-sm">{t(`categories.${ticket.category}`)}</p>}
                    </div>
                    {/* Priority */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('ticketDetails.priority')}</h3>
                        {isEditing ? (
                             <select name="priority" value={editData.priority} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm">
                                {ticketPriorities.map(prio => <option key={prio} value={prio}>{t(`priorities.${prio}`)}</option>)}
                            </select>
                        ) : <p className="mt-1 text-sm">{t(`priorities.${ticket.priority}`)}</p>}
                    </div>
                    {/* Last Updated */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('ticketDetails.lastUpdated')}</h3>
                        <p className="mt-1 text-sm">{formatDate(ticket.updatedAt)}</p>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-lg font-semibold">{t('ticketDetails.description')}</h2>
                    {isEditing ? (
                         <textarea name="description" rows={5} value={editData.description} onChange={handleInputChange} className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm whitespace-pre-wrap"></textarea>
                    ) : (
                        <p className="mt-2 text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{ticket.description}</p>
                    )}
                </div>

                {isEditing && (
                    <div className="mt-6 flex justify-end gap-4">
                        <button onClick={handleCancel} className="rounded-md border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600">{t('buttons.cancel')}</button>
                        <button onClick={handleSave} className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700">Save Changes</button>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex-grow flex flex-col">
                <h2 className="text-lg font-semibold flex-shrink-0">{t('ticketDetails.conversation')}</h2>
                <ul className="mt-4 space-y-4 flex-grow overflow-y-auto pr-2">
                    {ticket.comments.map(comment => (
                        <li key={comment.id} className="flex gap-x-4">
                            <img src={comment.author.avatar} alt="" className="h-10 w-10 rounded-full bg-gray-50 flex-shrink-0" />
                            <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200 dark:ring-gray-700">
                                <div className="flex justify-between">
                                    <p className="text-sm font-semibold">{comment.author.name}</p>
                                    <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                            </div>
                        </li>
                    ))}
                     {ticket.comments.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No comments yet.</p>}
                </ul>
                <div className="mt-6 flex gap-x-3 flex-shrink-0">
                    <img src={currentUser.avatar} alt="" className="h-10 w-10 rounded-full bg-gray-50" />
                    <div className="flex-1">
                        <textarea
                            rows={3}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 sm:text-sm"
                        ></textarea>
                        <div className="mt-2 flex justify-end">
                            <button
                                onClick={handleAddComment}
                                className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                            >
                                Add Comment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetails;
