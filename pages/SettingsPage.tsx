
import React from 'react';
import { SettingsIcon } from '../components/icons';

const SettingsPage: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-on-surface mb-6">الإعدادات</h1>
            <div className="bg-surface rounded-lg shadow p-8 text-center flex flex-col items-center justify-center">
                <SettingsIcon className="mx-auto w-16 h-16 text-gray-400" />
                <h2 className="mt-4 text-xl font-semibold text-on-surface">
                    تمت إزالة تكامل Google Drive
                </h2>
                <p className="mt-2 text-gray-600 max-w-md">
                    لم تعد هناك حاجة لصفحة الإعدادات هذه. تتم إدارة المستندات الآن يدويًا داخل كل قضية.
                </p>
            </div>
        </div>
    );
};

export default SettingsPage;