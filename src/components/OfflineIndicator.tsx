import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-3 left-3 right-3 sm:right-auto z-40 inline-flex items-center justify-center sm:justify-start gap-2 rounded-2xl bg-[#FEF3C7] border border-[#F59E0B] px-3.5 py-2 text-xs font-extrabold text-[#92400E] shadow-md"
    >
      <WifiOff className="w-4 h-4 shrink-0 text-[#D97706]" />
      <span>Modo sem internet · Progresso guardado no dispositivo</span>
    </div>
  );
};
