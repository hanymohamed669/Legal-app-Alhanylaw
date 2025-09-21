
import React from 'react';
import { DocumentIcon } from '../components/icons';
import { Link } from 'react-router-dom';

const DocumentsPage: React.FC = () => {
  return (
    <div className="text-center py-16 bg-surface rounded-lg shadow flex flex-col items-center justify-center">
      <DocumentIcon className="mx-auto w-16 h-16 text-gray-400" />
      <h1 className="mt-4 text-2xl font-bold text-on-surface">تم تحديث إدارة المستندات</h1>
      <p className="mt-2 text-gray-600 max-w-md">
        لتحسين التنظيم، تتم الآن إدارة المستندات مباشرة داخل كل قضية على حدة.
      </p>
      <Link to="/cases" className="mt-6 inline-block bg-primary text-white px-6 py-3 rounded-lg shadow hover:bg-primary-dark transition-colors font-semibold">
        الانتقال إلى صفحة القضايا
      </Link>
    </div>
  );
};

export default DocumentsPage;