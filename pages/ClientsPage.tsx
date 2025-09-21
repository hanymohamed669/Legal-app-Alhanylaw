
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { Client, UserRole } from '../types';
import { PlusIcon, UsersIcon, DownloadIcon, ExternalLinkIcon, TrashIcon } from '../components/icons';
import { useAuth } from '../services/hooks/useAuth';

const ClientsPage: React.FC = () => {
    const { user } = useAuth();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // New Client Form State
    const [newClientName, setNewClientName] = useState('');
    const [newClientPhone, setNewClientPhone] = useState('');
    const [newClientDocs, setNewClientDocs] = useState<{name: string, url: string}[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setLoading(true);
        api.getClients().then(data => {
            setClients(data);
            setLoading(false);
        });
    }, []);

    const handleAddDocLink = () => {
        setNewClientDocs([...newClientDocs, { name: '', url: '' }]);
    };
    
    const handleRemoveDocLink = (index: number) => {
        const docs = [...newClientDocs];
        docs.splice(index, 1);
        setNewClientDocs(docs);
    };

    const handleDocChange = (index: number, field: 'name' | 'url', value: string) => {
        const docs = [...newClientDocs];
        docs[index][field] = value;
        setNewClientDocs(docs);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newClientName || !newClientPhone) {
            alert('يرجى إدخال اسم العميل ورقم الهاتف.');
            return;
        }
        setIsSubmitting(true);
        try {
            const newClient = await api.addClient({ 
                name: newClientName, 
                phoneNumber: newClientPhone, 
                documents: newClientDocs.filter(d => d.name && d.url) 
            });
            setClients(prev => [newClient, ...prev]);
            // Reset form
            setNewClientName('');
            setNewClientPhone('');
            setNewClientDocs([]);
        } catch (error) {
            console.error('Failed to add client', error);
            alert('فشل إضافة العميل.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const filteredClients = useMemo(() => {
        return clients.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.phoneNumber.includes(searchTerm)
        );
    }, [clients, searchTerm]);
    
    const canEdit = user && (user.role === UserRole.ADMIN || user.role === UserRole.PARTNER || (user.role === UserRole.SECRETARY && user.permissions === 'full'));

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">إدارة العملاء</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="mb-4">
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="ابحث بالاسم أو رقم الهاتف..."
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                     <div className="bg-surface rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم العميل</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الهاتف</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المستندات</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr><td colSpan={3} className="text-center p-4">جاري تحميل العملاء...</td></tr>
                                ) : (
                                    filteredClients.map(client => (
                                        <tr key={client.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.phoneNumber}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {client.documents.length > 0 ? (
                                                     <a href={client.documents[0].url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                        {client.documents[0].name}
                                                        {client.documents.length > 1 && ` (+${client.documents.length - 1})`}
                                                     </a>
                                                ) : 'لا يوجد'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                         { !loading && filteredClients.length === 0 && (
                            <div className="text-center py-12">
                                <UsersIcon className="mx-auto w-12 h-12 text-gray-300" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">لا يوجد عملاء</h3>
                                <p className="mt-1 text-sm text-gray-500">{searchTerm ? 'لا يوجد عملاء يطابقون بحثك.' : 'أضف عميلاً جديداً للبدء.'}</p>
                            </div>
                        )}
                    </div>
                </div>

                {canEdit && (
                    <div className="bg-surface rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-on-surface mb-4">إضافة عميل جديد</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                             <div>
                                <label htmlFor="client-name" className="block text-sm font-medium text-gray-700 mb-1">اسم العميل</label>
                                <input type="text" id="client-name" value={newClientName} onChange={e => setNewClientName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required />
                            </div>
                            <div>
                                <label htmlFor="client-phone" className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                                <input type="tel" id="client-phone" value={newClientPhone} onChange={e => setNewClientPhone(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">المستندات الشخصية</label>
                                <div className="space-y-2">
                                    {newClientDocs.map((doc, index) => (
                                        <div key={index} className="flex items-center space-x-2 space-x-reverse">
                                            <input type="text" placeholder="اسم الملف" value={doc.name} onChange={e => handleDocChange(index, 'name', e.target.value)} className="w-1/2 px-2 py-1 border rounded-md text-sm" />
                                            <input type="url" placeholder="رابط الملف" value={doc.url} onChange={e => handleDocChange(index, 'url', e.target.value)} className="w-1/2 px-2 py-1 border rounded-md text-sm" />
                                            <button type="button" onClick={() => handleRemoveDocLink(index)} className="text-red-500 hover:text-red-700">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                 <button type="button" onClick={handleAddDocLink} className="mt-2 text-sm text-primary hover:underline">
                                    + إضافة رابط مستند
                                </button>
                            </div>
                             <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary-dark transition-colors disabled:bg-gray-400">
                                <span className="ml-2">{isSubmitting ? 'جاري الإضافة...' : 'إضافة عميل'}</span>
                                <PlusIcon className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientsPage;