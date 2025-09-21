
import React, { useEffect, useState } from 'react';
import { useAuth } from '../services/hooks/useAuth';
import { api } from '../services/api';
import { User, UserRole, Client } from '../types';
import { PlusIcon } from '../components/icons';

const TeamPage: React.FC = () => {
    const { user } = useAuth();
    const [teamMembers, setTeamMembers] = useState<User[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    // Invite Form State
    const [inviteRole, setInviteRole] = useState<UserRole>(UserRole.SECRETARY);
    const [inviteEmail, setInviteEmail] = useState('');
    const [selectedClientId, setSelectedClientId] = useState('');
    const [secretaryPermissions, setSecretaryPermissions] = useState<'full' | 'read'>('full');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user && (user.role === UserRole.ADMIN || user.role === UserRole.PARTNER)) {
            setLoading(true);
            Promise.all([api.getUsers(), api.getClients()]).then(([users, clientsData]) => {
                setTeamMembers(users);
                setClients(clientsData);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let details: any = { role: inviteRole };
            if (inviteRole === UserRole.CLIENT) {
                if (!selectedClientId) {
                    alert('يرجى اختيار موكل لدعوته.');
                    return;
                }
                details.clientId = selectedClientId;
            } else {
                if (!inviteEmail.trim()) {
                    alert('يرجى إدخال البريد الإلكتروني.');
                    return;
                }
                details.email = inviteEmail;
                if (inviteRole === UserRole.SECRETARY) {
                    details.permissions = secretaryPermissions;
                }
            }
            
            const newUser = await api.inviteUser(details);
            setTeamMembers(prev => [...prev, newUser]);

            // Reset form
            setInviteEmail('');
            setSelectedClientId('');
            alert(`تم إرسال الدعوة بنجاح.`);

        } catch (error) {
            console.error("Failed to invite user", error);
            alert("فشل إرسال الدعوة.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const getRoleDisplayName = (member: User) => {
        switch (member.role) {
            case UserRole.ADMIN: return 'مالك';
            case UserRole.PARTNER: return 'شريك';
            case UserRole.SECRETARY:
                const perm = member.permissions === 'full' ? 'صلاحيات كاملة' : 'عرض فقط';
                return `سكرتير (${perm})`;
            case UserRole.CLIENT: return 'موكل';
            default: return member.role;
        }
    };

    if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.PARTNER) {
        return (
            <div>
                <h1 className="text-3xl font-bold text-white">إدارة الفريق</h1>
                <p className="mt-4 text-gray-300">ليس لديك الصلاحية لعرض هذه الصفحة.</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">إدارة الفريق</h1>

            <div className="bg-surface rounded-lg shadow mb-8">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold">دعوة عضو جديد</h2>
                </div>
                <form onSubmit={handleInvite} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">دور المستخدم</label>
                        <select
                            value={inviteRole}
                            onChange={(e) => setInviteRole(e.target.value as UserRole)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-primary-light focus:border-primary-light"
                        >
                            <option value={UserRole.SECRETARY}>سكرتير</option>
                            <option value={UserRole.PARTNER}>شريك</option>
                            <option value={UserRole.CLIENT}>موكل</option>
                        </select>
                    </div>

                    {inviteRole === UserRole.CLIENT ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">اختيار الموكل</label>
                            <select
                                value={selectedClientId}
                                onChange={(e) => setSelectedClientId(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-primary-light focus:border-primary-light" required>
                                <option value="" disabled>اختر من قائمة العملاء المسجلين</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                             <input
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="أدخل بريد المستخدم"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-primary-light focus:border-primary-light"
                                required
                            />
                        </div>
                    )}

                    {inviteRole === UserRole.SECRETARY && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">صلاحيات السكرتير</label>
                            <div className="flex items-center space-x-4 space-x-reverse">
                                <label className="flex items-center"><input type="radio" value="full" checked={secretaryPermissions === 'full'} onChange={e => setSecretaryPermissions(e.target.value as any)} className="ml-2"/> صلاحيات كاملة (مع التعديل)</label>
                                <label className="flex items-center"><input type="radio" value="read" checked={secretaryPermissions === 'read'} onChange={e => setSecretaryPermissions(e.target.value as any)} className="ml-2"/> عرض فقط</label>
                            </div>
                        </div>
                    )}
                    
                    <button type="submit" disabled={isSubmitting} className="w-full md:w-auto flex-shrink-0 flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary-dark transition-colors disabled:bg-gray-400">
                         <span className="ml-2">{isSubmitting ? 'جاري الإرسال...' : 'إرسال دعوة'}</span>
                         <PlusIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
            
             <div className="bg-surface rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المستخدم</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الدور والصلاحيات</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={3} className="text-center p-4">جاري تحميل أعضاء الفريق...</td></tr>
                        ) : (
                            teamMembers.map(member => (
                                <tr key={member.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="mr-4">
                                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                                <div className="text-sm text-gray-500">{member.email}</div>
                                            </div>
                                            <img className="h-10 w-10 rounded-full" src={member.avatarUrl} alt="" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.role === UserRole.CLIENT ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {getRoleDisplayName(member)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button className="text-primary hover:underline">تعديل</button>
                                        <span className="mx-2">|</span>
                                        <button className="text-red-600 hover:underline">إزالة</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
             </div>
        </div>
    );
};

export default TeamPage;