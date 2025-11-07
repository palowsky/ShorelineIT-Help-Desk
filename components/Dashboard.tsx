import React, { useMemo } from 'react';
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface DashboardProps {
  tickets: Ticket[];
  onApplyFilter: (type: 'priority' | 'category' | 'status', value: string) => void;
}

interface ChartData {
    name: string; // Display name
    value: string; // Original value for filtering
    count: number;
}

const BarChart: React.FC<{ data: ChartData[], title: string, onBarClick: (value: string) => void }> = ({ data, title, onBarClick }) => {
    const maxValue = Math.max(...data.map(d => d.count), 0);
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <div className="space-y-2">
                {data.map(item => (
                    <div key={item.name} onClick={() => onBarClick(item.value)} className="flex items-center cursor-pointer group rounded-md p-1 -m-1 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                        <span className="w-24 text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{item.name}</span>
                        <div className="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                           <div 
                             className="bg-primary-500 h-6 rounded-full text-xs font-medium text-white text-center p-1 leading-none group-hover:bg-primary-600 transition-colors"
                             style={{ width: maxValue > 0 ? `${(item.count / maxValue) * 100}%` : '0%' }}
                           >
                             {item.count > 0 ? item.count : ''}
                           </div>
                        </div>
                    </div>
                ))}
                {data.length === 0 && <p className="text-sm text-gray-500">{useLocalization().t('dashboard.noData')}</p>}
            </div>
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ tickets, onApplyFilter }) => {
    const { t } = useLocalization();

    const stats = useMemo(() => {
        const open = tickets.filter(t => t.status === TicketStatus.Open).length;
        const inProgress = tickets.filter(t => t.status === TicketStatus.InProgress).length;
        const resolved = tickets.filter(t => t.status === TicketStatus.Resolved).length;
        const total = tickets.length;
        return { open, inProgress, resolved, total };
    }, [tickets]);

    const ticketsByPriority = useMemo(() => {
        const counts: Record<TicketPriority, number> = { 'Low': 0, 'Medium': 0, 'High': 0, 'Critical': 0 };
        tickets.forEach(t => { counts[t.priority]++; });
        return Object.entries(counts).map(([value, count]) => ({ name: t(`priorities.${value}`), value, count }));
    }, [tickets, t]);
    
    const ticketsByCategory = useMemo(() => {
        const counts: Record<TicketCategory, number> = { 'Hardware': 0, 'Software': 0, 'Network': 0, 'Account': 0, 'Other': 0 };
        tickets.forEach(t => { counts[t.category]++; });
        return Object.entries(counts).map(([value, count]) => ({ name: t(`categories.${value}`), value, count }));
    }, [tickets, t]);

  return (
    <div className="p-6 w-full overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">{t('dashboard.title')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('dashboard.totalTickets')}</h3>
                <p className="mt-1 text-3xl font-semibold">{stats.total}</p>
            </div>
             <div onClick={() => stats.open > 0 && onApplyFilter('status', TicketStatus.Open)} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow ${stats.open > 0 ? 'cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all' : ''}`}>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('dashboard.openTickets')}</h3>
                <p className="mt-1 text-3xl font-semibold text-blue-500">{stats.open}</p>
            </div>
             <div onClick={() => stats.inProgress > 0 && onApplyFilter('status', TicketStatus.InProgress)} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow ${stats.inProgress > 0 ? 'cursor-pointer hover:ring-2 hover:ring-yellow-500 transition-all' : ''}`}>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('dashboard.inProgressTickets')}</h3>
                <p className="mt-1 text-3xl font-semibold text-yellow-500">{stats.inProgress}</p>
            </div>
             <div onClick={() => stats.resolved > 0 && onApplyFilter('status', TicketStatus.Resolved)} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow ${stats.resolved > 0 ? 'cursor-pointer hover:ring-2 hover:ring-green-500 transition-all' : ''}`}>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('dashboard.resolvedTickets')}</h3>
                <p className="mt-1 text-3xl font-semibold text-green-500">{stats.resolved}</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart data={ticketsByPriority} title={t('dashboard.byPriority')} onBarClick={(value) => onApplyFilter('priority', value)} />
            <BarChart data={ticketsByCategory} title={t('dashboard.byCategory')} onBarClick={(value) => onApplyFilter('category', value)} />
        </div>
    </div>
  );
};

export default Dashboard;