import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAppData } from '../hooks/useAppData';
import { Client, Project, TeamMember, Transaction, Lead, ClientFeedback, Card, FinancialPocket, Package, AddOn } from '../types';
import { listCards } from '../services/cards';
import { listPockets } from '../services/pockets';
import { listPackages } from '../services/packages';
import { listAddOns } from '../services/addOns';
import {
    useClientsQuery,
    useProjectsQuery,
    useTeamMembersQuery,
    useTransactionsQuery,
    useLeadsQuery,
    useCardsQuery,
    usePocketsQuery,
    usePackagesQuery,
    useAddOnsQuery
} from '../hooks/queries';

interface DataContextType {
    clients: Client[];
    setClients: React.Dispatch<React.SetStateAction<Client[]>>;
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    teamMembers: TeamMember[];
    setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
    transactions: Transaction[];
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
    leads: Lead[];
    setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
    cards: Card[];
    setCards: React.Dispatch<React.SetStateAction<Card[]>>;
    pockets: FinancialPocket[];
    setPockets: React.Dispatch<React.SetStateAction<FinancialPocket[]>>;
    packages: Package[];
    setPackages: React.Dispatch<React.SetStateAction<Package[]>>;
    addOns: AddOn[];
    setAddOns: React.Dispatch<React.SetStateAction<AddOn[]>>;
    clientFeedback: ClientFeedback[];
    setClientFeedback: React.Dispatch<React.SetStateAction<ClientFeedback[]>>;
    totals: any;
    loadAllData: () => void;
    appData: ReturnType<typeof useAppData>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const appData = useAppData();

    // Use React Query hooks
    const { data: qClients = [] } = useClientsQuery();
    const { data: qProjects = [] } = useProjectsQuery();
    const { data: qTeamMembers = [] } = useTeamMembersQuery();
    const { data: qTransactions = [] } = useTransactionsQuery();
    const { data: qLeads = [] } = useLeadsQuery();
    const { data: qCards = [] } = useCardsQuery();
    const { data: qPockets = [] } = usePocketsQuery();
    const { data: qPackages = [] } = usePackagesQuery();
    const { data: qAddOns = [] } = useAddOnsQuery();

    const [clients, setClients] = useState<Client[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [cards, setCards] = useState<Card[]>([]);
    const [pockets, setPockets] = useState<FinancialPocket[]>([]);
    const [packages, setPackages] = useState<Package[]>([]);
    const [addOns, setAddOns] = useState<AddOn[]>([]);
    const [clientFeedback, setClientFeedback] = useState<ClientFeedback[]>([]);

    const isInitialized = useRef(false);

    const loadAllData = () => {
        // We still call appData.loadTotals() if it's used elsewhere, 
        // but other data is managed by React Query now.
        appData.loadTotals();
        appData.loadClientFeedback();
    };

    useEffect(() => {
        loadAllData();
    }, []);

    // Sync from React Query to local state for Realtime compatibility
    useEffect(() => { setClients(qClients); }, [qClients]);
    useEffect(() => { setProjects(qProjects as any); }, [qProjects]);
    useEffect(() => { setTeamMembers(qTeamMembers); }, [qTeamMembers]);
    useEffect(() => { setTransactions(qTransactions); }, [qTransactions]);
    useEffect(() => { setLeads(qLeads); }, [qLeads]);
    useEffect(() => { setCards(qCards); }, [qCards]);
    useEffect(() => { setPockets(qPockets); }, [qPockets]);
    useEffect(() => { setPackages(qPackages); }, [qPackages]);
    useEffect(() => { setAddOns(qAddOns); }, [qAddOns]);

    // Helper for cards
    const mapCardRowToCard = (row: any): Card => ({
        id: row.id,
        cardHolderName: row.card_holder_name,
        bankName: row.bank_name,
        cardType: row.card_type,
        lastFourDigits: row.last_four_digits ?? "",
        expiryDate: row.expiry_date ?? undefined,
        balance: Number(row.balance || 0),
        colorGradient: row.color_gradient || "from-slate-200 to-slate-400",
    });

    // Realtime Subscriptions
    useEffect(() => {
        const setupRealtime = () => {
            const channel = supabase.channel('global-realtime-channel')
                // TRANSACTIONS
                .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setTransactions(prev => {
                            const exists = prev.some(t => t.id === payload.new.id);
                            return exists ? prev : [payload.new as Transaction, ...prev];
                        });
                    }
                    if (payload.eventType === 'UPDATE') {
                        setTransactions(prev => prev.map(t => t.id === payload.new.id ? { ...t, ...payload.new } as Transaction : t));
                    }
                    if (payload.eventType === 'DELETE') {
                        setTransactions(prev => prev.filter(t => t.id !== (payload.old as any).id));
                    }
                })
                // CLIENTS
                .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setClients(prev => prev.some(i => i.id === payload.new.id) ? prev : [payload.new as Client, ...prev]);
                    }
                    if (payload.eventType === 'UPDATE') {
                        setClients(prev => prev.map(i => i.id === payload.new.id ? { ...i, ...payload.new } as Client : i));
                    }
                    if (payload.eventType === 'DELETE') {
                        setClients(prev => prev.filter(i => i.id !== (payload.old as any).id));
                    }
                })
                // PROJECTS
                .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setProjects(prev => prev.some(i => i.id === payload.new.id) ? prev : [payload.new as Project, ...prev]);
                    }
                    if (payload.eventType === 'UPDATE') {
                        setProjects(prev => prev.map(i => i.id === payload.new.id ? { ...i, ...payload.new } as Project : i));
                    }
                    if (payload.eventType === 'DELETE') {
                        setProjects(prev => prev.filter(i => i.id !== (payload.old as any).id));
                    }
                })
                // CARDS
                .on('postgres_changes', { event: '*', schema: 'public', table: 'cards' }, (payload) => {
                    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                        const newCard = mapCardRowToCard(payload.new);
                        setCards(prev => {
                            const exists = prev.some(c => c.id === newCard.id);
                            return exists ? prev.map(c => c.id === newCard.id ? newCard : c) : [newCard, ...prev];
                        });
                    }
                    if (payload.eventType === 'DELETE') {
                        setCards(prev => prev.filter(c => c.id !== (payload.old as any).id));
                    }
                })
                // POCKETS
                .on('postgres_changes', { event: '*', schema: 'public', table: 'pockets' }, (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setPockets(prev => prev.some(i => i.id === payload.new.id) ? prev : [payload.new as any, ...prev]);
                    }
                    if (payload.eventType === 'UPDATE') {
                        setPockets(prev => prev.map(i => i.id === payload.new.id ? { ...i, ...payload.new } as any : i));
                    }
                    if (payload.eventType === 'DELETE') {
                        setPockets(prev => prev.filter(i => i.id !== (payload.old as any).id));
                    }
                })
                .subscribe();

            return channel;
        };

        const channel = setupRealtime();
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <DataContext.Provider value={{
            clients, setClients,
            projects, setProjects,
            teamMembers, setTeamMembers,
            transactions, setTransactions,
            leads, setLeads,
            cards, setCards,
            pockets, setPockets,
            packages, setPackages,
            addOns, setAddOns,
            clientFeedback, setClientFeedback,
            totals: appData.totals,
            loadAllData,
            appData
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
