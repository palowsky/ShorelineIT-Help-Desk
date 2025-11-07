import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import TicketList from './components/TicketList';
import TicketDetails from './components/TicketDetails';
import NewTicketModal from './components/NewTicketModal';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import BrandingSettings from './components/BrandingSettings';
import { Ticket, User, Role, TicketStatus, TicketPriority, TicketCategory, BrandingSettings as BrandingSettingsType } from './types';

// Mock Data
const initialUsers: User[] = [
  { id: 'user-1', name: 'Alice Admin', username: 'admin', pin: '1234', role: Role.Admin, avatar: 'https://i.pravatar.cc/150?u=alice' },
  { id: 'user-2', name: 'Bob Agent', username: 'agent', pin: '1234', role: Role.Agent, avatar: 'https://i.pravatar.cc/150?u=bob' },
  { id: 'user-3', name: 'Charlie Customer', username: 'customer', pin: '1234', role: Role.User, avatar: 'https://i.pravatar.cc/150?u=charlie' },
  { id: 'user-4', name: 'Diana Agent', username: 'diana', pin: '1234', role: Role.Agent, avatar: 'https://i.pravatar.cc/150?u=diana' },
];

const initialTickets: Ticket[] = [
  {
    id: 'TICKET-1234',
    subject: 'Cannot connect to the office Wi-Fi',
    description: 'My laptop is unable to connect to the "Office-Guest" Wi-Fi network. I have tried restarting my machine and forgetting the network, but it still fails to connect. My colleagues in the same area are not experiencing this issue. I need this resolved urgently as I have a client presentation in an hour.',
    customer: { name: 'Charlie Customer' },
    status: TicketStatus.Open,
    priority: 'High',
    category: 'Network',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    agent: initialUsers[1],
    comments: [
      { id: 'c1', author: initialUsers[2], content: 'Please help, my Wi-Fi is not working!', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      { id: 'c2', author: initialUsers[1], content: 'I am looking into this now. Can you please provide your device model?', createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() }
    ],
    isArchived: false,
  },
  {
    id: 'TICKET-5678',
    subject: 'Request for new software installation - Adobe Photoshop',
    description: 'I need to have Adobe Photoshop installed on my workstation for a new project. My project manager has approved this request. Please let me know the process.',
    customer: { name: 'Diana Agent' }, // An agent can also be a customer
    status: TicketStatus.InProgress,
    priority: 'Medium',
    category: 'Software',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    agent: initialUsers[0],
    comments: [],
    isArchived: false,
  },
  {
    id: 'TICKET-1011',
    subject: 'Printer is not working',
    description: 'The main office printer on the 2nd floor is out of toner. Can someone please replace it?',
    customer: { name: 'Charlie Customer' },
    status: TicketStatus.Resolved,
    priority: 'Low',
    category: 'Hardware',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    agent: initialUsers[1],
    comments: [],
    isArchived: true,
  },
];

const defaultBranding: BrandingSettingsType = {
  companyName: 'Help Desk',
  logoUrl: '',
  faviconUrl: '/vite.svg',
};

const App: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
    const [view, setView] = useState<'tickets' | 'dashboard' | 'users' | 'settings'>('tickets');
    const [showArchived, setShowArchived] = useState(false);
    const [showUnassignedOnly, setShowUnassignedOnly] = useState(false);
    const [activeFilter, setActiveFilter] = useState<{ type: string; value: string } | null>(null);
    const [branding, setBranding] = useState<BrandingSettingsType>(defaultBranding);
    
    // Load branding from localStorage on initial load
    useEffect(() => {
        try {
            const savedBranding = localStorage.getItem('branding');
            if (savedBranding) {
                setBranding(JSON.parse(savedBranding));
            }
        } catch (error) {
            console.error("Failed to parse branding from localStorage", error);
        }
    }, []);
    
    // Update document title and favicon when branding changes
    useEffect(() => {
        document.title = branding.companyName;
        const favicon = document.getElementById('favicon') as HTMLLinkElement | null;
        if (favicon && branding.faviconUrl) {
            favicon.href = branding.faviconUrl;
        }
    }, [branding]);

    const filteredTickets = useMemo(() => {
        let displayTickets = tickets;

        if (currentUser?.role === Role.User) {
            displayTickets = tickets.filter(t => t.customer.name === currentUser.name);
        }

        displayTickets = displayTickets.filter(t => t.isArchived === showArchived);

        if (showUnassignedOnly) {
            displayTickets = displayTickets.filter(t => !t.agent);
        }
        
        if (activeFilter) {
            displayTickets = displayTickets.filter(t => (t as any)[activeFilter.type] === activeFilter.value);
        }

        return displayTickets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }, [tickets, currentUser, showArchived, showUnassignedOnly, activeFilter]);

    useEffect(() => {
        if (currentUser && filteredTickets.length > 0) {
            if (!selectedTicketId || !filteredTickets.find(t => t.id === selectedTicketId)) {
                setSelectedTicketId(filteredTickets[0].id);
            }
        } else {
            setSelectedTicketId(null);
        }
    }, [currentUser, filteredTickets, selectedTicketId]);

    const handleLogin = (username: string, pin: string): boolean => {
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.pin === pin);
        if (user) {
            setCurrentUser(user);
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setSelectedTicketId(null);
        setView('tickets');
    };

    const handleSelectTicket = (ticket: Ticket) => {
        setSelectedTicketId(ticket.id);
    };

    const handleUpdateTicket = (updatedTicket: Ticket) => {
        const newTickets = tickets.map(t => t.id === updatedTicket.id ? { ...updatedTicket, updatedAt: new Date().toISOString() } : t);
        setTickets(newTickets);
    };

    const handleAddTicket = (newTicketData: {
        subject: string;
        description: string;
        customerName: string;
        priority: TicketPriority;
        category: TicketCategory;
    }) => {
        if (!currentUser) return;

        const customerAsUser: User = users.find(u => u.name === newTicketData.customerName) || {
            id: `user-guest-${Date.now()}`,
            name: newTicketData.customerName,
            username: newTicketData.customerName.toLowerCase().replace(/\s/g, ''),
            pin: '',
            role: Role.User,
            avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(newTicketData.customerName)}`
        };

        const newTicket: Ticket = {
            id: `TICKET-${Math.floor(Math.random() * 10000)}`,
            subject: newTicketData.subject,
            description: newTicketData.description,
            customer: { name: newTicketData.customerName },
            status: TicketStatus.Open,
            priority: newTicketData.priority,
            category: newTicketData.category,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            comments: [{
                id: `comment-${Date.now()}`,
                author: customerAsUser,
                content: newTicketData.description,
                createdAt: new Date().toISOString(),
            }],
            isArchived: false,
        };
        setTickets([newTicket, ...tickets]);
    };
    
    const handleApplyFilter = (type: string, value: string) => {
        setActiveFilter({ type, value });
        setView('tickets');
    };

    const handleClearFilter = () => {
        setActiveFilter(null);
    };

    const handleUpdateUser = (updatedUser: User) => {
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        if (currentUser && currentUser.id === updatedUser.id) {
            setCurrentUser(updatedUser);
        }
    };

    const handleDeleteUser = (userId: string) => {
        setUsers(users.filter(u => u.id !== userId));
    };

    const handleCreateUser = (name: string, username: string, role: Role, pin: string) => {
        const newUser: User = {
            id: `user-${Date.now()}`,
            name,
            username,
            pin,
            role,
            avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(username)}`,
        };
        setUsers([newUser, ...users]);
    };
    
    const handleChangeAvatar = (newAvatarUrl: string) => {
        if (!currentUser) return;
        const updatedUser = { ...currentUser, avatar: newAvatarUrl };
        handleUpdateUser(updatedUser);
    };
    
    const handleSaveBranding = (newBranding: BrandingSettingsType) => {
        setBranding(newBranding);
        localStorage.setItem('branding', JSON.stringify(newBranding));
    };

    const selectedTicket = useMemo(() => {
        return tickets.find(ticket => ticket.id === selectedTicketId);
    }, [tickets, selectedTicketId]);
    
    const technicians = useMemo(() => {
        return users.filter(u => u.role === Role.Admin || u.role === Role.Agent);
    }, [users]);

    if (!currentUser) {
        return <LoginScreen onLogin={handleLogin} branding={branding} />;
    }

    return (
        <div className="h-screen w-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Header
                onNewTicket={() => setIsNewTicketModalOpen(true)}
                currentUser={currentUser}
                onLogout={handleLogout}
                view={view}
                onSetView={setView}
                onChangeAvatar={handleChangeAvatar}
                branding={branding}
            />
            <main className="flex-grow flex min-h-0">
                {view === 'tickets' && (
                    <>
                        <aside className="w-full md:w-1/3 min-w-[300px] max-w-[450px] border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
                            <TicketList
                                tickets={filteredTickets}
                                selectedTicketId={selectedTicketId}
                                onSelectTicket={handleSelectTicket}
                                showArchived={showArchived}
                                onSetShowArchived={setShowArchived}
                                currentUser={currentUser}
                                showUnassignedOnly={showUnassignedOnly}
                                onSetShowUnassignedOnly={setShowUnassignedOnly}
                                activeFilter={activeFilter}
                                onClearFilter={handleClearFilter}
                            />
                        </aside>
                        <section className="hidden md:flex flex-col flex-grow">
                            {selectedTicket ? (
                                <TicketDetails
                                    ticket={selectedTicket}
                                    currentUser={currentUser}
                                    onUpdateTicket={handleUpdateTicket}
                                    technicians={technicians}
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-500">
                                    <p>Select a ticket to view details</p>
                                </div>
                            )}
                        </section>
                    </>
                )}
                {view === 'dashboard' && <Dashboard tickets={tickets} onApplyFilter={handleApplyFilter} />}
                {view === 'users' && <UserManagement 
                    users={users}
                    currentUser={currentUser}
                    onUpdateUser={handleUpdateUser}
                    onDeleteUser={handleDeleteUser}
                    onCreateUser={handleCreateUser}
                 />}
                {view === 'settings' && <BrandingSettings
                    currentBranding={branding}
                    onSave={handleSaveBranding}
                />}
            </main>
            {isNewTicketModalOpen && (
                <NewTicketModal
                    onClose={() => setIsNewTicketModalOpen(false)}
                    onAddTicket={handleAddTicket}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
};

export default App;