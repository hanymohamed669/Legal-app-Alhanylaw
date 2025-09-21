
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/hooks/useAuth';
import { api } from '../services/api';
import { Case, Document as Doc, Session, UserRole } from '../types';
import { MapPinIcon, PdfIcon, WordIcon, DownloadIcon, FilePlusIcon, DocumentIcon, ExternalLinkIcon, ArchiveIcon } from '../components/icons';

const DetailCard: React.FC<{ title: string, children: React.ReactNode, className?: string }> = ({ title, children, className }) => (
    <div className={`bg-surface rounded-lg shadow p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-on-surface mb-4 border-b pb-2">{title}</h3>
        {children}
    </div>
);

const CaseDetailPage: React.FC = () => {
    const { caseId } = useParams<{ caseId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [caseData, setCaseData] = useState<Case | null>(null);
    const [loading, setLoading] = useState(true);
    const [newDocName, setNewDocName] = useState('');
    const [newDocUrl, setNewDocUrl] = useState('');
    const [isAddingDoc, setIsAddingDoc] = useState(false);

    useEffect(() => {
        if (caseId && user) {
            setLoading(true);
            api.getCase(caseId, user).then(data => {
                setCaseData(data || null);
                setLoading(false);
            }).catch(() => setLoading(false));
        }
    }, [caseId, user]);

    const handleAddDocument = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!caseId || !newDocName.trim() || !newDocUrl.trim()) return;

        setIsAddingDoc(true);
        try {
            const newDoc = await api.addDocument(newDocName, caseId, newDocUrl);
            setCaseData(prev => prev ? { ...prev, documents: [newDoc, ...prev.documents] } : null);
            setNewDocName('');
            setNewDocUrl('');
        } catch (error) {
            console.error("Failed to add document", error);
            alert('فشل إضافة المستند.');
        } finally {
            setIsAddingDoc(false);
        }
    };

    const handleToggleArchive = async () => {
        if (!caseData) return;
        const newStatus = !caseData.isArchived;
        const action = newStatus ? 'أرشفة' : 'إعادة';
        if (window.confirm(`هل أنت متأكد من رغبتك في ${action} هذه القضية؟`)) {
            const updatedCase = await api.archiveCase(caseData.id, newStatus);
            if(updatedCase) {
                setCaseData(updatedCase);
                const targetPath = newStatus ? '/archive' : '/cases';
                alert(`تمت ${action} القضية بنجاح.`);
                navigate(targetPath);
            }
        }
    };

    if (loading) {
        return <div className="text-center p-8">جاري تحميل تفاصيل القضية...</div>;
    }

    if (!caseData) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold">لم يتم العثور على القضية</h2>
                <p className="text-gray-500">القضية التي تبحث عنها غير موجودة أو ليس لديك إذن لعرضها.</p>
                <Link to="/cases" className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded-lg">العودة إلى القضايا</Link>
            </div>
        );
    }
    
    const canEdit = user && (user.role === UserRole.ADMIN || user.role === UserRole.PARTNER || (user.role === UserRole.SECRETARY && user.permissions === 'full'));

    const getDocIcon = (docType: Doc['type']) => {
        switch(docType) {
            case 'PDF': return <PdfIcon className="w-6 h-6 text-red-600" />;
            case 'Word': return <WordIcon className="w-6 h-6 text-blue-600" />;
            default: return <DocumentIcon className="w-6 h-6 text-gray-500" />;
        }
    };


    return (
        <div>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <Link to={caseData.isArchived ? "/archive" : "/cases"} className="text-sm text-secondary hover:underline">&rarr; العودة إلى {caseData.isArchived ? "الأرشيف" : "كل القضايا"}</Link>
                    <h1 className="text-3xl font-bold text-white mt-2">{caseData.caseNumber}</h1>
                    <p className="text-gray-300">الموكل: {caseData.clientName}</p>
                </div>
                 {canEdit && (
                    <button onClick={handleToggleArchive} className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition-colors">
                        <span className="ml-2">{caseData.isArchived ? 'إعادة من الأرشيف' : 'إرسال إلى الأرشيف'}</span>
                        <ArchiveIcon className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <DetailCard title="تفاصيل القضية">
                        <p className="text-gray-600">{caseData.details}</p>
                    </DetailCard>
                    <DetailCard title="المستندات المرتبطة">
                        <ul className="space-y-3">
                            {caseData.documents.length > 0 ? caseData.documents.map((doc: Doc) => (
                                <li key={doc.id} className="flex items-center justify-between p-3 bg-background rounded-md">
                                    <div className="flex items-center">
                                         <div className="ml-3">
                                            <p className="font-medium text-on-surface">{doc.name}</p>
                                            <p className="text-xs text-gray-500">تاريخ الإضافة: {new Date(doc.uploadDate).toLocaleDateString('ar-EG')}</p>
                                        </div>
                                        {getDocIcon(doc.type)}
                                    </div>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" title="فتح الملف" className="text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors">
                                            <ExternalLinkIcon className="w-5 h-5" />
                                        </a>
                                         <a href={doc.url} download={doc.name} title="تحميل الملف" className="text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors">
                                            <DownloadIcon className="w-5 h-5" />
                                        </a>
                                    </div>
                                </li>
                            )) : <p className="text-sm text-gray-500">لا توجد مستندات مرتبطة بهذه القضية بعد.</p>}
                        </ul>
                    </DetailCard>
                     {canEdit && (
                        <DetailCard title="إضافة مستند جديد">
                            <form onSubmit={handleAddDocument} className="space-y-4">
                                <div>
                                    <label htmlFor="doc-name" className="block text-sm font-medium text-gray-700 mb-1">اسم الملف</label>
                                    <input
                                        type="text"
                                        id="doc-name"
                                        value={newDocName}
                                        onChange={(e) => setNewDocName(e.target.value)}
                                        placeholder="مثال: عقد الإيجار.pdf"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-primary-light focus:border-primary-light"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="doc-url" className="block text-sm font-medium text-gray-700 mb-1">رابط الملف</label>
                                    <input
                                        type="url"
                                        id="doc-url"
                                        value={newDocUrl}
                                        onChange={(e) => setNewDocUrl(e.target.value)}
                                        placeholder="https://example.com/path/to/document"
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-primary-light focus:border-primary-light"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isAddingDoc}
                                    className="w-full flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary-dark transition-colors disabled:bg-gray-400"
                                >
                                    <span className="ml-2">{isAddingDoc ? 'جاري الإضافة...' : 'إضافة مستند'}</span>
                                    <FilePlusIcon className="w-5 h-5" />
                                </button>
                            </form>
                        </DetailCard>
                    )}
                </div>
                
                <div className="space-y-8">
                    <DetailCard title="سجل الجلسات">
                        <ul className="space-y-3">
                            {caseData.sessions.map((session: Session) => (
                                <li key={session.id} className="p-3 bg-background rounded-md">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-sm text-on-surface">
                                                {new Date(session.dateTime).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">{session.notes || 'لا توجد ملاحظات.'}</p>
                                        </div>
                                        {session.courtLocationLink && (
                                            <a 
                                                href={session.courtLocationLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="flex-shrink-0 flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full shadow-sm hover:bg-blue-200 transition-colors text-xs font-semibold"
                                            >
                                            <span className="ml-1.5">موقع المحكمة</span>
                                            <MapPinIcon className="w-4 h-4" /> 
                                            </a>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </DetailCard>
                </div>
            </div>
        </div>
    );
};

export default CaseDetailPage;