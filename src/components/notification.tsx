'use client';

import { CheckCircle, X } from 'lucide-react';

interface NotificationProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export function Notification({ message, isVisible, onClose }: NotificationProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg">
      <CheckCircle className="h-5 w-5 text-green-500" />
      <p>{message}</p>
      <button onClick={onClose} className="text-green-600 hover:text-green-800">
        <X size={16} />
      </button>
    </div>
  );
}