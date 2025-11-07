export enum Role {
  Admin = 'Admin',
  Agent = 'Agent',
  User = 'User',
}

export interface User {
  id: string;
  name: string;
  username: string;
  pin: string;
  role: Role;
  avatar: string;
}

export enum TicketStatus {
  Open = 'Open',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
  Closed = 'Closed',
}

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type TicketCategory = 'Hardware' | 'Software' | 'Network' | 'Account' | 'Other';

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface Customer {
    name: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  customer: Customer;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: string;
  updatedAt: string;
  agent?: User;
  comments: Comment[];
  isArchived: boolean;
}