
import { Case, Session, Document, Task, User, UserRole, Client, CaseType, CaseDegree } from '../types';

let mockUsers: User[] = [
    { id: '1', name: 'John Doe (Owner)', email: 'admin@example.com', role: UserRole.ADMIN, avatarUrl: 'https://picsum.photos/seed/admin/100' },
    { id: '2', name: 'Jane Smith (Secretary)', email: 'secretary@example.com', role: UserRole.SECRETARY, permissions: 'full', avatarUrl: 'https://picsum.photos/seed/secretary/100' },
    { id: '3', name: 'أحمد محمود', email: 'ahmed@client.com', role: UserRole.CLIENT, avatarUrl: 'https://picsum.photos/seed/client/100', linkedClientId: 'cl1' },
    { id: '4', name: 'ACME Corp.', email: 'acme@example.com', role: UserRole.CLIENT, avatarUrl: 'https://picsum.photos/seed/acme/100', linkedClientId: 'cl2' },
    { id: '5', name: 'Sarah Lee (Partner)', email: 'partner@example.com', role: UserRole.PARTNER, avatarUrl: 'https://picsum.photos/seed/partner/100' },
    { id: '6', name: 'Mike Ross (Secretary - View Only)', email: 'viewonly@example.com', role: UserRole.SECRETARY, permissions: 'read', avatarUrl: 'https://picsum.photos/seed/viewonly/100' },
];

let mockClients: Client[] = [
    { id: 'cl1', name: 'أحمد محمود', phoneNumber: '0501234567', documents: [{ name: 'هوية شخصية.pdf', url: 'about:blank' }] },
    { id: 'cl2', name: 'شركة الإخوة المتحدون', phoneNumber: '0129876543', documents: [{ name: 'سجل تجاري.pdf', url: 'about:blank' }] },
    { id: 'cl3', name: 'فاطمة علي', phoneNumber: '0551112223', documents: [] },
    { id: 'cl4', name: 'Peter Jones', phoneNumber: '0555555555', documents: [] },
];


let mockDocs: Document[] = [
    { id: 'd1', name: 'Initial Filing.pdf', caseId: 'c1', uploadDate: new Date(Date.now() - 2 * 86400000).toISOString(), url: 'https://example.com/document1.pdf', type: 'PDF' },
    { id: 'd2', name: 'Evidence Brief.docx', caseId: 'c1', uploadDate: new Date(Date.now() - 1 * 86400000).toISOString(), url: 'https://example.com/document2.docx', type: 'Word'},
    { id: 'd3', name: 'Discovery Request.pdf', caseId: 'c2', uploadDate: new Date().toISOString(), url: 'https://example.com/document3.pdf', type: 'PDF' },
];

let mockSessions: Session[] = [
    { 
        id: 's1', 
        caseId: 'c1', 
        courtName: 'محكمة الاستئناف العليا', 
        courtDivision: 'الدائرة التجارية الأولى',
        dateTime: new Date(Date.now() + 3 * 86400000).toISOString(), 
        notes: 'جلسة استماع أولية', 
        courtLocationLink: 'https://maps.app.goo.gl/u5sri4a9QCxY5a3g7',
        caseNumber: '1445/ق/58',
        caseYear: '1445',
        caseType: CaseType.COMMERCIAL,
        caseDegree: CaseDegree.APPEAL,
        documents: [{ name: 'مذكرة الدفاع.pdf', url: 'about:blank' }],
        plaintiffs: ['cl2'],
        defendants: ['cl1'],
    },
    { 
        id: 's2', 
        caseId: 'c2', 
        courtName: 'المحكمة الجزئية',
        courtDivision: 'الدائرة الجنائية الثالثة',
        dateTime: new Date(Date.now() + 7 * 86400000).toISOString(), 
        notes: 'جلسة استماع لطلب الرفض',
        caseNumber: '1444/ج/102',
        caseYear: '1444',
        caseType: CaseType.CRIMINAL,
        caseDegree: CaseDegree.FIRST_DEGREE,
        documents: [],
        plaintiffs: ['cl3'],
        defendants: [],
    },
];

let mockTasks: Task[] = [
    { id: 't1', title: 'Draft memorandum for Case #C123-456', deadline: new Date(Date.now() + 2 * 86400000).toISOString(), isDone: false, caseId: 'c1'},
    { id: 't2', title: 'File discovery documents', deadline: new Date(Date.now() + 5 * 86400000).toISOString(), isDone: false, caseId: 'c2' },
    { id: 't3', title: 'Review client testimony', deadline: new Date(Date.now() - 1 * 86400000).toISOString(), isDone: true, caseId: 'c1'},
];

let mockCases: Case[] = [
    { id: 'c1', caseNumber: 'C123-456', courtName: 'Supreme Court of California', clientName: 'شركة الإخوة المتحدون', clientId: 'cl2', details: 'A complex corporate litigation case involving intellectual property rights.', documents: [mockDocs[0], mockDocs[1]], sessions: [], isArchived: false },
    { id: 'c2', caseNumber: 'C789-012', courtName: 'District Court of Appeals', clientName: 'Peter Jones', clientId: 'cl4', details: 'A contractual dispute regarding supply chain agreements.', documents: [mockDocs[2]], sessions: [], isArchived: false },
    { id: 'c3', caseNumber: 'A555-111', courtName: 'Old Municipal Court', clientName: 'أحمد محمود', clientId: 'cl1', details: 'قضية قديمة تم أرشفتها لأغراض مرجعية.', documents: [], sessions: [], isArchived: true },
];
// Populate cases with sessions
mockCases.forEach(c => {
    c.sessions = mockSessions.filter(s => s.caseId === c.id);
});


const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
    login: async (email: string, role: UserRole): Promise<User> => {
        await delay(500);
        // In a real app, you'd find user by email/password. Here we find by email or role for demo.
        let user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if(user) return user;
        
        user = mockUsers.find(u => u.role === role);
        if (user) {
            return { ...user, email };
        }

        user = { id: Date.now().toString(), name: email.split('@')[0], email, role, avatarUrl: `https://picsum.photos/seed/${email}/100` };
        mockUsers.push(user);
        return user;
    },

    getDashboardData: async (user: User) => {
        await delay(500);
        const upcomingSessions = mockSessions.filter(s => new Date(s.dateTime) > new Date()).slice(0, 3);
        const pendingTasks = mockTasks.filter(t => !t.isDone).slice(0, 3);
        const recentDocuments = mockDocs.sort((a,b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()).slice(0, 3);
        return { upcomingSessions, pendingTasks, recentDocuments };
    },

    getCases: async (user: User, archived: boolean = false): Promise<Case[]> => {
        await delay(500);
        let userCases = mockCases.filter(c => c.isArchived === archived);
        if (user.role === UserRole.CLIENT) {
            return userCases.filter(c => c.clientId === user.linkedClientId);
        }
        return userCases;
    },

    getCase: async (caseId: string, user: User): Promise<Case | undefined> => {
        await delay(500);
        const caseData = mockCases.find(c => c.id === caseId);
        if (caseData && user.role === UserRole.CLIENT && caseData.clientId !== user.linkedClientId) {
            return undefined;
        }
        return caseData;
    },
    
    archiveCase: async (caseId: string, archiveStatus: boolean): Promise<Case | undefined> => {
        await delay(400);
        const caseData = mockCases.find(c => c.id === caseId);
        if (caseData) {
            caseData.isArchived = archiveStatus;
            return caseData;
        }
        return undefined;
    },

    getSessions: async (user: User): Promise<Session[]> => {
        await delay(500);
        
        let userSessions = mockSessions;

        if (user.role === UserRole.CLIENT) {
             const clientCases = mockCases.filter(c => c.clientId === user.linkedClientId);
             const clientCaseIds = new Set(clientCases.map(c => c.id));
             userSessions = mockSessions.filter(s => clientCaseIds.has(s.caseId));
        }

        return userSessions.map(session => {
            const plaintiffsNames = session.plaintiffs.map(pId => mockClients.find(c => c.id === pId)?.name).filter(Boolean).join(', ');
            const caseName = plaintiffsNames ? `${plaintiffsNames} ضد...` : 'قضية غير محددة';
            return { 
                ...session, 
                caseName
            };
        });
    },

    getDocuments: async (user: User): Promise<Document[]> => {
        await delay(500);
         if (user.role === UserRole.CLIENT) {
            const clientCases = mockCases.filter(c => c.clientId === user.linkedClientId);
            const clientCaseIds = clientCases.map(c => c.id);
            return mockDocs.filter(d => clientCaseIds.includes(d.caseId));
        }
        return mockDocs;
    },

    getTasks: async (user: User): Promise<Task[]> => {
        await delay(500);
        if (user.role === UserRole.CLIENT) {
            return []; // Clients don't see tasks
        }
        return mockTasks;
    },

    toggleTask: async (taskId: string): Promise<Task | undefined> => {
        await delay(300);
        const task = mockTasks.find(t => t.id === taskId);
        if (task) {
            task.isDone = !task.isDone;
            return task;
        }
        return undefined;
    },
    
    updateTask: async (taskId: string, title: string, deadline: string): Promise<Task | undefined> => {
        await delay(400);
        const task = mockTasks.find(t => t.id === taskId);
        if (task) {
            task.title = title;
            task.deadline = deadline;
            return task;
        }
        return undefined;
    },
    
    deleteTask: async (taskId: string): Promise<boolean> => {
        await delay(300);
        const initialLength = mockTasks.length;
        mockTasks = mockTasks.filter(t => t.id !== taskId);
        return mockTasks.length < initialLength;
    },

    addTask: async (title: string, deadline: string, caseId: string): Promise<Task> => {
        await delay(400);
        const newTask: Task = {
            id: `t${Date.now()}`,
            title,
            deadline,
            caseId,
            isDone: false,
        };
        mockTasks.push(newTask);
        return newTask;
    },
    
    addSession: async(session: Omit<Session, 'id' | 'caseName'>): Promise<Session> => {
        await delay(500);
        
        const linkedCaseId = mockCases[0]?.id || 'c1';

        const newSessionData: Session = {
            ...session, 
            id: `s${Date.now()}`,
            caseId: linkedCaseId,
        };
        mockSessions.push(newSessionData);
        
        const targetCase = mockCases.find(c => c.id === linkedCaseId);
        if(targetCase) {
            targetCase.sessions.push(newSessionData);
        }

        const plaintiffsNames = newSessionData.plaintiffs.map(pId => mockClients.find(c => c.id === pId)?.name).filter(Boolean).join(', ');
        const caseName = plaintiffsNames ? `${plaintiffsNames} ضد...` : 'قضية غير محددة';

        return {
            ...newSessionData,
            caseName
        };
    },
    
    addDocument: async (name: string, caseId: string, url: string): Promise<Document> => {
        await delay(300);
        const fileExtension = name.split('.').pop()?.toLowerCase() || '';
        let type: Document['type'] = 'Other';
        if (fileExtension === 'pdf') {
            type = 'PDF';
        } else if (['doc', 'docx'].includes(fileExtension)) {
            type = 'Word';
        }

        const newDoc: Document = {
            id: `d${Date.now()}`,
            name,
            caseId,
            url,
            type,
            uploadDate: new Date().toISOString(),
        };
        mockDocs.unshift(newDoc);
        const targetCase = mockCases.find(c => c.id === caseId);
        if (targetCase) {
            targetCase.documents.unshift(newDoc);
        }
        return newDoc;
    },

    getUsers: async (): Promise<User[]> => {
        await delay(300);
        return mockUsers.filter(u => u.role !== UserRole.ADMIN);
    },

    inviteUser: async (details: { role: UserRole; email?: string; clientId?: string; permissions?: 'read' | 'full' }): Promise<User> => {
        await delay(600);
        let newUser: User;

        if (details.role === UserRole.CLIENT && details.clientId) {
            const client = mockClients.find(c => c.id === details.clientId);
            if (!client) throw new Error('Client not found');
            const email = `${client.name.replace(/\s/g, '').toLowerCase()}@client.com`;
            newUser = {
                id: `u${Date.now()}`,
                email,
                role: UserRole.CLIENT,
                name: client.name,
                avatarUrl: `https://picsum.photos/seed/${email}/100`,
                linkedClientId: client.id,
            };
        } else if (details.email && (details.role === UserRole.SECRETARY || details.role === UserRole.PARTNER)) {
            newUser = {
                id: `u${Date.now()}`,
                email: details.email,
                role: details.role,
                name: details.email.split('@')[0],
                avatarUrl: `https://picsum.photos/seed/${details.email}/100`,
                permissions: details.role === UserRole.SECRETARY ? details.permissions : undefined,
            };
        } else {
            throw new Error('Invalid invitation details');
        }

        mockUsers.push(newUser);
        return newUser;
    },


    getClients: async (): Promise<Client[]> => {
        await delay(300);
        return mockClients;
    },

    addClient: async (client: Omit<Client, 'id' | 'documents'> & { documents: {name: string, url: string}[] }): Promise<Client> => {
        await delay(400);
        const newClient: Client = {
            ...client,
            id: `cl${Date.now()}`,
        };
        mockClients.push(newClient);
        return newClient;
    },
};
