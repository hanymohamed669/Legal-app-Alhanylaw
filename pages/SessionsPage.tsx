import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../services/hooks/useAuth';
import { api } from '../services/api';
import { Session, UserRole, Case } from '../types';
import { SessionIcon, PlusIcon } from '../components/icons';
import { Link } from 'react-router-dom';

const SessionsPage: React.FC = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');

    useEffect(() => {
        if (user) {
            setLoading(true);
            api.getSessions(user).then(data => {
                setSessions(data);
                setLoading(false);
            });
        }
    }, [user]);

    const filteredSessions = useMemo(() => {
        const now = new Date();
        return sessions
            .filter(s => {
                const sessionDate = new Date(s.dateTime);
                return filter === 'upcoming' ? sessionDate >= now : sessionDate < now;
            })
            .sort((a, b) => {
                const dateA = new Date(a.dateTime).getTime();
                const dateB = new Date(b.dateTime).getTime();
                return filter === 'upcoming' ? dateA - dateB : dateB - dateA;
            });
    }, [sessions, filter]);
    
    const canAddSession = user?.role === UserRole.ADMIN || user?.role === UserRole.SECRETARY;


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-on-surface">الجلسات</h1>
                {canAddSession && (
                    <button className="flex items-center bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary-dark transition-colors">
                        <span className="ml-2">إضافة جلسة جديدة</span>
                        <PlusIcon className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="mb-6 bg-surface p-2 rounded-lg shadow inline-flex">
                 <button 
                    onClick={() => setFilter('upcoming')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'upcoming' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    القادمة
                </button>
                 <button 
                    onClick={() => setFilter('past')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'past' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    السابقة
                </button>
            </div>
            
            <div className="space-y-4">
                 {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                         <div key={i} className="bg-surface rounded-lg shadow p-4 animate-pulse">
                            <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    ))
                 ) : (
                    filteredSessions.length > 0 ? filteredSessions.map(session => (
                        <div key={session.id} className="bg-surface rounded-lg shadow p-4 flex items-start space-x-4">
                             <div className="flex-shrink-0 bg-background p-3 rounded-lg">
                                <SessionIcon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-grow">
                                <p className="font-bold text-lg text-on-surface">{session.courtName}</p>
                                <p className="text-sm text-gray-700">
                                    القضية المرتبطة: 
                                    <Link to={`/cases/${session.caseId}`} className="text-primary hover:underline mr-1">
                                      {session.caseNumber || 'عرض القضية'}
                                    </Link>
                                </p>
                                <p className="text-sm text-gray-500 mt-1">{session.notes}</p>
                            </div>
                            <div className="text-left flex-shrink-0">
                                <p className="font-semibold text-primary">{new Date(session.dateTime).toLocaleDateString('ar-EG')}</p>
                                <p className="text-gray-600">{new Date(session.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                {canAddSession && (
                                    <button
                                        onClick={() => alert('تمت مزامنة هذه الجلسة مع تقويم جوجل الخاص بك.')}
                                        className="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                                    >
                                        مزامنة مع التقويم
                                    </button>
                                )}
                            </div>
                        </div>
                    )) : (
                         <div className="text-center py-12 bg-surface rounded-lg shadow">
                            <SessionIcon className="mx-auto w-12 h-12 text-gray-300" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد جلسات {filter === 'upcoming' ? 'قادمة' : 'سابقة'}</h3>
                            <p className="mt-1 text-sm text-gray-500">لا توجد جلسات لعرضها في هذا القسم.</p>
                        </div>
                    )
                 )}
            </div>
        </div>
    );
};

export default SessionsPage;