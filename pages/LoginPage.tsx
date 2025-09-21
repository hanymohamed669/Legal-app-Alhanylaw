import React, { useState } from 'react';
import { useAuth } from '../services/hooks/useAuth';
import { UserRole } from '../types';
import { GavelIcon } from '../components/icons';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);
  const { login, loading } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-dark to-yellow-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface rounded-2xl shadow-2xl p-8 space-y-8">
        <div className="text-center">
            <GavelIcon className="mx-auto w-16 h-16 text-primary" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
                إدارة قانونية
            </h2>
            <p className="font-serif text-lg text-primary tracking-widest -mt-1">ALHANYLAW</p>
            <p className="mt-4 text-sm text-gray-600">
                مساعدك المتكامل للممارسة القانونية.
            </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
                 <div>
                    <label htmlFor="email-address" className="sr-only">البريد الإلكتروني</label>
                    <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-light focus:border-primary-light focus:z-10 sm:text-sm"
                        placeholder="البريد الإلكتروني"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                 <div>
                    <label htmlFor="role" className="sr-only">الدور</label>
                    <select
                        id="role"
                        name="role"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-light focus:border-primary-light focus:z-10 sm:text-sm"
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                    >
                        <option value={UserRole.ADMIN}>مدير</option>
                        <option value={UserRole.SECRETARY}>سكرتير</option>
                        <option value={UserRole.CLIENT}>موكل</option>
                    </select>
                </div>
            </div>
            
            <p className="text-center text-xs text-gray-500">
                هذا تسجيل دخول تجريبي. اختر دوراً للمتابعة.
            </p>

            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-on-primary bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light disabled:bg-gray-400"
                >
                    {loading ? '...جاري تسجيل الدخول' : 'تسجيل الدخول'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;