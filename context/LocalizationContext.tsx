import React, { createContext, useState, useContext, ReactNode } from 'react';

// By embedding the JSON content directly, we bypass any module resolution issues
// with the browser's native ES module loader for JSON files.
const en = {
  "header": {
    "title": "Support Desk",
    "newTicket": "New Ticket"
  },
  "ticketList": {
    "title": "All Tickets",
    "noTickets": "No tickets found."
  },
  "ticketDetails": {
    "customer": "Customer",
    "agent": "Agent",
    "unassigned": "Unassigned",
    "created": "Created",
    "category": "Category",
    "priority": "Priority",
    "lastUpdated": "Last Updated",
    "description": "Description",
    "conversation": "Conversation"
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
    "selectTicket": "Select a ticket to view details"
  },
  "roles": {
    "agent": "Agent"
  },
  "buttons": {
    "cancel": "Cancel",
    "createTicket": "Create Ticket"
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
    "newTicket": "Nuevo Ticket"
  },
  "ticketList": {
    "title": "Todos los Tickets",
    "noTickets": "No se encontraron tickets."
  },
  "ticketDetails": {
    "customer": "Cliente",
    "agent": "Agente",
    "unassigned": "Sin Asignar",
    "created": "Creado",
    "category": "Categoría",
    "priority": "Prioridad",
    "lastUpdated": "Última Actualización",
    "description": "Descripción",
    "conversation": "Conversación"
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
    "errorAISuggest": "No se pudieron obtener sugerencias de la IA. Por favor, seleccione manualmente.",
    "errorRequiredFields": "Por favor, complete todos los campos obligatorios."
  },
  "dashboard": {
    "selectTicket": "Seleccione un ticket para ver los detalles"
  },
  "roles": {
    "agent": "Agente"
  },
  "buttons": {
    "cancel": "Cancelar",
    "createTicket": "Crear Ticket"
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


// Define the shape of your translations
type Translations = typeof en;

// Define the languages you support
const translations: { [key: string]: Translations } = {
  en,
  es,
};

interface LocalizationContextType {
  locale: 'en' | 'es';
  setLocale: (locale: 'en' | 'es') => void;
  t: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider = ({ children }: { children: ReactNode }) => {
    const [locale, setLocale] = useState<'en' | 'es'>('en');

    const t = (key: string): string => {
        const keys = key.split('.');
        let result: any = translations[locale];
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) {
                // Fallback to English if translation is missing
                let fallbackResult: any = translations['en'];
                for (const fk of keys) {
                    fallbackResult = fallbackResult?.[fk];
                }
                return fallbackResult || key;
            }
        }
        return result || key;
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