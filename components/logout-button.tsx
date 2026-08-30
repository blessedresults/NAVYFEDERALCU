'use client';

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <button 
      onClick={handleLogout}
      className="px-4 py-2 bg-nfcu-navy-light text-white text-sm rounded-lg hover:bg-blue-700 transition font-medium border border-blue-400/30"
    >
      Sign Out
    </button>
  );
}
