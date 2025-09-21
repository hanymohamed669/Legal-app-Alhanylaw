
import React, { useEffect, useState } from 'react';
import { useAuth } from '../services/hooks/useAuth';
import { api } from '../services/api';
import { Session, Task, Document, User } from '../types';
import { SessionIcon, TaskIcon, DocumentIcon, ExternalLinkIcon } from '../components/icons';
import { Link } from 'react-router-dom';

const DashboardCard: React.FC<{ title: string; icon: React.ReactElement; children: React.ReactNode; showViewAll?: boolean; linkTo?: string; }> = ({ title, icon, children, showViewAll = true, linkTo = "/" }) => (
    <div className="bg-surface rounded-lg shadow p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
                <h3 className="text-lg font-semibold text-on-surface mr-3">{title}</h3>
                {icon}
            </div>
            {showViewAll && <Link to={linkTo} className="text-sm text-primary hover:underline">عرض الكل</Link>}
        </div>
        <div className="flex-grow space-y-3">
            {children}
        </div>
    </div>
);

const LoadingSkeleton = () => (
    <div className="bg-surface rounded-lg shadow p-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>
    </div>
);

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [data, setData] = useState<{
        upcomingSessions: Session[];
        pendingTasks: Task[];
        recentDocuments: Document[];
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const dashboardData = await api.getDashboardData(user);
                    setData(dashboardData);
                } catch (error) {
                    console.error("Failed to fetch dashboard data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [user]);

    if (!user) return null;

    return (
        <div>
            <h1 className="text-3xl font-bold text-on-surface">مرحباً بعودتك، {user.name.split(' ')[0]}!</h1>
            <p className="text-gray-500 mt-1">إليك ملخص ممارستك القانونية اليوم.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {loading ? (
                    <>
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                        <LoadingSkeleton />
                    </>
                ) : (
                    <>
                        <DashboardCard title="الجلسات القادمة" icon={<SessionIcon className="w-6 h-6 text-primary"/>} linkTo="/calendar">
                           {data?.upcomingSessions.length ? data.upcomingSessions.map(s => (
                               <div key={s.id} className="text-sm p-2 rounded-md bg-background">
                                   <p className="font-semibold text-on-surface">{s.courtName}</p>
                                   <p className="text-gray-500">{new Date(s.dateTime).toLocaleString('ar-EG')}</p>
                               </div>
                           )) : <p className="text-sm text-gray-500">لا توجد جلسات قادمة.</p>}
                        </DashboardCard>
                        <DashboardCard title="المهام المعلقة" icon={<TaskIcon className="w-6 h-6 text-primary"/>} linkTo="/tasks">
                           {data?.pendingTasks.length ? data.pendingTasks.map(t => (
                               <div key={t.id} className="text-sm p-2 rounded-md bg-background">
                                   <p className="font-semibold text-on-surface">{t.title}</p>
                                   <p className="text-gray-500">تاريخ الاستحقاق: {new Date(t.deadline).toLocaleDateString('ar-EG')}</p>
                               </div>
                           )) : <p className="text-sm text-gray-500">لا توجد مهام معلقة.</p>}
                        </DashboardCard>
                        <DashboardCard title="المستندات الأخيرة" icon={<DocumentIcon className="w-6 h-6 text-primary"/>} showViewAll={false}>
                           {data?.recentDocuments.length ? data.recentDocuments.map(d => (
                               <div key={d.id} className="text-sm p-2 rounded-md bg-background flex justify-between items-center">
                                   <Link to={`/cases/${d.caseId}`} className="hover:underline">
                                     <p className="font-semibold text-on-surface">{d.name}</p>
                                     <p className="text-gray-500 text-xs">تاريخ الرفع: {new Date(d.uploadDate).toLocaleDateString('ar-EG')}</p>
                                   </Link>
                                   <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark">
                                       <ExternalLinkIcon className="w-4 h-4" />
                                   </a>
                               </div>
                           )) : <p className="text-sm text-gray-500">لا توجد مستندات حديثة.</p>}
                        </DashboardCard>
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
