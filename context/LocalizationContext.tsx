import React, { createContext, useState, useContext, ReactNode } from 'react';

// By embedding the JSON content directly, we bypass any module resolution issues
// with the browser's native ES module loader for JSON files.
const en = {
  "header": {
    "title": "Support Desk",
    "newTicket": "New Ticket",
    "dashboard": "Dashboard"
  },
  "ticketList": {
    "title": "All Tickets",
    "archivedTitle": "Archived Tickets",
    "showArchived": "Show Archived",
    "showUnassigned": "Show Unassigned Only",
    "noTickets": "No tickets found.",
    "filterTypes": {
      "status": "Status",
      "priority": "Priority",
      "category": "Category"
    },
    "filteringBy": "Filtering by {type}: {value}",
    "clearFilter": "Clear"
  },
  "ticketDetails": {
    "customer": "Customer",
    "agent": "Agent",
    "assignee": "Assignee",
    "unassigned": "Unassigned",
    "created": "Created",
    "category": "Category",
    "priority": "Priority",
    "status": "Status",
    "lastUpdated": "Last Updated",
    "description": "Description",
    "conversation": "Conversation",
    "noComments": "No comments yet.",
    "addCommentPlaceholder": "Add a comment..."
  },
  "ticket": {
    "archived": "Archived"
  },
  "newTicketModal": {
    "title": "New Support Ticket",
    "customerName": "Customer Name",
    "customerEmail": "Customer Email",
    "subject": "Subject",
    "description": "Description",
    "category": "Category",
    "priority": "Priority",
    "aiSuggest": "AI Suggest",
    "suggesting": "Suggesting...",
    "errorDescription": "Please enter a description to get suggestions.",
    "errorAISuggest": "Could not get AI suggestions. Please select manually.",
    "errorRequiredFields": "Please fill all required fields."
  },
  "dashboard": {
    "title": "Reports Dashboard",
    "selectTicket": "Select a ticket to view details",
    "totalTickets": "Total Tickets",
    "openTickets": "Open",
    "inProgressTickets": "In Progress",
    "resolvedTickets": "Resolved",
    "byPriority": "Tickets by Priority",
    "byCategory": "Tickets by Category",
    "noData": "No data available."
  },
  "roles": {
    "admin": "Admin",
    "agent": "Agent",
    "user": "User"
  },
  "buttons": {
    "cancel": "Cancel",
    "createTicket": "Create Ticket",
    "saveChanges": "Save Changes",
    "addComment": "Add Comment",
    "archive": "Archive",
    "unarchive": "Unarchive",
    "edit": "Edit"
  },
  "statuses": {
    "Open": "Open",
    "In Progress": "In Progress",
    "Resolved": "Resolved",
    "Closed": "Closed"
  },
  "categories": {
    "Hardware": "Hardware",
    "Software": "Software",
    "Network": "Network",
    "Account": "Account",
    "Other": "Other"
  },
  "priorities": {
    "Low": "Low",
    "Medium": "Medium",
    "High": "High",
    "Critical": "Critical"
  }
};

const es = {
  "header": {
    "title": "Mesa de Ayuda",
    "newTicket": "Nuevo Ticket",
    "dashboard": "Tablero"
  },
  "ticketList": {
    "title": "Todos los Tickets",
    "archivedTitle": "Tickets Archivados",
    "showArchived": "Mostrar Archivados",
    "showUnassigned": "Mostrar Solo Sin Asignar",
    "noTickets": "No se encontraron tickets.",
    "filterTypes": {
      "status": "Estado",
      "priority": "Prioridad",
      "category": "Categoría"
    },
    "filteringBy": "Filtrando por {type}: {value}",
    "clearFilter": "Quitar"
  },
  "ticketDetails": {
    "customer": "Cliente",
    "agent": "Agente",
    "assignee": "Asignado a",
    "unassigned": "Sin Asignar",
    "created": "Creado",
    "category": "Categoría",
    "priority": "Prioridad",
    "status": "Estado",
    "lastUpdated": "Última Actualización",
    "description": "Descripción",
    "conversation": "Conversación",
    "noComments": "Aún no hay comentarios.",
    "addCommentPlaceholder": "Añadir un comentario..."
  },
  "ticket": {
    "archived": "Archivado"
  },
  "newTicketModal": {
    "title": "Nuevo Ticket de Soporte",
    "customerName": "Nombre del Cliente",
    "customerEmail": "Email del Cliente",
    "subject": "Asunto",
    "description": "Descripción",
    "category": "Categoría",
    "priority": "Prioridad",
    "aiSuggest": "Sugerencia IA",
    "suggesting": "Sugiriendo...",
    "errorDescription": "Por favor, ingrese una descripción para obtener sugerencias.",
    "errorAISuggest": "No se pudieron obtener sugerencias de la IA. Por favor, seleccione manually.",
    "errorRequiredFields": "Por favor, complete todos los campos obligatorios."
  },
  "dashboard": {
    "title": "Tablero de Reportes",
    "selectTicket": "Seleccione un ticket para ver los detalles",
    "totalTickets": "Tickets Totales",
    "openTickets": "Abiertos",
    "inProgressTickets": "En Progreso",
    "resolvedTickets": "Resueltos",
    "byPriority": "Tickets por Prioridad",
    "byCategory": "Tickets por Categoría",
    "noData": "No hay datos disponibles."
  },
  "roles": {
    "admin": "Administrador",
    "agent": "Agente",
    "user": "Usuario"
  },
  "buttons": {
    "cancel": "Cancelar",
    "createTicket": "Crear Ticket",
    "saveChanges": "Guardar Cambios",
    "addComment": "Añadir Comentario",
    "archive": "Archivar",
    "unarchive": "Desarchivar",
    "edit": "Editar"
  },
  "statuses": {
    "Open": "Abierto",
    "In Progress": "En Progreso",
    "Resolved": "Resuelto",
    "Closed": "Cerrado"
  },
  "categories": {
    "Hardware": "Hardware",
    "Software": "Software",
    "Network": "Red",
    "Account": "Cuenta",
    "Other": "Otro"
  },
  "priorities": {
    "Low": "Baja",
    "Medium": "Media",
    "High": "Alta",
    "Critical": "Crítica"
  }
};


type Translations = typeof en;

const translations: { [key: string]: Translations } = {
  en,
  es,
};

interface LocalizationContextType {
  locale: 'en' | 'es';
  setLocale: (locale: 'en' | 'es') => void;
  t: (key: string, fallbackOrReplacements?: string | { [key: string]: string }) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider = ({ children }: { children: ReactNode }) => {
    const [locale, setLocale] = useState<'en' | 'es'>('en');

    const t = (key: string, fallbackOrReplacements?: string | { [key: string]: string }): string => {
        const keys = key.split('.');
        let result: any = translations[locale];
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) {
                let fallbackResult: any = translations['en'];
                for (const fk of keys) {
                    fallbackResult = fallbackResult?.[fk];
                }
                result = fallbackResult;
                break;
            }
        }

        let finalString = result || (typeof fallbackOrReplacements === 'string' ? fallbackOrReplacements : key);

        if (typeof fallbackOrReplacements === 'object') {
            Object.entries(fallbackOrReplacements).forEach(([rKey, rValue]) => {
                finalString = finalString.replace(`{${rKey}}`, rValue);
            });
        }
        
        return finalString;
    };

    return (
        <LocalizationContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LocalizationContext.Provider>
    );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};