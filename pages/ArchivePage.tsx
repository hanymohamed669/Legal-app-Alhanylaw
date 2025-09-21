
import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../services/hooks/useAuth';
import { api } from '../services/api';
import { Case, UserRole, Client } from '../types';
import { Link, useSearchParams } from 'react-router-dom';
import { ArchiveIcon } from '../components/icons';

const ArchivePage: React.FC = () => {
    const { user } = useAuth();
    const [cases, setCases] = useState<Case[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        searchTerm: searchParams.get('search') || '',
        clientId: '',
        keyword: '',
        sessionDate: '',
        caseYear: ''
    });

    const fetchArchivedCases = () => {
        if (user) {
            setLoading(true);
            api.getCases(user, true).then(data => {
                setCases(data);
                setLoading(false);
            });
        }
    };

    useEffect(() => {
        fetchArchivedCases();
        api.getClients().then(setClients);
    }, [user]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleRestore = async (caseId: string) => {
        if (window.confirm('هل أنت متأكد من رغبتك في إعادة هذه القضية من الأرشيف؟')) {
            await api.archiveCase(caseId, false);
            setCases(prev => prev.filter(c => c.id !== caseId));
        }
    };

    const filteredCases = useMemo(() => {
        return cases.filter(c => {
            const searchTermMatch = filters.searchTerm ? (
                c.caseNumber.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                c.clientName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                c.courtName.toLowerCase().includes(filters.searchTerm.toLowerCase())
            ) : true;
            
            const clientMatch = filters.clientId ? c.clientId === filters.clientId : true;
            
            const keywordMatch = filters.keyword ? c.details.toLowerCase().includes(filters.keyword.toLowerCase()) : true;

            const sessionDateMatch = filters.sessionDate ? c.sessions.some(s => {
                const sessionDate = new Date(s.dateTime).toISOString().split('T')[0];
                return sessionDate === filters.sessionDate;
            }) : true;

            const yearMatch = filters.caseYear ? c.sessions.some(s => s.caseYear === filters.caseYear) : true;

            return searchTermMatch && clientMatch && keywordMatch && sessionDateMatch && yearMatch;
        });
    }, [cases, filters]);

    const canEdit = user && (user.role === UserRole.ADMIN || user.role === UserRole.PARTNER || (user.role === UserRole.SECRETARY && user.permissions === 'full'));

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">الأرشيف</h1>
            </div>

            <div className="mb-6 bg-surface p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="md:col-span-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">بحث عام</label>
                    <input
                        type="text"
                        name="searchTerm"
                        placeholder="ابحث برقم القضية، اسم الموكل، أو المحكمة..."
                        className="w-full px-4 py-2 border rounded-lg focus:ring-primary-light focus:border-primary-light"
                        value={filters.searchTerm}
                        onChange={handleFilterChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">فلترة بالموكل</label>
                    <select name="clientId" value={filters.clientId} onChange={handleFilterChange} className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-primary-light focus:border-primary-light">
                        <option value="">كل الموكلين</option>
                        {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">كلمة مفتاحية بالوصف</label>
                    <input type="text" name="keyword" placeholder="مثال: نزاع، عقد..." value={filters.keyword} onChange={handleFilterChange} className="w-full px-4 py-2 border rounded-lg focus:ring-primary-light focus:border-primary-light" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">سنة القضية</label>
                    <input type="number" name="caseYear" placeholder="مثال: 1445" value={filters.caseYear} onChange={handleFilterChange} className="w-full px-4 py-2 border rounded-lg focus:ring-primary-light focus:border-primary-light" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الجلسة</label>
                    <input type="date" name="sessionDate" value={filters.sessionDate} onChange={handleFilterChange} className="w-full px-4 py-2 border rounded-lg focus:ring-primary-light focus:border-primary-light" />
                </div>
            </div>

            <div className="bg-surface rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم القضية</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم الموكل</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المحكمة</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div></td>
                                </tr>
                            ))
                        ) : (
                            filteredCases.map(caseItem => (
                                <tr key={caseItem.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-primary">{caseItem.caseNumber}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{caseItem.clientName}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{caseItem.courtName}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium space-x-4">
                                        <Link to={`/cases/${caseItem.id}`} className="text-primary hover:text-primary-dark">عرض</Link>
                                        {canEdit && <button onClick={() => handleRestore(caseItem.id)} className="text-green-600 hover:text-green-800">إعادة</button>}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                { !loading && filteredCases.length === 0 && (
                    <div className="text-center py-12">
                        <ArchiveIcon className="mx-auto w-12 h-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">الأرشيف فارغ</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {filters.searchTerm || filters.clientId || filters.keyword || filters.sessionDate || filters.caseYear ? "لا توجد قضايا مؤرشفة تطابق بحثك." : "يمكنك أرشفة القضايا من صفحة القضايا الرئيسية."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArchivePage;