
import React from 'react';
import { useAuth } from '../services/hooks/useAuth';
import { GavelIcon } from '../components/icons';

const LoginPage: React.FC = () => {
  const { loginWithGoogle, loading, error } = useAuth();

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

        <div className="mt-8 space-y-6">
            {error && (
                <div className="bg-red-50 border-r-4 border-red-500 p-4 mb-4">
                    <p className="text-sm text-red-700 text-right">{error}</p>
                </div>
            )}
            
            <p className="text-center text-sm text-gray-500">
                يرجى تسجيل الدخول باستخدام حساب جوجل الخاص بك للوصول إلى النظام.
            </p>

            <div>
                <button
                    onClick={loginWithGoogle}
                    disabled={loading}
                    className="group relative w-full flex items-center justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light disabled:bg-gray-100 transition-all duration-200"
                >
                    {loading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            جاري تسجيل الدخول...
                        </span>
                    ) : (
                        <span className="flex items-center">
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 ml-3" />
                            تسجيل الدخول باستخدام جوجل
                        </span>
                    )}
                </button>
            </div>
            
            <div className="text-center text-xs text-gray-400 mt-4">
                بالمتابعة، أنت توافق على شروط الخدمة وسياسة الخصوصية.
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
