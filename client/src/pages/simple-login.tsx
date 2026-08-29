import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'wouter';
import { Eye, EyeOff, ArrowLeft, Brain, Check, AlertCircle } from 'lucide-react';

export default function SimpleLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const { signIn, signUp } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign in submitted:', { email, password: '***' });
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await signIn(email, password);
      if (error) {
        console.error('Sign in error:', error);
        setError(error.message);
      } else {
        console.log('Sign in successful');
        setSuccess(t.signInSuccess);
        setLocation('/');
      }
    } catch (err) {
      console.error('Sign in exception:', err);
      setError(t.signInError);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign up submitted:', { email, password: '***', firstName, lastName });
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await signUp(email, password, firstName, lastName);
      if (error) {
        console.error('Sign up error:', error);
        setError(error.message);
      } else {
        console.log('Sign up successful');
        setSuccess(t.signUpSuccess);
      }
    } catch (err) {
      console.error('Sign up exception:', err);
      setError(t.signUpError);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('Email input changed:', value);
    setEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('Password input changed:', value.length, 'characters');
    setPassword(value);
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const isSignInValid = email.trim() !== '' && password.trim() !== '';
  const isSignUpValid = email.trim() !== '' && password.trim() !== '' && firstName.trim() !== '' && lastName.trim() !== '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => setLocation('/')}
          className="flex items-center gap-2 text-white hover:bg-white/10 border border-white/20 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backToHome}
        </button>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignUp ? t.signUp : t.signIn}
            </h2>
            <p className="text-gray-600">
              {isSignUp ? t.accessAdvancedPlatform : t.accessAdvancedPlatform}
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                !isSignUp 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.signIn}
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                isSignUp 
                  ? 'bg-white text-purple-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.signUp}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-6">
            {/* Name Fields (Sign Up Only) */}
            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.firstName}
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    placeholder="Juan"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.lastName}
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={handleLastNameChange}
                    placeholder="Pérez"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t.email}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t.password}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
            
            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                <Check className="w-5 h-5" />
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (isSignUp ? !isSignUpValid : !isSignInValid)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isSignUp ? t.creatingAccount : t.signingIn}
                </div>
              ) : (
                isSignUp ? t.signUpButton : t.signInButton
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
