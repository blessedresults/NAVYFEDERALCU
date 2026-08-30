'use client';

import { useState } from 'react';

export default function Home() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ username: '', password: '', email: '', otp: '' });
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [userId, setUserId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setLoading(false);
    setMessage(data.success ? 'Account created! Switch to Sign In.' : data.error);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: form.username, password: form.password })
    });
    const data = await res.json();
    setLoading(false);
    
    if (data.success) {
      setUserId(data.userId);
      setStep('otp');
      setMessage(`Demo OTP: ${data.demoOtp}`);
    } else {
      setMessage(data.error);
    }
  };

  const handleOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/auth/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, otp: form.otp })
    });
    const data = await res.json();
    setLoading(false);
    
    if (data.success) {
      window.location.href = '/dashboard';
    } else {
      setMessage(data.error);
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <main className="min-h-screen bg-nfcu-light-blue relative overflow-hidden flex items-center justify-center p-4">
      {/* Decorative circles - matching Navy Federal's soft background shapes */}
      <div className="absolute top-[-100px] right-[-80px] w-80 h-80 rounded-full bg-blue-200/30 blur-2xl" />
      <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full bg-blue-300/20 blur-2xl" />
      <div className="absolute top-1/3 left-1/4 w-4 h-4 rounded-full bg-blue-400/40" />
      <div className="absolute bottom-1/4 right-1/3 w-3 h-3 rounded-full bg-blue-400/30" />
      <div className="absolute top-20 right-20 w-2 h-2 rounded-full bg-blue-500/40" />

      {/* Mobile Dark Card / Desktop White Card */}
      <div className="relative z-10 w-full max-w-[420px]">
        
        {/* Mobile View: Dark Navy Card */}
        <div className="md:hidden bg-nfcu-navy rounded-2xl shadow-2xl overflow-hidden">
          {/* Logo */}
          <div className="flex justify-center pt-8 pb-4">
            <div className="flex items-center gap-2 text-white">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span className="font-bold text-sm tracking-widest">NAVY FEDERAL</span>
            </div>
          </div>

          {step === 'credentials' ? (
            <>
              <div className="text-center px-6 pt-2 pb-6">
                <p className="text-blue-200 text-lg font-light">{greeting()}</p>
              </div>

              <div className="px-6 space-y-4 pb-6">
                {message && (
                  <div className={`text-xs text-center p-2 rounded ${message.includes('error') || message.includes('Failed') ? 'bg-red-500/20 text-red-200' : 'bg-amber-500/20 text-amber-200'}`}>
                    {message}
                  </div>
                )}

                {/* Mode Toggle */}
                <div className="flex gap-1 bg-nfcu-navy-dark/50 rounded-lg p-1">
                  <button 
                    onClick={() => setMode('login')}
                    className={`flex-1 py-1.5 text-xs rounded-md font-medium transition ${mode === 'login' ? 'bg-nfcu-navy-light text-white' : 'text-blue-300'}`}
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => setMode('register')}
                    className={`flex-1 py-1.5 text-xs rounded-md font-medium transition ${mode === 'register' ? 'bg-nfcu-navy-light text-white' : 'text-blue-300'}`}
                  >
                    Join
                  </button>
                </div>

                <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      required
                      placeholder="Username"
                      className="w-full px-4 py-3 bg-nfcu-navy-dark/60 border border-blue-400/30 rounded-lg text-white placeholder-blue-300/70 text-sm focus:outline-none focus:border-blue-400/60"
                      value={form.username}
                      onChange={e => setForm({...form, username: e.target.value})}
                    />
                  </div>
                  
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Password"
                      className="w-full px-4 py-3 bg-nfcu-navy-dark/60 border border-blue-400/30 rounded-lg text-white placeholder-blue-300/70 text-sm focus:outline-none focus:border-blue-400/60 pr-10"
                      value={form.password}
                      onChange={e => setForm({...form, password: e.target.value})}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/70"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      )}
                    </button>
                  </div>

                  {mode === 'register' && (
                    <input 
                      type="email"
                      placeholder="Email (optional)"
                      className="w-full px-4 py-3 bg-nfcu-navy-dark/60 border border-blue-400/30 rounded-lg text-white placeholder-blue-300/70 text-sm focus:outline-none focus:border-blue-400/60"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                    />
                  )}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-nfcu-orange text-white py-3.5 rounded-lg font-semibold text-sm hover:bg-nfcu-orange-hover transition disabled:opacity-60 shadow-lg"
                  >
                    {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

                <div className="flex justify-center gap-3 text-[11px] text-blue-300/80 pt-2">
                  <a href="#" className="hover:text-white transition">SIGN IN HELP</a>
                  <span>|</span>
                  <a href="#" className="hover:text-white transition">BECOME A MEMBER</a>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-blue-400/20 px-6 py-4 flex justify-between text-[11px] text-blue-300/70">
                <a href="#" className="flex items-center gap-1.5 hover:text-white transition">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  CONTACT
                </a>
                <a href="#" className="flex items-center gap-1.5 hover:text-white transition">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  ATM/BRANCH
                </a>
              </div>
            </>
          ) : (
            <div className="px-6 py-8">
              <div className="text-center mb-6">
                <p className="text-blue-200 text-lg font-light mb-1">Two-Factor Authentication</p>
                <p className="text-blue-300/70 text-xs">Enter the 6-digit code</p>
              </div>

              {message && (
                <div className="text-xs text-center p-2 rounded bg-amber-500/20 text-amber-200 mb-4 font-mono">
                  {message}
                </div>
              )}

              <form onSubmit={handleOTP} className="space-y-4">
                <input 
                  type="text" 
                  maxLength={6}
                  required
                  placeholder="000000"
                  className="w-full px-4 py-3 bg-nfcu-navy-dark/60 border border-blue-400/30 rounded-lg text-white placeholder-blue-300/70 text-sm text-center tracking-[0.5em] text-lg focus:outline-none focus:border-blue-400/60"
                  value={form.otp}
                  onChange={e => setForm({...form, otp: e.target.value})}
                />
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-nfcu-orange text-white py-3.5 rounded-lg font-semibold text-sm hover:bg-nfcu-orange-hover transition disabled:opacity-60 shadow-lg"
                >
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                </button>
                
                <button 
                  type="button"
                  onClick={() => { setStep('credentials'); setMessage(''); }}
                  className="w-full text-blue-300/70 text-xs hover:text-white py-2"
                >
                  ← Back to Sign In
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Desktop View: White Card with Orange Top Border */}
        <div className="hidden md:block bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
          {/* Orange top accent bar */}
          <div className="h-1.5 bg-nfcu-orange" />
          
          <div className="p-8">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-nfcu-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span className="font-bold text-nfcu-navy text-sm tracking-widest">NAVY FEDERAL</span>
            </div>

            <h1 className="text-2xl font-bold text-nfcu-navy mb-1">Welcome to Digital Banking</h1>
            <p className="text-nfcu-text-gray text-sm mb-6">{greeting()}</p>

            {step === 'credentials' ? (
              <>
                {/* Mode Toggle */}
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
                  <button 
                    onClick={() => setMode('login')}
                    className={`flex-1 py-2 text-sm rounded-md font-medium transition ${mode === 'login' ? 'bg-white text-nfcu-navy shadow-sm' : 'text-gray-500'}`}
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => setMode('register')}
                    className={`flex-1 py-2 text-sm rounded-md font-medium transition ${mode === 'register' ? 'bg-white text-nfcu-navy shadow-sm' : 'text-gray-500'}`}
                  >
                    Join
                  </button>
                </div>

                {message && (
                  <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes('error') || message.includes('Failed') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                    {message}
                  </div>
                )}

                <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 border border-nfcu-border-gray rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-nfcu-navy/20 focus:border-nfcu-navy"
                      value={form.username}
                      onChange={e => setForm({...form, username: e.target.value})}
                      placeholder="Enter username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        required
                        className="w-full px-4 py-3 border border-nfcu-border-gray rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-nfcu-navy/20 focus:border-nfcu-navy pr-10"
                        value={form.password}
                        onChange={e => setForm({...form, password: e.target.value})}
                        placeholder="Enter password"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {mode === 'register' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                      <input 
                        type="email"
                        className="w-full px-4 py-3 border border-nfcu-border-gray rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-nfcu-navy/20 focus:border-nfcu-navy"
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                        placeholder="Optional"
                      />
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-nfcu-orange text-white py-3.5 rounded-lg font-semibold text-sm hover:bg-nfcu-orange-hover transition disabled:opacity-60 shadow-md"
                  >
                    {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <a href="#" className="text-sm text-nfcu-link-blue hover:underline font-medium">Sign In Help</a>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-nfcu-light-blue rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-nfcu-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <h2 className="text-lg font-bold text-nfcu-navy">Two-Factor Authentication</h2>
                  <p className="text-nfcu-text-gray text-sm mt-1">Enter the 6-digit verification code</p>
                </div>

                {message && (
                  <div className="mb-4 p-3 rounded-lg text-sm bg-amber-50 text-amber-800 border border-amber-200 font-mono text-center">
                    {message}
                  </div>
                )}

                <form onSubmit={handleOTP} className="space-y-4">
                  <input 
                    type="text" 
                    maxLength={6}
                    required
                    placeholder="000000"
                    className="w-full px-4 py-3 border border-nfcu-border-gray rounded-lg text-gray-900 text-center tracking-[0.5em] text-xl focus:outline-none focus:ring-2 focus:ring-nfcu-navy/20 focus:border-nfcu-navy"
                    value={form.otp}
                    onChange={e => setForm({...form, otp: e.target.value})}
                  />
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-nfcu-orange text-white py-3.5 rounded-lg font-semibold text-sm hover:bg-nfcu-orange-hover transition disabled:opacity-60 shadow-md"
                  >
                    {loading ? 'Verifying...' : 'Verify & Sign In'}
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => { setStep('credentials'); setMessage(''); }}
                    className="w-full text-nfcu-text-gray text-sm hover:text-nfcu-navy py-2"
                  >
                    ← Back to Sign In
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
