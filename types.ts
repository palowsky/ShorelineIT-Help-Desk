
export enum TicketStatus {
  Open = 'Open',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
  Closed = 'Closed',
}

export type TicketCategory = 'Hardware' | 'Software' | 'Network' | 'Account' | 'Other';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface User {
  id: string;
  name: string;
  avatar: string; // URL to avatar image
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string; // ISO date string
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  customer: User;
  agent?: User;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  comments: Comment[];
}
