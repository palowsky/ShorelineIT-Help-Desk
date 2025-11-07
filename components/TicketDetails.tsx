
import React from 'react';
import { Ticket, User } from '../types';
import StatusBadge from './StatusBadge';

interface TicketDetailsProps {
    ticket: Ticket;
    currentUser: User;
    onUpdateTicket: (ticket: Ticket) => void;
}

const TicketDetails: React.FC<TicketDetailsProps> = ({ ticket }) => {
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-semibold">{ticket.id}</p>
                    <h1 className="text-2xl font-bold">{ticket.subject}</h1>
                </div>
                <StatusBadge status={ticket.status} />
            </div>

            <div className="grid grid-cols-3 gap-6 mt-6">
                <div className="col-span-1">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer</h3>
                    <p className="mt-1 text-sm">{ticket.customer.name}</p>
                </div>
                <div className="col-span-1">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Agent</h3>
                    <p className="mt-1 text-sm">{ticket.agent?.name || 'Unassigned'}</p>
                </div>
                <div className="col-span-1">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</h3>
                    <p className="mt-1 text-sm">{formatDate(ticket.createdAt)}</p>
                </div>
                <div className="col-span-1">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h3>
                    <p className="mt-1 text-sm">{ticket.category}</p>
                </div>
                <div className="col-span-1">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</h3>
                    <p className="mt-1 text-sm">{ticket.priority}</p>
                </div>
                 <div className="col-span-1">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</h3>
                    <p className="mt-1 text-sm">{formatDate(ticket.updatedAt)}</p>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-semibold">Description</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{ticket.description}</p>
            </div>
            
            <div className="mt-8">
                <h2 className="text-lg font-semibold">Conversation</h2>
                <ul className="mt-4 space-y-4">
                    {ticket.comments.map(comment => (
                        <li key={comment.id} className="flex gap-x-4">
                            <img src={comment.author.avatar} alt="" className="h-10 w-10 rounded-full bg-gray-50" />
                            <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200 dark:ring-gray-700">
                                <div className="flex justify-between">
                                    <p className="text-sm font-semibold">{comment.author.name}</p>
                                    <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{comment.content}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TicketDetails;
