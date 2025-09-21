
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../services/hooks/useAuth';
import { api } from '../services/api';
import { Session, Case, UserRole, Client, CaseType, CaseDegree, CaseDocument } from '../types';
import { PlusIcon, CalendarIcon, SessionIcon, MapPinIcon, TrashIcon, ExternalLinkIcon, DownloadIcon } from '../components/icons';
import { Link } from 'react-router-dom';

const AddSessionModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSessionAdded: (newSession: Session) => void;
}> = ({ isOpen, onClose, onSessionAdded }) => {
    const [clients, setClients] = useState<Client[]>([]);
    
    // Form State
    const [courtName, setCourtName] = useState('');
    const [courtDivision, setCourtDivision] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [caseNumber, setCaseNumber] = useState('');
    const [caseYear, setCaseYear] = useState('');
    const [caseType, setCaseType] = useState<CaseType>(CaseType.CIVIL);
    const [caseDegree, setCaseDegree] = useState<CaseDegree>(CaseDegree.FIRST_DEGREE);
    const [courtLocationLink, setCourtLocationLink] = useState('');
    const [documents, setDocuments] = useState<CaseDocument[]>([]);
    const [notes, setNotes] = useState('');
    const [plaintiffs, setPlaintiffs] = useState<string[]>(['']);
    const [defendants, setDefendants] = useState<string[]>(['']);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quickAddClientName, setQuickAddClientName] = useState('');

    useEffect(() => {
        if (isOpen) {
            api.getClients().then(setClients);
        }
    }, [isOpen]);

    const resetForm = () => {
        setCourtName(''); setCourtDivision(''); setDate(''); setTime('');
        setCaseNumber(''); setCaseYear(''); setCaseType(CaseType.CIVIL);
        setCaseDegree(CaseDegree.FIRST_DEGREE); setCourtLocationLink('');
        setDocuments([]); setNotes(''); setPlaintiffs(['']); setDefendants(['']);
    };

    const handleQuickAddClient = async () => {
        if (!quickAddClientName.trim()) return;
        try {
            const newClient = await api.addClient({ name: quickAddClientName, phoneNumber: '0000000000', documents: [] });
            setClients(prev => [newClient, ...prev]);
            setQuickAddClientName('');
        } catch (error) {
            console.error("Failed to quick-add client", error);
            alert('فشل إضافة العميل.');
        }
    };
    
    const handleDynamicListChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
        setter(prev => {
            const newList = [...prev];
            newList[index] = value;
            return newList;
        });
    };
    
    const addDynamicListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev => [...prev, '']);
    };

    const removeDynamicListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
        setter(prev => prev.filter((_, i) => i !== index));
    };
    
    const handleDocChange = (index: number, field: 'name' | 'url', value: string) => {
        setDocuments(prev => {
            const newDocs = [...prev];
            newDocs[index][field] = value;
            return newDocs;
        });
    };


    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!courtName || !date || !time || !caseNumber || !caseYear) {
            alert('يرجى ملء الحقول الأساسية.');
            return;
        }
        setIsSubmitting(true);
        const dateTime = new Date(`${date}T${time}`).toISOString();
        
        try {
            // In a real app, caseId would be determined by finding/creating a case.
            // For now, it's mocked in the API.
            const newSessionPayload = {
                caseId: '', // Mocked in API
                courtName, courtDivision, dateTime, notes, caseNumber, caseYear, caseType, caseDegree,
                courtLocationLink: courtLocationLink.trim() || undefined,
                documents: documents.filter(d => d.name && d.url),
                plaintiffs: plaintiffs.filter(Boolean),
                defendants: defendants.filter(Boolean),
            };

            const newSession = await api.addSession(newSessionPayload);
            onSessionAdded(newSession);
            resetForm();
            onClose();
        } catch (error) {
            console.error("Failed to add session", error);
            alert('فشل إضافة الجلسة.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const renderClientSelector = (label: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => (
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="space-y-2">
            {list.map((clientId, index) => (
                <div key={index} className="flex items-center space-x-2 space-x-reverse">
                    <select value={clientId} onChange={e => handleDynamicListChange(setter, index, e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                        <option value="" disabled>اختر عميل</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {list.length > 1 && <button type="button" onClick={() => removeDynamicListItem(setter, index)} className="text-red-500"><TrashIcon className="w-5 h-5"/></button>}
                </div>
            ))}
             <button type="button" onClick={() => addDynamicListItem(setter)} className="text-sm text-primary hover:underline">+ إضافة آخر</button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    <h2 className="text-2xl font-bold mb-6 text-on-surface text-center">إضافة جلسة جديدة</h2>
                    
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label htmlFor="courtName" className="block text-sm font-medium text-gray-700 mb-1">اسم المحكمة</label><input type="text" id="courtName" value={courtName} onChange={e => setCourtName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required /></div>
                        <div><label htmlFor="courtDivision" className="block text-sm font-medium text-gray-700 mb-1">الدائرة</label><input type="text" id="courtDivision" value={courtDivision} onChange={e => setCourtDivision(e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
                        <div><label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">تاريخ الجلسة</label><input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" /></div>
                        <div><label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">وقت الجلسة</label><input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" /></div>
                        <div><label htmlFor="caseNumber" className="block text-sm font-medium text-gray-700 mb-1">رقم القضية</label><input type="text" id="caseNumber" value={caseNumber} onChange={e => setCaseNumber(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required/></div>
                        <div><label htmlFor="caseYear" className="block text-sm font-medium text-gray-700 mb-1">سنة القضية</label><input type="number" id="caseYear" value={caseYear} onChange={e => setCaseYear(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required/></div>
                        <div><label htmlFor="caseType" className="block text-sm font-medium text-gray-700 mb-1">نوع القضية</label><select id="caseType" value={caseType} onChange={e => setCaseType(e.target.value as CaseType)} className="w-full px-3 py-2 border rounded-lg">{Object.values(CaseType).map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                        <div><label htmlFor="caseDegree" className="block text-sm font-medium text-gray-700 mb-1">درجة التقاضي</label><select id="caseDegree" value={caseDegree} onChange={e => setCaseDegree(e.target.value as CaseDegree)} className="w-full px-3 py-2 border rounded-lg">{Object.values(CaseDegree).map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                    </div>
                     <div><label htmlFor="courtLocationLink" className="block text-sm font-medium text-gray-700 mb-1">رابط موقع المحكمة (Google Maps)</label><input type="url" id="courtLocationLink" value={courtLocationLink} onChange={e => setCourtLocationLink(e.target.value)} placeholder="https://maps.app.goo.gl/..." className="w-full px-3 py-2 border rounded-lg" /></div>
                    
                    {/* Documents */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">مستندات القضية</label>
                        <div className="space-y-2">
                        {documents.map((doc, index) => (
                            <div key={index} className="flex items-center space-x-2 space-x-reverse"><input type="text" placeholder="اسم الملف" value={doc.name} onChange={e => handleDocChange(index, 'name', e.target.value)} className="flex-1 px-2 py-1 border rounded-md text-sm" /><input type="url" placeholder="رابط الملف" value={doc.url} onChange={e => handleDocChange(index, 'url', e.target.value)} className="flex-1 px-2 py-1 border rounded-md text-sm" /><button type="button" onClick={() => setDocuments(docs => docs.filter((_, i) => i !== index))} className="text-red-500"><TrashIcon className="w-5 h-5"/></button></div>
                        ))}
                        </div>
                        <button type="button" onClick={() => setDocuments(docs => [...docs, {name: '', url: ''}])} className="mt-2 text-sm text-primary hover:underline">+ إضافة مستند</button>
                    </div>

                    {/* Notes */}
                    <div><label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label><textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg"></textarea></div>

                    {/* Quick Add Client */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-1">إضافة عميل سريع</label>
                        <div className="flex items-center space-x-2 space-x-reverse">
                            <input type="text" placeholder="اسم العميل الجديد" value={quickAddClientName} onChange={e => setQuickAddClientName(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                            <button type="button" onClick={handleQuickAddClient} className="px-3 py-2 bg-secondary text-primary rounded-lg text-sm font-semibold">إضافة</button>
                        </div>
                    </div>

                    {/* Plaintiffs & Defendants */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderClientSelector('المدعين', plaintiffs, setPlaintiffs)}
                        {renderClientSelector('المدعى عليهم', defendants, setDefendants)}
                    </div>
                    
                    <div className="flex justify-end space-x-3 space-x-reverse pt-4"><button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">إلغاء</button><button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-lg disabled:bg-gray-400">{isSubmitting ? 'جاري الحفظ...' : 'حفظ الجلسة'}</button></div>
                </form>
            </div>
        </div>
    );
};


const CalendarView: React.FC<{ sessions: Session[], currentDate: Date, onDateClick: (date: Date) => void }> = ({ sessions, currentDate, onDateClick }) => {
    const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    
    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) { days.push(null); }
        for (let i = 1; i <= daysInMonth; i++) { days.push(new Date(year, month, i)); }
        return days;
    }, [currentDate]);

    const sessionsByDay = useMemo(() => {
        const map = new Map<string, Session[]>();
        sessions.forEach(session => {
            const dateKey = new Date(session.dateTime).toDateString();
            if (!map.has(dateKey)) { map.set(dateKey, []); }
            map.get(dateKey)?.push(session);
        });
        return map;
    }, [sessions]);

    return (
        <div className="bg-surface rounded-lg shadow">
            <div className="grid grid-cols-7 text-center font-semibold text-sm text-gray-600 border-b">
                {daysOfWeek.map(day => <div key={day} className="p-3">{day}</div>)}
            </div>
            <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => {
                    const daySessions = day ? sessionsByDay.get(day.toDateString()) || [] : [];
                    const isToday = day && day.toDateString() === new Date().toDateString();
                    return (
                        <div key={index} className={`h-32 border-b border-r p-2 flex flex-col overflow-hidden ${!day ? 'bg-gray-50' : ''}`}>
                           {day && (
                                <>
                                    <div className={`text-sm font-semibold ${isToday ? 'bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>{day.getDate()}</div>
                                    <div className="flex-grow overflow-y-auto text-xs mt-1 space-y-1">
                                        {daySessions.map(session => (
                                            <div key={session.id} className="p-1 bg-primary-light/20 text-primary-dark rounded truncate" title={`${session.caseNumber} - ${session.caseName}`}>
                                                {session.caseName}
                                            </div>
                                        ))}
                                    </div>
                                </>
                           )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ListView: React.FC<{ sessions: Session[] }> = ({ sessions }) => {
    const now = new Date();
    const upcomingSessions = sessions.filter(s => new Date(s.dateTime) >= now).sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    const pastSessions = sessions.filter(s => new Date(s.dateTime) < now).sort((a,b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

    const SessionCard = ({ session, isPast = false }: { session: Session, isPast?: boolean}) => (
        <div key={session.id} className={`bg-surface rounded-lg shadow p-4 flex flex-col md:flex-row items-start space-x-4 space-x-reverse ${isPast ? 'opacity-70' : ''}`}>
            <div className="flex-shrink-0 bg-background p-3 rounded-lg"><SessionIcon className="w-6 h-6 text-primary" /></div>
            <div className="flex-grow">
                <p className="font-bold text-lg text-on-surface">{session.courtName} - {session.courtDivision}</p>
                <p className="text-sm text-gray-700 font-semibold">قضية رقم: {session.caseNumber}/{session.caseYear} ({session.caseType} - {session.caseDegree})</p>
                <p className="text-sm text-gray-500 mt-1">{session.notes}</p>
                <div className="mt-2 space-x-4 space-x-reverse flex items-center">
                {session.courtLocationLink && (
                    <a href={session.courtLocationLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full shadow-sm hover:bg-blue-200 transition-colors text-xs font-semibold">
                        <span className="ml-1.5">موقع المحكمة</span>
                        <MapPinIcon className="w-4 h-4" /> 
                    </a>
                )}
                {session.documents.length > 0 && session.documents.map((doc, i) => (
                    <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs text-primary hover:underline">
                        <ExternalLinkIcon className="w-4 h-4 ml-1" />
                        <span>{doc.name}</span>
                    </a>
                ))}
                </div>
            </div>
            <div className="text-left flex-shrink-0 w-full md:w-auto mt-4 md:mt-0 border-t md:border-none pt-4 md:pt-0">
                <p className="font-semibold text-primary">{new Date(session.dateTime).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-gray-600">{new Date(session.dateTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold">الجلسات القادمة</h3>
             {upcomingSessions.length > 0 ? upcomingSessions.map(session => (
                <SessionCard key={session.id} session={session} />
            )) : <p className="text-center p-4 bg-surface rounded-lg">لا توجد جلسات قادمة.</p>}

            <h3 className="text-xl font-semibold pt-6">الجلسات السابقة</h3>
            {pastSessions.length > 0 ? pastSessions.map(session => (
                <SessionCard key={session.id} session={session} isPast />
            )) : <p className="text-center p-4 bg-surface rounded-lg">لا توجد جلسات سابقة.</p>}
        </div>
    );
}

const CalendarPage: React.FC = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'calendar' | 'list'>('calendar');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());

    const fetchSessions = () => {
        if (user) {
            setLoading(true);
            api.getSessions(user).then(data => {
                setSessions(data);
                setLoading(false);
            }).catch(() => setLoading(false));
        }
    };

    useEffect(fetchSessions, [user]);

    const canEdit = user && (user.role === UserRole.ADMIN || user.role === UserRole.PARTNER || (user.role === UserRole.SECRETARY && user.permissions === 'full'));

    const handleMonthChange = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    return (
        <div>
             <AddSessionModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSessionAdded={(newSession) => {
                    setSessions(prev => [...prev, newSession].sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()));
                }}
            />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">تقويم الجلسات</h1>
                {canEdit && (
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary-dark transition-colors">
                        <span className="ml-2">إضافة جلسة جديدة</span>
                        <PlusIcon className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="mb-6 bg-surface p-4 rounded-lg shadow flex justify-between items-center">
                 <div className="flex items-center space-x-4 space-x-reverse">
                    <button onClick={() => handleMonthChange(-1)}>&lt;</button>
                    <h2 className="text-xl font-semibold">{currentDate.toLocaleString('ar-EG', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={() => handleMonthChange(1)}>&gt;</button>
                </div>
                 <div className="p-1 rounded-lg bg-gray-200 inline-flex">
                    <button onClick={() => setView('calendar')} className={`px-3 py-1 text-sm rounded-md ${view === 'calendar' ? 'bg-white shadow' : ''}`}>تقويم</button>
                    <button onClick={() => setView('list')} className={`px-3 py-1 text-sm rounded-md ${view === 'list' ? 'bg-white shadow' : ''}`}>قائمة</button>
                </div>
            </div>

            {loading ? <p>جاري تحميل الجلسات...</p> : (
                view === 'calendar' 
                ? <CalendarView sessions={sessions} currentDate={currentDate} onDateClick={() => {}} /> 
                : <ListView sessions={sessions} />
            )}
        </div>
    );
};

export default CalendarPage;